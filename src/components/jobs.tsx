'use client'

import { useEffect, useRef, useState } from "react"

type Job = {
  id: number
  title: string
  company: string
  location: string
  type: string
  description: string
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <>
      {jobs.map(job => (
        <div
          key={job.id}
          className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">{job.company}</span> – {job.location}
              </p>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {job.type}
              </span>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{job.description}</p>
        </div>
      ))}

      <div ref={observerRef} className="text-center py-6">
        {hasMore ? (
          <span className="text-gray-500">Loading more jobs...</span>
        ) : (
          <span className="text-gray-400">No more jobs available</span>
        )}
      </div>
    </>
  )
}