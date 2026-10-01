import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { Activity as ActivityIcon, ChevronRight, Dumbbell, Trophy, UserRound, UsersRound } from 'lucide-react'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import octofitLogo from '../../../docs/octofitapp-small.png'

const sections = [
  { label: 'Activity feed', path: '/activities', icon: ActivityIcon },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Teams', path: '/teams', icon: UsersRound },
  { label: 'Athletes', path: '/users', icon: UserRound },
  { label: 'Workouts', path: '/workouts', icon: Dumbbell },
]

function App() {
  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <NavLink className="brand-lockup" to="/activities" aria-label="OctoFit Tracker home">
          <img className="brand-logo" src={octofitLogo} alt="" />
          <span className="brand-name">octofit<span>tracker</span></span>
        </NavLink>
        <p className="sidebar-label">YOUR TRAINING</p>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {sections.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              <span>{label}</span>
              <ChevronRight className="side-chevron" size={15} aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-program">
          <span className="program-overline">SCHOOL PROGRAM</span>
          <strong>Mergington High</strong>
          <span className="program-season">Move more. Feel stronger.</span>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div>
            <p className="topbar-kicker">STUDENT ATHLETICS</p>
            <span className="topbar-title">Your season, in motion</span>
          </div>
          <div className="topbar-date"><span className="date-dot" />TRAINING SEASON</div>
        </header>
        <main className="content-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/activities" replace />} />
          </Routes>
        </main>
        <footer className="site-footer">OCTOFIT TRACKER <span>·</span> MERGINGTON HIGH SCHOOL</footer>
      </div>
    </div>
  )
}

export default App
