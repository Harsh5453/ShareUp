export default function Skeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-56 bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  )
}
