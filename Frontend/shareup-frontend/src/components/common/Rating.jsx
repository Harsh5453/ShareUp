import { useEffect, useState } from 'react'
import ratingsApi from '../../api/ratings.api'
import toast from 'react-hot-toast'
import Empty from '../../components/ui/Empty'

export default function Ratings() {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await ratingsApi.myRatings()
        setRatings(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error(err)
        toast.error('Failed to load ratings')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (!loading && ratings.length === 0) {
    return <Empty text="No ratings yet." />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Ratings</h1>

      <div className="space-y-4">
        {ratings.map(r => (
          <div key={r.id} className="border p-4 rounded bg-white">
            <p className="font-semibold">Stars: {r.stars} / 10</p>
            <p className="text-gray-600">{r.review}</p>
            <p className="text-sm text-gray-400 mt-1">
              From user: {r.fromUserId}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
