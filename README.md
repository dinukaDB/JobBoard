# 🧑‍💼 Job Board

A full-stack Job Listing application built with **Next.js 13 App Router**, **TailwindCSS**, **PostgreSQL**, and **NextAuth** for authentication. Features include job posting, admin dashboard, and infinite scroll for public job listings.

---

## 🚀 Features

- ✅ Public job listing page
- ♾️ Infinite scrolling with `IntersectionObserver`
- 🔐 Admin dashboard (protected route)
- ➕ Create and delete job postings
- 🔑 Admin authentication via NextAuth
- 💅 Fully styled with TailwindCSS
- 🗃️ PostgreSQL database (via Prisma)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 13 (App Router), TailwindCSS
- **Backend**: API Routes (REST)
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: NextAuth.js
- **Deployment**: Vercel / Github

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/dinukaDB/JobBoard.git
cd JobBoard
```
### 2. Install dependancies

```bash
npm install
```
### 3. Configure environment variables
Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/jobboard
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```
### 4. Setup the database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the dev server
```bash
npm run dev
```
## 🔐 Admin Access
Go to
`/admin`
- Only logged-in users with admin privileges can access this page.
- **email = admin@gmail.com , password = admin**

## Pages
- `/signin` - Signin Page
- `/` - Public Job listing page
- `/admin` - Admin page

## ✨ Upcoming Features
- 🔍 Search and filters
- 📬 Email notifications for job applicants
- 🌐 Multilingual support
- ✅ Admin roles and permissions