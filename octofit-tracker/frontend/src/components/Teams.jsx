import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'
import { displayName } from '../lib/api.js'

export default function Teams() {
  const { items, loading, error } = useCollection('/api/teams/')

  return (
    <section className="data-section" aria-labelledby="teams-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Find your crew</p>
          <h1 id="teams-title">Teams</h1>
        </div>
        <span className="section-count">{items.length} teams</span>
      </div>
      <CollectionFeedback loading={loading} error={error} count={items.length} empty="No teams have been created yet." />
      {!loading && !error && items.length > 0 && (
        <div className="table-scroll">
          <table className="table align-middle tracker-table">
            <thead><tr><th>Team</th><th>Members</th><th>Roster</th><th>Points</th></tr></thead>
            <tbody>
              {items.map((team, index) => (
                <tr key={team._id || team.id || team.name || index}>
                  <td><span className="primary-cell">{team.name || 'Team'}</span><span className="cell-detail">{team.description || 'Ready to move together.'}</span></td>
                  <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
                  <td>{Array.isArray(team.members) && team.members.length ? team.members.map(displayName).join(', ') : 'No members yet'}</td>
                  <td><strong>{team.totalPoints ?? 0}</strong> pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}