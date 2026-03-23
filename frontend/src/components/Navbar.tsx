"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass"
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold">M</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Monetize <span className="text-primary tracking-normal">Connect</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="/discovery" className="hover:text-primary transition-colors">Influencers</Link>
        <Link href="/campaigns" className="hover:text-primary transition-colors">Campaigns</Link>
        {user?.role === 'INFLUENCER' && <Link href="/influencer" className="hover:text-primary transition-colors font-bold text-primary">Influencer Profile</Link>}
        {user?.role === 'BUSINESS' && <Link href="/business" className="hover:text-primary transition-colors font-bold text-primary">Business Profile</Link>}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium hidden md:block">Hi, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
