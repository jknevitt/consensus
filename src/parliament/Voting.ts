import { Expert } from '../experts/Expert.js';

/**
 * Voting methods available in the parliament
 */
export type VotingMethod =
  | 'simple-majority'      // > 50%
  | 'supermajority'        // >= 66.67%
  | 'consensus'            // >= 90%
  | 'unanimous'            // 100%
  | 'weighted-experience'; // Weighted by years of experience

/**
 * Represents a vote from an expert
 */
export interface Vote {
  expertId: string;
  position: 'for' | 'against' | 'abstain';
  weight: number;
  reasoning: string;
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
 * Handles voting logic for the parliament
 */
export class VotingSystem {
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

    if (method === 'weighted-experience') {
      // Weight votes by expert experience
      const forWeight = votes
        .filter(v => v.position === 'for')
        .reduce((sum, v) => sum + v.weight, 0);

      const againstWeight = votes
        .filter(v => v.position === 'against')
        .reduce((sum, v) => sum + v.weight, 0);

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
   * Simulate votes from experts based on their expertise and the issue
   */
  static simulateVotes(
    experts: Expert[],
    issue: string,
    useWeighting: boolean = false
  ): Vote[] {
    return experts.map(expert => {
      // Simulate expert opinion based on their field and issue keywords
      const position = this.determinePosition(expert, issue);
      const weight = useWeighting ? expert.yearsOfExperience : 1;
      const reasoning = this.generateReasoning(expert, issue, position);

      return {
        expertId: expert.id,
        position,
        weight,
        reasoning
      };
    });
  }

  /**
   * Determine expert's position on an issue (simulated)
   */
  private static determinePosition(
    expert: Expert,
    issue: string
  ): 'for' | 'against' | 'abstain' {
    // This is a simplified simulation
    // In a real system, this would integrate with an AI model

    const issueLower = issue.toLowerCase();
    const expertiseLower = [
      expert.field,
      ...expert.specializations,
      ...expert.traits
    ].join(' ').toLowerCase();

    // Check if issue is related to expert's field
    const relevance = this.calculateRelevance(issueLower, expertiseLower);

    // Experts abstain only if completely irrelevant (low threshold)
    if (relevance < 0.1) {
      return 'abstain'; // Not enough expertise to vote
    }

    // Simulate position based on traits and random factors
    const hasProgressiveTrait = expert.traits.some(t =>
      ['progressive', 'innovative', 'forward-thinking', 'reform-minded'].includes(t.toLowerCase())
    );

    const hasConservativeTrait = expert.traits.some(t =>
      ['conservative', 'traditional', 'cautious', 'risk-averse'].includes(t.toLowerCase())
    );

    // Add some randomness but bias based on traits
    const random = Math.random();

    if (hasProgressiveTrait && random > 0.3) return 'for';
    if (hasConservativeTrait && random > 0.3) return 'against';

    return random > 0.5 ? 'for' : 'against';
  }

  /**
   * Calculate relevance between issue and expertise
   */
  private static calculateRelevance(issue: string, expertise: string): number {
    const issueWords = issue.split(/\s+/);
    const expertiseWords = expertise.split(/\s+/);

    let matches = 0;
    for (const word of issueWords) {
      if (word.length > 3 && expertiseWords.some(ew => ew.includes(word) || word.includes(ew))) {
        matches++;
      }
    }

    // Most experts have at least some relevance to broad issues
    const baseRelevance = matches / Math.max(issueWords.length, 1);

    // Add a baseline so experts aren't too quick to abstain
    return Math.min(1.0, baseRelevance + 0.2);
  }

  /**
   * Generate reasoning for a vote (simulated)
   */
  private static generateReasoning(
    expert: Expert,
    issue: string,
    position: 'for' | 'against' | 'abstain'
  ): string {
    if (position === 'abstain') {
      return `As a ${expert.field} expert, this issue falls outside my primary area of expertise. I abstain to allow more qualified experts to decide.`;
    }

    const stance = position === 'for' ? 'support' : 'oppose';
    return `From my perspective as a ${expert.field} specialist with expertise in ${expert.specializations[0]}, I ${stance} this proposal. This aligns with established principles in ${expert.field}.`;
  }
}
