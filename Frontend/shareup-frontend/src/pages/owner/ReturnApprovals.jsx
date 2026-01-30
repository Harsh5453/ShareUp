import { useEffect, useState } from 'react'
import rentalsApi from '../../api/rentals.api'
import toast from 'react-hot-toast'
import Empty from '../../components/ui/Empty'
import useItemsMap from '../../hooks/useItemsMap'

export default function ReturnApprovals() {
  const [returns, setReturns] = useState([])
  const itemsMap = useItemsMap()

  const load = async () => {
    try {
      const res = await rentalsApi.getPendingReturns()
      setReturns(Array.isArray(res.data) ? res.data : [])
    } catch {
      toast.error('Failed to load return requests')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const approveReturn = async id => {
    // optimistic UI
    setReturns(prev => prev.filter(r => r.id !== id))

    try {
      await rentalsApi.approveReturn(id)
      toast.success('Return approved')
    } catch {
      toast.error('Approval failed')
      load()
    }
  }

  if (returns.length === 0) return <Empty text="No pending returns." />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Return Approvals</h1>

      {returns.map(r => {
        const imageUrl = `${import.meta.env.VITE_RENTAL_API}/api/rentals/${r.id}/return-image`

        return (
          <div key={r.id} className="border p-4 mb-3 rounded bg-white space-y-2">
            <p><b>Item:</b> {itemsMap[r.itemId] || r.itemId}</p>
            <p><b>Borrower:</b> {r.borrowerEmail}</p>

            <img
              src={imageUrl}
              alt="Return proof"
              className="w-48 rounded border"
              onError={e => (e.target.style.display = 'none')}
            />

            <button
              onClick={() => approveReturn(r.id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve Return
            </button>
          </div>
        )
      })}
    </div>
  )
}
