import { Expert } from '../experts/Expert.js';
import { AIService, ExpertConsultation } from '../ai/AIService.js';

/**
 * Voting methods available in the parliament
 */
export type VotingMethod =
  | 'simple-majority'      // > 50%
  | 'supermajority'        // >= 66.67%
  | 'consensus'            // >= 90%
  | 'unanimous'            // 100%
  | 'weighted-confidence'; // Weighted by AI confidence

/**
 * Represents a vote from an expert (with AI-powered reasoning)
 */
export interface Vote {
  expertId: string;
  position: 'for' | 'against' | 'abstain';
  weight: number;
  reasoning: string;
  confidence?: number;
}

/**
 * Result of a vote
 */
export interface VoteResult {
  method: VotingMethod;
  totalVotes: number;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  percentageFor: number;
  percentageAgainst: number;
  passed: boolean;
  threshold: number;
}

/**
 * Handles voting logic for the parliament (AI-powered)
 */
export class VotingSystem {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  /**
   * Conduct a vote using the specified method
   */
  static conductVote(
    votes: Vote[],
    method: VotingMethod = 'simple-majority'
  ): VoteResult {
    let votesFor: number;
    let votesAgainst: number;
    let totalVotes: number;
    let threshold: number;

    if (method === 'weighted-confidence') {
      // Weight votes by AI confidence
      const forWeight = votes
        .filter(v => v.position === 'for')
        .reduce((sum, v) => sum + (v.confidence || 1) * v.weight, 0);

      const againstWeight = votes
        .filter(v => v.position === 'against')
        .reduce((sum, v) => sum + (v.confidence || 1) * v.weight, 0);

      totalVotes = forWeight + againstWeight;
      votesFor = forWeight;
      votesAgainst = againstWeight;
      threshold = 0.5;
    } else {
      // Simple counting
      votesFor = votes.filter(v => v.position === 'for').length;
      votesAgainst = votes.filter(v => v.position === 'against').length;
      totalVotes = votesFor + votesAgainst;

      // Set threshold based on method
      switch (method) {
        case 'simple-majority':
          threshold = 0.5;
          break;
        case 'supermajority':
          threshold = 2/3;
          break;
        case 'consensus':
          threshold = 0.9;
          break;
        case 'unanimous':
          threshold = 1.0;
          break;
        default:
          threshold = 0.5;
      }
    }

    const percentageFor = totalVotes > 0 ? votesFor / totalVotes : 0;
    const percentageAgainst = totalVotes > 0 ? votesAgainst / totalVotes : 0;
    const passed = percentageFor > threshold;

    return {
      method,
      totalVotes,
      votesFor,
      votesAgainst,
      abstentions: votes.filter(v => v.position === 'abstain').length,
      percentageFor: percentageFor * 100,
      percentageAgainst: percentageAgainst * 100,
      passed,
      threshold: threshold * 100
    };
  }

  /**
   * Get AI-powered votes from experts
   */
  async getVotesFromExperts(
    experts: Expert[],
    issue: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<Vote[]> {
    console.log(`Consulting ${experts.length} experts with AI models...`);

    const consultations = await this.aiService.consultExperts(
      experts,
      issue,
      onProgress
    );

    const votes: Vote[] = [];

    for (const expert of experts) {
      const consultation = consultations.get(expert.id);

      if (consultation) {
        votes.push({
          expertId: expert.id,
          position: consultation.position,
          weight: expert.yearsOfExperience,
          reasoning: consultation.reasoning,
          confidence: consultation.confidence
        });
      }
    }

    return votes;
  }
}
