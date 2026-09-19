import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiWind, FiUser, FiDollarSign } from 'react-icons/fi'
import { getVehicles } from '../services/vehicleService'
import { LoadingSpinner, ErrorState, EmptyState } from '../components/LoadingSpinner'
import './VehiclesPage.css'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      const res = await getVehicles()
      setVehicles(res.data)
    } catch (err) {
      setError('Unable to load vehicles.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'all' ? vehicles : vehicles.filter(v => v.type === filter)

  return (
    <div className="vehicles-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our Vehicles</h1>
          <p>Browse our fleet of comfortable cars and spacious buses</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter Tabs */}
          <div className="vehicle-filters" id="vehicle-filters">
            {['all', 'car', 'bus'].map(type => (
              <button
                key={type}
                className={`filter-tab ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All Vehicles' : type === 'car' ? '🚗 Cars' : '🚌 Buses'}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading && <LoadingSpinner message="Loading vehicles..." />}
          {error && <ErrorState message={error} onRetry={loadVehicles} />}
          {!loading && !error && filtered.length === 0 && (
            <EmptyState message="No vehicles available yet. Please check back soon." />
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="vehicles-grid">
              {filtered.map(vehicle => (
                <div className="vehicle-card card" key={vehicle._id}>
                  <div className="vehicle-card-img">
                    <span className="vehicle-type-badge">{vehicle.type === 'car' ? '🚗 Car' : '🚌 Bus'}</span>
                    {vehicle.isDemo && <span className="demo-badge">Demo Data</span>}
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{vehicle.name}</h3>
                    <div className="vehicle-specs">
                      <div className="spec">
                        <FiUsers size={14} />
                        <span>{vehicle.seats} Seats</span>
                      </div>
                      <div className="spec">
                        <FiWind size={14} />
                        <span>{vehicle.ac ? 'AC' : 'Non-AC'}</span>
                      </div>
                      <div className="spec">
                        <FiUser size={14} />
                        <span>{vehicle.driverAvailable ? 'Driver Available' : 'Self Drive'}</span>
                      </div>
                      {vehicle.pricePerDay > 0 && (
                        <div className="spec">
                          <FiDollarSign size={14} />
                          <span>₹{vehicle.pricePerDay}/day</span>
                        </div>
                      )}
                    </div>
                    {vehicle.description && (
                      <p className="card-text">{vehicle.description}</p>
                    )}
                    <div className="vehicle-actions">
                      <Link to="/booking" className="btn btn-primary btn-sm">Book Now</Link>
                      <span className={`badge ${vehicle.availability ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {vehicle.availability ? 'Available' : 'Unavailable'}
                      </span>
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
