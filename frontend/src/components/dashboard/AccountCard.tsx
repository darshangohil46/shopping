'use client';

import React from 'react';
import { User as UserIcon, Mail, Calendar, Clock, LogOut } from 'lucide-react';
import { User } from '../../types/auth.types';
import { formatDateTime } from '../../utils/general';
import { Button } from '../ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/Card';

interface AccountCardProps {
  user: User;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function AccountCard({
  user,
  onLogout,
  isLoggingOut,
}: AccountCardProps) {
  return (
    <Card className="border-stone-200/90 shadow-xs">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <UserIcon className="w-4 h-4" />
            </div>
            <CardTitle>Account Details</CardTitle>
          </div>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-sm">
            Account
          </span>
        </div>
        <CardDescription>
          Welcome back, <strong className="text-stone-900">{user.name}</strong>. Here are your account credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Full Name */}
          <div className="p-3 bg-stone-50/80 border border-stone-200/80 rounded-sm flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <UserIcon className="w-3 h-3 text-stone-400" />
              Full Name
            </span>
            <span className="font-semibold text-stone-900">{user.name}</span>
          </div>

          {/* Email */}
          <div className="p-3 bg-stone-50/80 border border-stone-200/80 rounded-sm flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Mail className="w-3 h-3 text-stone-400" />
              Registered Email
            </span>
            <span className="font-mono text-stone-900 truncate">{user.email}</span>
          </div>

          {/* Created At */}
          <div className="p-3 bg-stone-50/80 border border-stone-200/80 rounded-sm flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Calendar className="w-3 h-3 text-stone-400" />
              Joined On
            </span>
            <span className="text-stone-700 font-mono">
              {formatDateTime(user.createdAt)}
            </span>
          </div>

          {/* Updated At */}
          <div className="p-3 bg-stone-50/80 border border-stone-200/80 rounded-sm flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Clock className="w-3 h-3 text-stone-400" />
              Last Updated
            </span>
            <span className="text-stone-700 font-mono">
              {formatDateTime(user.updatedAt)}
            </span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-end">
          <Button
            variant="secondary"
            onClick={onLogout}
            isLoading={isLoggingOut}
            className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
