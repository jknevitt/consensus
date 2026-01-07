import express from 'express';
import cors from 'cors';
import { ParliamentAI } from './parliament/ParliamentAI.js';
import { ExpertManager } from './experts/ExpertManager.js';
import { DeliberationResult } from './parliament/DeliberationNew.js';
import { VotingMethod } from './parliament/VotingNew.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize parliament
let parliament: ParliamentAI;
let expertManager: ExpertManager;

async function initializeParliament() {
  expertManager = new ExpertManager();
  await expertManager.loadExperts('./data/experts');

  // Initialize AI-powered parliament
  parliament = new ParliamentAI(expertManager, {
    maxConcurrent: 10,
    temperature: 0.7
  });

  console.log('AI Parliament initialized with', expertManager.getAllExperts().length, 'AI-powered expert models');
  console.log('Each expert uses Claude AI with specialized system prompts\n');
}

// API Routes

/**
 * GET /api/stats
 * Get parliament statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    const stats = parliament.getStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

/**
 * GET /api/fields
 * Get all available fields
 */
app.get('/api/fields', (req, res) => {
  try {
    const fields = parliament.getFields();
    res.json({ fields });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get fields' });
  }
});

/**
 * POST /api/deliberate
 * Conduct an AI-powered deliberation on an issue
 */
app.post('/api/deliberate', async (req, res) => {
  try {
    const {
      issue,
      fields,
      votingMethod = 'simple-majority',
      maxParticipants = 20 // Default to 20 for reasonable AI API usage
    } = req.body;

    if (!issue) {
      return res.status(400).json({ error: 'Issue is required' });
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`New deliberation request: "${issue}"`);
    console.log(`Max participants: ${maxParticipants}`);
    console.log(`${'='.repeat(80)}\n`);

    const deliberationOptions: any = {
      issue,
      votingMethod: votingMethod as VotingMethod,
      maxParticipants,
      onProgress: (stage: string, completed?: number, total?: number) => {
        if (completed !== undefined && total !== undefined) {
          console.log(`${stage}: ${completed}/${total}`);
        } else {
          console.log(stage);
        }
      }
    };

    if (fields && fields.length > 0) {
      deliberationOptions.expertFilter = { fields };
    }

    const result = await parliament.deliberate(deliberationOptions);

    console.log(`\nDeliberation complete: ${result.voteResult.passed ? 'PASSED' : 'REJECTED'}`);
    console.log(`Votes: ${result.voteResult.votesFor} for, ${result.voteResult.votesAgainst} against, ${result.voteResult.abstentions} abstain\n`);

    // Enrich result with expert details
    const enrichedResult = {
      ...result,
      votesWithDetails: result.votes.map(vote => {
        const expert = expertManager.getExpertById(vote.expertId);
        return {
          ...vote,
          expertName: expert?.name || 'Unknown',
          expertField: expert?.field || 'Unknown',
          expertTitle: expert?.title || '',
          expertCredentials: expert?.credentials || [],
          expertExperience: expert?.yearsOfExperience || 0
        };
      })
    };

    res.json(enrichedResult);
  } catch (error: any) {
    console.error('Deliberation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to conduct deliberation',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/experts/:id
 * Get a specific expert by ID
 */
app.get('/api/experts/:id', (req, res) => {
  try {
    const expert = expertManager.getExpertById(req.params.id);
    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }
    res.json(expert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get expert' });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  const apiKeyConfigured = !!process.env.ANTHROPIC_API_KEY;
  res.json({
    status: 'ok',
    experts: expertManager?.getAllExperts().length || 0,
    aiPowered: apiKeyConfigured,
    message: apiKeyConfigured
      ? 'AI-powered parliament ready'
      : 'Warning: ANTHROPIC_API_KEY not configured. Set it to enable AI-powered deliberations.'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    await initializeParliament();
    app.listen(port, () => {
      console.log(`AI Parliament API server running on http://localhost:${port}`);
      console.log(`\nNote: Set ANTHROPIC_API_KEY environment variable to enable AI-powered deliberations`);
      console.log(`Example: ANTHROPIC_API_KEY=sk-xxx npm run server:ai\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
