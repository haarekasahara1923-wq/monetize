"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/store/useAuth';
import { 
  ShoppingBag, Search, Filter, 
  MapPin, Calendar, DollarSign, ArrowRight,
  Instagram, Youtube, Facebook, Globe,
  CheckCircle2, Send, Zap, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CampaignsDiscovery = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [quote, setQuote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      const response = await axios.get(`${apiUrl}/campaigns`);
      setCampaigns(response.data);
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) return alert('Please login to apply');
    setApplying(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      await axios.post(`${apiUrl}/deals`, {
        campaignId: selectedCampaign.id,
        influencerId: user.id,
        businessId: selectedCampaign.businessId,
        proposedPrice: parseFloat(quote) || selectedCampaign.budget
      });
      
      setAppliedSuccess(true);
      setTimeout(() => {
        setSelectedCampaign(null);
        setAppliedSuccess(false);
        setQuote('');
      }, 2000);
    } catch (err) {
      console.error('Application failed', err);
      alert('You have already applied or something went wrong.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
            <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
            <h1 className="text-4xl font-black tracking-tight">Find Brand Gigs</h1>
          </div>
          <p className="text-zinc-500 text-sm italic font-medium ml-1">Connect with premium brands and monetize your influence. High-quality campaigns updated daily.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="Search gigs by brand, niche or location..." className="w-full pl-11 pr-4 py-4 rounded-2xl border dark:bg-zinc-900 focus:ring-2 focus:ring-primary outline-none font-medium text-sm transition-all" />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <button className="flex-1 md:px-6 py-4 rounded-2xl border bg-white dark:bg-zinc-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all"><Filter className="w-4 h-4" /> Filters</button>
             <select className="flex-1 md:px-6 py-4 rounded-2xl border bg-white dark:bg-zinc-900 font-bold text-sm outline-none appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1.25rem_center] bg-[length:1rem_1rem] bg-no-repeat">
                <option>Newest First</option>
                <option>Budget: High to Low</option>
                <option>Platform</option>
             </select>
          </div>
        </div>

        {/* Discovery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-sm border border-zinc-100 dark:border-white/5">
            <h3 className="text-2xl font-black mb-2">No gigs found</h3>
            <p className="text-zinc-500">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp, idx) => (
              <motion.div 
                key={camp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] p-7 shadow-lg border border-zinc-100 dark:border-white/5 hover:border-primary/30 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                   <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                     {camp.platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                     {camp.platform === 'YouTube' && <Youtube className="w-5 h-5 text-red-500" />}
                     {camp.platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                     {!['Instagram', 'YouTube', 'Facebook'].includes(camp.platform) && <Globe className="w-5 h-5 text-primary" />}
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-black uppercase text-zinc-400 mb-0.5">Brand</p>
                     <p className="text-xs font-black truncate max-w-[120px]">{camp.business?.businessName || camp.business?.name}</p>
                   </div>
                </div>

                <h3 className="text-xl font-black mb-3 line-clamp-1 group-hover:text-primary transition-all underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-primary">{camp.title}</h3>
                <p className="text-zinc-500 text-xs line-clamp-3 mb-6 leading-relaxed flex-1">
                  {camp.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                   <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center gap-2">
                     <MapPin className="w-3.5 h-3.5 text-red-500" />
                     <span className="text-[10px] font-black uppercase truncate">{camp.location}</span>
                   </div>
                   <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center gap-2">
                     <Calendar className="w-3.5 h-3.5 text-blue-500" />
                     <span className="text-[10px] font-black uppercase truncate">{camp.durationDays} Days</span>
                   </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                   <div>
                     <p className="text-[9px] font-black uppercase text-zinc-400 mb-0.5">Budget</p>
                     <p className="text-xl font-black text-primary">₹{camp.budget.toLocaleString()}</p>
                   </div>
                   <button 
                    onClick={() => setSelectedCampaign(camp)}
                    className="px-6 py-4 rounded-2xl bg-primary text-white font-black text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center gap-2"
                   >
                     Apply <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCampaign(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] p-10 overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -z-10" />
              
              {appliedSuccess ? (
                <div className="text-center py-10 scale-105">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">Application Sent!</h3>
                  <p className="text-zinc-500 text-sm">The brand will review your profile and get back to you soon. Track it in your dash.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-600"><TrendingUp className="w-6 h-6" /></span>
                    <div>
                      <h3 className="text-xl font-black">Submit Application</h3>
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Campaign: {selectedCampaign.title}</p>
                    </div>
                  </div>

                  <div className="mb-8 space-y-4">
                    <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border dark:border-white/5">
                      <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Campaign Budget</p>
                      <p className="text-2xl font-black text-primary">₹{selectedCampaign.budget.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black uppercase text-zinc-400 mb-3">Your Custom Quote (Optional)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-4 font-black text-foreground">₹</span>
                        <input 
                          type="number" placeholder={selectedCampaign.budget} value={quote}
                          onChange={(e) => setQuote(e.target.value)}
                          className="w-full pl-8 pr-4 py-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary font-black text-lg transition-all"
                        />
                      </div>
                      <p className="text-[9px] text-zinc-500 mt-3 font-bold px-2 italic">Tip: Entering a competitive quote increases your chances of selection.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setSelectedCampaign(null)} className="flex-1 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold text-sm text-zinc-500">Cancel</button>
                    <button 
                      onClick={handleApply}
                      disabled={applying}
                      className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      {applying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Application</>}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignsDiscovery;
