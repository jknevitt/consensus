import { Expert } from '../experts/Expert.js';
import { Vote, VotingSystem, VotingMethod } from './VotingNew.js';
import { AIService } from '../ai/AIService.js';

/**
 * Represents a deliberation session
 */
export interface DeliberationSession {
  id: string;
  issue: string;
  participants: Expert[];
  perspectives: Perspective[];
  votes: Vote[];
  startTime: Date;
  endTime?: Date;
}

/**
 * An expert's perspective on an issue (AI-powered)
 */
export interface Perspective {
  expertId: string;
  expertName: string;
  field: string;
  viewpoint: string;
  keyPoints: string[];
  recommendations: string[];
}

/**
 * Result of a deliberation
 */
export interface DeliberationResult {
  issue: string;
  participantCount: number;
  perspectives: Perspective[];
  votes: Vote[];
  voteResult: any;
  decision: string;
  reasoning: string[];
  dissent: string[];
  duration: number;
}

/**
 * Manages AI-powered deliberation sessions in the parliament
 */
export class Deliberation {
  private aiService: AIService;
  private votingSystem: VotingSystem;

  constructor(aiService: AIService) {
    this.aiService = aiService;
    this.votingSystem = new VotingSystem(aiService);
  }

  /**
   * Conduct an AI-powered deliberation on an issue
   */
  async conductDeliberation(
    issue: string,
    experts: Expert[],
    votingMethod: VotingMethod = 'simple-majority',
    onProgress?: (stage: string, completed?: number, total?: number) => void
  ): Promise<DeliberationResult> {
    const startTime = Date.now();

    // Step 1: Get AI-powered votes from all experts
    if (onProgress) onProgress('Consulting experts', 0, experts.length);

    const votes = await this.votingSystem.getVotesFromExperts(
      experts,
      issue,
      (completed, total) => {
        if (onProgress) onProgress('Consulting experts', completed, total);
      }
    );

    // Step 2: Conduct voting
    if (onProgress) onProgress('Tallying votes');
    const voteResult = VotingSystem.conductVote(votes, votingMethod);

    // Step 3: Generate perspectives (simplified for now, can be enhanced)
    if (onProgress) onProgress('Generating perspectives');
    const perspectives = this.generatePerspectives(experts, votes);

    // Step 4: Synthesize decision
    if (onProgress) onProgress('Synthesizing decision');
    const decision = this.synthesizeDecision(issue, voteResult, perspectives);
    const reasoning = this.extractReasoning(votes, perspectives, true);
    const dissent = this.extractReasoning(votes, perspectives, false);

    const endTime = Date.now();

    return {
      issue,
      participantCount: experts.length,
      perspectives,
      votes,
      voteResult,
      decision,
      reasoning,
      dissent,
      duration: endTime - startTime
    };
  }

  /**
   * Generate perspectives from votes
   */
  private generatePerspectives(
    experts: Expert[],
    votes: Vote[]
  ): Perspective[] {
    const expertMap = new Map(experts.map(e => [e.id, e]));

    return votes.map(vote => {
      const expert = expertMap.get(vote.expertId);
      if (!expert) {
        throw new Error(`Expert ${vote.expertId} not found`);
      }

      return {
        expertId: expert.id,
        expertName: expert.name,
        field: expert.field,
        viewpoint: vote.reasoning,
        keyPoints: [vote.reasoning],
        recommendations: []
      };
    });
  }

  /**
   * Synthesize the final decision
   */
  private synthesizeDecision(
    issue: string,
    voteResult: any,
    perspectives: Perspective[]
  ): string {
    const outcome = voteResult.passed ? 'approved' : 'rejected';
    const support = voteResult.percentageFor.toFixed(1);
    const uniqueFields = new Set(perspectives.map(p => p.field)).size;

    return `After consultation with ${perspectives.length} AI-powered expert models across ${uniqueFields} fields, the parliament has ${outcome} the proposal with ${support}% support. Each expert provided independent analysis based on their specialized knowledge and experience.`;
  }

  /**
   * Extract reasoning from votes and perspectives
   */
  private extractReasoning(
    votes: Vote[],
    perspectives: Perspective[],
    supportingView: boolean
  ): string[] {
    const relevantVotes = votes.filter(v =>
      supportingView ? v.position === 'for' : v.position === 'against'
    );

    // Sort by confidence if available
    const sortedVotes = relevantVotes.sort((a, b) =>
      (b.confidence || 0) - (a.confidence || 0)
    );

    const reasoning = sortedVotes.slice(0, 5).map(vote => {
      const expert = perspectives.find(p => p.expertId === vote.expertId);
      if (expert) {
        const confidenceStr = vote.confidence
          ? ` (confidence: ${(vote.confidence * 100).toFixed(0)}%)`
          : '';
        return `${expert.expertName} (${expert.field})${confidenceStr}: ${vote.reasoning}`;
      }
      return vote.reasoning;
    });

    return reasoning;
  }

  /**
   * Generate a summary report of the deliberation
   */
  static generateReport(result: DeliberationResult): string {
    const lines = [
      '='.repeat(80),
      'AI PARLIAMENT DELIBERATION REPORT',
      '='.repeat(80),
      '',
      `Issue: ${result.issue}`,
      `Participants: ${result.participantCount} AI-powered expert models`,
      `Duration: ${(result.duration / 1000).toFixed(2)}s`,
      '',
      'VOTE RESULT:',
      `- Method: ${result.voteResult.method}`,
      `- Votes For: ${result.voteResult.votesFor} (${result.voteResult.percentageFor.toFixed(1)}%)`,
      `- Votes Against: ${result.voteResult.votesAgainst} (${result.voteResult.percentageAgainst.toFixed(1)}%)`,
      `- Abstentions: ${result.voteResult.abstentions}`,
      `- Threshold: ${result.voteResult.threshold}%`,
      `- Result: ${result.voteResult.passed ? 'PASSED' : 'REJECTED'}`,
      '',
      'DECISION:',
      result.decision,
      '',
      'SUPPORTING REASONING (Top 5):',
      ...result.reasoning.map((r, i) => `${i + 1}. ${r}`),
      '',
    ];

    if (result.dissent.length > 0) {
      lines.push(
        'DISSENTING VIEWS (Top 5):',
        ...result.dissent.map((d, i) => `${i + 1}. ${d}`),
        ''
      );
    }

    lines.push('='.repeat(80));

    return lines.join('\n');
  }
}
