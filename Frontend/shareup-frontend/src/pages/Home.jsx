import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import itemsApi from '../api/items.api'
import ItemCard from '../components/ItemCard'
import Pagination from '../components/ui/Pagination'
import Loader from '../components/layout/Loader'
import toast from 'react-hot-toast'

export default function Home() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const pageSize = 6

  useEffect(() => {
    const load = async () => {
      try {
        const res = await itemsApi.getAll()
        setItems(res.data)
      } catch {
        toast.error('Failed to load items')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (loading) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-20">

      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Rent anything you need,<br />
            from people nearby.
          </h1>

          <p className="text-gray-600 mb-6">
            Tools, electronics, camping gear & more.
            Save money. Reduce waste. Rent smarter with ShareUp.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate('/login')}
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <img
            src="/hero-items.png"
            alt="items"
            className="w-full max-h-[320px] object-contain"
            onError={e => (e.target.style.display = 'none')}
          />
        </div>

      </section>

      {/* FEATURES */}
      <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">

        {[
          ['💸', 'Save Money', 'Rent instead of buying'],
          ['🛡️', 'Trusted Users', 'Verified owners'],
          ['⚡', 'Fast Rentals', 'Instant approvals'],
          ['🔁', 'Easy Returns', 'Smooth return flow']
        ].map(([icon, title, desc]) => (
          <div
            key={title}
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}

      </section>

      {/* ITEMS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Browse Items</h2>

        <input
          className="border rounded-lg p-3 mb-6 w-full"
          placeholder="Search items..."
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />

        {paginated.length === 0 && (
          <p className="text-center text-gray-500">No items found.</p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginated.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-10">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </section>

    </div>
  )
}
