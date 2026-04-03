import { useState } from 'react'
import BorrowerSidebar from './BorrowerSidebar'
import useAuth from '../../hooks/useAuth'

export default function BorrowerLayout({ children }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .bl-root { font-family: 'DM Sans', sans-serif; }
        .bl-topbar {
          background: white;
          border-bottom: 1px solid #f1f5f9;
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
        }
        .bl-main {
          background: #f8f7f4;
          min-height: calc(100vh - 64px);
          padding: 32px;
        }
        .bl-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 25;
        }
        .bl-mobile-sidebar {
          position: fixed; left: 0; top: 0; bottom: 0; z-index: 30;
        }
        .bl-hamburger {
          display: none;
          background: none; border: none;
          cursor: pointer; padding: 8px; border-radius: 8px;
          color: #374151; transition: background 0.2s;
        }
        .bl-hamburger:hover { background: #f3f4f6; }
        @media (max-width: 768px) {
          .bl-hamburger { display: flex; align-items: center; }
          .bl-main { padding: 20px 16px; }
        }
        .bl-breadcrumb-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #3b82f6; display: inline-block; margin-right: 8px;
        }
        .bl-notif-btn {
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid #e5e7eb; background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: #6b7280; position: relative;
        }
        .bl-notif-btn:hover { border-color: #3b82f6; color: #3b82f6; }
        .bl-notif-dot {
          position: absolute; top: 6px; right: 6px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #3b82f6; border: 1.5px solid white;
        }
        .bl-user-pill {
          display: flex; align-items: center; gap: 8px;
          background: #f8f7f4; border: 1px solid #e5e7eb;
          border-radius: 10px; padding: 6px 12px 6px 6px;
        }
        .bl-avatar {
          width: 28px; height: 28px; border-radius: 8px;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.8rem; color: white;
        }
      `}</style>

      <div className="bl-root" style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Desktop Sidebar */}
        <div style={{ display: 'flex' }} className="hidden md:flex">
          <BorrowerSidebar />
        </div>

        {/* Mobile overlay */}
        {open && (
          <>
            <div className="bl-overlay" onClick={() => setOpen(false)} />
            <div className="bl-mobile-sidebar">
              <BorrowerSidebar />
            </div>
          </>
        )}

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Topbar — matches DashboardLayout exactly */}
          <div className="bl-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                className="bl-hamburger"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span className="bl-breadcrumb-dot" />
                  Borrower Dashboard
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111', lineHeight: 1.2 }}>
                  {greeting}, {user?.email?.split('@')[0]} 👋
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Notification bell */}
              <button className="bl-notif-btn" title="Notifications">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="bl-notif-dot" />
              </button>

              {/* User pill */}
              <div className="bl-user-pill">
                <div className="bl-avatar">{user?.email?.[0]?.toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#111', lineHeight: 1 }}>
                    {user?.email?.split('@')[0]}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {user?.role}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="bl-main">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
