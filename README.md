# AI Parliament

An AI parliament consisting of 1000+ individual GenAI models, each with different world-class professional expertise.

## 🚀 Now with Real AI-Powered Expertise!

The parliament now supports **actual AI-powered expert consultations** where each expert is backed by Claude AI with specialized system prompts. Get genuine expert analysis instead of simulated responses!

**See [README-AI.md](README-AI.md) for the AI-powered version setup and usage.**

## Overview

The AI Parliament is a sophisticated system that brings together over 1000 unique AI experts spanning every major field of human knowledge. Each expert has specialized knowledge, experience, and perspective in their domain, enabling collaborative deliberation and consensus-building on complex issues.

### Two Modes Available

1. **AI-Powered Mode** (Recommended): Real Claude AI consultations with each expert
   - Requires Anthropic API key
   - Genuine expert-level analysis
   - See [README-AI.md](README-AI.md)

2. **Simulated Mode**: Fast, free simulations for testing and demos
   - No API key required
   - Rule-based responses
   - This README

## Features

- **1000+ Unique Experts**: Each with distinct expertise, specializations, and professional backgrounds
- **Diverse Fields**: Medical, Legal, Engineering, Sciences, Arts, Business, Technology, Humanities, and more
- **Parliament Coordination**: Sophisticated deliberation and voting mechanisms
- **Consensus Building**: Multiple voting systems (simple majority, supermajority, weighted, consensus)
- **Expert Selection**: Query experts by field, specialization, or keywords
- **Flexible Architecture**: Extensible design for adding new experts and capabilities

## Installation

```bash
npm install
npm run build
```

## Usage

### Web Interface (Recommended)

The AI Parliament includes a modern web interface for easy interaction:

1. **Start the backend API server:**
```bash
npm run server
```

2. **Start the frontend (in a separate terminal):**
```bash
cd web
npm run dev
```

3. **Open in browser:** Navigate to `http://localhost:3000`

The web interface allows you to:
- Submit questions or proposals to the parliament
- View real-time deliberation results
- Expand vote categories to see which experts voted
- View individual expert reasoning and credentials

See [web/README.md](web/README.md) for more details.

### CLI Interface

```bash
# Consult the parliament on an issue
npm run dev -- consult "Should we adopt renewable energy policies?"

# Query specific experts
npm run dev -- query --field "Climate Science" --limit 10

# Initiate a deliberation with voting
npm run dev -- deliberate "Ethical implications of AI in healthcare" --vote
```

### Programmatic Usage

```typescript
import { Parliament } from './parliament/Parliament.js';
import { ExpertManager } from './experts/ExpertManager.js';

const expertManager = new ExpertManager();
await expertManager.loadExperts();

const parliament = new Parliament(expertManager);

// Get experts by field
const climateExperts = parliament.queryExperts({ fields: ['Climate Science'] });

// Deliberate on an issue
const result = await parliament.deliberate({
  issue: "Should we invest in nuclear fusion research?",
  expertFilter: { fields: ['Physics', 'Energy Policy', 'Economics'] },
  votingMethod: 'consensus'
});

console.log(result.decision);
console.log(result.reasoning);
```

## Architecture

### Expert System

Each expert is defined with:
- Unique identifier
- Full name and credentials
- Primary field of expertise
- Multiple specializations
- Years of experience
- Key achievements
- Personality traits
- Perspective bias (if any)

### Parliament Mechanisms

1. **Expert Selection**: Filter and select relevant experts for specific issues
2. **Deliberation**: Experts provide perspectives based on their expertise
3. **Voting**: Multiple voting methods for decision-making
4. **Consensus Building**: Iterative refinement toward agreement

### File Structure

```
src/
├── experts/
│   ├── Expert.ts           # Expert model
│   ├── ExpertManager.ts    # Expert loading and querying
│   └── ExpertGenerator.ts  # Expert profile generation
├── parliament/
│   ├── Parliament.ts       # Main parliament coordinator
│   ├── Deliberation.ts     # Deliberation logic
│   └── Voting.ts           # Voting mechanisms
├── data/
│   └── experts/            # JSON files with expert profiles
├── scripts/
│   └── generateExperts.ts  # Script to generate expert profiles
└── index.ts                # CLI entry point
```

## Expert Categories

The parliament includes experts from:

- **Medicine & Healthcare**: Physicians, Surgeons, Researchers, Public Health
- **Law & Policy**: Lawyers, Judges, Policy Makers, Constitutional Scholars
- **Engineering**: Civil, Mechanical, Electrical, Software, Aerospace
- **Natural Sciences**: Physics, Chemistry, Biology, Earth Sciences
- **Technology**: AI/ML, Cybersecurity, Blockchain, Quantum Computing
- **Business & Economics**: Finance, Marketing, Entrepreneurship, Development
- **Arts & Humanities**: Philosophy, History, Literature, Art, Music
- **Social Sciences**: Psychology, Sociology, Anthropology, Political Science
- **Education**: Pedagogy, Curriculum Development, Educational Technology
- **Agriculture & Environment**: Agronomy, Ecology, Conservation, Sustainability

...and many more!

## Development

```bash
# Generate expert profiles
npm run generate-experts

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## License

MIT
