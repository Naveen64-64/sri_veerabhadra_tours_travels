import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDestinations } from '../services/destinationService'
import { LoadingSpinner, ErrorState, EmptyState } from '../components/LoadingSpinner'

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDestinations().then(res => { setDestinations(res.data); setLoading(false) })
      .catch(() => { setError('Unable to load destinations.'); setLoading(false) })
  }, [])

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Destinations</h1>
          <p>Explore beautiful destinations we travel to</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <LoadingSpinner message="Loading destinations..." />}
          {error && <ErrorState message={error} />}
          {!loading && !error && destinations.length === 0 && (
            <EmptyState message="Destinations will be listed here soon. Contact us at 9542659999 to inquire about specific destinations." />
          )}

          {destinations.length > 0 && (
            <div className="grid-3">
              {destinations.map(dest => (
                <div className="card" key={dest._id}>
                  <div style={{ height: 200, background: 'linear-gradient(135deg, #2d5a4e, #1a3c34)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>{dest.category === 'temple' ? '🛕' : '🏞️'}</span>
                  </div>
                  <div className="card-body">
                    <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>{dest.category}</span>
                    <h3 className="card-title">{dest.name}</h3>
                    <p className="card-text">{dest.description}</p>
                    {dest.tourInfo && (
                      <p className="card-text" style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{dest.tourInfo}</p>
                    )}
                    <Link to="/booking" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                      Explore Destination
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
