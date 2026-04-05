import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenu(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        .nav{
          font-family:'DM Sans',sans-serif;
          position:sticky;top:0;z-index:40;
          background:white;border-bottom:1px solid #f0ede8;
          box-shadow:0 1px 10px rgba(0,0,0,0.05);
        }
        .nav-inner{
          max-width:1100px;margin:0 auto;padding:0 20px;
          height:58px;display:flex;align-items:center;justify-content:space-between;
        }
        /* Logo */
        .nav-logo{display:flex;align-items:center;gap:8px;text-decoration:none}
        .nav-logo-icon{
          width:32px;height:32px;border-radius:8px;
          background:linear-gradient(135deg,#e85d26,#f59e0b);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }
        .nav-logo-text{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#111;letter-spacing:-0.5px}
        /* Desktop links */
        .nav-links{display:flex;align-items:center;gap:8px}
        .nav-link{
          font-size:0.85rem;font-weight:500;color:#6b7280;
          text-decoration:none;padding:6px 12px;border-radius:8px;transition:all 0.18s;
        }
        .nav-link:hover{color:#111;background:#f8f7f4}
        .nav-btn-outline{
          font-size:0.82rem;font-weight:600;color:#e85d26;
          border:1.5px solid #e85d26;background:transparent;
          padding:7px 16px;border-radius:8px;cursor:pointer;
          transition:all 0.18s;font-family:'DM Sans',sans-serif;text-decoration:none;
          display:inline-flex;align-items:center;
        }
        .nav-btn-outline:hover{background:#e85d26;color:white}
        .nav-btn-solid{
          font-size:0.82rem;font-weight:600;color:white;
          border:none;background:#111;
          padding:8px 18px;border-radius:8px;cursor:pointer;
          transition:all 0.18s;font-family:'DM Sans',sans-serif;text-decoration:none;
          display:inline-flex;align-items:center;
        }
        .nav-btn-solid:hover{background:#e85d26}
        .nav-avatar{
          width:32px;height:32px;border-radius:8px;
          background:linear-gradient(135deg,#e85d26,#f59e0b);
          display:flex;align-items:center;justify-content:center;
          font-weight:700;font-size:0.85rem;color:white;flex-shrink:0;
        }
        /* Mobile hamburger */
        .nav-hamburger{
          display:none;background:none;border:none;cursor:pointer;
          padding:6px;border-radius:8px;color:#374151;
        }
        .nav-hamburger:hover{background:#f3f4f6}
        /* Mobile dropdown */
        .nav-mobile{
          display:none;
          border-top:1px solid #f0ede8;
          padding:12px 20px 16px;
          background:white;
          flex-direction:column;gap:6px;
        }
        .nav-mobile.open{display:flex}
        .nav-mobile-link{
          font-size:0.9rem;font-weight:500;color:#374151;
          text-decoration:none;padding:10px 12px;border-radius:10px;
          transition:background 0.18s;display:block;
        }
        .nav-mobile-link:hover{background:#f8f7f4;color:#111}
        .nav-mobile-btn{
          width:100%;text-align:center;padding:11px;border-radius:10px;
          font-size:0.875rem;font-weight:600;cursor:pointer;border:none;
          font-family:'DM Sans',sans-serif;transition:all 0.18s;margin-top:4px;
        }
        .nav-mobile-btn.outline{background:white;color:#e85d26;border:1.5px solid #e85d26}
        .nav-mobile-btn.outline:hover{background:#e85d26;color:white}
        .nav-mobile-btn.solid{background:#111;color:white}
        .nav-mobile-btn.solid:hover{background:#e85d26}
        .nav-user-row{
          display:flex;align-items:center;gap:10px;
          padding:10px 12px;background:#f8f7f4;border-radius:10px;margin-bottom:4px;
        }
        .nav-user-info{}
        .nav-user-name{font-size:0.85rem;font-weight:600;color:#111}
        .nav-user-role{font-size:0.72rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em}
        @media(max-width:640px){
          .nav-links{display:none}
          .nav-hamburger{display:block}
        }
      `}</style>

      <nav className="nav">
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5L3 12.5M3 12.5L7 8.5M3 12.5H21M17 7.5L21 11.5M21 11.5L17 15.5"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="nav-logo-text">Share<span style={{color:'#e85d26'}}>Up</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="nav-links">
            {!user ? (
              <>
                <Link to="/login"    className="nav-link">Login</Link>
                <Link to="/register" className="nav-btn-solid">Get Started</Link>
              </>
            ) : (
              <>
                <Link to={user.role === 'OWNER' ? '/owner' : '/borrower'} className="nav-link">
                  Dashboard
                </Link>
                <div className="nav-avatar">{user?.email?.[0]?.toUpperCase()}</div>
                <button className="nav-btn-outline" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileMenu(m => !m)}
            aria-label="Menu"
          >
            {mobileMenu ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`nav-mobile ${mobileMenu ? 'open' : ''}`}>
          {user && (
            <div className="nav-user-row">
              <div className="nav-avatar">{user?.email?.[0]?.toUpperCase()}</div>
              <div className="nav-user-info">
                <div className="nav-user-name">{user?.email?.split('@')[0]}</div>
                <div className="nav-user-role">{user?.role}</div>
              </div>
            </div>
          )}

          {!user ? (
            <>
              <Link to="/login"    className="nav-mobile-link" onClick={() => setMobileMenu(false)}>Login</Link>
              <Link to="/register" className="nav-mobile-link" onClick={() => setMobileMenu(false)}>Register</Link>
              <Link to="/register">
                <button className="nav-mobile-btn solid" onClick={() => setMobileMenu(false)}>
                  Get Started →
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === 'OWNER' ? '/owner' : '/borrower'}
                className="nav-mobile-link"
                onClick={() => setMobileMenu(false)}
              >
                Dashboard
              </Link>
              <button className="nav-mobile-btn outline" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
