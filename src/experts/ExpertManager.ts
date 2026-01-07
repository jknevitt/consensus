import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { Expert, ExpertFilter } from './Expert.js';

/**
 * Manages the collection of experts in the parliament
 */
export class ExpertManager {
  private experts: Expert[] = [];
  private expertsById: Map<string, Expert> = new Map();
  private expertsByField: Map<string, Expert[]> = new Map();

  /**
   * Load all experts from the data directory
   */
  async loadExperts(dataDir: string = './data/experts'): Promise<void> {
    try {
      const files = await readdir(dataDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles) {
        const filePath = join(dataDir, file);
        const content = await readFile(filePath, 'utf-8');
        const expertsData = JSON.parse(content);

        // Handle both single expert and array of experts
        const experts = Array.isArray(expertsData) ? expertsData : [expertsData];

        for (const expert of experts) {
          this.addExpert(expert);
        }
      }

      console.log(`Loaded ${this.experts.length} experts from ${jsonFiles.length} files`);
    } catch (error) {
      console.error('Error loading experts:', error);
      throw error;
    }
  }

  /**
   * Add an expert to the collection
   */
  private addExpert(expert: Expert): void {
    this.experts.push(expert);
    this.expertsById.set(expert.id, expert);

    // Index by field
    if (!this.expertsByField.has(expert.field)) {
      this.expertsByField.set(expert.field, []);
    }
    this.expertsByField.get(expert.field)!.push(expert);
  }

  /**
   * Get all experts
   */
  getAllExperts(): Expert[] {
    return [...this.experts];
  }

  /**
   * Get expert by ID
   */
  getExpertById(id: string): Expert | undefined {
    return this.expertsById.get(id);
  }

  /**
   * Query experts based on filter criteria
   */
  queryExperts(filter: ExpertFilter): Expert[] {
    let results = [...this.experts];

    // Filter by fields
    if (filter.fields && filter.fields.length > 0) {
      results = results.filter(expert =>
        filter.fields!.some(field =>
          expert.field.toLowerCase().includes(field.toLowerCase())
        )
      );
    }

    // Filter by specializations
    if (filter.specializations && filter.specializations.length > 0) {
      results = results.filter(expert =>
        filter.specializations!.some(spec =>
          expert.specializations.some(s =>
            s.toLowerCase().includes(spec.toLowerCase())
          )
        )
      );
    }

    // Filter by minimum experience
    if (filter.minExperience) {
      results = results.filter(expert =>
        expert.yearsOfExperience >= filter.minExperience!
      );
    }

    // Filter by keywords
    if (filter.keywords && filter.keywords.length > 0) {
      results = results.filter(expert => {
        const searchText = [
          expert.name,
          expert.field,
          ...expert.specializations,
          expert.biography,
          ...expert.achievements
        ].join(' ').toLowerCase();

        return filter.keywords!.some(keyword =>
          searchText.includes(keyword.toLowerCase())
        );
      });
    }

    // Apply limit
    if (filter.limit && filter.limit > 0) {
      results = results.slice(0, filter.limit);
    }

    return results;
  }

  /**
   * Get experts by field
   */
  getExpertsByField(field: string): Expert[] {
    return this.expertsByField.get(field) || [];
  }

  /**
   * Get all available fields
   */
  getAvailableFields(): string[] {
    return Array.from(this.expertsByField.keys()).sort();
  }

  /**
   * Get statistics about the expert pool
   */
  getStatistics() {
    const fieldCounts = new Map<string, number>();
    let totalExperience = 0;

    for (const expert of this.experts) {
      fieldCounts.set(expert.field, (fieldCounts.get(expert.field) || 0) + 1);
      totalExperience += expert.yearsOfExperience;
    }

    return {
      totalExperts: this.experts.length,
      totalFields: this.expertsByField.size,
      averageExperience: totalExperience / this.experts.length,
      fieldDistribution: Object.fromEntries(fieldCounts),
      mostRepresentedField: Array.from(fieldCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]
    };
  }

  /**
   * Get a random sample of experts
   */
  getRandomExperts(count: number): Expert[] {
    const shuffled = [...this.experts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, this.experts.length));
  }
}
