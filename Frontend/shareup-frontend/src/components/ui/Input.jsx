export default function Button({
  children,
  variant = 'primary',
  loading = false,
  ...props
}) {
  const styles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-100 text-gray-700'
  }

  return (
    <button
      {...props}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-semibold transition shadow-sm disabled:opacity-60 ${styles[variant]}`}
    >
      {loading ? 'Processing...' : children}
    </button>
  )
}
