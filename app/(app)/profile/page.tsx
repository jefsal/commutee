import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Link href="/home" className="text-sm text-slate-600 hover:text-slate-800">← Home</Link>
      <h1 className="text-xl font-semibold mt-4">Profile</h1>
      <p className="text-slate-500 mt-2">Edit name & phone (coming soon).</p>
    </div>
  );
}
