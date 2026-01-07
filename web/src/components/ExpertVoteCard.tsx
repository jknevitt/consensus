import { useState } from 'react';
import { VoteWithDetails } from '../api';

interface ExpertVoteCardProps {
  vote: VoteWithDetails;
  color: string;
}

export default function ExpertVoteCard({ vote, color }: ExpertVoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-lg border border-${color}-200 shadow-sm overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800">
              {vote.expertName}
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              {vote.expertTitle} • {vote.expertField}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                {vote.expertExperience} years exp.
              </span>
              {vote.expertCredentials.slice(0, 3).map((cred) => (
                <span
                  key={cred}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                >
                  {cred}
                </span>
              ))}
            </div>
          </div>
          <div className={`text-xl text-${color}-600 transition-transform ml-4 ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            ▼
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className={`px-4 pb-4 border-t border-${color}-100 bg-${color}-50/30`}>
          <h5 className="font-medium text-slate-700 mt-3 mb-2">Reasoning:</h5>
          <p className="text-slate-600 text-sm leading-relaxed">
            {vote.reasoning}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Expert ID: {vote.expertId} • Vote weight: {vote.weight}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
