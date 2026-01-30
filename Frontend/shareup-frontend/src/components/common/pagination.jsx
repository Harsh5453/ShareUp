export default function Pagination({ page, max, setPage }) {
return (
<div className="flex gap-2 justify-center mt-6">
{[...Array(max)].map((_, i) => (
<button
key={i}
onClick={() => setPage(i + 1)}
className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
>
{i + 1}
</button>
))}
</div>
);
}