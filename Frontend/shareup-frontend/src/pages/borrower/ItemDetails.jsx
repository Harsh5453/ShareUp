import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import itemsApi from '../../api/items.api'
import rentalsApi from '../../api/rentals.api'
import toast from 'react-hot-toast'

export default function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await itemsApi.getById(id)
        setItem(res.data)
      } catch {
        toast.error('Failed to load item')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const requestRental = async () => {
    try {
      await rentalsApi.request({
        itemId: item.id || item._id,
        ownerId: item.ownerId
      })
      toast.success('Rental request sent')
    } catch {
      toast.error('Request failed')
    }
  }

  if (loading) return <p>Loading...</p>
  if (!item) return <p>Item not found</p>

  const imageUrl = item.imageUrl
    ? `${import.meta.env.VITE_ITEM_API}/api/images/${item.imageUrl.replace(
        /^.*[\\/]/,
        ''
      )}`
    : '/placeholder.png'

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

      <div className="grid md:grid-cols-2 gap-8 items-start">

        {/* IMAGE */}
        <div className="w-full max-w-md aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg mx-auto">
          <img
            src={imageUrl}
            alt={item.name}
            className="max-w-full max-h-full object-contain"
            onError={e => (e.currentTarget.src = '/placeholder.png')}
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-4">

          <h1 className="text-2xl font-bold">{item.name}</h1>

          <p className="text-gray-600">{item.description}</p>

          <div className="space-y-2 text-sm">
            <div>
              <b>Price:</b> ₹{item.price}
            </div>

            <div>
              <b>Status:</b> {item.status}
            </div>

            <div>
              <b>Pickup Address:</b> {item.pickupAddress || 'Not provided'}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="border px-4 py-2 rounded"
            >
              Back
            </button>

            <button
              onClick={requestRental}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Request Rental
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
