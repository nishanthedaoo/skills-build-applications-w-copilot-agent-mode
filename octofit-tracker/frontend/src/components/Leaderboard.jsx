import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(buildApiUrl('/leaderboard'));
        if (!response.ok) throw new Error('Leaderboard request failed');
        const payload = await response.json();
        setLeaderboard(normalizeCollection(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to fetch leaderboard');
      }
    };

    load();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h3 className="h5 mb-3">Leaderboard</h3>
        <div className="list-group list-group-flush">
          {leaderboard.map((entry, index) => (
            <div key={entry._id || `${entry.userId}-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <span className="me-2 badge rounded-pill bg-light text-dark">#{index + 1}</span>
                <strong>{entry.userId?.name || 'Unknown user'}</strong>
              </div>
              <span className="fw-semibold">{entry.points || 0} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
