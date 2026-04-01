import { useState } from 'react'
import itemsApi from '../../api/items.api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Electronics', 'Tools', 'Furniture', 'Sports', 'Vehicles', 'Books', 'Other']

export default function AddItem() {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const submit = async e => {
    e.preventDefault()
    const form = e.target

    const data = {
      name:          form.name.value,
      description:   form.description.value,
      category:      form.category.value,
      price:         parseFloat(form.price.value),
      pickupAddress: form.pickupAddress.value,
    }

    const image = form.image.files[0]

    try {
      setLoading(true)
      const res = await itemsApi.createItem(data)
      const itemId = res.data.id

      if (image) {
        await itemsApi.uploadImage(itemId, image)
      }

      toast.success('Item listed successfully!')
      form.reset()
      setImagePreview(null)
    } catch (err) {
      console.error(err)
      toast.error('Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .add-form-root { font-family: 'DM Sans', sans-serif; }
        .add-form-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #f0ede8;
          padding: 36px;
          max-width: 600px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }
        .add-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }
        .add-form-sub {
          font-size: 0.85rem;
          color: #9ca3af;
          margin-bottom: 28px;
          letter-spacing: 0.01em;
        }
        .form-group { margin-bottom: 18px; }
        .form-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .form-input {
          width: 100%;
          border: 1.5px solid #e5e0d8;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #111;
          outline: none;
          transition: border-color 0.2s;
          background: #faf9f6;
          box-sizing: border-box;
        }
        .form-input:focus { border-color: #e85d26; background: white; }
        .form-input::placeholder { color: #b0a99f; }
        textarea.form-input { resize: vertical; min-height: 90px; }
        select.form-input { cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .image-upload-area {
          border: 2px dashed #e5e0d8;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #faf9f6;
          position: relative;
        }
        .image-upload-area:hover { border-color: #e85d26; background: #fff8f5; }
        .image-upload-area input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .image-preview {
          width: 100%;
          max-height: 180px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 8px;
        }
        .submit-btn {
          width: 100%;
          background: #111;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) { background: #e85d26; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .required { color: #e85d26; margin-left: 2px; }
      `}</style>

      <div className="add-form-root">
        <div className="add-form-card">
          <div className="add-form-title">List a New Item</div>
          <div className="add-form-sub">Fill in the details below to list your item for rent.</div>

          <form onSubmit={submit}>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Item Name <span className="required">*</span></label>
              <input name="name" placeholder="e.g. Canon DSLR Camera" required className="form-input" />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description <span className="required">*</span></label>
              <textarea name="description" placeholder="Describe your item, condition, what's included..." required className="form-input" />
            </div>

            {/* Category + Price in a row */}
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category <span className="required">*</span></label>
                <select name="category" required className="form-input" defaultValue="">
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Price / Day (₹) <span className="required">*</span></label>
                <input
                  name="price"
                  type="number"
                  min="1"
                  placeholder="e.g. 250"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Pickup Address */}
            <div className="form-group" style={{ marginTop: 18 }}>
              <label className="form-label">Pickup Address <span className="required">*</span></label>
              <input name="pickupAddress" placeholder="e.g. Sector 18, Noida, UP" required className="form-input" />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Item Photo</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" className="image-preview" />
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Click to change photo</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>📷</div>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Click to upload photo</p>
                    <p style={{ fontSize: '0.75rem', color: '#b0a99f', marginTop: 4 }}>PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Listing item...' : 'List Item for Rent'}
            </button>

          </form>
        </div>
      </div>
    </>
  )
}
