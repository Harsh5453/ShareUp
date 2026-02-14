import { Link } from 'react-router-dom'

export default function ItemCard({ item }) {

  const imageUrl = item.imageUrl || '/placeholder.png'

  return (
    <div className="group bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden border">
      <div className="relative">
        <img
          src={imageUrl}
          alt={item.name}
          onError={e => (e.currentTarget.src = '/placeholder.png')}
          className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          ₹{item.price}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {item.description}
        </p>

        <Link
          to={`/item/${item.id || item._id}`}
          className="inline-block mt-2 text-sm text-indigo-600 font-semibold hover:underline"
        >
          View details →
        </Link>
      </div>
    </div>
  )
}
