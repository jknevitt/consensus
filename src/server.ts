import express from 'express';
import cors from 'cors';
import { Parliament } from './parliament/Parliament.js';
import { ExpertManager } from './experts/ExpertManager.js';
import { DeliberationResult } from './parliament/Deliberation.js';
import { VotingMethod } from './parliament/Voting.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize parliament
let parliament: Parliament;
let expertManager: ExpertManager;

async function initializeParliament() {
  expertManager = new ExpertManager();
  await expertManager.loadExperts('./data/experts');
  parliament = new Parliament(expertManager);
  console.log('Parliament initialized with', expertManager.getAllExperts().length, 'experts');
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
 * Conduct a deliberation on an issue
 */
app.post('/api/deliberate', async (req, res) => {
  try {
    const {
      issue,
      fields,
      votingMethod = 'simple-majority',
      maxParticipants = 100
    } = req.body;

    if (!issue) {
      return res.status(400).json({ error: 'Issue is required' });
    }

    const deliberationOptions: any = {
      issue,
      votingMethod: votingMethod as VotingMethod,
      maxParticipants
    };

    if (fields && fields.length > 0) {
      deliberationOptions.expertFilter = { fields };
    }

    const result = await parliament.deliberate(deliberationOptions);

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
    res.status(500).json({ error: error.message || 'Failed to conduct deliberation' });
  }
});

/**
 * POST /api/consult
 * Consult experts without voting
 */
app.post('/api/consult', async (req, res) => {
  try {
    const { issue, fields, limit = 20 } = req.body;

    if (!issue) {
      return res.status(400).json({ error: 'Issue is required' });
    }

    const expertFilter: any = { limit };
    if (fields && fields.length > 0) {
      expertFilter.fields = fields;
    }

    const result = await parliament.consult(issue, expertFilter);
    res.json(result);
  } catch (error: any) {
    console.error('Consultation error:', error);
    res.status(500).json({ error: error.message || 'Failed to consult experts' });
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
  res.json({ status: 'ok', experts: expertManager?.getAllExperts().length || 0 });
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
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
