import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(buildApiUrl('/activities'));
        if (!response.ok) throw new Error('Activities request failed');
        const payload = await response.json();
        setActivities(normalizeCollection(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to fetch activities');
      }
    };

    load();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h3 className="h5 mb-3">Activities</h3>
        <ul className="list-group list-group-flush">
          {activities.map((activity) => (
            <li key={activity._id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{activity.type}</strong>
                  <div className="text-muted small">{activity.userId?.name || 'Unknown user'}</div>
                </div>
                <div className="text-end">
                  <div>{activity.duration} min</div>
                  <div className="text-muted small">{activity.calories} cal</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
