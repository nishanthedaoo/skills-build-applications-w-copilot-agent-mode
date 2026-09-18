import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(buildApiUrl('/workouts'));
        if (!response.ok) throw new Error('Workouts request failed');
        const payload = await response.json();
        setWorkouts(normalizeCollection(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to fetch workouts');
      }
    };

    load();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row g-3">
      {workouts.map((workout) => (
        <div key={workout._id} className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="h5 mb-0">{workout.title}</h3>
                <span className="badge text-bg-success">{workout.level}</span>
              </div>
              <p className="text-muted mb-2">{workout.focus}</p>
              <div className="small text-muted">{workout.duration} min • {workout.exercises?.length || 0} exercises</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
