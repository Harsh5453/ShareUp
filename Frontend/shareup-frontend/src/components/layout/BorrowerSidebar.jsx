import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { FaSearch, FaClipboardList, FaSignOutAlt } from 'react-icons/fa'

// ✅ Ratings removed
const links = [
  { to: '/borrower/browse',  label: 'Browse Items', icon: <FaSearch /> },
  { to: '/borrower/rentals', label: 'My Rentals',   icon: <FaClipboardList /> },
]

export default function BorrowerSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .bsidebar-root {
          font-family: 'DM Sans', sans-serif;
          width: 256px; min-height: 100vh;
          background: #0f1117;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }
        .bsidebar-root::before {
          content: ''; position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .bsidebar-logo { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: white; letter-spacing: -0.5px; }
        .b-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; border-radius: 10px;
          text-decoration: none; transition: all 0.2s;
          margin-bottom: 2px; position: relative;
        }
        .b-nav-item .b-icon {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; background: rgba(255,255,255,0.07);
          color: #9ca3af; flex-shrink: 0; transition: all 0.2s;
        }
        .b-nav-item .b-label { font-size: 0.875rem; font-weight: 500; color: #9ca3af; transition: color 0.2s; }
        .b-nav-item:hover .b-icon { background: rgba(59,130,246,0.15); color: #3b82f6; }
        .b-nav-item:hover .b-label { color: #fff; }
        .b-nav-item.active .b-icon { background: #3b82f6; color: white; }
        .b-nav-item.active .b-label { color: #fff; font-weight: 600; }
        .b-nav-item.active::before {
          content: ''; position: absolute;
          left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 60%; background: #3b82f6;
          border-radius: 0 3px 3px 0;
        }
        .b-divider { height: 1px; background: rgba(255,255,255,0.07); }
        .b-logout-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; border-radius: 10px;
          cursor: pointer; border: none; background: transparent;
          width: 100%; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .b-logout-btn:hover { background: rgba(239,68,68,0.1); }
        .b-logout-btn:hover .b-logout-icon { color: #ef4444; background: rgba(239,68,68,0.15); }
        .b-logout-btn:hover .b-logout-label { color: #ef4444; }
        .b-logout-icon {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; background: rgba(255,255,255,0.07);
          color: #6b7280; transition: all 0.2s;
        }
        .b-logout-label { font-size: 0.875rem; font-weight: 500; color: #6b7280; transition: color 0.2s; }
        .b-user-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 12px; margin: 0 12px 12px;
        }
        .b-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.9rem; color: white; flex-shrink: 0;
        }
      `}</style>

      <aside className="bsidebar-root">
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5L3 12.5M3 12.5L7 8.5M3 12.5H21M17 7.5L21 11.5M21 11.5L17 15.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="bsidebar-logo">Share<span style={{ color: '#3b82f6' }}>Up</span></span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: 2 }}>Borrower Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `b-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="b-icon">{link.icon}</div>
              <span className="b-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div>
          <div className="b-divider" style={{ margin: '12px' }} />
          <div className="b-user-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="b-avatar">{user?.email?.[0]?.toUpperCase()}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Borrower</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 12px 16px' }}>
            <button className="b-logout-btn" onClick={handleLogout}>
              <div className="b-logout-icon"><FaSignOutAlt /></div>
              <span className="b-logout-label">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
