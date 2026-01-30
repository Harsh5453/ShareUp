import DashboardLayout from './DashboardLayout'

export default function OwnerLayout({ children }) {
  const links = [
    { to: '/owner', label: 'Dashboard' },
    { to: '/owner/add', label: 'Add Item' },
    { to: '/owner/items', label: 'My Items' },
    { to: '/owner/requests', label: 'Rental Requests' },
    { to: '/owner/returns', label: 'Return Approvals' },
    { to: '/owner/ratings', label: 'Ratings' }
  ]

  return (
    <DashboardLayout links={links} title="Owner Panel">
      {children}
    </DashboardLayout>
  )
}
