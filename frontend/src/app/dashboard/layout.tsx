"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    } else {
      setIsReady(true);
    }
  }, [user, token, router]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <DashboardSidebar />
      <main className="ml-64 flex-1 p-10 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={user?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
