import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'

export default function Workouts() {
  const { items, loading, error } = useCollection('/api/workouts/')

  return (
    <section className="data-section" aria-labelledby="workouts-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Ideas for your next session</p>
          <h1 id="workouts-title">Workouts</h1>
        </div>
        <span className="section-count">{items.length} plans</span>
      </div>
      <CollectionFeedback loading={loading} error={error} count={items.length} empty="No workout suggestions are available yet." />
      {!loading && !error && items.length > 0 && (
        <div className="workout-list">
          {items.map((workout, index) => (
            <article className="workout-row" key={workout._id || workout.id || workout.title || index}>
              <div className="workout-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="workout-copy">
                <h2>{workout.title || 'Workout'}</h2>
                <p>{workout.description || 'A guided session to keep your routine moving.'}</p>
              </div>
              <div className="workout-meta">
                <span>{workout.activityType || 'Training'}</span>
                <span>{workout.durationMinutes ?? '-'} min</span>
                <span className="difficulty-tag">{workout.difficulty || 'All levels'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}