import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(buildApiUrl('/teams'));
        if (!response.ok) throw new Error('Teams request failed');
        const payload = await response.json();
        setTeams(normalizeCollection(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to fetch teams');
      }
    };

    load();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row g-3">
      {teams.map((team) => (
        <div key={team._id} className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="h5 mb-0">{team.name}</h3>
                <span className="badge text-bg-primary">{team.members?.length || 0} members</span>
              </div>
              <p className="text-muted mb-0">{team.goal}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
