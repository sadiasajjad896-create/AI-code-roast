// Root component: owns top-level state and wires the pieces together.

import { useEffect, useState } from 'react';
import CodeInput from './components/CodeInput.jsx';
import ReviewResult from './components/ReviewResult.jsx';
import HistoryList from './components/HistoryList.jsx';
import PixelFlame from './components/PixelFlame.jsx';
import { submitReview, fetchHistory, deleteReview } from './api.js';

export default function App() {
  const [currentReview, setCurrentReview] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory()
      .then(setHistory)
      .catch((err) => console.error('Failed to load history:', err.message));
  }, []);

  const handleSubmit = async ({ code, language }) => {
    setLoading(true);
    setError(null);
    try {
      const saved = await submitReview({ code, language });
      setCurrentReview(saved);
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (review) => {
    setError(null);
    setCurrentReview(review);
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setHistory((prev) => prev.filter((r) => r._id !== id));
      if (currentReview?._id === id) setCurrentReview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b-[3px] border-black bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <h1 className="font-pixel text-base sm:text-xl">
            <span className="bg-arcade-yellow px-1">AI</span> CODE{' '}
            <span className="text-arcade-red">ROASTER</span>
          </h1>
          <p className="text-sm text-neutral-600">Paste code. Get roasted. Get better.</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <CodeInput onSubmit={handleSubmit} loading={loading} />
          <ReviewResult review={currentReview} loading={loading} error={error} />
        </div>

        <aside>
          <HistoryList
            items={history}
            selectedId={currentReview?._id}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
          <div className="mt-6 flex justify-center">
            <PixelFlame />
          </div>
        </aside>
      </main>
    </div>
  );
}
