import { useState } from 'react';
import { api, DeliberationResult } from '../api';
import QuestionForm from './QuestionForm';
import VoteResults from './VoteResults';
import LoadingSpinner from './LoadingSpinner';

export default function ParliamentInterface() {
  const [result, setResult] = useState<DeliberationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (issue: string, maxParticipants: number) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const deliberationResult = await api.deliberate({
        issue,
        votingMethod: 'simple-majority',
        maxParticipants
      });
      setResult(deliberationResult);
    } catch (err: any) {
      setError(err.message || 'Failed to deliberate on the issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <QuestionForm onSubmit={handleSubmit} disabled={loading} />

      {loading && (
        <div className="mt-8">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {result && !loading && (
        <VoteResults result={result} />
      )}
    </div>
  );
}
