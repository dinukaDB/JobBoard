import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { verifySession } from "@/lib/auth"

export async function GET() {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admins = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  })
  return NextResponse.json(admins)
}

export async function POST(req: Request) {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { email, password, name } = await req.json()
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }

  const hashed = await hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  })

  return NextResponse.json({ id: user.id, email: user.email, name: user.name })
}

export async function PUT(req: Request) {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, password, name } = await req.json()
  const updateData: {
    password?: string;
    name?: string;
  } = {}
  if (password) updateData.password = await hash(password, 10)
  if (name) updateData.name = name

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json({ message: "Admin updated", updated })
}

export async function DELETE(req: Request) {
  const session = await verifySession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ message: "Admin deleted", id })
}
