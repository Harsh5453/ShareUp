import { useEffect, useState } from 'react'
import rentalsApi from '../../api/rentals.api'
import toast from 'react-hot-toast'
import StatusBadge from '../../components/ui/StatusBadge'
import Empty from '../../components/ui/Empty'
import itemsApi from '../../api/items.api'

export default function RentalRequests() {
  const [requests, setRequests] = useState([])
  const [items, setItems] = useState({})
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await rentalsApi.getOwnerRequests()
      const list = Array.isArray(res.data) ? res.data : []
      setRequests(list)

      // load item details
      const map = {}
      for (const r of list) {
        if (!map[r.itemId]) {
          const itemRes = await itemsApi.getById(r.itemId)
          map[r.itemId] = itemRes.data
        }
      }
      setItems(map)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async id => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    )
    try {
      await rentalsApi.approve(id)
      toast.success('Request approved')
    } catch (err) {
      toast.error('Approval failed')
      load()
    }
  }

  const reject = async id => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    )
    try {
      await rentalsApi.reject(id)
      toast.success('Request rejected')
    } catch (err) {
      toast.error('Reject failed')
      load()
    }
  }

  if (!loading && requests.length === 0) {
    return <Empty text="No rental requests." />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rental Requests</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {requests.map(r => {
          const item = items[r.itemId]
          const imageUrl = item?.imageUrl
            ? `${import.meta.env.VITE_ITEM_API}/api/images/${item.imageUrl.replace(/^.*[\\/]/, '')}`
            : '/placeholder.png'

          return (
            <div key={r.id} className="bg-white rounded-xl shadow-md p-5 space-y-3 border">
              <img
                src={imageUrl}
                className="h-40 w-full object-cover rounded"
                onError={e => (e.currentTarget.src = '/placeholder.png')}
              />

              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg truncate">
                  {item?.name || r.itemId}
                </h3>
                <StatusBadge status={r.status} />
              </div>

              <p className="text-sm text-gray-500">
                Borrower: <b>{r.borrowerEmail}</b>
              </p>

              {r.status === 'PENDING' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => approve(r.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(r.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
