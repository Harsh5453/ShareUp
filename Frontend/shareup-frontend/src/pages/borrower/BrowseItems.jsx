import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import itemsApi from '../../api/items.api'
import rentalsApi from '../../api/rentals.api'
import toast from 'react-hot-toast'
import Empty from '../../components/ui/Empty'

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Kitchen Appliances', 'Gaming', 'Sports', 'Tools', 'Events', 'Outdoor', 'Vehicles', 'Books', 'Other']

// Get today's date in YYYY-MM-DD for min attribute
const today = new Date().toISOString().split('T')[0]

export default function BrowseItems() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [category, setCategory]   = useState('All')
  const [search, setSearch]       = useState('')
  const [requesting, setRequesting] = useState(null) // itemId being requested
  const [dateModal, setDateModal] = useState(null)   // item for which modal is open
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await itemsApi.getAll()
        setItems(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error(err)
        toast.error('Failed to load items')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filter by search + category
  const filtered = items.filter(i => {
    const matchSearch = !search || i.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'All' || i.category?.toLowerCase() === category.toLowerCase()
    return matchSearch && matchCat
  })

  const openDateModal = item => {
    setDateModal(item)
    setStartDate('')
    setEndDate('')
  }

  const closeDateModal = () => {
    setDateModal(null)
    setStartDate('')
    setEndDate('')
  }

  const submitRequest = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates')
      return
    }
    if (endDate <= startDate) {
      toast.error('End date must be after start date')
      return
    }

    const item = dateModal
    setRequesting(item.id || item._id)
    closeDateModal()

    try {
      await rentalsApi.request({
        itemId:    item.id || item._id,
        ownerId:   item.ownerId,
        startDate,
        endDate,
      })
      toast.success('Rental request sent!')
    } catch (err) {
      console.error(err)
      toast.error('Request failed. Please try again.')
    } finally {
      setRequesting(null)
    }
  }

  if (!loading && items.length === 0) {
    return <Empty text="No items available right now." />
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .browse-root { font-family: 'DM Sans', sans-serif; }

        .browse-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 800;
          color: #111; letter-spacing: -0.3px; margin-bottom: 20px;
        }

        /* Search bar */
        .browse-search {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #e5e0d8;
          border-radius: 10px; padding: 4px 4px 4px 14px;
          margin-bottom: 14px; transition: border-color 0.2s;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .browse-search:focus-within { border-color: #e85d26; }
        .browse-search input {
          flex: 1; border: none; outline: none;
          font-size: 0.875rem; background: transparent;
          font-family: 'DM Sans', sans-serif; color: #111;
        }
        .browse-search input::placeholder { color: #b0a99f; }

        /* Category pills */
        .cat-pills { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 24px; }
        .cat-pill {
          padding: 5px 14px; border-radius: 20px;
          font-size: 0.78rem; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; border: 1.5px solid #e5e0d8;
          background: white; color: #6b7280; transition: all 0.18s;
        }
        .cat-pill:hover { border-color: #e85d26; color: #e85d26; }
        .cat-pill.active { background: #e85d26; border-color: #e85d26; color: white; font-weight: 600; }

        /* Item grid */
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        /* Item card */
        .item-card {
          background: white; border-radius: 16px;
          border: 1px solid #f0ede8; overflow: hidden;
          transition: all 0.25s; display: flex; flex-direction: column;
        }
        .item-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); }
        .item-card img {
          width: 100%; height: 180px; object-fit: cover;
          transition: transform 0.3s;
        }
        .item-card:hover img { transform: scale(1.04); }
        .item-card-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .item-name { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #111; }
        .item-desc { font-size: 0.8rem; color: #9ca3af; line-height: 1.5; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .item-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
        .item-price { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #111; }
        .item-price span { font-size: 0.7rem; font-weight: 400; color: #9ca3af; font-family: 'DM Sans', sans-serif; }
        .item-btns { display: flex; gap: 6px; }
        .btn-view {
          padding: 6px 12px; border-radius: 7px; font-size: 0.78rem; font-weight: 500;
          border: 1.5px solid #e5e0d8; background: white; color: #374151;
          cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
        }
        .btn-view:hover { border-color: #111; color: #111; }
        .btn-request {
          padding: 6px 14px; border-radius: 7px; font-size: 0.78rem; font-weight: 600;
          border: none; background: #111; color: white;
          cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
        }
        .btn-request:hover:not(:disabled) { background: #e85d26; }
        .btn-request:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Date modal overlay */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 20px;
        }
        .modal-box {
          background: white; border-radius: 20px; padding: 28px;
          width: 100%; max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .modal-title {
          font-family: 'Syne', sans-serif; font-size: 1.1rem;
          font-weight: 800; color: #111; margin-bottom: 4px;
        }
        .modal-sub { font-size: 0.82rem; color: #9ca3af; margin-bottom: 20px; }
        .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .date-group label {
          display: block; font-size: 0.75rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #374151; margin-bottom: 6px;
        }
        .date-input {
          width: 100%; border: 1.5px solid #e5e0d8; border-radius: 9px;
          padding: 9px 12px; font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif; color: #111;
          outline: none; transition: border-color 0.2s; box-sizing: border-box;
        }
        .date-input:focus { border-color: #e85d26; }
        .modal-btns { display: flex; gap: 10px; }
        .btn-cancel-modal {
          flex: 1; padding: 11px; border-radius: 9px;
          border: 1.5px solid #e5e0d8; background: white;
          font-size: 0.875rem; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.18s; color: #374151;
        }
        .btn-cancel-modal:hover { border-color: #111; }
        .btn-confirm {
          flex: 1; padding: 11px; border-radius: 9px;
          border: none; background: #e85d26; color: white;
          font-size: 0.875rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: background 0.18s;
        }
        .btn-confirm:hover { background: #d44d1a; }

        .results-count { font-size: 0.8rem; color: #9ca3af; margin-bottom: 16px; }
      `}</style>

      <div className="browse-root">
        <div className="browse-title">Browse Items</div>

        {/* Search */}
        <div className="browse-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0a99f" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category pills */}
        <div className="cat-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(search || category !== 'All') && (
          <div className="results-count">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
            {category !== 'All' ? ` in "${category}"` : ''}
            {search ? ` for "${search}"` : ''}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <Empty text="No items found. Try a different search or category." />
        ) : (
          <div className="items-grid">
            {filtered.map(item => {
              const id = item.id || item._id
              return (
                <div key={id} className="item-card">
                  <img
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.name}
                    onError={e => (e.currentTarget.src = '/placeholder.png')}
                  />
                  <div className="item-card-body">
                    <div className="item-name">{item.name}</div>
                    <div className="item-desc">{item.description}</div>
                    <div className="item-footer">
                      <div className="item-price">
                        ₹{item.price} <span>/ day</span>
                      </div>
                      <div className="item-btns">
                        <button className="btn-view" onClick={() => navigate(`/borrower/items/${id}`)}>
                          View
                        </button>
                        <button
                          className="btn-request"
                          disabled={requesting === id}
                          onClick={() => openDateModal(item)}
                        >
                          {requesting === id ? 'Sending...' : 'Request'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ✅ Date picker modal */}
      {dateModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeDateModal()}>
          <div className="modal-box">
            <div className="modal-title">Select Rental Dates</div>
            <div className="modal-sub">
              Requesting: <strong>{dateModal.name}</strong> · ₹{dateModal.price}/day
            </div>

            <div className="date-row">
              <div className="date-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  className="date-input"
                  min={today}
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-group">
                <label>End Date *</label>
                <input
                  type="date"
                  className="date-input"
                  min={startDate || today}
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Show total cost if both dates selected */}
            {startDate && endDate && endDate > startDate && (
              <div style={{
                background: '#fef3ec', border: '1px solid #fbd5bf',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                fontSize: '0.85rem', color: '#7c3b1a'
              }}>
                📅 {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days
                &nbsp;·&nbsp;
                Total: <strong>₹{Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * dateModal.price}</strong>
              </div>
            )}

            <div className="modal-btns">
              <button className="btn-cancel-modal" onClick={closeDateModal}>Cancel</button>
              <button className="btn-confirm" onClick={submitRequest}>Confirm Request</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
