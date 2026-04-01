import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { FaBox, FaPlus, FaClipboardList, FaStar, FaUndo, FaSignOutAlt } from 'react-icons/fa'

const navItems = [
  { to: '/owner/items',    label: 'My Items',         icon: <FaBox />,           desc: 'Manage listings' },
  { to: '/owner/add',      label: 'Add Item',          icon: <FaPlus />,          desc: 'Create new listing' },
  { to: '/owner/requests', label: 'Rental Requests',   icon: <FaClipboardList />, desc: 'Incoming requests' },
  { to: '/owner/returns',  label: 'Return Approvals',  icon: <FaUndo />,          desc: 'Pending returns' },
  { to: '/owner/ratings',  label: 'My Ratings',        icon: <FaStar />,          desc: 'View feedback' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .sidebar-root {
          font-family: 'DM Sans', sans-serif;
          width: 256px;
          min-height: 100vh;
          background: #0f1117;
          display: flex;
          flex-direction: column;
          padding: 0;
          position: relative;
          overflow: hidden;
        }
        .sidebar-root::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,93,38,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .sidebar-logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 2px;
          position: relative;
          overflow: hidden;
        }
        .sidebar-nav-item .item-icon {
          width: 34px; height: 34px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem;
          background: rgba(255,255,255,0.07);
          color: #9ca3af;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .sidebar-nav-item .item-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #9ca3af;
          transition: color 0.2s;
        }
        .sidebar-nav-item:hover .item-icon {
          background: rgba(232,93,38,0.15);
          color: #e85d26;
        }
        .sidebar-nav-item:hover .item-label { color: #fff; }
        .sidebar-nav-item.active .item-icon {
          background: #e85d26;
          color: white;
        }
        .sidebar-nav-item.active .item-label { color: #fff; font-weight: 600; }
        .sidebar-nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 60%;
          background: #e85d26;
          border-radius: 0 3px 3px 0;
        }
        .sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 12px 0;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 10px;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); }
        .logout-btn:hover .logout-icon { color: #ef4444; background: rgba(239,68,68,0.15); }
        .logout-btn:hover .logout-label { color: #ef4444; }
        .logout-icon {
          width: 34px; height: 34px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem;
          background: rgba(255,255,255,0.07);
          color: #6b7280;
          transition: all 0.2s;
        }
        .logout-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          transition: color 0.2s;
        }
        .user-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px;
          margin: 0 12px 12px;
        }
        .user-avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #e85d26, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.9rem; color: white;
          flex-shrink: 0;
        }
      `}</style>

      <aside className="sidebar-root">
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #e85d26, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5L3 12.5M3 12.5L7 8.5M3 12.5H21M17 7.5L21 11.5M21 11.5L17 15.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="sidebar-logo">Share<span style={{ color: '#e85d26' }}>Up</span></span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: 2 }}>
            Owner Panel
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="item-icon">{link.icon}</div>
              <span className="item-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div>
          <div className="sidebar-divider" style={{ margin: '12px 12px' }} />

          {/* User card */}
          <div className="user-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Owner</div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div style={{ padding: '0 12px 16px' }}>
            <button className="logout-btn" onClick={handleLogout}>
              <div className="logout-icon"><FaSignOutAlt /></div>
              <span className="logout-label">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
