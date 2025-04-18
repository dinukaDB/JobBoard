import { verifySession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "5")

  const jobs = await prisma.job.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { id: "desc" },
    distinct: ['id']
  })

  return NextResponse.json(jobs)
}


export async function POST(req: Request) {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const job = await prisma.job.create({ data })
  return NextResponse.json(job)
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()

  try {
    await prisma.job.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}