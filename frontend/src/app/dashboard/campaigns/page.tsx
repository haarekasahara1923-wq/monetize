"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/store/useAuth';
import { 
  ShoppingBag, Plus, Search, Filter, 
  MapPin, Calendar, Users, ArrowRight,
  Instagram, Youtube, Facebook, Globe,
  Briefcase, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MyCampaigns = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCampaigns();
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      const response = await axios.get(`${apiUrl}/campaigns`, {
        params: { businessId: user?.id }
      });
      setCampaigns(response.data);
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'BUSINESS') return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-black tracking-tight">My Campaigns</h1>
            </div>
            <p className="text-zinc-500 text-sm ml-11">Manage your active influencer marketing campaigns and track applicants.</p>
          </div>
          <Link 
            href="/dashboard/campaigns/create"
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-purple-600 text-white font-black text-sm hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/30"
          >
            <Plus className="w-5 h-5" /> Create New Campaign
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active Campaigns', value: campaigns.length, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Total Applicants', value: '0', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Completed Deals', value: '0', color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Budget Spent', value: '₹0', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
              <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">{stat.label}</p>
              <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
             <input type="text" placeholder="Search campaigns..." className="w-full pl-11 pr-4 py-4 rounded-2xl border dark:bg-zinc-900 focus:ring-2 focus:ring-purple-500 outline-none text-sm" />
           </div>
           <button className="p-4 rounded-2xl border bg-white dark:bg-zinc-900 hover:bg-zinc-50 transition-all"><Filter className="w-4 h-4" /></button>
        </div>

        {/* Campaign List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-white/5 shadow-sm">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-xl font-black mb-2">No campaigns found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-8">Ready to grow your brand? Create your first campaign to connect with creators.</p>
            <Link 
              href="/dashboard/campaigns/create"
              className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-black text-sm hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/20"
            >
              Start Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp, idx) => (
              <motion.div 
                key={camp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-7 shadow-lg border border-zinc-100 dark:border-white/5 group hover:border-purple-500/30 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                   <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                     {camp.platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                     {camp.platform === 'YouTube' && <Youtube className="w-5 h-5 text-red-500" />}
                     {camp.platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                     {!['Instagram', 'YouTube', 'Facebook'].includes(camp.platform) && <Globe className="w-5 h-5 text-purple-600" />}
                   </div>
                   <span className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded-full">
                     Active
                   </span>
                </div>
                
                <h3 className="text-lg font-black mb-2 line-clamp-1">{camp.title}</h3>
                <p className="text-zinc-500 text-xs line-clamp-2 mb-6 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl italic">
                  "{camp.description}"
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                   <div className="flex items-center gap-2 text-zinc-500">
                     <MapPin className="w-3.5 h-3.5 text-purple-500" />
                     <span className="text-[10px] font-bold uppercase">{camp.location}</span>
                   </div>
                   <div className="flex items-center gap-2 text-zinc-500">
                     <Calendar className="w-3.5 h-3.5 text-blue-500" />
                     <span className="text-[10px] font-bold uppercase">{camp.durationDays} Days</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                   <div>
                     <p className="text-[9px] font-black uppercase text-zinc-400 mb-0.5">Budget</p>
                     <p className="text-lg font-black text-purple-600">₹{camp.budget.toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-black uppercase text-zinc-400 mb-0.5">Applicants</p>
                     <div className="flex items-center gap-1.5 text-sm font-black text-foreground">
                        <Users className="w-4 h-4 text-zinc-400" /> 0
                     </div>
                   </div>
                </div>

                <Link 
                  href={`/dashboard/campaigns/${camp.id}`}
                  className="mt-6 w-full py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 group-hover:bg-purple-600 group-hover:text-white transition-all text-sm font-black flex items-center justify-center gap-2"
                >
                  View applicants <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCampaigns;
