import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'
import { displayName, formatDate } from '../lib/api.js'

export default function Activities() {
  const { items, loading, error } = useCollection('activities')
  const hasNoRows = !loading && !error && items.length === 0

  return (
    <section className="data-section" aria-labelledby="activities-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Movement log</p>
          <h1 id="activities-title">Activities</h1>
        </div>
        <span className="section-count">{items.length} entries</span>
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