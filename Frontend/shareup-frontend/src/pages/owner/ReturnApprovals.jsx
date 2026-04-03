import { useEffect, useState } from 'react'
import rentalsApi from '../../api/rentals.api'
import itemsApi from '../../api/items.api'
import toast from 'react-hot-toast'
import Empty from '../../components/ui/Empty'

const formatDate = iso => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ReturnApprovals() {
  const [returns, setReturns] = useState([])
  const [items, setItems]     = useState({})
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res  = await rentalsApi.getPendingReturns()
      const list = Array.isArray(res.data) ? res.data : []
      setReturns(list)

      //  Parallel fetch
      const uniqueIds = [...new Set(list.map(r => r.itemId))]
      const results   = await Promise.all(uniqueIds.map(id => itemsApi.getById(id).catch(() => null)))
      const map       = {}
      uniqueIds.forEach((id, i) => { if (results[i]) map[id] = results[i].data })
      setItems(map)
    } catch {
      toast.error('Failed to load return requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approveReturn = async id => {
    setReturns(prev => prev.filter(r => r.id !== id))
    try {
      await rentalsApi.approveReturn(id)
      toast.success('Return approved!')
    } catch {
      toast.error('Approval failed')
      load()
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ height: 140, borderRadius: 14, background: '#f0ede8', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  )

  if (returns.length === 0) return <Empty text="No pending return approvals." />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .ra-root { font-family: 'DM Sans', sans-serif; }
        .ra-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #111; letter-spacing: -0.3px; margin-bottom: 20px; }
        .ra-list { display: flex; flex-direction: column; gap: 14px; }
        .ra-card {
          background: white; border-radius: 16px;
          border: 1px solid #f0ede8; overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          display: flex; gap: 0;
        }
        /* Return proof image on left */
        .ra-proof {
          width: 140px; min-height: 140px; flex-shrink: 0;
          object-fit: cover; background: #f8f7f4;
          display: flex; align-items: center; justify-content: center;
        }
        .ra-proof img { width: 140px; height: 100%; object-fit: cover; }
        .ra-proof-placeholder {
          width: 140px; background: #f0ede8;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; color: #d1d5db;
        }
        .ra-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .ra-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .ra-item-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #111; }
        .ra-badge {
          background: #fef3ec; border: 1px solid #fbd5bf;
          border-radius: 20px; padding: 3px 10px;
          font-size: 0.7rem; font-weight: 700; color: #c2410c;
          text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap;
        }
        .borrower-box {
          background: #f8f7f4; border-radius: 10px; padding: 10px 12px;
          display: flex; flex-direction: column; gap: 5px;
        }
        .borrower-box-title {
          font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 2px;
        }
        .info-line { display: flex; align-items: center; gap: 7px; font-size: 0.8rem; }
        .info-icon { font-size: 0.85rem; flex-shrink: 0; }
        .info-label { color: #9ca3af; min-width: 48px; }
        .info-val { font-weight: 500; color: #111; }
        .info-val.na { color: #d1d5db; font-style: italic; }
        .date-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.78rem; color: #1e40af;
        }
        .date-badge strong { color: #1e3a8a; }
        .btn-approve-return {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 20px; border-radius: 9px; border: none;
          background: #16a34a; color: white;
          font-size: 0.82rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.18s;
          align-self: flex-start; margin-top: auto;
        }
        .btn-approve-return:hover { background: #15803d; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 600px) {
          .ra-card { flex-direction: column; }
          .ra-proof, .ra-proof img, .ra-proof-placeholder { width: 100%; height: 180px; }
        }
      `}</style>

      <div className="ra-root">
        <div className="ra-title">Return Approvals</div>

        <div className="ra-list">
          {returns.map(r => {
            const item = items[r.itemId]

            return (
              <div key={r.id} className="ra-card">

                {/* Return proof image */}
                {r.returnImageUrl ? (
                  <div className="ra-proof">
                    <img
                      src={r.returnImageUrl}
                      alt="Return proof"
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                ) : (
                  <div className="ra-proof-placeholder">📷</div>
                )}

                <div className="ra-body">
                  {/* Header */}
                  <div className="ra-header">
                    <div className="ra-item-name">{item?.name || r.itemId}</div>
                    <span className="ra-badge">Return Pending</span>
                  </div>

                  {/* Dates */}
                  {(r.startDate || r.endDate) && (
                    <div className="date-badge">
                      📅 <strong>{formatDate(r.startDate)}</strong>
                      &nbsp;→&nbsp;
                      <strong>{formatDate(r.endDate)}</strong>
                    </div>
                  )}

                  {/* Borrower info */}
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

                  {/* Approve return button */}
                  <button className="btn-approve-return" onClick={() => approveReturn(r.id)}>
                    ✓ Approve Return
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
