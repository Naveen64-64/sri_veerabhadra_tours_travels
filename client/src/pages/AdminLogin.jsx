import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../services/authService'
import { FiLogIn } from 'react-icons/fi'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(email, password)
      login(res.data.token, { email: res.data.email, name: res.data.name, role: res.data.role })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--color-dark-navy), var(--color-dark-green))', padding: '2rem' }}>
      <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-dark-navy)', margin: '0 auto var(--space-md)', fontFamily: 'var(--font-heading)' }}>SV</div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>Admin Login</h2>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Sri Veerabhadra Tours and Travels</p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: '#f8d7da', color: '#721c24', marginBottom: 'var(--space-lg)', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@sriveerabhadra.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
            <FiLogIn /> {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
