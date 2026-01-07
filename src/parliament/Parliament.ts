import { ExpertManager } from '../experts/ExpertManager.js';
import { Expert, ExpertFilter } from '../experts/Expert.js';
import { Deliberation, DeliberationResult } from './Deliberation.js';
import { VotingMethod } from './Voting.js';

/**
 * Options for a deliberation
 */
export interface DeliberationOptions {
  issue: string;
  expertFilter?: ExpertFilter;
  votingMethod?: VotingMethod;
  minParticipants?: number;
  maxParticipants?: number;
}

/**
 * Main Parliament coordinator
 */
export class Parliament {
  constructor(private expertManager: ExpertManager) {}

  /**
   * Query experts based on filter criteria
   */
  queryExperts(filter: ExpertFilter): Expert[] {
    return this.expertManager.queryExperts(filter);
  }

  /**
   * Get a specific expert by ID
   */
  getExpert(id: string): Expert | undefined {
    return this.expertManager.getExpertById(id);
  }

  /**
   * Get all available fields of expertise
   */
  getFields(): string[] {
    return this.expertManager.getAvailableFields();
  }

  /**
   * Get parliament statistics
   */
  getStatistics() {
    return this.expertManager.getStatistics();
  }

  /**
   * Conduct a deliberation on an issue
   */
  async deliberate(options: DeliberationOptions): Promise<DeliberationResult> {
    // Select experts
    let experts: Expert[];

    if (options.expertFilter) {
      experts = this.expertManager.queryExperts(options.expertFilter);
    } else {
      experts = this.expertManager.getAllExperts();
    }

    // Apply participant limits
    if (options.minParticipants && experts.length < options.minParticipants) {
      throw new Error(
        `Not enough experts found. Required: ${options.minParticipants}, Found: ${experts.length}`
      );
    }

    if (options.maxParticipants && experts.length > options.maxParticipants) {
      // Randomly sample to meet max limit
      experts = this.expertManager.getRandomExperts(options.maxParticipants);
    }

    // Conduct deliberation
    const votingMethod = options.votingMethod || 'simple-majority';
    const result = await Deliberation.conductDeliberation(
      options.issue,
      experts,
      votingMethod
    );

    return result;
  }

  /**
   * Consult specific experts on an issue without voting
   */
  async consult(issue: string, expertFilter?: ExpertFilter): Promise<{
    issue: string;
    experts: Expert[];
    perspectives: any[];
  }> {
    let experts: Expert[];

    if (expertFilter) {
      experts = this.expertManager.queryExperts(expertFilter);
    } else {
      // Default to a manageable number for consultation
      experts = this.expertManager.getRandomExperts(20);
    }

    const result = await Deliberation.conductDeliberation(
      issue,
      experts,
      'simple-majority'
    );

    return {
      issue,
      experts,
      perspectives: result.perspectives
    };
  }

  /**
   * Get experts suitable for a specific issue
   */
  getRelevantExperts(issue: string, limit: number = 50): Expert[] {
    // Extract potential keywords from the issue
    const keywords = issue
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4);

    return this.expertManager.queryExperts({
      keywords,
      limit
    });
  }

  /**
   * Create a specialized committee from the parliament
   */
  createCommittee(fields: string[], size: number = 10): Expert[] {
    const experts = this.expertManager.queryExperts({ fields });

    if (experts.length <= size) {
      return experts;
    }

    // Return a diverse sample
    return this.expertManager.getRandomExperts(size);
  }

  /**
   * Display parliament composition
   */
  displayComposition(): string {
    const stats = this.getStatistics();
    const fields = this.getFields();

    const lines = [
      '='.repeat(80),
      'AI PARLIAMENT COMPOSITION',
      '='.repeat(80),
      '',
      `Total Experts: ${stats.totalExperts}`,
      `Total Fields: ${stats.totalFields}`,
      `Average Experience: ${stats.averageExperience.toFixed(1)} years`,
      '',
      'FIELD DISTRIBUTION:',
      ...fields.slice(0, 20).map(field => {
        const count = stats.fieldDistribution[field] || 0;
        const bar = '█'.repeat(Math.floor(count / 2));
        return `  ${field.padEnd(30)} ${bar} ${count}`;
      }),
      '',
      '='.repeat(80)
    ];

    return lines.join('\n');
  }
}
