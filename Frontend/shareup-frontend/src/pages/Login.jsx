import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import schema from '../validations/login.schema'
import useAuth from '../hooks/useAuth'
import { useState } from 'react'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async data => {
    setLoading(true)
    try {
      const role = await login(data)
      toast.success('Welcome back!')
      navigate(role === 'OWNER' ? '/owner' : '/borrower')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        .ap{font-family:'DM Sans',sans-serif;min-height:100vh;background:#faf9f6;display:flex;align-items:center;justify-content:center;padding:20px}
        .ac{background:white;border-radius:20px;border:1px solid #f0ede8;padding:36px 32px;width:100%;max-width:420px;box-shadow:0 4px 24px rgba(0,0,0,0.07)}
        .al{display:flex;align-items:center;gap:8px;margin-bottom:28px}
        .ali{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#e85d26,#f59e0b);display:flex;align-items:center;justify-content:center}
        .alt{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:#111;letter-spacing:-0.5px}
        .at{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:#111;margin-bottom:4px;letter-spacing:-0.3px}
        .as{font-size:0.85rem;color:#9ca3af;margin-bottom:28px}
        .fl{margin-bottom:16px}
        .fl label{display:block;font-size:0.78rem;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px}
        .fl input{width:100%;border:1.5px solid #e5e0d8;border-radius:10px;padding:11px 14px;font-size:0.9rem;font-family:'DM Sans',sans-serif;color:#111;outline:none;transition:border-color 0.2s;background:#faf9f6}
        .fl input:focus{border-color:#e85d26;background:white}
        .fl input::placeholder{color:#b0a99f}
        .fe{font-size:0.75rem;color:#dc2626;margin-top:4px}
        .sb{width:100%;background:#111;color:white;border:none;padding:13px;border-radius:10px;font-size:0.9rem;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;margin-top:4px}
        .sb:hover:not(:disabled){background:#e85d26}
        .sb:disabled{opacity:0.6;cursor:not-allowed}
        .af{text-align:center;margin-top:20px;font-size:0.85rem;color:#9ca3af}
        .alink{color:#e85d26;font-weight:600;text-decoration:none}
        .alink:hover{text-decoration:underline}
        .adiv{height:1px;background:#f0ede8;margin:24px 0}
      `}</style>
      <div className="ap">
        <div className="ac">
          <div className="al">
            <div className="ali">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5L3 12.5M3 12.5L7 8.5M3 12.5H21M17 7.5L21 11.5M21 11.5L17 15.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="alt">Share<span style={{color:'#e85d26'}}>Up</span></span>
          </div>
          <div className="at">Welcome back</div>
          <div className="as">Sign in to your ShareUp account</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="fl">
              <label>Email</label>
              <input {...register('email')} placeholder="you@example.com" type="email" />
              {errors.email && <div className="fe">{errors.email.message}</div>}
            </div>
            <div className="fl">
              <label>Password</label>
              <input {...register('password')} placeholder="••••••••" type="password" />
              {errors.password && <div className="fe">{errors.password.message}</div>}
            </div>
            <button type="submit" className="sb" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <div className="adiv" />
          <div className="af">
            Don't have an account?{' '}
            <Link to="/register" className="alink">Create one</Link>
          </div>
        </div>
      </div>
    </>
  )
}
