import { useState } from 'react'
import CollectionFeedback from './CollectionFeedback.jsx'
import SortableHeader from './SortableHeader.jsx'
import useCollection from '../hooks/useCollection.js'
import { displayName } from '../lib/api.js'

export default function Teams() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/'
  const { items, loading, error } = useCollection(endpoint)
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
  const updateSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }
  const sortedTeams = [...items].sort((left, right) => {
    const getValue = (team) => {
      if (sort.key === 'members') return Array.isArray(team.members) ? team.members.length : 0
      if (sort.key === 'points') return Number(team.totalPoints) || 0
      return team.name || ''
    }
    const leftValue = getValue(left)
    const rightValue = getValue(right)
    const comparison = typeof leftValue === 'number'
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true, sensitivity: 'base' })
    return sort.direction === 'asc' ? comparison : -comparison
  })

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
            <thead>
              <tr>
                <SortableHeader label="Team" sortKey="name" sort={sort} onSort={updateSort} />
                <SortableHeader label="Members" sortKey="members" sort={sort} onSort={updateSort} />
                <th scope="col">Roster</th>
                <SortableHeader label="Points" sortKey="points" sort={sort} onSort={updateSort} />
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team, index) => (
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