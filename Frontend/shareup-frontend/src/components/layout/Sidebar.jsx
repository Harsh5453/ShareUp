import { NavLink } from 'react-router-dom'
import { FaBox, FaPlus, FaClipboardList, FaStar, FaUndo } from 'react-icons/fa'

const navItems = [
  { to: '/owner/items', label: 'My Items', icon: <FaBox /> },
  { to: '/owner/add', label: 'Add Item', icon: <FaPlus /> },
  { to: '/owner/requests', label: 'Rental Requests', icon: <FaClipboardList /> },
  { to: '/owner/returns', label: 'Return Approvals', icon: <FaUndo /> },
  // { to: '/owner/ratings', label: 'My Ratings', icon: <FaStar /> }
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-indigo-600">Owner Panel</h2>

      <nav className="space-y-1">
        {navItems.map(link => (
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
