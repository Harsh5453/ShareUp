const styles = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  APPROVED: 'bg-green-100 text-green-700 border-green-300',
  REJECTED: 'bg-red-100 text-red-700 border-red-300',
  RETURN_REQUESTED: 'bg-blue-100 text-blue-700 border-blue-300',
  RETURN_APPROVED: 'bg-purple-100 text-purple-700 border-purple-300'
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status.replace('_', ' ')}
    </span>
  )
}
