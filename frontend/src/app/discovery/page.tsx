"use client";
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Instagram, Youtube, 
  PhoneCall, MessageSquare, Video, ChevronRight, 
  Building2, User, CheckCircle2, MapPin, Globe,
  Eye, Heart, MessageCircle, Users, TrendingUp
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const DiscoveryContent = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'INFLUENCER';
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      const endpoint = type === 'BUSINESS' ? '/users/businesses' : '/users/influencers';
      const response = await axios.get(`${apiUrl}${endpoint}`);
      setData(response.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(item => {
    const term = searchTerm.toLowerCase();
    const name = (item.businessName || item.name || '').toLowerCase();
    const niche = (item.niche || '').toLowerCase();
    return name.includes(term) || niche.includes(term);
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${type === 'BUSINESS' ? 'bg-purple-500/10 text-purple-600' : 'bg-primary/10 text-primary'}`}>
              {type === 'BUSINESS' ? 'Business Directory' : 'Creator Network'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {type === 'BUSINESS' ? 'Discover Brands' : 'Discover Creators'}
            </h1>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search by name or ${type === 'BUSINESS' ? 'product' : 'niche'}...`}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-zinc-200 dark:border-white/5 focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-zinc-900 shadow-sm"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`p-5 rounded-3xl bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl relative group flex flex-col items-center text-center cursor-pointer transition-all hover:-translate-y-1 border border-zinc-100 dark:border-white/5`}
                onClick={() => setSelectedProfile(item)}
              >
                {/* Profile Image */}
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4 flex items-center justify-center overflow-hidden shadow-sm">
                   {item.image ? (
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   ) : (
                     type === 'BUSINESS' ? <Building2 className="w-7 h-7 text-zinc-300" /> : <User className="w-7 h-7 text-zinc-300" />
                   )}
                </div>
                
                {/* Name */}
                <h3 className="text-sm font-black mb-1 leading-tight line-clamp-1">{item.businessName || item.name}</h3>
                
                {/* Niche / Product Tag */}
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase mb-3 ${type === 'BUSINESS' ? 'bg-purple-500/10 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                  {item.niche || (item.dealingProducts ? item.dealingProducts.split(';')[0] : 'Creator')}
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-1.5 w-full mt-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="flex-1 p-2 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="flex-1 p-2 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="flex-1 p-2 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filtered.length === 0 && (
          <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-3xl mt-6">
            <p className="text-zinc-400 text-sm font-medium">No profiles found.</p>
          </div>
        )}

        {/* ===================== PUBLIC PROFILE MODAL ===================== */}
        <AnimatePresence>
          {selectedProfile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedProfile(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="md:col-span-1 text-center">
                    <div className="w-28 h-28 mx-auto rounded-3xl bg-zinc-100 dark:bg-zinc-800 mb-5 overflow-hidden shadow-lg border-4 border-white dark:border-zinc-800 flex items-center justify-center">
                       {selectedProfile.image ? 
                         <img src={selectedProfile.image} alt="Profile" className="w-full h-full object-cover" /> : 
                         (type === 'BUSINESS' ? <Building2 className="w-14 h-14 text-zinc-300" /> : <User className="w-14 h-14 text-zinc-300" />)
                       }
                    </div>
                    <h2 className="text-2xl font-black mb-1">{selectedProfile.businessName || selectedProfile.name}</h2>
                    <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase mb-5 ${type === 'BUSINESS' ? 'bg-purple-500/10 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                       {selectedProfile.niche || 'Pro Member'}
                    </div>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-zinc-500 font-medium justify-center">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> Location Verified
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 font-medium justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Verified
                      </div>
                      {type === 'BUSINESS' && selectedProfile.targetArea && (
                        <div className="flex items-center gap-2 text-zinc-500 font-medium justify-center">
                          <Globe className="w-3.5 h-3.5 text-primary" /> {selectedProfile.targetArea}
                        </div>
                      )}
                    </div>

                    {/* CTA in Modal */}
                    <div className="flex gap-2 mt-6">
                      <button className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all">
                        <PhoneCall className="w-4 h-4" /> Call
                      </button>
                      <button className="flex-1 p-3 rounded-xl bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
                        <MessageSquare className="w-4 h-4" /> Chat
                      </button>
                      <button className="flex-1 p-3 rounded-xl bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all">
                        <Video className="w-4 h-4" /> Video
                      </button>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-3">
                        {type === 'BUSINESS' ? 'About the Brand' : 'About'}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl text-sm">
                         {selectedProfile.bio || 'Passionate about creating value and connecting with like-minded professionals.'}
                      </p>
                    </div>

                    {/* Social Metrics — FULL DATA for Influencers */}
                    {type === 'INFLUENCER' && selectedProfile.platformStats && selectedProfile.platformStats.length > 0 && (
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Social Media Metrics
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedProfile.platformStats.map((stat: any) => (
                            <div key={stat.id} className="p-4 rounded-2xl border dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/50">
                              <div className="flex items-center gap-2 mb-3">
                                {stat.platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                                {stat.platform === 'YouTube' && <Youtube className="w-4 h-4 text-red-500" />}
                                {!['Instagram', 'YouTube'].includes(stat.platform) && <Globe className="w-4 h-4 text-primary" />}
                                <span className="text-xs font-black uppercase">{stat.platform}</span>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                <div className="text-center">
                                  <Users className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
                                  <div className="text-sm font-black">{stat.followers >= 1000 ? `${(stat.followers/1000).toFixed(1)}K` : stat.followers || 0}</div>
                                  <div className="text-[8px] text-zinc-400 font-bold uppercase">Followers</div>
                                </div>
                                <div className="text-center">
                                  <Eye className="w-3.5 h-3.5 mx-auto text-blue-500 mb-1" />
                                  <div className="text-sm font-black">{stat.avgViews >= 1000 ? `${(stat.avgViews/1000).toFixed(1)}K` : stat.avgViews || 0}</div>
                                  <div className="text-[8px] text-zinc-400 font-bold uppercase">Avg Views</div>
                                </div>
                                <div className="text-center">
                                  <Heart className="w-3.5 h-3.5 mx-auto text-red-500 mb-1" />
                                  <div className="text-sm font-black">{stat.avgLikes >= 1000 ? `${(stat.avgLikes/1000).toFixed(1)}K` : stat.avgLikes || 0}</div>
                                  <div className="text-[8px] text-zinc-400 font-bold uppercase">Avg Likes</div>
                                </div>
                                <div className="text-center">
                                  <MessageCircle className="w-3.5 h-3.5 mx-auto text-green-500 mb-1" />
                                  <div className="text-sm font-black">{stat.avgComments >= 1000 ? `${(stat.avgComments/1000).toFixed(1)}K` : stat.avgComments || 0}</div>
                                  <div className="text-[8px] text-zinc-400 font-bold uppercase">Comments</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Products for Business */}
                    {type === 'BUSINESS' && selectedProfile.dealingProducts && (
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                          <Building2 className="w-4 h-4" /> Products & Services
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfile.dealingProducts.split(';').filter((p: string) => p.trim()).map((p: string, i: number) => (
                             <span key={i} className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 text-xs font-bold border border-purple-500/20">
                               {p.trim()}
                             </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedProfile(null)}
                  className="mt-8 w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 transition-all text-sm"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DiscoveryPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen pt-40 text-center italic text-zinc-400">Loading...</div>}>
      <DiscoveryContent />
    </Suspense>
  );
};

export default DiscoveryPage;
