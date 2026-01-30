import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-indigo-600">
          ShareUp
        </Link>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link to="/login" className="text-gray-600 hover:text-black">Login</Link>
              <Link to="/register" className="text-gray-600 hover:text-black">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link
                to={user.role === 'OWNER' ? '/owner' : '/borrower'}
                className="text-gray-600 hover:text-black"
              >
                Dashboard
              </Link>

              <span className="text-sm text-gray-500">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
