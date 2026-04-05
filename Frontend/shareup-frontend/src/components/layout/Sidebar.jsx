import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { FaBox, FaPlus, FaClipboardList, FaUndo, FaSignOutAlt, FaTimes } from 'react-icons/fa'

const navItems = [
  { to: '/owner/items',    label: 'My Items',        icon: <FaBox /> },
  { to: '/owner/add',      label: 'Add Item',         icon: <FaPlus /> },
  { to: '/owner/requests', label: 'Rental Requests',  icon: <FaClipboardList /> },
  { to: '/owner/returns',  label: 'Return Approvals', icon: <FaUndo /> },
]

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) onClose()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .sb-root {
          font-family: 'DM Sans', sans-serif;
          width: 240px;
          min-height: 100vh;
          height: 100%;
          background: #0f1117;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .sb-root::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,93,38,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .sb-header {
          padding: 20px 16px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sb-logo-wrap { display: flex; align-items: center; gap: 8px; }
        .sb-logo-icon {
          width: 28px; height: 28px; border-radius: 7px;
          background: linear-gradient(135deg, #e85d26, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sb-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem; font-weight: 800;
          color: white; letter-spacing: -0.5px;
        }
        .sb-panel-label {
          font-size: 0.65rem; color: #4b5563;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 0 16px 12px;
        }
        /* Close button — only visible on mobile via parent */
        .sb-close {
          background: rgba(255,255,255,0.07);
          border: none; border-radius: 8px;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          color: #6b7280; cursor: pointer;
          transition: all 0.2s; flex-shrink: 0;
        }
        .sb-close:hover { background: rgba(239,68,68,0.15); color: #ef4444; }

        .sb-nav { flex: 1; padding: 0 10px; }
        .sb-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none; transition: all 0.2s;
          margin-bottom: 2px; position: relative;
        }
        .sb-link .sb-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem;
          background: rgba(255,255,255,0.07);
          color: #9ca3af; flex-shrink: 0; transition: all 0.2s;
        }
        .sb-link .sb-label {
          font-size: 0.85rem; font-weight: 500;
          color: #9ca3af; transition: color 0.2s;
        }
        .sb-link:hover .sb-icon { background: rgba(232,93,38,0.15); color: #e85d26; }
        .sb-link:hover .sb-label { color: #fff; }
        .sb-link.active .sb-icon { background: #e85d26; color: white; }
        .sb-link.active .sb-label { color: #fff; font-weight: 600; }
        .sb-link.active::before {
          content: ''; position: absolute;
          left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 60%; background: #e85d26;
          border-radius: 0 3px 3px 0;
        }
        .sb-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 10px 10px; }
        .sb-user-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 10px; margin: 0 10px 8px;
        }
        .sb-avatar {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #e85d26, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem; color: white; flex-shrink: 0;
        }
        .sb-logout {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 10px;
          cursor: pointer; border: none; background: transparent;
          width: 100%; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          margin: 0 0 12px;
        }
        .sb-logout:hover { background: rgba(239,68,68,0.1); }
        .sb-logout:hover .sb-logout-icon { color: #ef4444; background: rgba(239,68,68,0.15); }
        .sb-logout:hover .sb-logout-label { color: #ef4444; }
        .sb-logout-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; background: rgba(255,255,255,0.07);
          color: #6b7280; transition: all 0.2s;
        }
        .sb-logout-label { font-size: 0.85rem; font-weight: 500; color: #6b7280; transition: color 0.2s; }
      `}</style>

      <aside className="sb-root">
        {/* Header */}
        <div className="sb-header">
          <div className="sb-logo-wrap">
            <div className="sb-logo-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5L3 12.5M3 12.5L7 8.5M3 12.5H21M17 7.5L21 11.5M21 11.5L17 15.5"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="sb-logo-text">Share<span style={{ color: '#e85d26' }}>Up</span></span>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button className="sb-close" onClick={onClose} aria-label="Close menu">
              <FaTimes size={12} />
            </button>
          )}
        </div>

        <div className="sb-panel-label">Owner Panel</div>

        {/* Nav */}
        <nav className="sb-nav">
          {navItems.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleNavClick}
              className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}
            >
              <div className="sb-icon">{link.icon}</div>
              <span className="sb-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div>
          <div className="sb-divider" />
          <div className="sb-user-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div className="sb-avatar">{user?.email?.[0]?.toUpperCase()}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e5e7eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: '0.67rem', color: '#6b7280' }}>Owner</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 10px' }}>
            <button className="sb-logout" onClick={handleLogout}>
              <div className="sb-logout-icon"><FaSignOutAlt /></div>
              <span className="sb-logout-label">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
