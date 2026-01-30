import { NavLink } from 'react-router-dom'
import { FaSearch, FaClipboardList, FaPaperPlane, FaStar } from 'react-icons/fa'

const links = [
  { to: '/borrower/browse', label: 'Browse Items', icon: <FaSearch /> },
  { to: '/borrower/rentals', label: 'My Rentals', icon: <FaClipboardList /> },
  // { to: '/borrower/requests', label: 'My Requests', icon: <FaPaperPlane /> },
  // { to: '/borrower/ratings', label: 'Rate Owners', icon: <FaStar /> }
]

export default function BorrowerSidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-indigo-600">Borrower Panel</h2>

      <nav className="space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium
              ${isActive
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
