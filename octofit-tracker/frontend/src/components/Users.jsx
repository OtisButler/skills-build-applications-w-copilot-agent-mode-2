import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'
import { displayName } from '../lib/api.js'

export default function Users() {
  const { items, loading, error } = useCollection('users')

  return (
    <section className="data-section" aria-labelledby="users-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Athlete directory</p>
          <h1 id="users-title">Users</h1>
        </div>
        <span className="section-count">{items.length} athletes</span>
      </div>
      <CollectionFeedback loading={loading} error={error} count={items.length} empty="No athletes are registered yet." />
      {!loading && !error && items.length > 0 && (
        <div className="table-scroll">
          <table className="table align-middle tracker-table">
            <thead><tr><th>Athlete</th><th>Username</th><th>Team</th><th>Points</th></tr></thead>
            <tbody>
              {items.map((user, index) => (
                <tr key={user._id || user.id || user.username || index}>
                  <td className="primary-cell">{displayName(user)}</td>
                  <td>@{user.username || '-'}</td>
                  <td>{displayName(user.team) === 'OctoFit member' ? 'Unassigned' : displayName(user.team)}</td>
                  <td><strong>{user.totalPoints ?? 0}</strong> pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}