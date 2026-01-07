import { useState } from 'react';
import { DeliberationResult, VoteWithDetails } from '../api';
import ExpertVoteCard from './ExpertVoteCard';

interface VoteResultsProps {
  result: DeliberationResult;
}

type VoteCategory = 'for' | 'against' | 'abstain';

export default function VoteResults({ result }: VoteResultsProps) {
  const [expandedCategory, setExpandedCategory] = useState<VoteCategory | null>(null);

  const toggleCategory = (category: VoteCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getVotesByCategory = (category: VoteCategory): VoteWithDetails[] => {
    return result.votesWithDetails.filter(vote => vote.position === category);
  };

  const votesFor = getVotesByCategory('for');
  const votesAgainst = getVotesByCategory('against');
  const abstentions = getVotesByCategory('abstain');

  const getCategoryColor = (category: VoteCategory) => {
    switch (category) {
      case 'for':
        return 'emerald';
      case 'against':
        return 'rose';
      case 'abstain':
        return 'slate';
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Issue Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Deliberation Results
        </h2>
        <p className="text-slate-600 mb-4">
          <span className="font-medium">Issue:</span> {result.issue}
        </p>
        <div className="flex items-center space-x-4 text-sm text-slate-600">
          <span>{result.participantCount} experts participated</span>
          <span>•</span>
          <span>{result.duration}ms duration</span>
        </div>
      </div>

      {/* Decision Banner */}
      <div
        className={`rounded-xl shadow-lg p-6 border-2 ${
          result.voteResult.passed
            ? 'bg-emerald-50 border-emerald-300'
            : 'bg-rose-50 border-rose-300'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div
            className={`text-3xl ${
              result.voteResult.passed ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {result.voteResult.passed ? '✓' : '✗'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {result.voteResult.passed ? 'PASSED' : 'REJECTED'}
            </h3>
            <p className="text-sm text-slate-600">
              Voting method: {result.voteResult.method} (threshold: {result.voteResult.threshold.toFixed(1)}%)
            </p>
          </div>
        </div>
        <p className="text-slate-700">{result.decision}</p>
      </div>

      {/* Vote Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Vote Summary</h3>

        <div className="space-y-3">
          {/* For Votes */}
          <VoteCategoryButton
            category="for"
            count={result.voteResult.votesFor}
            percentage={result.voteResult.percentageFor}
            color={getCategoryColor('for')}
            isExpanded={expandedCategory === 'for'}
            onToggle={() => toggleCategory('for')}
          />
          {expandedCategory === 'for' && (
            <ExpertList votes={votesFor} color="emerald" />
          )}

          {/* Against Votes */}
          <VoteCategoryButton
            category="against"
            count={result.voteResult.votesAgainst}
            percentage={result.voteResult.percentageAgainst}
            color={getCategoryColor('against')}
            isExpanded={expandedCategory === 'against'}
            onToggle={() => toggleCategory('against')}
          />
          {expandedCategory === 'against' && (
            <ExpertList votes={votesAgainst} color="rose" />
          )}

          {/* Abstentions */}
          <VoteCategoryButton
            category="abstain"
            count={result.voteResult.abstentions}
            percentage={
              (result.voteResult.abstentions / result.participantCount) * 100
            }
            color={getCategoryColor('abstain')}
            isExpanded={expandedCategory === 'abstain'}
            onToggle={() => toggleCategory('abstain')}
          />
          {expandedCategory === 'abstain' && (
            <ExpertList votes={abstentions} color="slate" />
          )}
        </div>
      </div>
    </div>
  );
}

interface VoteCategoryButtonProps {
  category: VoteCategory;
  count: number;
  percentage: number;
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function VoteCategoryButton({
  category,
  count,
  percentage,
  color,
  isExpanded,
  onToggle
}: VoteCategoryButtonProps) {
  const categoryLabels = {
    for: 'Voted For',
    against: 'Voted Against',
    abstain: 'Abstained'
  };

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md bg-${color}-50 border-${color}-200 hover:border-${color}-300`}
      style={{
        backgroundColor: `rgb(var(--color-${color}-50))`,
        borderColor: `rgb(var(--color-${color}-200))`
      }}
    >
      <div className="flex items-center space-x-3">
        <div className={`text-2xl font-bold text-${color}-700`}>
          {count}
        </div>
        <div className="text-left">
          <div className={`font-semibold text-${color}-900`}>
            {categoryLabels[category]}
          </div>
          <div className={`text-sm text-${color}-600`}>
            {percentage.toFixed(1)}% of voting experts
          </div>
        </div>
      </div>
      <div className={`text-2xl text-${color}-600 transition-transform ${
        isExpanded ? 'rotate-180' : ''
      }`}>
        ▼
      </div>
    </button>
  );
}

interface ExpertListProps {
  votes: VoteWithDetails[];
  color: string;
}

function ExpertList({ votes, color }: ExpertListProps) {
  return (
    <div className="ml-4 pl-4 border-l-2 border-slate-200 space-y-3 py-2">
      {votes.length === 0 ? (
        <p className="text-slate-500 italic">No experts in this category</p>
      ) : (
        votes.map((vote) => (
          <ExpertVoteCard key={vote.expertId} vote={vote} color={color} />
        ))
      )}
    </div>
  );
}
