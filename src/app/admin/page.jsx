import { redirect } from 'next/navigation';
import { verifySuperAdmin } from '@/lib/auth';

export default async function AdminRootPage() {
  const admin = await verifySuperAdmin();
  if (admin) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}
