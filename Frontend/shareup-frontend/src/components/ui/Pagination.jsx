export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center gap-2 mt-8">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`px-3 py-1 rounded border ${
            page === i + 1
              ? 'bg-black text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}
