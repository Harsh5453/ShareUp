import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import schema from '../validations/login.schema'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    try {
      const role = await login(data)
      toast.success('Logged in successfully')

      if (role === 'OWNER') navigate('/owner')
      else navigate('/borrower')
    } catch {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          {...register('email')}
          placeholder="Email"
          className="border p-2 w-full rounded"
        />

        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded"
        />

        <button className="bg-black text-white w-full py-2 rounded hover:bg-gray-800">
          Login
        </button>
      </form>
    </div>
  )
}
