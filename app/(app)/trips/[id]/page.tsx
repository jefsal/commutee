import Link from "next/link";

export default function TripDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Link href="/home" className="text-sm text-slate-600 hover:text-slate-800">← Home</Link>
      <h1 className="text-xl font-semibold mt-4">Trip {params.id}</h1>
      <p className="text-slate-500 mt-2">Trip detail (coming soon).</p>
    </div>
  );
}
