import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'
import { displayName } from '../lib/api.js'

export default function Leaderboard() {
  const { items, loading, error } = useCollection('/api/leaderboard/')
  const rows = items.flatMap((board) =>
    Array.isArray(board.entries)
      ? board.entries.map((entry) => ({ ...entry, period: board.period }))
      : [board],
  )

  return (
    <section className="data-section" aria-labelledby="leaderboard-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Friendly competition</p>
          <h1 id="leaderboard-title">Leaderboard</h1>
        </div>
        <span className="section-count">{rows.length} ranked</span>
      </div>
      <CollectionFeedback loading={loading} error={error} count={rows.length} empty="The leaderboard will appear after activities earn points." />
      {!loading && !error && rows.length > 0 && (
        <div className="table-scroll">
          <table className="table align-middle tracker-table">
            <thead><tr><th>Rank</th><th>Athlete</th><th>Period</th><th>Points</th></tr></thead>
            <tbody>
              {rows.map((entry, index) => (
                <tr key={entry._id || entry.id || `${displayName(entry.user)}-${index}`}>
                  <td><span className="rank-mark">{entry.rank ?? index + 1}</span></td>
                  <td className="primary-cell">{displayName(entry.user || entry.username)}</td>
                  <td>{entry.period || 'All-time'}</td>
                  <td><strong>{entry.points ?? entry.totalPoints ?? 0}</strong> pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}