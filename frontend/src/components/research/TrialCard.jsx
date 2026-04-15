export default function TrialCard({ data }) {
  return (
    <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
      <h3 className="font-semibold">{data.title}</h3>
      <p className="text-sm text-yellow-400">{data.status}</p>
      <p className="text-sm text-gray-400">{data.location}</p>
    </div>
  );
}