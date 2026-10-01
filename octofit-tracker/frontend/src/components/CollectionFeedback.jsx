export default function CollectionFeedback({ loading, error, empty, count }) {
  if (loading) {
    return <p className="feedback-line" role="status">Loading tracker data...</p>
  }

  if (error) {
    return (
      <div className="feedback-error" role="alert">
        <strong>Data could not be loaded.</strong>
        <span>{error}</span>
      </div>
    )
  }

  if (count === 0) {
    return <p className="feedback-line">{empty}</p>
  }

  return null
}