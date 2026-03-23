"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import StatCard from '@/components/dashboard/StatCard';
import { 
  Users, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Zap, 
  Play, 
  Clock,
  Plus
} from 'lucide-react';
import Link from 'next/link';

const DashboardPage = () => {
  const { user } = useAuth();
  
  if (user?.role === 'BUSINESS') {
    return (
      <div className="space-y-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Hello, {user.name} 👋</h1>
            <p className="text-zinc-500">Welcome to your business command center.</p>
          </div>
          <Link 
            href="/dashboard/campaigns/create" 
            className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard 
            label="Total Reach" 
            value="1.2M" 
            icon={<TrendingUp className="w-6 h-6" />} 
            trend={{ value: 12, isUp: true }}
          />
          <StatCard 
            label="Active Campaigns" 
            value="3" 
            icon={<Zap className="w-6 h-6" />} 
          />
          <StatCard 
            label="Escrow Balance" 
            value="₹45,000" 
            icon={<CreditCard className="w-6 h-6" />} 
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8">Ongoing Initiatives</h2>
          <div className="overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-white/5">
                  <th className="p-6 text-sm font-bold text-zinc-500">CAMPAIGN</th>
                  <th className="p-6 text-sm font-bold text-zinc-500">BUDGET</th>
                  <th className="p-6 text-sm font-bold text-zinc-500">INFLUENCERS</th>
                  <th className="p-6 text-sm font-bold text-zinc-500">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                {[
                  { name: "Summer Blast 2024", budget: "₹50,000", leads: 12, status: "Active" },
                  { name: "Tech Reveal Vlog", budget: "₹15,000", leads: 5, status: "Negotiation" },
                  { name: "Winter Cozy Ads", budget: "₹25,000", leads: 0, status: "Paused" }
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer">
                    <td className="p-6 font-bold">{item.name}</td>
                    <td className="p-6 text-zinc-500">{item.budget}</td>
                    <td className="p-6">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200" />
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                          +{item.leads}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        item.status === 'Active' ? 'bg-green-50 text-green-600' : 
                        item.status === 'Negotiation' ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // INFLUENCER VIEW
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome Back, {user?.name} 🚀</h1>
          <p className="text-zinc-500">Check your latest earnings and find new opportunities.</p>
        </div>
        <Link 
            href="/discovery" 
            className="flex items-center gap-2 px-6 py-3.5 bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
          >
            Find New Gigs
          </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Total Earnings" 
          value="₹82,400" 
          icon={<CreditCard className="w-6 h-6" />} 
          trend={{ value: 24, isUp: true }}
        />
        <StatCard 
          label="Pending Payouts" 
          value="₹12,000" 
          icon={<Clock className="w-6 h-6" />} 
        />
        <StatCard 
          label="Active Deals" 
          value="2" 
          icon={<Play className="w-6 h-6" />} 
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8">Active Collaborations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {[
             { brand: "Luxe Wear", deal: "Instagram Feature", amount: "₹8,500", status: "In Progress" },
             { brand: "Tech Pulse", deal: "YouTube Review", amount: "₹25,000", status: "Reviewing" }
           ].map((collab, idx) => (
             <div key={idx} className="premium-card p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {collab.brand.charAt(0)}
                    </div>
                    <span className="text-2xl font-black text-primary">{collab.amount}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{collab.brand}</h3>
                  <p className="text-zinc-500 mb-6 font-medium">{collab.deal}</p>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-100 dark:border-white/5">
                  <span className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    {collab.status}
                  </span>
                  <button className="px-5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm font-bold hover:bg-zinc-100 transition-all">
                    Manage Deal
                  </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
