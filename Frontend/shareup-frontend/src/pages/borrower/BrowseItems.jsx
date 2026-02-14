import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import itemsApi from '../../api/items.api'
import rentalsApi from '../../api/rentals.api'
import toast from 'react-hot-toast'
import Empty from '../../components/ui/Empty'

export default function BrowseItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await itemsApi.getAll()
        const list = Array.isArray(res.data) ? res.data : []
        setItems(list)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load items')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const requestRental = async item => {
    try {
      await rentalsApi.request({
        itemId: item.id || item._id,
        ownerId: item.ownerId
      })
      toast.success('Rental request sent')
    } catch (err) {
      console.error(err)
      toast.error('Request failed')
    }
  }

  if (!loading && items.length === 0) {
    return <Empty text="No items available right now." />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Items</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(i => {
          const imageUrl = item.imageUrl || '/placeholder.png'


          return (
            <div
              key={i.id || i._id}
              className="bg-white border rounded-xl shadow p-4 flex flex-col
                         transition-all duration-300 ease-in-out
                         hover:-translate-y-2 hover:shadow-xl group"
            >
              {/* Image */}
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={imageUrl}
                  className="max-w-full max-h-full object-contain
                             transition-transform duration-300
                             group-hover:scale-105"
                  onError={e => (e.currentTarget.src = '/placeholder.png')}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between flex-1 mt-4 space-y-2">
                <div>
                  <h3 className="font-semibold text-lg">{i.name}</h3>
                  <p className="text-sm text-gray-500">{i.description}</p>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="font-bold text-lg">₹{i.price}</span>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/borrower/items/${i.id || i._id}`)
                      }
                      className="border px-3 py-1 rounded text-sm
                                 transition hover:bg-gray-100"
                    >
                      View
                    </button>

                    <button
                      onClick={() => requestRental(i)}
                      className="bg-black text-white px-3 py-1 rounded text-sm
                                 transition hover:bg-gray-800"
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
