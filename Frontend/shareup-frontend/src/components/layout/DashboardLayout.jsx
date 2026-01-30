import { useState } from 'react'
import Sidebar from './Sidebar'
import useAuth from '../../hooks/useAuth'

export default function DashboardLayout({ links, title, children }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className={`fixed z-30 md:static ${open ? 'block' : 'hidden'} md:block`}>
        <Sidebar  />
      </div>

      {/* Content */}
      <div className="flex-1">

        {/* Topbar */}
        <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
          <button onClick={() => setOpen(!open)} className="md:hidden text-xl">☰</button>

          <h1 className="text-xl font-semibold text-gray-700">{title}</h1>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.email}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              {user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
