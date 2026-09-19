import { useState, useEffect } from 'react'
import { FiTruck, FiCalendar, FiPackage, FiMapPin, FiHelpCircle, FiCpu } from 'react-icons/fi'
import api from '../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    vehicles: 0, cars: 0, buses: 0, bookings: 0,
    packages: 0, destinations: 0, faqs: 0, ragDocs: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [vehicles, bookings, packages, destinations, faqs, ragStatus] = await Promise.allSettled([
          api.get('/vehicles'),
          api.get('/bookings'),
          api.get('/packages/all'),
          api.get('/destinations/all'),
          api.get('/faqs/all'),
          api.get('/rag/status'),
        ])

        const v = vehicles.status === 'fulfilled' ? vehicles.value.data : []
        setStats({
          vehicles: v.length,
          cars: v.filter(x => x.type === 'car').length,
          buses: v.filter(x => x.type === 'bus').length,
          bookings: bookings.status === 'fulfilled' ? bookings.value.data.length : 0,
          packages: packages.status === 'fulfilled' ? packages.value.data.length : 0,
          destinations: destinations.status === 'fulfilled' ? destinations.value.data.length : 0,
          faqs: faqs.status === 'fulfilled' ? faqs.value.data.length : 0,
          ragDocs: ragStatus.status === 'fulfilled' ? ragStatus.value.data.rag_documents_count : 0,
        })
      } catch (err) {
        console.error('Failed to load stats')
      }
    }
    loadStats()
  }, [])

  const statCards = [
    { label: 'Total Vehicles', value: stats.vehicles, icon: <FiTruck />, color: '#1a3c34' },
    { label: 'Cars', value: stats.cars, icon: <FiTruck />, color: '#2d5a4e' },
    { label: 'Buses', value: stats.buses, icon: <FiTruck />, color: '#1a2332' },
    { label: 'Bookings', value: stats.bookings, icon: <FiCalendar />, color: '#d4a843' },
    { label: 'Packages', value: stats.packages, icon: <FiPackage />, color: '#234a40' },
    { label: 'Destinations', value: stats.destinations, icon: <FiMapPin />, color: '#2a3a52' },
    { label: 'FAQs', value: stats.faqs, icon: <FiHelpCircle />, color: '#1a3c34' },
    { label: 'RAG Documents', value: stats.ragDocs, icon: <FiCpu />, color: '#b8922e' },
  ]

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {statCards.map((stat, i) => (
          <div className="admin-stat-card" key={i}>
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
