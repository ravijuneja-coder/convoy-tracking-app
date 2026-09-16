import { redirect } from 'next/navigation';
import { getAuthenticatedSession } from '@/lib/auth';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = { title: 'Admin — Akhand Bhakti Sagar' };

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthenticatedSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout userEmail={session.email}>
      {children}
    </AdminLayout>
  );
}
