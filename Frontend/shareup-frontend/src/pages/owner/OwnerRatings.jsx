import { useEffect, useState } from 'react'
import ratingsApi from '../../api/ratings.api'
import toast from 'react-hot-toast'
import Empty from '../../components/ui/Empty'

export default function OwnerRatings() {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const res = await ratingsApi.getMyRatings()
      setRatings(res.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load ratings')
    } finally {
      setLoading(false)
    }
  }

  if (!loading && ratings.length === 0) {
    return <Empty text="No ratings received yet." />
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Ratings</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ratings.map(r => (
          <div key={r.id} className="bg-white rounded-xl shadow p-5 space-y-2">

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-yellow-500">
                ⭐ {r.stars}/10
              </span>
              <span className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>

            {r.review && (
              <p className="text-gray-700 italic">"{r.review}"</p>
            )}

            <p className="text-xs text-gray-500">
              From user: {r.fromUserId}
            </p>

          </div>
        ))}
      </div>
    </div>
  )
}
