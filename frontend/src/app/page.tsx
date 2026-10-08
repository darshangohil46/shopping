import { Metadata } from 'next';
import { DashboardView } from '../components/dashboard/DashboardView';

export const metadata: Metadata = {
  title: 'Home - Online Shopping Cart',
  description: 'Your account overview and shopping home page.',
};

export default function HomePage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <DashboardView />
    </div>
  );
}
