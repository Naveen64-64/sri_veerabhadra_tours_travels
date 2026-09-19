import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import HomePage from './pages/HomePage'
import VehiclesPage from './pages/VehiclesPage'
import BusToursPage from './pages/BusToursPage'
import DestinationsPage from './pages/DestinationsPage'
import PackagesPage from './pages/PackagesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BookingPage from './pages/BookingPage'

// Admin Pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminVehicles from './pages/AdminVehicles'
import AdminBookings from './pages/AdminBookings'
import AdminFAQs from './pages/AdminFAQs'
import AdminRAG from './pages/AdminRAG'
import AdminPackages from './pages/AdminPackages'
import AdminDestinations from './pages/AdminDestinations'
import AdminTours from './pages/AdminTours'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/bus-tours" element={<BusToursPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/vehicles" element={<AdminVehicles />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/faqs" element={<AdminFAQs />} />
        <Route path="/admin/rag" element={<AdminRAG />} />
        <Route path="/admin/packages" element={<AdminPackages />} />
        <Route path="/admin/destinations" element={<AdminDestinations />} />
        <Route path="/admin/tours" element={<AdminTours />} />
      </Route>
    </Routes>
  )
}

export default App
