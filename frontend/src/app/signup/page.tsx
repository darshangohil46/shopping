import { Metadata } from 'next';
import { SignupForm } from '../../components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up - Online Cart',
  description: 'Register for a new account on Online Cart.',
};

export default function SignupPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}
