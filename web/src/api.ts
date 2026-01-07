export interface VoteWithDetails {
  expertId: string;
  position: 'for' | 'against' | 'abstain';
  weight: number;
  reasoning: string;
  expertName: string;
  expertField: string;
  expertTitle: string;
  expertCredentials: string[];
  expertExperience: number;
}

export interface VoteResult {
  method: string;
  totalVotes: number;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  percentageFor: number;
  percentageAgainst: number;
  passed: boolean;
  threshold: number;
}

export interface DeliberationResult {
  issue: string;
  participantCount: number;
  voteResult: VoteResult;
  decision: string;
  reasoning: string[];
  dissent: string[];
  duration: number;
  votesWithDetails: VoteWithDetails[];
}

export interface DeliberationRequest {
  issue: string;
  fields?: string[];
  votingMethod?: 'simple-majority' | 'supermajority' | 'consensus' | 'unanimous' | 'weighted-experience';
  maxParticipants?: number;
}

const API_BASE = '/api';

export const api = {
  async deliberate(request: DeliberationRequest): Promise<DeliberationResult> {
    const response = await fetch(`${API_BASE}/deliberate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to deliberate');
    }

    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) throw new Error('Failed to get stats');
    return response.json();
  },

  async getFields(): Promise<{ fields: string[] }> {
    const response = await fetch(`${API_BASE}/fields`);
    if (!response.ok) throw new Error('Failed to get fields');
    return response.json();
  }
};
