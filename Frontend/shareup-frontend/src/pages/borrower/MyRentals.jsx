import { useEffect, useState } from 'react'
import rentalsApi from '../../api/rentals.api'
import toast from 'react-hot-toast'
import StatusBadge from '../../components/ui/StatusBadge'
import Empty from '../../components/ui/Empty'
import itemsApi from '../../api/items.api'

export default function MyRentals() {
  const [rentals, setRentals] = useState([])
  const [items, setItems] = useState({})
  const [files, setFiles] = useState({})

  const load = async () => {
    try {
      const res = await rentalsApi.myRentals()
      const list = Array.isArray(res.data) ? res.data : []
      setRentals(list)

      const map = {}
      for (const r of list) {
        if (!map[r.itemId]) {
          const itemRes = await itemsApi.getById(r.itemId)
          map[r.itemId] = itemRes.data
        }
      }
      setItems(map)
    } catch {
      toast.error('Failed to load rentals')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const sendReturnRequest = async rentalId => {
    const file = files[rentalId]
    if (!file) {
      toast.error('Please select image first')
      return
    }

    // optimistic UI
    setRentals(prev =>
      prev.map(r =>
        r.id === rentalId ? { ...r, status: 'RETURN_REQUESTED' } : r
      )
    )

    try {
      await rentalsApi.returnItem(rentalId, file)
      toast.success('Return request sent')
    } catch {
      toast.error('Failed to send return request')
      load()
    }
  }

  if (rentals.length === 0) return <Empty text="No rentals yet." />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Rentals</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {rentals.map(r => {
          const item = items[r.itemId]

          return (
            <div key={r.id} className="bg-white p-4 rounded-lg shadow space-y-2">
              <h3 className="font-semibold">{item?.name || r.itemId}</h3>
              <StatusBadge status={r.status} />

              {/* APPROVED: show pickup info + return upload */}
              {r.status === 'APPROVED' && (
                <div className="space-y-3 bg-gray-50 p-3 rounded">

                  <div className="text-sm">
                    <b>Pickup address:</b><br />
                    {r.pickupAddress || 'Not provided'}
                  </div>

                  <div className="text-sm">
                    <b>Owner phone:</b><br />
                    {r.ownerPhone || 'Not provided'}
                  </div>

                  <input
                    type="file"
                    onChange={e =>
                      setFiles(prev => ({
                        ...prev,
                        [r.id]: e.target.files[0]
                      }))
                    }
                  />

                  <button
                    onClick={() => sendReturnRequest(r.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Send Return Request
                  </button>
                </div>
              )}

              {r.status === 'RETURN_REQUESTED' && (
                <p className="text-blue-600 text-sm">
                  Waiting for owner approval
                </p>
              )}

              {r.status === 'RETURN_APPROVED' && (
                <div className="bg-green-50 p-2 rounded text-sm">
                  Rental completed successfully ✅
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
