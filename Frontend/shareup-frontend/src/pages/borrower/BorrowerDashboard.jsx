import { Routes, Route, Navigate } from 'react-router-dom'
import BorrowerLayout from '../../components/layout/BorrowerLayout'
import BrowseItems from './BrowseItems'
import MyRentals from './MyRentals'
import RateOwner from './RateOwner'
import ItemDetails from './ItemDetails'

export default function BorrowerDashboard() {
  return (
    <BorrowerLayout>
      <Routes>
        <Route path="/" element={<Navigate to="browse" />} />
        <Route path="browse" element={<BrowseItems />} />
        <Route path="rentals" element={<MyRentals />} />
        <Route path="ratings" element={<RateOwner />} />
        <Route path="items/:id" element={<ItemDetails />} />


      </Routes>

      

    </BorrowerLayout>
  )
}
