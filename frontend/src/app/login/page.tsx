import { Metadata } from 'next';
import { LoginForm } from '../../components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Online Cart',
  description: 'Sign in to access your online cart and order history.',
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
