import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const defaultActivity = { userId: '', type: 'Run', duration: 20, calories: 180 };

function App() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [activity, setActivity] = useState(defaultActivity);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, activitiesResponse, teamsResponse, leaderboardResponse, workoutsResponse] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/activities`),
        fetch(`${API_URL}/teams`),
        fetch(`${API_URL}/leaderboard`),
        fetch(`${API_URL}/workouts`)
      ]);

      const nextUsers = await usersResponse.json();
      const nextActivities = await activitiesResponse.json();
      const nextTeams = await teamsResponse.json();
      const nextLeaderboard = await leaderboardResponse.json();
      const nextWorkouts = await workoutsResponse.json();

      setUsers(nextUsers);
      setActivities(nextActivities);
      setTeams(nextTeams);
      setLeaderboard(nextLeaderboard);
      setWorkouts(nextWorkouts);
      if (!activity.userId && nextUsers.length) {
        setActivity((current) => ({ ...current, userId: nextUsers.find((user) => user.role === 'student')?._id || nextUsers[0]._id }));
      }
    } catch (error) {
      setMessage('Unable to reach the OctoFit API. Start the backend on port 8000 and MongoDB on 27017.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogActivity = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...activity,
          duration: Number(activity.duration),
          calories: Number(activity.calories),
        })
      });

      if (!response.ok) {
        throw new Error('Invalid activity payload');
      }

      setMessage('Activity logged successfully. Leaderboard updates are now available.');
      setActivity({ ...defaultActivity, userId: activity.userId });
      await fetchData();
    } catch (error) {
      setMessage('Please choose a student and enter valid minute/calorie values.');
    }
  };

  const activeMinutes = activities.reduce((sum, entry) => sum + Number(entry.duration || 0), 0);
  const caloriesBurned = activities.reduce((sum, entry) => sum + Number(entry.calories || 0), 0);
  const studentProfiles = users.filter((user) => user.role === 'student');
  const teacherProfiles = users.filter((user) => user.role === 'teacher');
  const currentStudent = studentProfiles[0];

  return (
    <div className="octofit-app">
      <header className="topbar">
        <div className="brand-wrap">
          <img src="/octofitapp-small.png" alt="OctoFit Tracker logo" className="brand-logo" />
          <div>
            <div className="brand-kicker">Student wellness</div>
            <strong>OctoFit Tracker</strong>
          </div>
        </div>
        <div className="status-pill">
          <span className="status-dot" />
          LIVE TRACKING
        </div>
      </header>

      <main className="container-fluid main-shell">
        <section className="hero-row row align-items-end mb-4">
          <div className="col-lg-9">
            <p className="eyebrow">WEEKLY FITNESS DASHBOARD</p>
            <h1>Build momentum <span>for every student.</span></h1>
          </div>
          <div className="col-lg-3 text-lg-end">
            <div className="summary-badge">
              <strong>{activeMinutes}</strong>
              <span>active<br />minutes</span>
            </div>
          </div>
        </section>

        {message ? <div className="alert-box" role="status">{message}</div> : null}

        {loading ? (
          <div className="loading-box">Loading OctoFit data…</div>
        ) : (
          <>
            <section className="stats-grid row g-3 mb-4">
              <div className="col-md-3"><div className="stat-card orange"><span>Active minutes</span><strong>{activeMinutes}</strong><small>this week</small></div></div>
              <div className="col-md-3"><div className="stat-card blue"><span>Calories</span><strong>{caloriesBurned}</strong><small>logged</small></div></div>
              <div className="col-md-3"><div className="stat-card pink"><span>Teams</span><strong>{teams.length}</strong><small>active groups</small></div></div>
              <div className="col-md-3"><div className="stat-card green"><span>Goal</span><strong>82%</strong><small>weekly target</small></div></div>
            </section>

            <section className="content-grid row g-3">
              <div className="col-lg-4">
                <article className="panel profile-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">PROFILE</p>
                      <h2>{currentStudent?.name || 'Student profile'}</h2>
                    </div>
                    <span className="role-badge">student</span>
                  </div>
                  <p className="goal-copy">“{currentStudent?.goal || 'Create a fitness goal'}”</p>
                  <div className="mini-grid">
                    <div><strong>4</strong><span>day streak</span></div>
                    <div><strong>{studentProfiles.length}</strong><span>students</span></div>
                    <div><strong>{teacherProfiles.length}</strong><span>teachers</span></div>
                  </div>
                  <div className="meter">
                    <span style={{ width: '82%' }} />
                  </div>
                </article>
              </div>

              <div className="col-lg-8">
                <article className="panel log-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">TRACK ACTIVITY</p>
                      <h2>Log a movement session</h2>
                    </div>
                    <span className="spark">✦</span>
                  </div>

                  <form onSubmit={handleLogActivity} className="activity-form">
                    <select
                      value={activity.userId}
                      onChange={(event) => setActivity({ ...activity, userId: event.target.value })}
                    >
                      <option value="">Select student</option>
                      {studentProfiles.map((student) => (
                        <option key={student._id} value={student._id}>{student.name}</option>
                      ))}
                    </select>

                    <select
                      value={activity.type}
                      onChange={(event) => setActivity({ ...activity, type: event.target.value })}
                    >
                      <option value="Run">Run</option>
                      <option value="Strength">Strength</option>
                      <option value="Mobility">Mobility</option>
                      <option value="Cycle">Cycle</option>
                      <option value="Walk">Walk</option>
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={activity.duration}
                      onChange={(event) => setActivity({ ...activity, duration: event.target.value })}
                      placeholder="Minutes"
                    />

                    <input
                      type="number"
                      min="0"
                      value={activity.calories}
                      onChange={(event) => setActivity({ ...activity, calories: event.target.value })}
                      placeholder="Calories"
                    />

                    <button type="submit" className="primary-btn">Log activity</button>
                  </form>
                </article>
              </div>
            </section>

            <section className="lower-grid row g-3 mt-1">
              <div className="col-lg-5">
                <article className="panel leaderboard-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">COMPETITIVE RANK</p>
                      <h2>Leaderboard</h2>
                    </div>
                    <button type="button" className="ghost-btn">This week</button>
                  </div>
                  <div className="leaderboard-list">
                    {leaderboard.map((entry) => (
                      <div key={entry._id || entry.userId} className="leader-row">
                        <span className={`rank-pill rank-${entry.rank || 1}`}>#{entry.rank || 1}</span>
                        <div className="leader-avatar">{entry.name?.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
                        <div className="leader-meta">
                          <strong>{entry.name}</strong>
                          <small>{entry.sessions || 0} sessions</small>
                        </div>
                        <div className="leader-score">{entry.minutes || 0}<span>min</span></div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="col-lg-4">
                <article className="panel team-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">COLLABORATION</p>
                      <h2>Team goals</h2>
                    </div>
                    <button type="button" className="round-btn">+</button>
                  </div>
                  <div className="team-list">
                    {teams.map((team) => (
                      <div key={team._id} className="team-row">
                        <span className="team-mark" style={{ background: team.color || '#e07a5f' }}>⚑</span>
                        <div className="team-meta">
                          <strong>{team.name}</strong>
                          <small>{team.members?.length || 0} members</small>
                        </div>
                        <span className="team-goal">{team.target || 0} min</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="col-lg-3">
                <article className="panel workout-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">RECOMMENDED</p>
                      <h2>Workouts</h2>
                    </div>
                  </div>
                  <div className="workout-list">
                    {workouts.map((workout) => (
                      <div key={workout._id} className="workout-card">
                        <span className="level-pill">{workout.level}</span>
                        <strong>{workout.title}</strong>
                        <small>{workout.focus} • {workout.duration} min</small>
                        <div className="exercise-tags">
                          {workout.exercises?.slice(0, 3).map((exercise) => (
                            <span key={exercise}>{exercise}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
