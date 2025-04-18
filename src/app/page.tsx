import Jobs from "@/components/jobs";

export default function Home() {
 
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Listings</h1>
        <p className="text-gray-600">Browse our current career opportunities</p>
      </div>
      <div className="space-y-6">
        <Jobs />
      </div>
    </div>
  </div>
  )
}
