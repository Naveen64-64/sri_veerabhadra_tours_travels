import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import {
  FiGrid, FiTruck, FiMap, FiNavigation, FiPackage,
  FiMapPin, FiCalendar, FiHelpCircle, FiImage,
  FiCpu, FiSettings, FiLogOut
} from 'react-icons/fi'
import './AdminLayout.css'

const sidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { path: '/admin/vehicles', label: 'Vehicles', icon: <FiTruck /> },
  { path: '/admin/tours', label: 'Tours', icon: <FiMap /> },
  { path: '/admin/packages', label: 'Packages', icon: <FiPackage /> },
  { path: '/admin/destinations', label: 'Destinations', icon: <FiMapPin /> },
  { path: '/admin/bookings', label: 'Bookings', icon: <FiCalendar /> },
  { path: '/admin/faqs', label: 'FAQs', icon: <FiHelpCircle /> },
  { path: '/admin/rag', label: 'RAG Knowledge', icon: <FiCpu /> },
]

export default function AdminLayout() {
  const { isAuthenticated, admin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" id="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">
            <div className="admin-logo-icon">SV</div>
            <span>Admin Panel</span>
          </Link>
        </div>

        <nav className="admin-nav">
          {sidebarLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`admin-nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <span>{admin?.name || 'Admin'}</span>
          </div>
          <button className="admin-logout" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
