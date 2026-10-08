'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      toast(response.message || 'Login successful', 'success');
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid credentials';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <LogIn className="w-4 h-4 text-black" />
          <CardTitle>Sign In</CardTitle>
        </div>
        <CardDescription>
          Enter your email and password to access your cart and account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="priya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="mt-2">
            <span>Login</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>

          <div className="text-center pt-2 border-t border-neutral-100">
            <p className="text-xs text-neutral-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-black font-semibold underline underline-offset-2 hover:opacity-80"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
