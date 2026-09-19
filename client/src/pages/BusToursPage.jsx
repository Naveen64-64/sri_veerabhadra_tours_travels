import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiNavigation } from 'react-icons/fi'
import { getTours } from '../services/tourService'
import { LoadingSpinner, ErrorState, EmptyState } from '../components/LoadingSpinner'

export default function BusToursPage() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTours().then(res => { setTours(res.data); setLoading(false) })
      .catch(() => { setError('Unable to load tours.'); setLoading(false) })
  }, [])

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Bus Tours</h1>
          <p>Explore organized bus tours to popular destinations</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <LoadingSpinner message="Loading tours..." />}
          {error && <ErrorState message={error} />}
          {!loading && !error && tours.length === 0 && (
            <EmptyState message="No tours available right now. Tours will be added soon. Contact us at 9542659999 for custom tour inquiries." />
          )}

          {tours.length > 0 && (
            <div className="grid-3">
              {tours.map(tour => (
                <div className="card" key={tour._id}>
                  <div style={{ height: 180, background: 'linear-gradient(135deg, var(--color-dark-green), var(--color-dark-navy))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>🚌</span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{tour.name}</h3>
                    {tour.destination && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-medium)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <FiMapPin size={14} /> {tour.startLocation} → {tour.destination}
                      </div>
                    )}
                    {tour.duration && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-medium)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        <FiClock size={14} /> {tour.duration}
                      </div>
                    )}
                    {tour.places.length > 0 && (
                      <p className="card-text" style={{ marginBottom: '1rem' }}>
                        Places: {tour.places.join(', ')}
                      </p>
                    )}
                    {tour.description && <p className="card-text">{tour.description}</p>}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                      <Link to="/booking" className="btn btn-primary btn-sm">Book Tour</Link>
                    </div>
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
