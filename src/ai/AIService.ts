import Anthropic from '@anthropic-ai/sdk';
import pLimit from 'p-limit';
import { Expert } from '../experts/Expert.js';

/**
 * Configuration for AI service
 */
export interface AIConfig {
  apiKey?: string;
  model?: string;
  maxConcurrent?: number;
  temperature?: number;
}

/**
 * Response from an AI expert consultation
 */
export interface ExpertConsultation {
  position: 'for' | 'against' | 'abstain';
  reasoning: string;
  confidence: number;
}

/**
 * Service for managing AI model interactions
 */
export class AIService {
  private client: Anthropic;
  private model: string;
  private limiter: ReturnType<typeof pLimit>;
  private temperature: number;

  constructor(config: AIConfig = {}) {
    const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY environment variable is required. ' +
        'Please set it to use AI-powered expert consultations.'
      );
    }

    this.client = new Anthropic({ apiKey });
    this.model = config.model || 'claude-3-5-sonnet-20241022';
    this.temperature = config.temperature ?? 0.7;

    // Limit concurrent API calls to avoid rate limits
    const maxConcurrent = config.maxConcurrent || 10;
    this.limiter = pLimit(maxConcurrent);
  }

  /**
   * Generate a system prompt for an expert
   */
  private generateSystemPrompt(expert: Expert): string {
    return `You are ${expert.name}, ${expert.title}, with credentials in ${expert.credentials.join(', ')}.

You are a world-renowned expert in ${expert.field} with ${expert.yearsOfExperience} years of experience.

Your specializations include: ${expert.specializations.join(', ')}.

Professional Background:
${expert.biography}

Your approach: ${expert.perspective}

Key personality traits: ${expert.traits.join(', ')}.

Notable achievements:
${expert.achievements.slice(0, 3).map(a => `- ${a}`).join('\n')}

When consulted on issues, you provide expert analysis from your specialized perspective. You are thoughtful, evidence-based, and draw on your deep expertise. You may vote for, against, or abstain (if the issue is outside your expertise).`;
  }

  /**
   * Consult an expert on a specific issue
   */
  async consultExpert(expert: Expert, issue: string): Promise<ExpertConsultation> {
    return this.limiter(async () => {
      try {
        const systemPrompt = this.generateSystemPrompt(expert);

        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: 1024,
          temperature: this.temperature,
          system: systemPrompt,
          messages: [{
            role: 'user',
            content: `As an expert in your field, please evaluate the following proposal and provide your position:

"${issue}"

Please respond in the following JSON format:
{
  "position": "for" | "against" | "abstain",
  "reasoning": "Your detailed reasoning (2-3 sentences)",
  "confidence": 0.0 to 1.0
}

Choose "abstain" only if this issue is completely outside your area of expertise.`
          }]
        });

        // Extract the response text
        const content = response.content[0];
        if (content.type !== 'text') {
          throw new Error('Unexpected response type from AI');
        }

        // Parse the JSON response
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          // Fallback parsing if JSON is not well-formed
          return this.fallbackParsing(content.text, expert, issue);
        }

        const result = JSON.parse(jsonMatch[0]) as ExpertConsultation;

        // Validate the response
        if (!['for', 'against', 'abstain'].includes(result.position)) {
          throw new Error('Invalid position in response');
        }

        return result;
      } catch (error) {
        console.error(`Error consulting expert ${expert.name}:`, error);

        // Return a fallback response
        return {
          position: 'abstain',
          reasoning: `As a ${expert.field} expert, I need more information to provide a well-informed opinion on this matter.`,
          confidence: 0.3
        };
      }
    });
  }

  /**
   * Fallback parsing when JSON is not well-formed
   */
  private fallbackParsing(text: string, expert: Expert, issue: string): ExpertConsultation {
    const lowerText = text.toLowerCase();

    let position: 'for' | 'against' | 'abstain' = 'abstain';

    if (lowerText.includes('"position": "for"') ||
        lowerText.includes('i support') ||
        lowerText.includes('in favor')) {
      position = 'for';
    } else if (lowerText.includes('"position": "against"') ||
               lowerText.includes('i oppose') ||
               lowerText.includes('against this')) {
      position = 'against';
    }

    return {
      position,
      reasoning: text.substring(0, 300),
      confidence: 0.5
    };
  }

  /**
   * Consult multiple experts in parallel (with rate limiting)
   */
  async consultExperts(
    experts: Expert[],
    issue: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<Map<string, ExpertConsultation>> {
    const results = new Map<string, ExpertConsultation>();
    let completed = 0;

    const consultations = experts.map(async (expert) => {
      const consultation = await this.consultExpert(expert, issue);
      results.set(expert.id, consultation);

      completed++;
      if (onProgress) {
        onProgress(completed, experts.length);
      }

      return { expertId: expert.id, consultation };
    });

    await Promise.all(consultations);
    return results;
  }

  /**
   * Get a detailed perspective from an expert
   */
  async getDetailedPerspective(expert: Expert, issue: string): Promise<string> {
    return this.limiter(async () => {
      try {
        const systemPrompt = this.generateSystemPrompt(expert);

        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: 512,
          temperature: this.temperature,
          system: systemPrompt,
          messages: [{
            role: 'user',
            content: `As an expert in ${expert.field}, please provide your detailed perspective on the following issue:

"${issue}"

Share your professional viewpoint, key considerations from your field, and recommendations. Keep it concise (2-3 paragraphs).`
          }]
        });

        const content = response.content[0];
        if (content.type !== 'text') {
          throw new Error('Unexpected response type from AI');
        }

        return content.text;
      } catch (error) {
        console.error(`Error getting perspective from expert ${expert.name}:`, error);
        return `As a ${expert.field} expert specializing in ${expert.specializations[0]}, I approach this issue from the perspective of ${expert.perspective}.`;
      }
    });
  }
}
