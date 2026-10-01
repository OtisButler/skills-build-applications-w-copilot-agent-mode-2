import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'
import { displayName, formatDate } from '../lib/api.js'
import { Activity as ActivityIcon, ArrowUpRight, Clock3, Flame, Footprints } from 'lucide-react'
import { Link } from 'react-router-dom'
import trainingPhoto from '../assets/athlete-training.jpg'

export default function Activities() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/'
  const { items, loading, error } = useCollection(endpoint)
  const hasNoRows = !loading && !error && items.length === 0
  const points = items.reduce((total, activity) => total + (Number(activity.points) || 0), 0)
  const minutes = items.reduce((total, activity) => total + (Number(activity.durationMinutes) || 0), 0)
  const distance = items.reduce((total, activity) => total + (Number(activity.distanceKm) || 0), 0)

  return (
    <section className="data-section" aria-labelledby="activities-title">
      <div className="activity-hero">
        <div className="hero-copy">
          <p className="hero-overline"><span /> SMALL WINS ADD UP</p>
          <h1 id="activities-title">Move your<br />way forward.</h1>
          <p className="hero-description">Every walk, workout, and team effort builds a stronger season.</p>
          <Link className="hero-link" to="/workouts">Find your next workout <ArrowUpRight size={17} /></Link>
        </div>
        <div className="hero-photo-wrap">
          <img className="hero-photo" src={trainingPhoto} alt="Athlete training in a gym" />
          <div className="photo-stamp"><ActivityIcon size={17} /><span>SHOW UP<br />FOR YOURSELF</span></div>
        </div>
      </div>

      <div className="metrics-row" aria-label="Activity totals">
        <article className="metric-item metric-highlight">
          <span className="metric-icon"><Flame size={19} /></span>
          <div><span className="metric-label">Points earned</span><strong>{points.toLocaleString()}</strong></div>
          <span className="metric-tail">PTS</span>
        </article>
        <article className="metric-item">
          <span className="metric-icon"><Clock3 size={19} /></span>
          <div><span className="metric-label">Active minutes</span><strong>{minutes.toLocaleString()}</strong></div>
          <span className="metric-tail">MIN</span>
        </article>
        <article className="metric-item">
          <span className="metric-icon"><Footprints size={19} /></span>
          <div><span className="metric-label">Distance logged</span><strong>{distance.toFixed(1)}</strong></div>
          <span className="metric-tail">KM</span>
        </article>
      </div>

      <div className="section-heading activity-list-heading">
        <div>
          <p className="eyebrow">Your crew is moving</p>
          <h2>Recent activity</h2>
        </div>
        <span className="section-count">{items.length} sessions</span>
      </div>
      <CollectionFeedback loading={loading} error={error} count={items.length} empty="No activities have been logged yet." />
      {!loading && !error && items.length > 0 && (
        <div className="table-scroll">
          <table className="table align-middle tracker-table">
            <thead><tr><th>Athlete</th><th>Activity</th><th>Duration</th><th>Distance</th><th>Points</th><th>Date</th></tr></thead>
            <tbody>
              {items.map((activity, index) => (
                <tr key={activity._id || activity.id || `${activity.type}-${index}`}>
                  <td className="primary-cell">{displayName(activity.user || activity.username)}</td>
                  <td><span className="activity-kind">{activity.type || 'Activity'}</span></td>
                  <td>{activity.durationMinutes ?? '-'} min</td>
                  <td>{activity.distanceKm ? `${activity.distanceKm} km` : '-'}</td>
                  <td><strong>{activity.points ?? 0}</strong> pts</td>
                  <td>{formatDate(activity.performedAt || activity.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {hasNoRows && <p className="section-note">Log a walk, run, or workout to start building your activity history.</p>}
    </section>
  )
}