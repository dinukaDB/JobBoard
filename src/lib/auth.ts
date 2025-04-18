import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { prisma } from "./prisma"
import { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import 'server-only'
import { cookies } from 'next/headers'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        })

        if (user && credentials?.password) {
          const isValid = await compare(credentials.password, user.password)
          if (isValid) {
            return { id: user.id.toString(), email: user.email }
          }
        }

        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}


export async function verifySession() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return null
  }

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  return admin ? session : null
}
 
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}