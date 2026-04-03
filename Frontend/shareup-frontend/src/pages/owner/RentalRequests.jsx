import { useEffect, useState } from 'react'
import rentalsApi from '../../api/rentals.api'
import itemsApi from '../../api/items.api'
import toast from 'react-hot-toast'
import StatusBadge from '../../components/ui/StatusBadge'
import Empty from '../../components/ui/Empty'

const formatDate = iso => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function RentalRequests() {
  const [requests, setRequests] = useState([])
  const [items, setItems]       = useState({})
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    try {
      const res  = await rentalsApi.getOwnerRequests()
      const list = Array.isArray(res.data) ? res.data : []
      setRequests(list)

      //  Parallel fetch — all items at once
      const uniqueIds = [...new Set(list.map(r => r.itemId))]
      const results   = await Promise.all(uniqueIds.map(id => itemsApi.getById(id).catch(() => null)))
      const map       = {}
      uniqueIds.forEach((id, i) => { if (results[i]) map[id] = results[i].data })
      setItems(map)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approve = async id => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r))
    try {
      await rentalsApi.approve(id)
      toast.success('Request approved')
    } catch {
      toast.error('Approval failed')
      load()
    }
  }

  const reject = async id => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r))
    try {
      await rentalsApi.reject(id)
      toast.success('Request rejected')
    } catch {
      toast.error('Reject failed')
      load()
    }
  }

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ height: 320, borderRadius: 16, background: '#f0ede8', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  )

  if (!loading && requests.length === 0) return <Empty text="No rental requests yet." />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .rr-root { font-family: 'DM Sans', sans-serif; }
        .rr-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #111; letter-spacing: -0.3px; margin-bottom: 20px; }
        .rr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .rr-card {
          background: white; border-radius: 16px;
          border: 1px solid #f0ede8; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s;
        }
        .rr-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); }
        .rr-card img { width: 100%; height: 170px; object-fit: cover; }
        .rr-card-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .rr-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .rr-item-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #111; }

        /* Borrower info box */
        .borrower-box {
          background: #f8f7f4; border-radius: 10px; padding: 10px 12px;
          display: flex; flex-direction: column; gap: 5px;
        }
        .borrower-box-title {
          font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 2px;
        }
        .info-line { display: flex; align-items: center; gap: 7px; font-size: 0.8rem; color: #374151; }
        .info-line .info-icon { font-size: 0.85rem; flex-shrink: 0; }
        .info-line .info-label { color: #9ca3af; min-width: 44px; }
        .info-line .info-val { font-weight: 500; color: #111; }
        .info-line .info-val.na { color: #d1d5db; font-style: italic; }

        /* Date badge */
        .date-badge {
          display: flex; align-items: center; gap: 6px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: 8px; padding: 6px 10px;
          font-size: 0.78rem; color: #1e40af;
        }
        .date-badge strong { color: #1e3a8a; }

        /* Action buttons */
        .rr-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 4px; }
        .btn-approve {
          flex: 1; padding: 9px; border-radius: 9px; border: none;
          background: #16a34a; color: white; font-size: 0.82rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.18s;
        }
        .btn-approve:hover { background: #15803d; }
        .btn-reject {
          flex: 1; padding: 9px; border-radius: 9px;
          border: 1.5px solid #fecaca; background: #fff5f5;
          color: #dc2626; font-size: 0.82rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.18s;
        }
        .btn-reject:hover { background: #dc2626; color: white; border-color: #dc2626; }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div className="rr-root">
        <div className="rr-title">Rental Requests</div>

        <div className="rr-grid">
          {requests.map(r => {
            const item     = items[r.itemId]
            const imageUrl = item?.imageUrl || '/placeholder.png'

            return (
              <div key={r.id} className="rr-card">
                <img
                  src={imageUrl}
                  alt={item?.name || 'Item'}
                  onError={e => (e.currentTarget.src = '/placeholder.png')}
                />

                <div className="rr-card-body">
                  {/* Header */}
                  <div className="rr-card-header">
                    <div className="rr-item-name">{item?.name || r.itemId}</div>
                    <StatusBadge status={r.status} />
                  </div>

                  {/* ✅ Rental dates */}
                  {(r.startDate || r.endDate) && (
                    <div className="date-badge">
                      📅 <strong>{formatDate(r.startDate)}</strong>
                      &nbsp;→&nbsp;
                      <strong>{formatDate(r.endDate)}</strong>
                    </div>
                  )}

                  {/* ✅ Borrower info — email, phone, address */}
                  <div className="borrower-box">
                    <div className="borrower-box-title">Borrower Info</div>

                    <div className="info-line">
                      <span className="info-icon">✉️</span>
                      <span className="info-label">Email</span>
                      <span className={`info-val ${!r.borrowerEmail ? 'na' : ''}`}>
                        {r.borrowerEmail || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-line">
                      <span className="info-icon">📞</span>
                      <span className="info-label">Phone</span>
                      <span className={`info-val ${!r.borrowerPhone ? 'na' : ''}`}>
                        {r.borrowerPhone || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-line">
                      <span className="info-icon">📍</span>
                      <span className="info-label">Address</span>
                      <span className={`info-val ${!r.borrowerAddress ? 'na' : ''}`}>
                        {r.borrowerAddress || 'Not provided'}
                      </span>
                    </div>
                  </div>

                  {/* Approve / Reject buttons */}
                  {r.status === 'PENDING' && (
                    <div className="rr-actions">
                      <button className="btn-approve" onClick={() => approve(r.id)}>✓ Approve</button>
                      <button className="btn-reject"  onClick={() => reject(r.id)}>✕ Reject</button>
                    </div>
                  )}

                  {/* Already actioned */}
                  {r.status === 'APPROVED' && (
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 500 }}>
                      ✅ You approved this request
                    </div>
                  )}
                  {r.status === 'REJECTED' && (
                    <div style={{ fontSize: '0.78rem', color: '#dc2626', fontStyle: 'italic' }}>
                      ✕ You rejected this request
                    </div>
                  )}
                  {r.status === 'CANCELLED' && (
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontStyle: 'italic' }}>
                      Borrower cancelled this request
                    </div>
                  )}
                  {r.status === 'RETURN_REQUESTED' && (
                    <div style={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: 500 }}>
                      ⏳ Borrower has requested return
                    </div>
                  )}
                  {r.status === 'RETURN_APPROVED' && (
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 500 }}>
                      ✅ Return approved — completed
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
