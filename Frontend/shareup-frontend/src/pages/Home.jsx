import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import itemsApi from '../api/items.api'
import ItemCard from '../components/ItemCard'
import Pagination from '../components/ui/Pagination'
import Loader from '../components/layout/Loader'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Electronics', 'Tools', 'Furniture', 'Sports', 'Vehicles', 'Books', 'Other']

const stats = [
  { value: '500+', label: 'Items Listed' },
  { value: '200+', label: 'Active Users' },
  { value: '98%',  label: 'Happy Renters' },
  { value: '₹0',   label: 'Listing Fee' },
]

export default function Home() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const pageSize = 6

  useEffect(() => {
    const load = async () => {
      try {
        const res = await itemsApi.getAll()
        setItems(Array.isArray(res.data) ? res.data : [])
      } catch {
        toast.error('Failed to load items')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ✅ Fixed: filter works on both search AND category
  const filtered = items.filter(i => {
    const matchSearch = !search || i.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || i.category?.toLowerCase() === category.toLowerCase()
    return matchSearch && matchCat
  })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (loading) return <Loader />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .home-root { font-family: 'DM Sans', sans-serif; background: #faf9f6; }

        /* HERO */
        .hero {
          background: #0f1117;
          position: relative;
          overflow: hidden;
          padding: 80px 0 90px;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,93,38,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: -80px; left: 10%;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px;
          position: relative;
          z-index: 1;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(232,93,38,0.15);
          border: 1px solid rgba(232,93,38,0.3);
          color: #f97316;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 28px;
        }
        .hero-badge::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f97316;
          animation: blink 2s infinite;
          flex-shrink: 0;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        /* ✅ Fixed: letter-spacing was too tight, now readable */
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.6rem, 5.5vw, 4.2rem);
          font-weight: 900;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.5px;
          margin-bottom: 20px;
        }
        .hero-title span { color: #e85d26; }

        .hero-subtitle {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.75;
          max-width: 480px;
          margin-bottom: 36px;
          font-weight: 400;
          letter-spacing: 0.01em;
        }
        .hero-cta-group { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-primary {
          background: #e85d26;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .btn-primary:hover {
          background: #d44d1a;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(232,93,38,0.35);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.07);
          color: #e5e7eb;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.13); }

        /* STATS */
        .stats-row {
          background: #0f1117;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 32px 0;
        }
        .stats-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .stat-item {
          text-align: center;
          padding: 0 24px;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: white;
          letter-spacing: -1px;
        }
        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 400;
          margin-top: 4px;
          letter-spacing: 0.02em;
        }

        /* FEATURES */
        .features-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 32px 0;
        }
        .section-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #e85d26;
          margin-bottom: 10px;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.3px;
          margin-bottom: 36px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 16px;
        }
        .feature-card {
          background: white;
          border: 1px solid #f0ede8;
          border-radius: 16px;
          padding: 26px;
          transition: all 0.25s;
        }
        .feature-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.07);
          border-color: #e8d5c8;
        }
        .feature-icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          background: #fef3ec;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          margin-bottom: 14px;
        }
        .feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #111;
          margin-bottom: 6px;
          letter-spacing: -0.2px;
        }
        .feature-desc {
          font-size: 0.84rem;
          color: #6b7280;
          line-height: 1.65;
          letter-spacing: 0.01em;
        }

        /* BROWSE */
        .browse-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px 32px 80px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1.5px solid #e5e0d8;
          border-radius: 12px;
          padding: 4px 4px 4px 16px;
          margin-bottom: 18px;
          transition: border-color 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .search-bar:focus-within { border-color: #e85d26; }
        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.92rem;
          color: #111;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
        }
        .search-bar input::placeholder { color: #b0a99f; }
        .search-btn {
          background: #111;
          color: white;
          border: none;
          padding: 11px 22px;
          border-radius: 9px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
          letter-spacing: 0.02em;
        }
        .search-btn:hover { background: #e85d26; }

        /* ✅ Category pills */
        .category-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .pill {
          padding: 7px 18px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: 1.5px solid #e5e0d8;
          background: white;
          color: #6b7280;
          transition: all 0.18s;
          letter-spacing: 0.01em;
        }
        .pill:hover { border-color: #e85d26; color: #e85d26; }
        .pill.active {
          background: #e85d26;
          border-color: #e85d26;
          color: white;
          font-weight: 600;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .empty-state {
          text-align: center;
          padding: 64px 0;
          color: #9ca3af;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 12px; }
        .empty-text {
          font-size: 1rem;
          letter-spacing: 0.01em;
        }

        @media (max-width: 640px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat-item { border-right: none; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .hero-title { font-size: 2.2rem; letter-spacing: -0.3px; }
        }
      `}</style>

      <div className="home-root">

        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-badge">India's Peer-to-Peer Rental Platform</div>
            <h1 className="hero-title">
              Rent anything,<br />
              from <span>people nearby.</span>
            </h1>
            <p className="hero-subtitle">
              Tools, electronics, camping gear & more. Save money, reduce waste — rent smarter with ShareUp.
            </p>
            <div className="hero-cta-group">
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Start Renting →
              </button>
              <button className="btn-secondary" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-row">
          <div className="stats-inner">
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="features-section">
          <div className="section-label">Why ShareUp</div>
          <div className="section-title">Everything you need to rent smarter</div>
          <div className="features-grid">
            {[
              ['💸', 'Save Money',     'Rent instead of buying expensive items you rarely use.'],
              ['🛡️', 'Trusted Owners', 'Verified profiles and ratings ensure safe transactions.'],
              ['⚡', 'Fast Approval',  'Owners respond quickly — often within hours.'],
              ['🔁', 'Easy Returns',   'Image-proof return flow keeps everyone accountable.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="feature-card">
                <div className="feature-icon">{icon}</div>
                <div className="feature-title">{title}</div>
                <div className="feature-desc">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BROWSE */}
        <section className="browse-section">
          <div className="section-label">Available Now</div>
          <div className="section-title">Browse items near you</div>

          {/* Search */}
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0a99f" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Search for tools, electronics, furniture..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
            <button className="search-btn">Search</button>
          </div>

          {/* ✅ Category pills — now actually filter items */}
          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`pill ${category === cat ? 'active' : ''}`}
                onClick={() => {
                  setCategory(cat)
                  setPage(1)
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          {category !== 'All' || search ? (
            <p style={{ fontSize: '0.83rem', color: '#9ca3af', marginBottom: 20, letterSpacing: '0.01em' }}>
              {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
              {category !== 'All' ? ` in "${category}"` : ''}
              {search ? ` for "${search}"` : ''}
            </p>
          ) : null}

          {paginated.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-text">No items found. Try a different search or category.</div>
            </div>
          ) : (
            <div className="items-grid">
              {paginated.map(item => (
                <ItemCard key={item.id || item._id} item={item} />
              ))}
            </div>
          )}

          <div style={{ marginTop: 40 }}>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </section>

      </div>
    </>
  )
}
