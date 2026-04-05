import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import useAuth from '../../hooks/useAuth'

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .dl-root {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          min-height: 100vh;
          background: #f8f7f4;
        }

        /* ── Desktop sidebar — always visible ── */
        .dl-sidebar-desktop {
          display: flex;
          flex-shrink: 0;
        }

        /* ── Mobile sidebar — hidden by default, slide in ── */
        .dl-sidebar-mobile {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
        }
        .dl-sidebar-mobile.is-open {
          transform: translateX(0);
        }

        /* ── Overlay behind mobile sidebar ── */
        .dl-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 49;
        }
        .dl-overlay.is-open {
          display: block;
        }

        /* ── Main content area ── */
        .dl-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        /* ── Topbar ── */
        .dl-topbar {
          background: white;
          border-bottom: 1px solid #f1f5f9;
          padding: 0 20px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: 0 1px 8px rgba(0,0,0,0.05);
          flex-shrink: 0;
        }

        .dl-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #374151;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .dl-hamburger:hover { background: #f3f4f6; }

        .dl-greeting {
          display: flex;
          flex-direction: column;
        }
        .dl-greeting-sub {
          font-size: 0.68rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .dl-greeting-sub::before {
          content: '';
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #e85d26;
          display: inline-block;
        }
        .dl-greeting-main {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111;
          line-height: 1.2;
        }

        .dl-user-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8f7f4;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 5px 10px 5px 5px;
        }
        .dl-avatar {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #e85d26, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.8rem; color: white;
          flex-shrink: 0;
        }
        .dl-user-name {
          font-size: 0.78rem;
          font-weight: 600;
          color: #111;
          line-height: 1;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dl-user-role {
          font-size: 0.62rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Page content ── */
        .dl-main {
          padding: 28px;
          flex: 1;
          overflow-y: auto;
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 767px) {
          .dl-sidebar-desktop { display: none; }
          .dl-hamburger { display: flex; align-items: center; }
          .dl-main { padding: 16px; }
          .dl-greeting-main { font-size: 0.82rem; }
          .dl-user-name { max-width: 60px; }
        }

        @media (min-width: 768px) {
          .dl-sidebar-mobile { display: none; }
          .dl-overlay { display: none !important; }
        }
      `}</style>

      <div className="dl-root">

        {/* Desktop sidebar — always visible */}
        <div className="dl-sidebar-desktop">
          <Sidebar />
        </div>

        {/* Mobile overlay */}
        <div
          className={`dl-overlay ${open ? 'is-open' : ''}`}
          onClick={() => setOpen(false)}
        />

        {/* Mobile sidebar — slides in */}
        <div className={`dl-sidebar-mobile ${open ? 'is-open' : ''}`}>
          <Sidebar onClose={() => setOpen(false)} />
        </div>

        {/* Main content */}
        <div className="dl-content">

          {/* Topbar */}
          <div className="dl-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Hamburger — mobile only */}
              <button
                className="dl-hamburger"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6"  x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>

              <div className="dl-greeting">
                <div className="dl-greeting-sub">Owner Dashboard</div>
                <div className="dl-greeting-main">{greeting}, {user?.email?.split('@')[0]} 👋</div>
              </div>
            </div>

            {/* User pill */}
            <div className="dl-user-pill">
              <div className="dl-avatar">{user?.email?.[0]?.toUpperCase()}</div>
              <div>
                <div className="dl-user-name">{user?.email?.split('@')[0]}</div>
                <div className="dl-user-role">{user?.role}</div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="dl-main">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
