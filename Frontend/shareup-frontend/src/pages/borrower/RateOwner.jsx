import { useEffect, useState } from 'react'
import rentalsApi from '../../api/rentals.api'
import toast from 'react-hot-toast'
import StatusBadge from '../../components/ui/StatusBadge'
import Empty from '../../components/ui/Empty'
import useItemsMap from '../../hooks/useItemsMap'

export default function MyRentals() {
  const [rentals, setRentals] = useState([])
  const itemsMap = useItemsMap()

  const load = async () => {
    try {
      const res = await rentalsApi.myRentals()
      setRentals(Array.isArray(res.data) ? res.data : [])
    } catch {
      toast.error('Failed to load rentals')
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (rentals.length === 0) return <Empty text="No rentals yet." />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Rentals</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {rentals.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                {itemsMap[r.itemId] || r.itemId}
              </h3>
              <StatusBadge status={r.status} />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Owner: {r.ownerEmail || r.ownerId}
            </p>

            {r.status === 'APPROVED' && (
              <label className="block mt-3 text-sm">
                Upload return proof:
                <input
                  type="file"
                  className="mt-1"
                  onChange={e =>
                    rentalsApi.returnItem(r.id, e.target.files[0])
                  }
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
