import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiMapPin, FiTruck } from 'react-icons/fi'
import { getPackages } from '../services/packageService'
import { LoadingSpinner, ErrorState, EmptyState } from '../components/LoadingSpinner'

export default function PackagesPage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPackages().then(res => { setPackages(res.data); setLoading(false) })
      .catch(() => { setError('Unable to load packages.'); setLoading(false) })
  }, [])

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Tour Packages</h1>
          <p>Curated travel packages for every type of traveler</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <LoadingSpinner message="Loading packages..." />}
          {error && <ErrorState message={error} />}
          {!loading && !error && packages.length === 0 && (
            <EmptyState message="Tour packages will be listed here soon. Contact us at 9542659999 for custom package inquiries." />
          )}

          {packages.length > 0 && (
            <div className="grid-3">
              {packages.map(pkg => (
                <div className="card" key={pkg._id}>
                  <div style={{ height: 180, background: 'linear-gradient(135deg, var(--color-dark-navy), #2d5a4e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>📦</span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{pkg.name}</h3>
                    {pkg.duration && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-medium)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <FiClock size={14} /> {pkg.duration}
                      </div>
                    )}
                    {pkg.vehicleType && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-medium)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        <FiTruck size={14} /> {pkg.vehicleType === 'both' ? 'Car & Bus' : pkg.vehicleType}
                      </div>
                    )}
                    {pkg.places.length > 0 && (
                      <p className="card-text">Places: {pkg.places.join(', ')}</p>
                    )}
                    {pkg.description && <p className="card-text" style={{ marginTop: '0.5rem' }}>{pkg.description}</p>}
                    {pkg.startingPrice > 0 && (
                      <p style={{ color: 'var(--color-gold-dark)', fontWeight: 600, marginTop: '0.75rem' }}>
                        Starting from ₹{pkg.startingPrice}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                      <Link to="/booking" className="btn btn-primary btn-sm">Book Package</Link>
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
