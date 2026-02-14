import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import itemsApi from '../api/items.api'
import rentalsApi from '../api/rentals.api'
import toast from 'react-hot-toast'

export default function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await itemsApi.getById(id)
        setItem(res.data)
      } catch (err) {
        toast.error('Failed to load item')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])
const requestRental = async () => {
  try {
    setRequesting(true)

    await rentalsApi.request({
      itemId: item.id || item._id,
      ownerId: item.ownerId
    })

    toast.success('Rental request sent')
    navigate('/borrower/requests')
  } catch (err) {
    console.error(err)
    toast.error('Request failed')
  } finally {
    setRequesting(false)
  }
}



  if (loading) return <p>Loading...</p>
  if (!item) return <p>Item not found</p>

 const imageUrl = item.imageUrl || '/placeholder.png'

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={imageUrl} className="w-full h-72 object-cover rounded-lg" />

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <p>{item.description}</p>
          <p className="font-semibold">₹ {item.price} / day</p>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Pickup Address</p>
            <p>{item.pickupAddress}</p>
          </div>

        
        </div>
      </div>
    </div>
  )
}
