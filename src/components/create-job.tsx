"use client"

import { useEffect, useRef, useState } from "react"
import { signOut } from "next-auth/react"

type Job = {
  id: number
  title: string
  company: string
  location: string
  type: string
  description: string
}

export default function CreateJob() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement | null>(null)
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    description: "",
  })

  const fetchJobs = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/jobs?page=${page}&limit=5`)
      const data = await res.json()

      if (data.length === 0) {
        setHasMore(false)
      } else {
        setJobs((prev) => {
          const existingIds = new Set(prev.map(job => job.id))
          const newJobs = data.filter((job: Job) => !existingIds.has(job.id))
          return [...prev, ...newJobs]
        })
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addJob = async () => {
    await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    })
    setForm({
      title: "",
      company: "",
      location: "",
      type: "",
      description: "",
    })
    setJobs([])
    setPage(1)
    setHasMore(true)
    fetchJobs()
  }

  const deleteJob = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this job?")
    if (!confirmed) return

    const res = await fetch("/api/jobs", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      setJobs(prev => prev.filter(job => job.id !== id))
    } else {
      alert("Failed to delete job")
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        fetchJobs()
      }
    })

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [hasMore, isLoading])

  const handleSignout = async () => {
    await signOut()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleSignout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
          >
            Sign out
          </button>
        </div>

        <div className="space-y-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ))}
        </div>

        <button
          onClick={addJob}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg font-medium"
        >
          Add Job
        </button>

        <div className="pt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Jobs</h2>
          <div className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <span className="text-gray-700 font-medium">{job.title}</span>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}

            <div ref={observerRef} className="text-center py-4">
              {hasMore ? (
                <span className="text-gray-500">Loading more jobs...</span>
              ) : (
                <span className="text-gray-400">No more jobs available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}