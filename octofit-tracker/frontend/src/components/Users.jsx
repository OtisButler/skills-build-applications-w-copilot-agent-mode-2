import { useState } from 'react'
import CollectionFeedback from './CollectionFeedback.jsx'
import SortableHeader from './SortableHeader.jsx'
import useCollection from '../hooks/useCollection.js'
import { displayName } from '../lib/api.js'

export default function Users() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/'
  const { items, loading, error } = useCollection(endpoint)
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
  const updateSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }
  const sortedUsers = [...items].sort((left, right) => {
    const getValue = (user) => {
      if (sort.key === 'name') return displayName(user)
      if (sort.key === 'team') return typeof user.team === 'string' ? user.team : user.team?.name || ''
      if (sort.key === 'points') return Number(user.totalPoints) || 0
      return user.username || ''
    }
    const leftValue = getValue(left)
    const rightValue = getValue(right)
    const comparison = typeof leftValue === 'number'
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true, sensitivity: 'base' })
    return sort.direction === 'asc' ? comparison : -comparison
  })

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
            <thead>
              <tr>
                <SortableHeader label="Athlete" sortKey="name" sort={sort} onSort={updateSort} />
                <SortableHeader label="Username" sortKey="username" sort={sort} onSort={updateSort} />
                <SortableHeader label="Team" sortKey="team" sort={sort} onSort={updateSort} />
                <SortableHeader label="Points" sortKey="points" sort={sort} onSort={updateSort} />
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
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