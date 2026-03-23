"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            The #1 Marketplace for Influencers & Brands
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Monetize Your Influence. <br />
            <span className="text-gradient">Connect With Brands.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
            The most powerful platform to find campaigns, negotiate deals, and get paid securely. Built for the next generation of creators.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup?role=INFLUENCER"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30"
            >
              Join as Influencer
            </Link>
            <Link 
              href="/signup?role=BUSINESS"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-foreground border border-zinc-200 font-bold text-lg hover:bg-zinc-50 transition-all dark:bg-zinc-900 dark:border-white/10 dark:hover:bg-zinc-800"
            >
              Hire Influencers
            </Link>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-zinc-100 dark:border-white/5 pt-12"
        >
          <div>
            <div className="text-3xl font-bold">10k+</div>
            <div className="text-sm text-zinc-500 mt-1">Creators</div>
          </div>
          <div>
            <div className="text-3xl font-bold">500+</div>
            <div className="text-sm text-zinc-500 mt-1">Brands</div>
          </div>
          <div>
            <div className="text-3xl font-bold">$2M+</div>
            <div className="text-sm text-zinc-500 mt-1">Payouts</div>
          </div>
          <div>
            <div className="text-3xl font-bold">4.9/5</div>
            <div className="text-sm text-zinc-500 mt-1">Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
