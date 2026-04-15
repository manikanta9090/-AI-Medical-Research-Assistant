export default function ResearchPanel({ data }) {
  return (
    <div className="p-4 space-y-3 h-full overflow-y-auto">

      <h2 className="text-lg font-semibold mb-3">Research</h2>

      {data.length === 0 ? (
        <p className="text-gray-400">No research data yet</p>
      ) : (
        data.map((item, index) => (
          <div key={index} className="p-3 bg-gray-800 rounded-lg">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.year}</p>
            <p className="text-sm">{item.summary}</p>
          </div>
        ))
      )}

    </div>
  );
}