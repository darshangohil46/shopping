'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Clock,
  LogOut,
} from 'lucide-react';
import { authService } from '../../services/auth.service';
import { User } from '../../types/auth.types';
import { formatDateTime } from '../../utils/general';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/Card';

export function DashboardView() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const response = await authService.getProfile();
        if (isMounted) {
          setUser(response.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          router.push('/login');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      toast('Logged out successfully', 'info');
      router.push('/login');
      router.refresh();
    } catch {
      toast('Error logging out', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-lg">
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-neutral-500">
          <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full" />
          <p className="text-xs">Loading user details...</p>
        </div>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-lg flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-black" />
              <CardTitle>User Details</CardTitle>
            </div>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-sm">
              Account
            </span>
          </div>
          <CardDescription>
            Welcome, <strong className="text-black">{user.name}</strong>. Here
            are your registered account details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y divide-neutral-200 text-xs">
            {/* Full Name */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
                Name
              </span>
              <span className="font-semibold text-black">{user.name}</span>
            </div>

            {/* Email */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                Email
              </span>
              <span className="font-mono text-black">{user.email}</span>
            </div>

            {/* Created At */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                Created At
              </span>
              <span className="text-neutral-800">
                {formatDateTime(user.createdAt)}
              </span>
            </div>

            {/* Updated At */}
            <div className="py-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                Updated At
              </span>
              <span className="text-neutral-800">
                {formatDateTime(user.updatedAt)}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-neutral-200 flex items-center justify-end">
            <Button
              variant="secondary"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              className="flex items-center gap-1.5 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
