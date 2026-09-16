'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  totalPosts: number;
  published: number;
  drafts: number;
  scheduled: number;
  categories: number;
  deities: number;
}

interface RecentPost {
  id: string;
  title: string;
  contentType: string;
  status: string;
  createdAt: string;
  category?: { name: string };
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  SCHEDULED: 'bg-blue-100 text-blue-700',
};

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.ok ? r.json() : null),
      fetch('/api/admin/posts?limit=5').then(r => r.ok ? r.json() : { posts: [] }),
    ]).then(([statsData, postsData]) => {
      if (statsData) setStats(statsData);
      setRecentPosts(postsData.posts || []);
    }).finally(() => setIsLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Posts', value: stats?.totalPosts ?? '—', icon: '📄', color: 'bg-purple-50 text-purple-600' },
    { label: 'Published', value: stats?.published ?? '—', icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'Drafts', value: stats?.drafts ?? '—', icon: '📝', color: 'bg-gray-50 text-gray-600' },
    { label: 'Scheduled', value: stats?.scheduled ?? '—', icon: '🕐', color: 'bg-blue-50 text-blue-600' },
    { label: 'Categories', value: stats?.categories ?? '—', icon: '🏷️', color: 'bg-amber-50 text-amber-600' },
    { label: 'Deities', value: stats?.deities ?? '—', icon: '🙏', color: 'bg-orange-50 text-orange-600' },
  ];

  const quickActions = [
    { label: '+ Add Bhajan', href: '/admin/posts/new?type=BHAJAN', color: 'bg-saffron-500 hover:bg-saffron-600' },
    { label: '+ Add Article', href: '/admin/posts/new?type=ARTICLE', color: 'bg-maroon-600 hover:bg-maroon-700' },
    { label: '+ Add Aarti', href: '/admin/posts/new?type=AARTI', color: 'bg-deepOrange-600 hover:bg-deepOrange-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <div className="w-8 h-7 bg-gray-200 rounded animate-pulse" />
              ) : card.value}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map(action => (
          <Link
            key={action.label}
            href={action.href}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${action.color}`}
          >
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm text-saffron-600 hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))
          ) : recentPosts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No posts yet. <Link href="/admin/posts/new" className="text-saffron-600 hover:underline">Create your first post →</Link>
            </div>
          ) : (
            recentPosts.map(post => (
              <div key={post.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {post.contentType} · {post.category?.name || 'Uncategorized'} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[post.status] || 'bg-gray-100 text-gray-600'}`}>
                    {post.status}
                  </span>
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-saffron-600 hover:underline">
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
