export default function Empty({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <img src="/empty.png" className="w-40 mb-4" />
      <p className="text-lg">{text}</p>
    </div>
  )
}
