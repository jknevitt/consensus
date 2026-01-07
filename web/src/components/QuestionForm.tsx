import { useState } from 'react';

interface QuestionFormProps {
  onSubmit: (issue: string, maxParticipants: number) => void;
  disabled: boolean;
}

export default function QuestionForm({ onSubmit, disabled }: QuestionFormProps) {
  const [issue, setIssue] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (issue.trim()) {
      onSubmit(issue.trim(), maxParticipants);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Consult the Parliament
      </h2>
      <p className="text-slate-600 mb-6">
        Pose a question or scenario to the parliament. Our 1,100+ expert models will
        deliberate and vote on the issue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="issue"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Your Question or Proposal
          </label>
          <textarea
            id="issue"
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
            placeholder="e.g., Should we invest heavily in renewable energy infrastructure?"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <label
            htmlFor="participants"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Maximum Participants: {maxParticipants}
          </label>
          <input
            id="participants"
            type="range"
            min="10"
            max="500"
            step="10"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>10</span>
            <span>500</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || !issue.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          {disabled ? 'Deliberating...' : 'Submit to Parliament'}
        </button>
      </form>
    </div>
  );
}
