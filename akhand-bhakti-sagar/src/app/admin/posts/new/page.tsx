import { getAuthenticatedSession } from '@/lib/auth';
import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'New Post — Admin' };

export default async function NewPostPage() {
  const session = await getAuthenticatedSession();
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Post</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new devotional post</p>
      </div>
      <PostForm authorEmail={session?.email} />
    </div>
  );
}
