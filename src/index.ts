#!/usr/bin/env node

import { Command } from 'commander';
import { Parliament } from './parliament/Parliament.js';
import { ExpertManager } from './experts/ExpertManager.js';
import { Deliberation } from './parliament/Deliberation.js';

const program = new Command();

program
  .name('ai-parliament')
  .description('AI Parliament - 1000+ expert models for collaborative decision-making')
  .version('1.0.0');

program
  .command('stats')
  .description('Display parliament statistics')
  .action(async () => {
    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new Parliament(expertManager);
    console.log(parliament.displayComposition());
    console.log();

    const stats = parliament.getStatistics();
    console.log('Detailed Statistics:');
    console.log(JSON.stringify(stats, null, 2));
  });

program
  .command('query')
  .description('Query experts by field or specialization')
  .option('-f, --field <field>', 'Filter by field')
  .option('-s, --specialization <spec>', 'Filter by specialization')
  .option('-k, --keywords <keywords>', 'Filter by keywords (comma-separated)')
  .option('-l, --limit <number>', 'Limit results', '10')
  .action(async (options) => {
    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new Parliament(expertManager);

    const filter: any = { limit: parseInt(options.limit) };

    if (options.field) {
      filter.fields = [options.field];
    }

    if (options.specialization) {
      filter.specializations = [options.specialization];
    }

    if (options.keywords) {
      filter.keywords = options.keywords.split(',').map((k: string) => k.trim());
    }

    const experts = parliament.queryExperts(filter);

    console.log(`\nFound ${experts.length} experts:\n`);
    for (const expert of experts.slice(0, 20)) {
      console.log(`${expert.name} - ${expert.title}`);
      console.log(`  Field: ${expert.field}`);
      console.log(`  Specializations: ${expert.specializations.join(', ')}`);
      console.log(`  Experience: ${expert.yearsOfExperience} years`);
      console.log(`  Credentials: ${expert.credentials.join(', ')}`);
      console.log();
    }
  });

program
  .command('consult')
  .description('Consult the parliament on an issue')
  .argument('<issue>', 'The issue to consult on')
  .option('-f, --field <field>', 'Limit to specific field')
  .option('-l, --limit <number>', 'Number of experts to consult', '20')
  .action(async (issue, options) => {
    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new Parliament(expertManager);

    const filter: any = { limit: parseInt(options.limit) };
    if (options.field) {
      filter.fields = [options.field];
    }

    console.log(`\nConsulting parliament on: "${issue}"\n`);

    const result = await parliament.consult(issue, filter);

    console.log(`Consulted ${result.experts.length} experts:\n`);

    for (const perspective of result.perspectives.slice(0, 10)) {
      console.log(`${perspective.expertName} (${perspective.field}):`);
      console.log(`  ${perspective.viewpoint}`);
      console.log(`  Key Points:`);
      for (const point of perspective.keyPoints.slice(0, 2)) {
        console.log(`    - ${point}`);
      }
      console.log();
    }
  });

program
  .command('deliberate')
  .description('Conduct a full deliberation with voting')
  .argument('<issue>', 'The issue to deliberate on')
  .option('-f, --field <field>', 'Limit to specific field')
  .option('-m, --method <method>', 'Voting method (simple-majority, supermajority, consensus, unanimous, weighted-experience)', 'simple-majority')
  .option('--min <number>', 'Minimum participants')
  .option('--max <number>', 'Maximum participants')
  .action(async (issue, options) => {
    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new Parliament(expertManager);

    const deliberationOptions: any = {
      issue,
      votingMethod: options.method
    };

    if (options.field) {
      deliberationOptions.expertFilter = { fields: [options.field] };
    }

    if (options.min) {
      deliberationOptions.minParticipants = parseInt(options.min);
    }

    if (options.max) {
      deliberationOptions.maxParticipants = parseInt(options.max);
    }

    console.log(`\nInitiating deliberation on: "${issue}"\n`);

    const result = await parliament.deliberate(deliberationOptions);

    console.log(Deliberation.generateReport(result));
  });

program
  .command('fields')
  .description('List all available fields of expertise')
  .action(async () => {
    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new Parliament(expertManager);
    const fields = parliament.getFields();

    console.log(`\nAvailable Fields (${fields.length}):\n`);
    for (const field of fields) {
      const experts = parliament.queryExperts({ fields: [field] });
      console.log(`  ${field.padEnd(40)} (${experts.length} experts)`);
    }
  });

program
  .command('expert')
  .description('Get detailed information about a specific expert')
  .argument('<id>', 'Expert ID')
  .action(async (id) => {
    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new Parliament(expertManager);
    const expert = parliament.getExpert(id);

    if (!expert) {
      console.log(`Expert ${id} not found`);
      return;
    }

    console.log('\n' + '='.repeat(80));
    console.log(`${expert.name}, ${expert.credentials.join(', ')}`);
    console.log('='.repeat(80));
    console.log(`\nTitle: ${expert.title}`);
    console.log(`Field: ${expert.field}`);
    console.log(`Specializations: ${expert.specializations.join(', ')}`);
    console.log(`Experience: ${expert.yearsOfExperience} years`);
    console.log(`\nBiography:`);
    console.log(`  ${expert.biography}`);
    console.log(`\nPerspective:`);
    console.log(`  ${expert.perspective}`);
    console.log(`\nTraits: ${expert.traits.join(', ')}`);
    console.log(`\nKey Achievements:`);
    for (const achievement of expert.achievements) {
      console.log(`  - ${achievement}`);
    }
    console.log('='.repeat(80) + '\n');
  });

program.parse();
