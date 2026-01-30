import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'

import MyItems from './MyItems'
import AddItem from './AddItem'
import RentalRequests from './RentalRequests'
import ReturnApprovals from './ReturnApprovals'
import OwnerRatings from './OwnerRatings'

export default function OwnerDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="items" />} />
        <Route path="items" element={<MyItems />} />
        <Route path="add" element={<AddItem />} />
        <Route path="requests" element={<RentalRequests />} />
        <Route path="returns" element={<ReturnApprovals />} />
        <Route path="ratings" element={<OwnerRatings />} />
      </Routes>
    </DashboardLayout>
  )
}
