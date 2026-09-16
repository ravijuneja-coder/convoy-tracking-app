import { notFound } from 'next/navigation';
import { getAuthenticatedSession } from '@/lib/auth';
import PostForm from '@/components/admin/PostForm';

interface Props {
  params: { id: string };
}

async function getPost(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/admin/posts/${id}`, {
      cache: 'no-store',
      headers: { Cookie: '' }, // server-side fetch — session handled via auth
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.id);
  return { title: post ? `Edit: ${post.title} — Admin` : 'Edit Post — Admin' };
}

export default async function EditPostPage({ params }: Props) {
  const [post, session] = await Promise.all([getPost(params.id), getAuthenticatedSession()]);
  if (!post) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        <p className="text-gray-500 text-sm mt-1 truncate">{post.title}</p>
      </div>
      <PostForm
        initialData={{
          id: post.id,
          title: post.title || '',
          slug: post.slug || '',
          contentType: post.contentType || 'BHAJAN',
          categoryId: post.categoryId || '',
          deityId: post.deityId || '',
          shortDescription: post.shortDescription || '',
          featuredImage: post.featuredImage || '',
          lyrics: post.lyrics || '',
          content: post.content || '',
          videoType: post.videoType || 'NONE',
          videoUrl: post.videoUrl || '',
          embedCode: post.embedCode || '',
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || '',
          seoKeywords: post.seoKeywords || '',
          ogImage: post.ogImage || '',
          status: post.status || 'DRAFT',
          publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
        }}
        authorEmail={session?.email}
      />
    </div>
  );
}
