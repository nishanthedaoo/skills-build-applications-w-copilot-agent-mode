import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(buildApiUrl('/users'));
        if (!response.ok) throw new Error('Users request failed');
        const payload = await response.json();
        setUsers(normalizeCollection(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to fetch users');
      }
    };

    load();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h3 className="h5 mb-3">Users</h3>
        <ul className="list-group list-group-flush">
          {users.map((user) => (
            <li key={user._id || user.email} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{user.name}</strong>
                  <div className="text-muted small">{user.role}</div>
                </div>
                <span className="badge bg-secondary">{user.email}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
