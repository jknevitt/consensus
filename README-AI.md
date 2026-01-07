# AI-Powered Parliament

The AI Parliament now features **real AI-powered expert consultations** where each of the 1,100+ experts is backed by Claude AI with specialized system prompts.

## Key Difference: Real AI Expertise

- **Before**: Simulated expert opinions with random logic
- **Now**: Each expert uses Claude AI with a specialized persona based on their profile
  - Unique system prompts defining expertise, experience, and perspective
  - Real analysis and reasoning from AI models
  - Genuine expert-level insights on complex issues

## Setup

### 1. Get an Anthropic API Key

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Create an API key

### 2. Configure Your Environment

Create a `.env` file in the project root:

```bash
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

Or set it as an environment variable:

```bash
export ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

### 3. Test the Integration

```bash
npm run test:ai
```

This will test the AI integration with 3 experts on a simple issue.

## Usage

### Web Interface (AI-Powered)

1. **Start the AI-powered backend:**
```bash
ANTHROPIC_API_KEY=sk-ant-xxx npm run server:ai
```

2. **Start the frontend:**
```bash
cd web
npm run dev
```

3. **Open in browser:** `http://localhost:3000`

**Note:** Start with a small number of participants (10-20) to manage API costs.

### CLI (AI-Powered)

```bash
# Deliberate on an issue with AI experts
ANTHROPIC_API_KEY=sk-ant-xxx npm run dev:ai -- deliberate "Should we invest in nuclear fusion research?" --max 15

# View statistics
npm run dev:ai -- stats
```

## How It Works

### Expert System Prompts

Each expert gets a specialized system prompt like:

```
You are Dr. Sarah Chen, Professor, with credentials in PhD, MD.

You are a world-renowned expert in Climate Science with 28 years of experience.

Your specializations include: climate modeling, paleoclimatology, carbon cycle.

Professional Background:
Dr. Sarah Chen is a distinguished expert in Climate Science with 28 years
of experience. Known for groundbreaking contributions to the field...

Your approach: evidence-based approach to climate science

Key personality traits: analytical, data-driven, pragmatic, systematic

Notable achievements:
- Published 56 peer-reviewed papers in Climate Science
- Led groundbreaking research in climate science
- Recipient of prestigious awards in Climate Science

When consulted on issues, you provide expert analysis from your specialized
perspective. You are thoughtful, evidence-based, and draw on your deep expertise.
```

### Deliberation Process

1. **Expert Selection**: Select relevant experts based on the issue and filters
2. **AI Consultation**: Each expert is consulted via Claude API with their unique persona
3. **Position & Reasoning**: Each expert provides:
   - Position: for / against / abstain
   - Detailed reasoning (AI-generated)
   - Confidence level (0.0 - 1.0)
4. **Voting**: Votes are tallied using the selected method
5. **Results**: Display outcomes with real AI reasoning

### Concurrency & Rate Limiting

The system uses intelligent rate limiting:
- Default: 10 concurrent API requests
- Adjustable via `AI_MAX_CONCURRENT` environment variable
- Ensures compliance with Anthropic rate limits

## Cost Considerations

Each expert consultation costs approximately:
- Input tokens: ~500 tokens (system prompt + issue)
- Output tokens: ~150 tokens (position + reasoning)
- Cost per expert: ~$0.005 - $0.01 (depending on model)

For 20 experts: ~$0.10 - $0.20 per deliberation

**Recommendations:**
- Start with 10-20 experts for testing
- Use `maxParticipants` to control costs
- Monitor usage in Anthropic console

## Configuration Options

Environment variables:

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-xxx

# Optional
AI_MODEL=claude-3-5-sonnet-20241022  # AI model to use
AI_MAX_CONCURRENT=10                  # Max concurrent API calls
AI_TEMPERATURE=0.7                    # Temperature for AI responses
```

## API Endpoints (AI-Powered)

### POST /api/deliberate

Conduct an AI-powered deliberation:

```json
{
  "issue": "Should we invest in renewable energy?",
  "maxParticipants": 20,
  "votingMethod": "simple-majority",
  "fields": ["Climate Science", "Energy Policy"]
}
```

Response includes real AI-generated reasoning for each expert.

### GET /api/health

Check AI integration status:

```json
{
  "status": "ok",
  "experts": 1100,
  "aiPowered": true,
  "message": "AI-powered parliament ready"
}
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Web Interface                     │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Express API Server                      │
│                (server-ai.ts)                        │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              ParliamentAI                            │
│         (orchestrates deliberation)                  │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              AIService                               │
│   (manages Claude API calls with rate limiting)     │
└────────────────────┬────────────────────────────────┘
                     │
                     │ For each expert:
                     │ 1. Generate specialized system prompt
                     │ 2. Call Claude API
                     │ 3. Parse AI response
                     ▼
┌─────────────────────────────────────────────────────┐
│            Claude AI (Anthropic)                     │
│    1100+ unique expert personas                      │
└─────────────────────────────────────────────────────┘
```

## Examples

### Example 1: Climate Policy

```bash
npm run dev:ai -- deliberate \
  "Should governments mandate carbon neutrality by 2040?" \
  --max 25
```

Each of the 25 experts provides real AI analysis from their unique perspective.

### Example 2: Healthcare Policy

```bash
npm run dev:ai -- deliberate \
  "Should we implement universal healthcare?" \
  --field "Public Health" \
  --max 15
```

Consults 15 Public Health experts, each providing genuine AI-powered insights.

## Troubleshooting

### Error: ANTHROPIC_API_KEY not set

```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Rate limit errors

Reduce concurrent requests:

```bash
AI_MAX_CONCURRENT=5 npm run server:ai
```

Or reduce participant count:

```json
{ "maxParticipants": 10 }
```

### High costs

- Use fewer participants (`maxParticipants: 10-20`)
- Use specific field filters to select relevant experts
- Monitor usage in Anthropic console

## Comparison: Simulated vs AI-Powered

| Feature | Simulated (server.ts) | AI-Powered (server-ai.ts) |
|---------|----------------------|---------------------------|
| Expert opinions | Random/rule-based | Real AI analysis |
| Reasoning quality | Generic templates | Thoughtful, contextual |
| Cost | Free | ~$0.01 per expert |
| Speed | Instant | 1-2s per expert |
| Requires API key | No | Yes |
| Authenticity | Roleplay | Real expertise |

## Next Steps

1. Set up your API key
2. Run `npm run test:ai` to verify
3. Start with small deliberations (10-20 experts)
4. Explore different issues and fields
5. Scale up as needed

For questions or issues, see the main [README.md](README.md).
