import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/users', label: 'Users' },
  { to: '/activities', label: 'Activities' },
  { to: '/teams', label: 'Teams' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' }
];

function App() {
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

      <nav className="navbar navbar-expand-lg bg-white border-bottom px-3 py-2">
        <div className="container-fluid">
          <div className="navbar-nav d-flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link rounded-pill px-3 py-2 ${isActive ? 'active bg-dark text-white' : 'text-dark'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="container-fluid main-shell py-4">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

function Overview() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="hero-row row align-items-end mb-3">
          <div className="col-lg-9">
            <p className="eyebrow">WEEKLY FITNESS DASHBOARD</p>
            <h1>Build momentum <span>for every student.</span></h1>
          </div>
          <div className="col-lg-3 text-lg-end">
            <div className="summary-badge">
              <strong>82%</strong>
              <span>weekly<br />target</span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-xl-3">
        <div className="stat-card orange">
          <span>Active minutes</span>
          <strong>480</strong>
          <small>this week</small>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="stat-card blue">
          <span>Calories</span>
          <strong>12.8K</strong>
          <small>logged</small>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="stat-card pink">
          <span>Teams</span>
          <strong>6</strong>
          <small>active groups</small>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="stat-card green">
          <span>Goal</span>
          <strong>82%</strong>
          <small>weekly target</small>
        </div>
      </div>

      <div className="col-lg-6">
        <Users />
      </div>
      <div className="col-lg-6">
        <Activities />
      </div>
      <div className="col-lg-6">
        <Teams />
      </div>
      <div className="col-lg-6">
        <Workouts />
      </div>
      <div className="col-12">
        <Leaderboard />
      </div>
    </div>
  );
}

export default App;
