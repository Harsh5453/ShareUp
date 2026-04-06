import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import itemsApi from '../api/items.api'
import Loader from '../components/layout/Loader'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Kitchen Appliances', 'Gaming', 'Sports', 'Tools', 'Events', 'Outdoor', 'Vehicles', 'Books', 'Other']

const FEATURES = [
  { icon: '💸', title: 'Save Money',     desc: 'Rent instead of buying expensive items you rarely use.' },
  { icon: '🛡️', title: 'Trusted Owners', desc: 'Verified profiles ensure safe and reliable transactions.' },
  { icon: '⚡', title: 'Fast Approval',  desc: 'Owners respond quickly — often within hours.' },
  { icon: '🔁', title: 'Easy Returns',   desc: 'Image-proof return flow keeps everyone accountable.' },
]

export default function Home() {
  const [items, setItems]       = useState([])
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage]         = useState(1)
  const [loading, setLoading]   = useState(true)
  const navigate = useNavigate()
  const pageSize = 6

  useEffect(() => {
    itemsApi.getAll()
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Failed to load items'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(i => {
    const matchSearch = !search || i.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'All' || i.category?.toLowerCase() === category.toLowerCase()
    return matchSearch && matchCat
  })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (loading) return <Loader />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .home { font-family: 'DM Sans', sans-serif; background: #faf9f6; }

        /* ── HERO ── */
        .hero {
          background: #0f1117; position: relative; overflow: hidden;
          padding: 64px 20px 72px;
        }
        .hero::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,93,38,0.2) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(232,93,38,0.15); border: 1px solid rgba(232,93,38,0.3);
          color: #f97316; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 20px; margin-bottom: 24px;
        }
        .hero-badge::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #f97316; animation: blink 2s infinite; flex-shrink: 0;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 6vw, 3.8rem);
          font-weight: 900; color: white;
          line-height: 1.08; letter-spacing: -1px; margin-bottom: 18px;
        }
        .hero-title span { color: #e85d26; }
        .hero-sub {
          font-size: clamp(0.9rem, 2vw, 1rem);
          color: #6b7280; line-height: 1.75; max-width: 480px;
          margin-bottom: 32px; font-weight: 400;
        }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-primary {
          background: #e85d26; color: white; border: none;
          padding: 13px 26px; border-radius: 10px;
          font-size: 0.9rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.2s; letter-spacing: 0.02em;
        }
        .btn-primary:hover { background: #d44d1a; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(232,93,38,0.3); }
        .btn-secondary {
          background: rgba(255,255,255,0.08); color: #e5e7eb;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 13px 26px; border-radius: 10px;
          font-size: 0.9rem; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.14); }

        /* ── STATS ── */
        .stats { background: #0f1117; border-top: 1px solid rgba(255,255,255,0.07); padding: 28px 20px; }
        .stats-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat { text-align: center; padding: 0 12px; border-right: 1px solid rgba(255,255,255,0.07); }
        .stat:last-child { border-right: none; }
        .stat-val { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: white; letter-spacing: -1px; }
        .stat-label { font-size: 0.75rem; color: #6b7280; margin-top: 3px; }

        /* ── FEATURES ── */
        .features { max-width: 1100px; margin: 0 auto; padding: 60px 20px 0; }
        .section-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #e85d26; margin-bottom: 8px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800; color: #111; letter-spacing: -0.3px; margin-bottom: 32px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }
        .feat-card {
          background: white; border: 1px solid #f0ede8; border-radius: 16px;
          padding: 22px; transition: all 0.22s;
        }
        .feat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.07); border-color: #e8d5c8; }
        .feat-icon { font-size: 1.4rem; margin-bottom: 12px; }
        .feat-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #111; margin-bottom: 5px; }
        .feat-desc { font-size: 0.82rem; color: #6b7280; line-height: 1.6; }

        /* ── BROWSE ── */
        .browse { max-width: 1100px; margin: 0 auto; padding: 56px 20px 72px; }

        /* Search */
        .search-wrap {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1.5px solid #e5e0d8; border-radius: 12px;
          padding: 4px 4px 4px 14px; margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: border-color 0.2s;
        }
        .search-wrap:focus-within { border-color: #e85d26; }
        .search-wrap input {
          flex: 1; border: none; outline: none; font-size: 0.875rem;
          background: transparent; font-family: 'DM Sans', sans-serif; color: #111; min-width: 0;
        }
        .search-wrap input::placeholder { color: #b0a99f; }
        .search-btn {
          background: #111; color: white; border: none;
          padding: 10px 18px; border-radius: 9px; font-size: 0.82rem;
          font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.2s; white-space: nowrap;
        }
        .search-btn:hover { background: #e85d26; }

        /* Category pills */
        .pills { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 28px; }
        .pill {
          padding: 6px 14px; border-radius: 20px; font-size: 0.78rem; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          border: 1.5px solid #e5e0d8; background: white; color: #6b7280; transition: all 0.18s;
        }
        .pill:hover { border-color: #e85d26; color: #e85d26; }
        .pill.active { background: #e85d26; border-color: #e85d26; color: white; font-weight: 600; }

        .results-hint { font-size: 0.78rem; color: #9ca3af; margin-bottom: 20px; }

        /* Items grid */
        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }

        /* Item card */
        .icard {
          background: white; border-radius: 16px; border: 1px solid #f0ede8;
          overflow: hidden; transition: all 0.22s; display: flex; flex-direction: column;
        }
        .icard:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); }
        .icard-img-wrap { position: relative; overflow: hidden; }
        .icard-img-wrap img { width: 100%; height: 190px; object-fit: cover; transition: transform 0.3s; display: block; }
        .icard:hover .icard-img-wrap img { transform: scale(1.04); }
        .icard-price {
          position: absolute; top: 10px; right: 10px;
          background: rgba(15,17,23,0.8); color: white;
          font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 20px;
          font-family: 'Syne', sans-serif;
        }
        .icard-cat {
          position: absolute; top: 10px; left: 10px;
          background: rgba(232,93,38,0.9); color: white;
          font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 20px;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .icard-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 5px; }
        .icard-name { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #111; }
        .icard-desc { font-size: 0.8rem; color: #9ca3af; line-height: 1.5; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .icard-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
        .icard-btn {
          padding: 7px 16px; border-radius: 8px; border: none;
          background: #111; color: white; font-size: 0.78rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.18s;
          text-decoration: none; display: inline-block;
        }
        .icard-btn:hover { background: #e85d26; }

        /* Empty */
        .empty { text-align: center; padding: 60px 20px; color: #9ca3af; }
        .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .empty-text { font-size: 0.9rem; }

        /* Pagination */
        .pagination { display: flex; justify-content: center; gap: 8px; margin-top: 40px; flex-wrap: wrap; }
        .page-btn {
          width: 36px; height: 36px; border-radius: 8px; border: 1.5px solid #e5e0d8;
          background: white; color: #374151; font-size: 0.85rem; font-weight: 500;
          cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center;
        }
        .page-btn:hover { border-color: #e85d26; color: #e85d26; }
        .page-btn.active { background: #e85d26; border-color: #e85d26; color: white; font-weight: 700; }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat { border-right: none; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .stat:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.07); padding-right: 10px; }
          .stat:nth-last-child(-n+2) { border-bottom: none; }
          .hero-title { letter-spacing: -0.5px; }
          .items-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .icard-img-wrap img { height: 140px; }
        }
        @media (max-width: 400px) {
          .items-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="home">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-badge">India's Peer-to-Peer Rental Platform</div>
            <h1 className="hero-title">
              Rent anything,<br />
              from <span>people nearby.</span>
            </h1>
            <p className="hero-sub">
              Tools, electronics, camping gear & more. Save money, reduce waste — rent smarter with ShareUp.
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => navigate('/register')}>Start Renting →</button>
              <button className="btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="stats">
          <div className="stats-inner">
            {[['100+','Items Listed'],['50+','Active Users'],['98%','Happy Renters'],['₹0','Listing Fee']].map(([v,l]) => (
              <div key={l} className="stat">
                <div className="stat-val">{v}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features">
          <div className="section-label">Why ShareUp</div>
          <div className="section-title">Everything you need to rent smarter</div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BROWSE ── */}
        <section className="browse">
          <div className="section-label">Available Now</div>
          <div className="section-title">Browse items near you</div>

          {/* Search */}
          <div className="search-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0a99f" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Search for tools, electronics, furniture..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
            <button className="search-btn">Search</button>
          </div>

          {/* Pills */}
          <div className="pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`pill ${category === cat ? 'active' : ''}`}
                onClick={() => { setCategory(cat); setPage(1) }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results hint */}
          {(search || category !== 'All') && (
            <div className="results-hint">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
              {category !== 'All' ? ` in "${category}"` : ''}
              {search ? ` for "${search}"` : ''}
            </div>
          )}

          {/* Grid */}
          {paginated.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📦</div>
              <div className="empty-text">No items found. Try a different search or category.</div>
            </div>
          ) : (
            <div className="items-grid">
              {paginated.map(item => (
                <div key={item.id || item._id} className="icard">
                  <div className="icard-img-wrap">
                    <img
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      onError={e => (e.currentTarget.src = '/placeholder.png')}
                    />
                    <span className="icard-price">₹{item.price}/day</span>
                    {item.category && <span className="icard-cat">{item.category}</span>}
                  </div>
                  <div className="icard-body">
                    <div className="icard-name">{item.name}</div>
                    <div className="icard-desc">{item.description}</div>
                    <div className="icard-footer">
                      <Link to={`/item/${item.id || item._id}`} className="icard-btn">
                        View details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

      </div>
    </>
  )
}
