# AI Parliament Web Interface

A modern React-based web interface for the AI Parliament system.

## Features

- Submit questions or proposals to the parliament
- Real-time deliberation and voting
- Expandable vote results showing:
  - Vote counts (For, Against, Abstain)
  - Individual expert votes
  - Expert reasoning and credentials
- Responsive design with Tailwind CSS

## Quick Start

### 1. Start the Backend API

From the root directory:

```bash
npm run server
```

This starts the Express API server on `http://localhost:3001`

### 2. Start the Frontend

In a separate terminal, from the `web` directory:

```bash
cd web
npm run dev
```

This starts the Vite dev server on `http://localhost:3000`

### 3. Open in Browser

Navigate to `http://localhost:3000` and start consulting the parliament!

## Development

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Enter your question or proposal** in the text area
2. **Adjust the number of participants** using the slider (10-500 experts)
3. **Click "Submit to Parliament"** to initiate deliberation
4. **View results:**
   - Overall vote outcome (Passed/Rejected)
   - Vote summary with percentages
   - Click on vote categories to expand and see individual experts
   - Click on expert cards to see their detailed reasoning

## Architecture

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Express API** backend (runs separately)

## Components

- `App.tsx` - Main application component
- `ParliamentInterface.tsx` - Main interface coordinator
- `QuestionForm.tsx` - Form for submitting questions
- `VoteResults.tsx` - Displays deliberation results
- `ExpertVoteCard.tsx` - Individual expert vote details
- `LoadingSpinner.tsx` - Loading state display
