import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { FaSearch, FaClipboardList, FaSignOutAlt, FaTimes } from 'react-icons/fa'

const links = [
  { to: '/borrower/browse',  label: 'Browse Items', icon: <FaSearch /> },
  { to: '/borrower/rentals', label: 'My Rentals',   icon: <FaClipboardList /> },
]

export default function BorrowerSidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const handleNavClick = () => { if (onClose) onClose() }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .bsb-root {
          font-family: 'DM Sans', sans-serif;
          width: 240px; min-height: 100vh; height: 100%;
          background: #0f1117;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden; flex-shrink: 0;
        }
        .bsb-root::before {
          content: ''; position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,93,38,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .bsb-header { padding: 20px 16px 16px; display: flex; align-items: center; justify-content: space-between; }
        .bsb-logo-wrap { display: flex; align-items: center; gap: 8px; }
        .bsb-logo-icon {
          width: 28px; height: 28px; border-radius: 7px;
          background: linear-gradient(135deg, #e85d26, #f59e0b);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .bsb-logo-text { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800; color: white; letter-spacing: -0.5px; }
        .bsb-panel-label { font-size: 0.65rem; color: #4b5563; text-transform: uppercase; letter-spacing: 0.1em; padding: 0 16px 12px; }
        .bsb-close {
          background: rgba(255,255,255,0.07); border: none; border-radius: 8px;
          width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
          color: #6b7280; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
        }
        .bsb-close:hover { background: rgba(239,68,68,0.15); color: #ef4444; }
        .bsb-nav { flex: 1; padding: 0 10px; }
        .bsb-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none; transition: all 0.2s; margin-bottom: 2px; position: relative;
        }
        .bsb-link .bsb-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; background: rgba(255,255,255,0.07);
          color: #9ca3af; flex-shrink: 0; transition: all 0.2s;
        }
        .bsb-link .bsb-label { font-size: 0.85rem; font-weight: 500; color: #9ca3af; transition: color 0.2s; }
        .bsb-link:hover .bsb-icon { background: rgba(232,93,38,0.15); color: #e85d26; }
        .bsb-link:hover .bsb-label { color: #fff; }
        .bsb-link.active .bsb-icon { background: #e85d26; color: white; }
        .bsb-link.active .bsb-label { color: #fff; font-weight: 600; }
        .bsb-link.active::before {
          content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 60%; background: #e85d26; border-radius: 0 3px 3px 0;
        }
        .bsb-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 10px 10px; }
        .bsb-user-card {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 10px; margin: 0 10px 8px;
        }
        .bsb-avatar {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #e85d26, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem; color: white; flex-shrink: 0;
        }
        .bsb-logout {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 10px;
          cursor: pointer; border: none; background: transparent;
          width: 100%; transition: all 0.2s; font-family: 'DM Sans', sans-serif; margin: 0 0 12px;
        }
        .bsb-logout:hover { background: rgba(239,68,68,0.1); }
        .bsb-logout:hover .bsb-li { color: #ef4444; background: rgba(239,68,68,0.15); }
        .bsb-logout:hover .bsb-ll { color: #ef4444; }
        .bsb-li {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; background: rgba(255,255,255,0.07); color: #6b7280; transition: all 0.2s;
        }
        .bsb-ll { font-size: 0.85rem; font-weight: 500; color: #6b7280; transition: color 0.2s; }
      `}</style>

      <aside className="bsb-root">
        <div className="bsb-header">
          <div className="bsb-logo-wrap">
            <div className="bsb-logo-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5L3 12.5M3 12.5L7 8.5M3 12.5H21M17 7.5L21 11.5M21 11.5L17 15.5"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="bsb-logo-text">Share<span style={{ color: '#e85d26' }}>Up</span></span>
          </div>
          {onClose && (
            <button className="bsb-close" onClick={onClose} aria-label="Close menu">
              <FaTimes size={12} />
            </button>
          )}
        </div>

        <div className="bsb-panel-label">Borrower Panel</div>

        <nav className="bsb-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleNavClick}
              className={({ isActive }) => `bsb-link ${isActive ? 'active' : ''}`}
            >
              <div className="bsb-icon">{link.icon}</div>
              <span className="bsb-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div>
          <div className="bsb-divider" />
          <div className="bsb-user-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div className="bsb-avatar">{user?.email?.[0]?.toUpperCase()}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e5e7eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: '0.67rem', color: '#6b7280' }}>Borrower</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 10px' }}>
            <button className="bsb-logout" onClick={handleLogout}>
              <div className="bsb-li"><FaSignOutAlt /></div>
              <span className="bsb-ll">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
