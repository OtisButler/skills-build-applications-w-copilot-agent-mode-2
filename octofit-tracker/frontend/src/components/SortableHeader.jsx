import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

export default function SortableHeader({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey
  const direction = active ? sort.direction : 'none'
  const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown

  return (
    <th scope="col" aria-sort={direction === 'none' ? 'none' : direction === 'asc' ? 'ascending' : 'descending'}>
      <button className={`sort-trigger${active ? ' active' : ''}`} type="button" onClick={() => onSort(sortKey)}>
        <span>{label}</span>
        <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </th>
  )
}