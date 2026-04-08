import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import authApi from '../api/auth.api'
import schema from '../validations/register.schema'
import { useState } from 'react'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async data => {
    setLoading(true)
    try {
      await authApi.register(data)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        .rp{font-family:'DM Sans',sans-serif;min-height:100vh;background:#faf9f6;display:flex;align-items:center;justify-content:center;padding:20px}
        .rc{background:white;border-radius:20px;border:1px solid #f0ede8;padding:36px 32px;width:100%;max-width:460px;box-shadow:0 4px 24px rgba(0,0,0,0.07)}
        .rl{display:flex;align-items:center;gap:8px;margin-bottom:28px}
        .rli{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#e85d26,#f59e0b);display:flex;align-items:center;justify-content:center}
        .rlt{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:#111;letter-spacing:-0.5px}
        .rt{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:#111;margin-bottom:4px;letter-spacing:-0.3px}
        .rs{font-size:0.85rem;color:#9ca3af;margin-bottom:24px}
        .rf{margin-bottom:14px}
        .rf label{display:block;font-size:0.78rem;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px}
        .rf input,.rf select,.rf textarea{width:100%;border:1.5px solid #e5e0d8;border-radius:10px;padding:11px 14px;font-size:0.9rem;font-family:'DM Sans',sans-serif;color:#111;outline:none;transition:border-color 0.2s;background:#faf9f6}
        .rf input:focus,.rf select:focus,.rf textarea:focus{border-color:#e85d26;background:white}
        .rf input::placeholder,.rf textarea::placeholder{color:#b0a99f}
        .rf textarea{resize:none;height:72px;line-height:1.5}
        .rf select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}
        .re{font-size:0.75rem;color:#dc2626;margin-top:4px}
        .rrow{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .rsb{width:100%;background:#111;color:white;border:none;padding:13px;border-radius:10px;font-size:0.9rem;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;margin-top:6px}
        .rsb:hover:not(:disabled){background:#e85d26}
        .rsb:disabled{opacity:0.6;cursor:not-allowed}
        .rfoot{text-align:center;margin-top:20px;font-size:0.85rem;color:#9ca3af}
        .rlink{color:#e85d26;font-weight:600;text-decoration:none}
        .rlink:hover{text-decoration:underline}
        .rdiv{height:1px;background:#f0ede8;margin:20px 0}
        .field-hint{font-size:0.72rem;color:#9ca3af;margin-top:3px}
        @media(max-width:400px){.rrow{grid-template-columns:1fr}}
      `}</style>

      <div className="rp">
        <div className="rc">
          {/* Logo */}
          <div className="rl">
            <div className="rli">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5L3 12.5M3 12.5L7 8.5M3 12.5H21M17 7.5L21 11.5M21 11.5L17 15.5"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="rlt">Share<span style={{color:'#e85d26'}}>Up</span></span>
          </div>

          <div className="rt">Create account</div>
          <div className="rs">Join ShareUp and start renting today</div>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Name + Phone */}
            <div className="rrow">
              <div className="rf">
                <label>Full Name *</label>
                <input {...register('name')} placeholder="Harsh Aggarwal" />
                {errors.name && <div className="re">{errors.name.message}</div>}
              </div>
              <div className="rf">
                <label>Phone</label>
                <input {...register('phone')} placeholder="+91 9876543210" />
              </div>
            </div>

            {/* Email */}
            <div className="rf">
              <label>Email *</label>
              <input {...register('email')} placeholder="you@example.com" type="email" />
              {errors.email && <div className="re">{errors.email.message}</div>}
            </div>

            {/* Password */}
            <div className="rf">
              <label>Password *</label>
              <input {...register('password')} placeholder="Min 6 characters" type="password" />
              {errors.password && <div className="re">{errors.password.message}</div>}
            </div>

            {/*  Address  */}
            <div className="rf">
              <label>Address</label>
              <textarea
                {...register('address')}
                placeholder="e.g. Sector 18, Noida, Uttar Pradesh — 201301"
              />
              <div className="field-hint">Shown to owners when your rental is approved</div>
            </div>

            {/* Role */}
            <div className="rf">
              <label>I want to</label>
              <select {...register('role')} defaultValue="BORROWER">
                <option value="BORROWER"> Borrower — rent items from others</option>
                <option value="OWNER"> Owner — list my items for rent</option>
              </select>
              {errors.role && <div className="re">{errors.role.message}</div>}
            </div>

            <button type="submit" className="rsb" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>

          </form>

          <div className="rdiv" />
          <div className="rfoot">
            Already have an account?{' '}
            <Link to="/login" className="rlink">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  )
}
