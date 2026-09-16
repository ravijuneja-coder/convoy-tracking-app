import DashboardStats from '@/components/admin/DashboardStats';

export const metadata = { title: 'Dashboard — Admin' };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back to Akhand Bhakti Sagar admin</p>
      </div>
      <DashboardStats />
    </div>
  );
}
