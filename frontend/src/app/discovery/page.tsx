"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Filter, Instagram, Youtube, Facebook } from 'lucide-react';

const DiscoveryPage = () => {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    fetchInfluencers();
  }, [platform]);

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/influencers`, {
        params: { platform }
      });
      setInfluencers(response.data);
    } catch (err) {
      console.error('Failed to fetch influencers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Find Your Face</h1>
          <p className="text-zinc-500">Discover top-tier creators for your brand</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by name or city..."
              className="pl-12 pr-6 py-3.5 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all w-full md:w-80 dark:bg-zinc-900 dark:border-white/5"
            />
          </div>
          <div className="glass p-1.5 rounded-2xl flex items-center gap-1">
            <button 
              onClick={() => setPlatform('')}
              className={`p-2.5 rounded-xl transition-all ${platform === '' ? 'bg-primary text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              All
            </button>
            <button 
               onClick={() => setPlatform('Instagram')}
               className={`p-2.5 rounded-xl transition-all ${platform === 'Instagram' ? 'bg-primary text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              <Instagram className="w-5 h-5" />
            </button>
            <button 
               onClick={() => setPlatform('YouTube')}
               className={`p-2.5 rounded-xl transition-all ${platform === 'YouTube' ? 'bg-primary text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              <Youtube className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-80 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {influencers.map((inf, idx) => (
            <motion.div
              key={inf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="premium-card group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
                {inf.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold mb-1">{inf.name}</h3>
              <p className="text-sm text-zinc-500 mb-4">{inf.city || 'Remote'}</p>
              
              <div className="flex gap-4 mb-6">
                {inf.platformStats.map((stat: any) => (
                  <div key={stat.id} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    {stat.platform === 'Instagram' && <Instagram className="w-3 h-3 text-pink-500" />}
                    {stat.platform === 'YouTube' && <Youtube className="w-3 h-3 text-red-500" />}
                    {stat.followers >= 1000 ? `${(stat.followers / 1000).toFixed(1)}k` : stat.followers}
                  </div>
                ))}
              </div>

              <button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all">
                View Profile
              </button>
            </motion.div>
          ))}
        </div>
      )}
      
      {!loading && influencers.length === 0 && (
        <div className="text-center py-40">
          <p className="text-zinc-500 text-lg italic">No influencers found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default DiscoveryPage;
