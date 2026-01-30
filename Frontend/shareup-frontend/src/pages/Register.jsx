import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import authApi from '../api/auth.api'
import schema from '../validations/register.schema'

export default function Register() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async data => {
    try {
      await authApi.register(data)
      toast.success('Registration successful. Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-3">

        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <input {...register('name')} placeholder="Full Name" className="border p-2 w-full rounded" />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>

        <input {...register('email')} placeholder="Email" className="border p-2 w-full rounded" />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <input {...register('password')} type="password" placeholder="Password" className="border p-2 w-full rounded" />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>

        <input {...register('phone')} placeholder="Phone number" className="border p-2 w-full rounded" />

        {/* <input {...register('pickupAddress')} placeholder="Pickup Address (for owners)" className="border p-2 w-full rounded" /> */}

        <select {...register('role')} className="border p-2 w-full rounded">
          <option value="BORROWER">Borrower</option>
          <option value="OWNER">Owner</option>
        </select>

        <button type="submit" className="bg-black text-white w-full py-2 rounded hover:bg-gray-800">
          Register
        </button>
      </form>
    </div>
  )
}
