import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import PostCard from '@/components/public/PostCard'
import Pagination from '@/components/public/Pagination'
import SearchBar from '@/components/public/SearchBar'

interface SearchPageProps {
  searchParams: { q?: string; page?: string }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const q = searchParams.q || ''
  return {
    title: q ? `"${q}" की खोज — अखंड भक्ति सागर` : 'खोज — अखंड भक्ति सागर',
    description: q ? `"${q}" के लिए खोज परिणाम` : 'भजन, आरती, चालीसा, मंत्र खोजें',
    robots: { index: false },
  }
}

async function getSearchResults(q: string, page: number) {
  if (!q.trim()) return { posts: [], total: 0, totalPages: 0 }
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(
      `${base}/api/search?q=${encodeURIComponent(q)}&page=${page}&limit=12`,
      { cache: 'no-store' }
    )
    if (!res.ok) return { posts: [], total: 0, totalPages: 0 }
    return res.json()
  } catch {
    return { posts: [], total: 0, totalPages: 0 }
  }
}

async function SearchResults({ q, page }: { q: string; page: number }) {
  const { posts, total, totalPages } = await getSearchResults(q, page)

  if (!q.trim()) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-500 text-lg">खोजने के लिए कुछ टाइप करें</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🕉️</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          &ldquo;{q}&rdquo; के लिए कोई परिणाम नहीं मिला
        </h2>
        <p className="text-gray-500 mb-6">दूसरे शब्दों से खोजने का प्रयास करें</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['हनुमान चालीसा', 'गणेश आरती', 'शिव भजन', 'राम स्तोत्र'].map((s) => (
            <Link
              key={s}
              href={`/search?q=${encodeURIComponent(s)}`}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <p className="text-gray-600 mb-6">
        <span className="font-semibold text-gray-800">{total}</span> परिणाम मिले &ldquo;
        <span className="text-orange-600">{q}</span>&rdquo; के लिए
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/search?q=${encodeURIComponent(q)}&page`}
        />
      )}
    </>
  )
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q || ''
  const page = Math.max(1, parseInt(searchParams.page || '1'))

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B1B1B] to-[#E85D04] text-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">खोजें</h1>
          <SearchBar initialValue={q} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Suspense fallback={
          <div className="text-center py-16">
            <div className="animate-spin text-4xl">🔄</div>
            <p className="mt-4 text-gray-500">खोजा जा रहा है...</p>
          </div>
        }>
          <SearchResults q={q} page={page} />
        </Suspense>
      </div>
    </div>
  )
}
