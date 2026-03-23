"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Instagram, Youtube, Facebook, 
  PhoneCall, MessageSquare, Video, ChevronRight, 
  Building2, User, CheckCircle2, MapPin, Globe 
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const DiscoveryContent = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'INFLUENCER'; // Default to INFLUENCER
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [platform, type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const endpoint = type === 'BUSINESS' ? '/api/users/businesses' : '/api/users/influencers';
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        params: { platform }
      });
      setData(response.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2">
            {type === 'BUSINESS' ? 'Discover Brands' : 'Discover Creators'}
          </h1>
          <p className="text-zinc-500 font-medium tracking-wide">
            {type === 'BUSINESS' ? 'Top-tier businesses looking for collaborations' : 'Discover elite influencers for your brand campaigns'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder={`Search by ${type === 'BUSINESS' ? 'brand' : 'name'}...`}
              className="pl-14 pr-8 py-4 rounded-[2rem] border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all w-full md:w-96 dark:bg-zinc-900 dark:border-white/5 shadow-sm"
            />
          </div>
          {type === 'INFLUENCER' && (
            <div className="glass p-2 rounded-[2rem] flex items-center gap-1">
              <button 
                onClick={() => setPlatform('')}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${platform === '' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                All
              </button>
              <button 
                onClick={() => setPlatform('Instagram')}
                className={`p-2.5 rounded-2xl transition-all ${platform === 'Instagram' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPlatform('YouTube')}
                className={`p-2.5 rounded-2xl transition-all ${platform === 'YouTube' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-[450px] rounded-[3rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-8 rounded-[3rem] bg-white dark:bg-zinc-900 shadow-xl relative group flex flex-col items-center text-center cursor-pointer border-t-[6px] ${type === 'BUSINESS' ? 'border-purple-500' : 'border-primary'}`}
              onClick={() => setSelectedProfile(item)}
            >
              <div className="w-24 h-24 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 mb-6 flex items-center justify-center overflow-hidden border-2 border-zinc-100 dark:border-white/5 shadow-md">
                 {item.image ? (
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                 ) : (
                   type === 'BUSINESS' ? <Building2 className="w-10 h-10 text-zinc-300" /> : <User className="w-10 h-10 text-zinc-300" />
                 )}
              </div>
              
              <h3 className="text-2xl font-black mb-1 leading-tight">{item.businessName || item.name}</h3>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-4 ${type === 'BUSINESS' ? 'bg-purple-500/10 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                {item.niche || (item.dealingProducts ? item.dealingProducts.split(';')[0] : 'Lifestyle')}
              </div>
              
              <p className="text-zinc-500 text-sm line-clamp-2 mb-6 italic h-10">
                {item.bio || 'Professional creator and brand collaborator.'}
              </p>

              <div className="flex gap-2 w-full mb-6 mt-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className={`flex-1 p-3 rounded-xl bg-green-500/10 text-green-600 transition-all flex items-center justify-center hover:bg-green-500 hover:text-white`}
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className={`flex-1 p-3 rounded-xl bg-blue-500/10 text-blue-600 transition-all flex items-center justify-center hover:bg-blue-500 hover:text-white`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className={`flex-1 p-3 rounded-xl bg-purple-500/10 text-purple-600 transition-all flex items-center justify-center hover:bg-purple-500 hover:text-white`}
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>

              <button className="w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg font-black">
                View Profile <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
      
      {!loading && data.length === 0 && (
        <div className="text-center py-40 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-inner">
          <p className="text-zinc-500 text-lg font-medium italic">No matches found in our directory.</p>
        </div>
      )}

      {/* Public View Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-1 text-center md:text-left">
                  <div className="aspect-square rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 mb-6 overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800 flex items-center justify-center">
                     {selectedProfile.image ? 
                       <img src={selectedProfile.image} alt="Profile" className="w-full h-full object-cover" /> : 
                       (type === 'BUSINESS' ? <Building2 className="w-20 h-20 text-zinc-300" /> : <User className="w-20 h-20 text-zinc-300" />)
                     }
                  </div>
                  <h2 className="text-3xl font-black mb-2 leading-tight">{selectedProfile.businessName || selectedProfile.name}</h2>
                  <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 ${type === 'BUSINESS' ? 'bg-purple-500/10 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                     {selectedProfile.niche || 'Pro Member'}
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 text-zinc-500 font-medium justify-center md:justify-start">
                      <MapPin className="w-4 h-4 text-primary" /> Location Verified
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500 font-medium justify-center md:justify-start">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Member
                    </div>
                    {type === 'BUSINESS' && (
                       <div className="flex items-center gap-3 text-zinc-500 font-medium justify-center md:justify-start">
                         <Globe className="w-4 h-4 text-primary" /> {selectedProfile.targetArea || 'Global'}
                       </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                       {type === 'BUSINESS' ? 'About the Brand' : 'Creator Journey'}
                    </h3>
                    <p className="text-zinc-500 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2rem] border border-zinc-100 dark:border-white/5 italic">
                       {selectedProfile.bio || 'I am passionate about creating value and connecting with enthusiasts in my niche.'}
                    </p>
                  </div>

                  {type === 'INFLUENCER' && selectedProfile.platformStats && (
                    <div>
                      <h3 className="text-xl font-black mb-4">Social Metrics</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {selectedProfile.platformStats.map((stat: any) => (
                          <div key={stat.id} className="p-4 rounded-2xl border dark:border-white/5 bg-zinc-50 dark:bg-zinc-800">
                            <span className="block text-[10px] font-black uppercase text-primary mb-1">{stat.platform}</span>
                            <span className="block text-lg font-black">{stat.followers >= 1000 ? `${(stat.followers/1000).toFixed(1)}K` : stat.followers}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">Followers</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {type === 'BUSINESS' && selectedProfile.dealingProducts && (
                    <div>
                      <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" /> Core Products
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.dealingProducts.split(';').map((p: string, i: number) => (
                           <span key={i} className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 text-xs font-bold border border-purple-500/20">
                             {p}
                           </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedProfile(null)}
                className="mt-12 w-full py-5 rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 transition-all text-sm uppercase tracking-widest"
              >
                Return to Directory
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DiscoveryPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center italic text-zinc-400">Searching global database...</div>}>
      <DiscoveryContent />
    </Suspense>
  );
};

export default DiscoveryPage;
