"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Settings,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const navItems = user?.role === 'BUSINESS' ? [
    { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'My Campaigns', href: '/dashboard/campaigns', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Discovery', href: '/discovery', icon: <Users className="w-5 h-5" /> },
    { name: 'Conversations', href: '/dashboard/chat', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Payments', href: '/dashboard/payments', icon: <CreditCard className="w-5 h-5" /> },
  ] : [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Find Gigs', href: '/campaigns', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Earnings', href: '/dashboard/earnings', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Messages', href: '/dashboard/chat', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-zinc-100 dark:bg-zinc-950 dark:border-white/5 flex flex-col pt-24 pb-10 px-6 z-40">
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-foreground'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-2 pt-10 border-t border-zinc-100 dark:border-white/5">
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-medium"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </Link>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
