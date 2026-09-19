import { FiLoader, FiAlertCircle, FiInbox } from 'react-icons/fi'

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="state-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="state-container">
      <div className="state-icon"><FiAlertCircle /></div>
      <h3>Error</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry} style={{ marginTop: '1rem' }}>
          Try Again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message = 'No data available.', icon }) {
  return (
    <div className="state-container">
      <div className="state-icon">{icon || <FiInbox />}</div>
      <h3>Nothing Here</h3>
      <p>{message}</p>
    </div>
  )
}
