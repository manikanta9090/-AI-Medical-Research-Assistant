export default function ResearchCard({ data }) {
  return (
    <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
      <h3 className="font-semibold">{data.title}</h3>
      <p className="text-sm text-gray-400">{data.year}</p>
      <p className="text-sm mt-1">{data.summary}</p>
      <button className="text-blue-400 text-sm mt-2">
        View Source →
      </button>
    </div>
  );
}