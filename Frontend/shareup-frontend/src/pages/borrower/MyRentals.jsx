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

export default function MyRentals() {
  const [rentals, setRentals] = useState([])
  const [items, setItems]     = useState({})
  const [files, setFiles]     = useState({})
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  const load = async () => {
    try {
      const res  = await rentalsApi.myRentals()
      const list = Array.isArray(res.data) ? res.data : []
      setRentals(list)

      // ✅ Parallel fetch — all items at once
      const uniqueIds = [...new Set(list.map(r => r.itemId))]
      const results   = await Promise.all(uniqueIds.map(id => itemsApi.getById(id).catch(() => null)))
      const map       = {}
      uniqueIds.forEach((id, i) => { if (results[i]) map[id] = results[i].data })
      setItems(map)
    } catch {
      toast.error('Failed to load rentals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const sendReturnRequest = async rentalId => {
    const file = files[rentalId]
    if (!file) { toast.error('Please select an image first'); return }

    setRentals(prev => prev.map(r => r.id === rentalId ? { ...r, status: 'RETURN_REQUESTED' } : r))

    try {
      await rentalsApi.returnItem(rentalId, file)
      toast.success('Return request sent!')
    } catch {
      toast.error('Failed to send return request')
      load()
    }
  }

  const cancelRental = async rentalId => {
    setCancelling(rentalId)
    setRentals(prev => prev.map(r => r.id === rentalId ? { ...r, status: 'CANCELLED' } : r))
    try {
      await rentalsApi.cancel(rentalId)
      toast.success('Rental cancelled')
    } catch {
      toast.error('Failed to cancel rental')
      load()
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ height: 180, borderRadius: 14, background: '#f0ede8', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  )

  if (rentals.length === 0) return <Empty text="No rentals yet." />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .my-rentals { font-family: 'DM Sans', sans-serif; }
        .mr-title { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #111; letter-spacing: -0.3px; margin-bottom: 20px; }
        .rental-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .rental-card {
          background: white; border-radius: 16px;
          border: 1px solid #f0ede8; padding: 18px;
          display: flex; flex-direction: column; gap: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .rental-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .rental-item-name { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #111; }
        .rental-dates {
          font-size: 0.78rem; color: #6b7280;
          background: #f8f7f4; border-radius: 7px;
          padding: 6px 10px; display: flex; gap: 6px; align-items: center;
        }
        .rental-dates strong { color: #374151; }
        .info-row { font-size: 0.8rem; color: #6b7280; }
        .info-row strong { color: #374151; }
        .approved-box {
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px;
        }
        .file-label {
          display: flex; align-items: center; gap: 8px;
          background: #f8f7f4; border: 1.5px dashed #e5e0d8;
          border-radius: 8px; padding: 8px 12px;
          cursor: pointer; font-size: 0.8rem; color: #6b7280; transition: border-color 0.2s;
        }
        .file-label:hover { border-color: #e85d26; color: #e85d26; }
        .file-label input { display: none; }
        .btn-return {
          padding: 8px 16px; border-radius: 8px; border: none;
          background: #111; color: white; font-size: 0.82rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.18s; width: 100%;
        }
        .btn-return:hover { background: #e85d26; }
        .btn-cancel {
          padding: 7px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 500;
          border: 1.5px solid #fecaca; background: #fff5f5; color: #dc2626;
          cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
        }
        .btn-cancel:hover:not(:disabled) { background: #dc2626; color: white; border-color: #dc2626; }
        .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
        .status-pending-msg { font-size: 0.8rem; color: #9ca3af; font-style: italic; }
        .completed-box {
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 8px; padding: 10px 12px;
          font-size: 0.82rem; color: #166534;
        }
        .return-pending-msg { font-size: 0.82rem; color: #3b82f6; font-style: italic; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div className="my-rentals">
        <div className="mr-title">My Rentals</div>

        <div className="rental-grid">
          {rentals.map(r => {
            const item = items[r.itemId]

            return (
              <div key={r.id} className="rental-card">

                {/* Header */}
                <div className="rental-card-header">
                  <div className="rental-item-name">{item?.name || 'Loading...'}</div>
                  <StatusBadge status={r.status} />
                </div>

                {/* Dates */}
                {(r.startDate || r.endDate) && (
                  <div className="rental-dates">
                    📅 <strong>{formatDate(r.startDate)}</strong> → <strong>{formatDate(r.endDate)}</strong>
                  </div>
                )}

                {/* PENDING — show cancel button */}
                {r.status === 'PENDING' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="status-pending-msg">Waiting for owner approval...</span>
                    <button
                      className="btn-cancel"
                      disabled={cancelling === r.id}
                      onClick={() => cancelRental(r.id)}
                    >
                      {cancelling === r.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                )}

                {/* APPROVED — show pickup info + return upload */}
                {r.status === 'APPROVED' && (
                  <div className="approved-box">
                    <div className="info-row">📍 <strong>Pickup:</strong> {r.pickupAddress || 'Not provided'}</div>
                    <div className="info-row">📞 <strong>Owner Phone:</strong> {r.ownerPhone || 'Not provided'}</div>

                    <label className="file-label">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      {files[r.id] ? files[r.id].name : 'Upload return photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setFiles(prev => ({ ...prev, [r.id]: e.target.files[0] }))}
                      />
                    </label>

                    <button className="btn-return" onClick={() => sendReturnRequest(r.id)}>
                      Send Return Request
                    </button>
                  </div>
                )}

                {/* RETURN REQUESTED */}
                {r.status === 'RETURN_REQUESTED' && (
                  <p className="return-pending-msg">⏳ Waiting for owner to approve your return...</p>
                )}

                {/* RETURN APPROVED */}
                {r.status === 'RETURN_APPROVED' && (
                  <div className="completed-box">✅ Rental completed successfully!</div>
                )}

                {/* CANCELLED */}
                {r.status === 'CANCELLED' && (
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>
                    This rental was cancelled.
                  </div>
                )}

                {/* REJECTED */}
                {r.status === 'REJECTED' && (
                  <div style={{ fontSize: '0.8rem', color: '#ef4444', fontStyle: 'italic' }}>
                    This request was declined by the owner.
                  </div>
                )}

              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
