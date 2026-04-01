import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .nav-root { font-family: 'DM Sans', sans-serif; }
        .nav-logo { font-family: 'Syne', sans-serif; }
        .nav-link {
          position: relative;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4b5563;
          transition: color 0.2s;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: #e85d26;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: #111; }
        .nav-link:hover::after { width: 100%; }
        .avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e85d26, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 0.875rem;
          cursor: pointer;
        }
        .btn-logout {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 6px 16px;
          border-radius: 8px;
          border: 1.5px solid #e85d26;
          color: #e85d26;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-logout:hover { background: #e85d26; color: white; }
        .btn-register {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: 8px;
          background: #111;
          color: white;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
        }
        .btn-register:hover { background: #e85d26; }
      `}</style>

      <nav className="nav-root sticky top-0 z-50 bg-white border-b border-gray-100" style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #e85d26, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5L3 12.5M3 12.5L7 8.5M3 12.5H21M17 7.5L21 11.5M21 11.5L17 15.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="nav-logo" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>
              Share<span style={{ color: '#e85d26' }}>Up</span>
            </span>
          </Link>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {!user && (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-register">Get Started</Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to={user.role === 'OWNER' ? '/owner' : '/borrower'}
                  className="nav-link"
                >
                  Dashboard
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111', lineHeight: 1.2 }}>
                      {user.email?.split('@')[0]}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {user.role}
                    </div>
                  </div>
                  <div className="avatar">{user.email?.[0]?.toUpperCase()}</div>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
