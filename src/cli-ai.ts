#!/usr/bin/env node

import { Command } from 'commander';
import { ParliamentAI } from './parliament/ParliamentAI.js';
import { ExpertManager } from './experts/ExpertManager.js';
import { Deliberation } from './parliament/DeliberationNew.js';

const program = new Command();

program
  .name('ai-parliament')
  .description('AI Parliament - 1000+ AI-powered expert models for collaborative decision-making')
  .version('1.0.0');

program
  .command('stats')
  .description('Display parliament statistics')
  .action(async () => {
    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new ParliamentAI(expertManager);
    console.log(parliament.displayComposition());
  });

program
  .command('deliberate')
  .description('Conduct an AI-powered deliberation with voting')
  .argument('<issue>', 'The issue to deliberate on')
  .option('-f, --field <field>', 'Limit to specific field')
  .option('-m, --method <method>', 'Voting method (simple-majority, supermajority, consensus, unanimous, weighted-confidence)', 'simple-majority')
  .option('--min <number>', 'Minimum participants')
  .option('--max <number>', 'Maximum participants', '20')
  .action(async (issue, options) => {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('\n❌ Error: ANTHROPIC_API_KEY environment variable not set');
      console.error('\nTo use AI-powered deliberations, you need to:');
      console.error('1. Get an API key from https://console.anthropic.com/');
      console.error('2. Set the environment variable:');
      console.error('   export ANTHROPIC_API_KEY=sk-ant-your-key-here');
      console.error('\nOr create a .env file with:');
      console.error('   ANTHROPIC_API_KEY=sk-ant-your-key-here\n');
      process.exit(1);
    }

    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new ParliamentAI(expertManager);

    const deliberationOptions: any = {
      issue,
      votingMethod: options.method,
      maxParticipants: parseInt(options.max)
    };

    if (options.field) {
      deliberationOptions.expertFilter = { fields: [options.field] };
    }

    if (options.min) {
      deliberationOptions.minParticipants = parseInt(options.min);
    }

    console.log(`\nInitiating AI-powered deliberation on: "${issue}"\n`);

    const result = await parliament.deliberate(deliberationOptions);

    console.log(Deliberation.generateReport(result));
  });

program
  .command('test-ai')
  .description('Test AI integration with a simple query')
  .action(async () => {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌ ANTHROPIC_API_KEY not set. Please configure your API key first.');
      process.exit(1);
    }

    console.log('✓ API key configured');
    console.log('Testing AI integration with 3 experts...\n');

    const expertManager = new ExpertManager();
    await expertManager.loadExperts('./data/experts');

    const parliament = new ParliamentAI(expertManager);

    const result = await parliament.deliberate({
      issue: 'Should we prioritize renewable energy development?',
      maxParticipants: 3,
      votingMethod: 'simple-majority'
    });

    console.log('\n✓ AI integration test successful!');
    console.log(`\nResult: ${result.voteResult.passed ? 'PASSED' : 'REJECTED'}`);
    console.log(`Votes: ${result.voteResult.votesFor} for, ${result.voteResult.votesAgainst} against`);
  });

program.parse();
