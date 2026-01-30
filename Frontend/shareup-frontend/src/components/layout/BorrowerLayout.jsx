import { useState } from 'react'
import BorrowerSidebar from './BorrowerSidebar'

export default function BorrowerLayout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={`fixed z-30 md:static ${open ? 'block' : 'hidden'} md:block`}>
        <BorrowerSidebar />
      </div>

      <div className="flex-1">
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => setOpen(true)}>☰</button>
          <span className="font-bold">Borrower Dashboard</span>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
