"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold">M</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Monetize <span className="text-primary tracking-normal">Connect</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="/discovery" className="hover:text-primary transition-colors">Influencers</Link>
        <Link href="/campaigns" className="hover:text-primary transition-colors">Campaigns</Link>
        <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
          Login
        </Link>
        <Link href="/signup" className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
