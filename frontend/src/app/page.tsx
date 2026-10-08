import { Metadata } from 'next';
import { DashboardView } from '../components/dashboard/DashboardView';

export const metadata: Metadata = {
  title: 'Home - Online Shopping Cart',
  description: 'Your account overview and shopping home page.',
};

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full py-6 px-4 flex justify-center">
      <DashboardView />
    </main>
  );
}
