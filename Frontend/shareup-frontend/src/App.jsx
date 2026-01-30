import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import BorrowerDashboard from './pages/borrower/BorrowerDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ItemDetails from './pages/ItemDetails'   

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Owner */}
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute>
              <RoleRoute role="OWNER">
                <OwnerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Borrower */}
        <Route
          path="/borrower/*"
          element={
            <ProtectedRoute>
              <RoleRoute role="BORROWER">
                <BorrowerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}
