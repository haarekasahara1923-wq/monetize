"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Hero from "@/components/Hero";
import { 
  User, Building2, PhoneCall, MessageSquare, Video, 
  ChevronRight, MapPin, CheckCircle2, Globe, 
  Eye, Heart, MessageCircle, Users, TrendingUp,
  Instagram, Youtube, ArrowRight, Award
} from 'lucide-react';

export default function Home() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'INFLUENCER' | 'BUSINESS'>('INFLUENCER');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      const [infRes, busRes] = await Promise.all([
        axios.get(`${apiUrl}/users/influencers`).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/users/businesses`).catch(() => ({ data: [] })),
      ]);
      setInfluencers(infRes.data);
      setBusinesses(busRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openProfile = (item: any, type: 'INFLUENCER' | 'BUSINESS') => {
    setSelectedType(type);
    setSelectedProfile(item);
  };

  const ProfileCard = ({ item, type, idx }: { item: any; type: 'INFLUENCER' | 'BUSINESS'; idx: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="p-5 rounded-3xl bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl flex flex-col items-center text-center cursor-pointer transition-all hover:-translate-y-1 border border-zinc-100 dark:border-white/5"
      onClick={() => openProfile(item, type)}
    >
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-3 flex items-center justify-center overflow-hidden shadow-sm">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          type === 'BUSINESS' ? <Building2 className="w-6 h-6 text-zinc-300" /> : <User className="w-6 h-6 text-zinc-300" />
        )}
      </div>
      <h3 className="text-xs font-black mb-1 line-clamp-1">{item.businessName || item.name}</h3>
      <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase mb-3 ${type === 'BUSINESS' ? 'bg-purple-500/10 text-purple-600' : 'bg-primary/10 text-primary'}`}>
        {item.niche || (item.dealingProducts ? item.dealingProducts.split(';')[0] : 'Creator')}
      </div>
      <div className="flex gap-1 w-full mt-auto">
        <button onClick={(e) => e.stopPropagation()} className="flex-1 p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center">
          <PhoneCall className="w-3 h-3" />
        </button>
        <button onClick={(e) => e.stopPropagation()} className="flex-1 p-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
          <MessageSquare className="w-3 h-3" />
        </button>
        <button onClick={(e) => e.stopPropagation()} className="flex-1 p-1.5 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center">
          <Video className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* ===== INFLUENCER CARDS SECTION ===== */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Creators</span>
              <h2 className="text-3xl font-black mt-3">Top Influencers</h2>
            </div>
            <Link href="/discovery" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {influencers.slice(0, 6).map((item, idx) => (
                <ProfileCard key={item.id} item={item} type="INFLUENCER" idx={idx} />
              ))}
            </div>
          )}
          {!loading && influencers.length === 0 && (
            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
              <p className="text-zinc-400 text-sm">No influencers yet. Be the first to join!</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== BUSINESS CARDS SECTION ===== */}
      <section className="py-16 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-500/10 px-3 py-1 rounded-full">Brands</span>
              <h2 className="text-3xl font-black mt-3">Top Businesses</h2>
            </div>
            <Link href="/discovery?type=BUSINESS" className="text-sm font-bold text-purple-600 flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {businesses.slice(0, 6).map((item, idx) => (
                <ProfileCard key={item.id} item={item} type="BUSINESS" idx={idx} />
              ))}
            </div>
          )}
          {!loading && businesses.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl">
              <p className="text-zinc-400 text-sm">No businesses yet. Register your brand!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl rounded-[3rem] bg-primary/10 border border-primary/20 dark:bg-primary/5 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10" />
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to Scale Your Brand?</h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Join thousands of brands and influencers who are already connecting and growing on Monetize Connect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup?role=INFLUENCER" className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
              Get Started Now
            </Link>
            <Link href="/signup?role=BUSINESS" className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-zinc-800 text-foreground font-bold rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-lg">
              Register as Business
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-100 dark:border-white/5 text-center">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Monetize Connect. Made for the Creator Economy.
        </p>
      </footer>

      {/* ===== PUBLIC PROFILE MODAL ===== */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 text-center">
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-zinc-100 dark:bg-zinc-800 mb-5 overflow-hidden shadow-lg border-4 border-white dark:border-zinc-800 flex items-center justify-center">
                    {selectedProfile.image ? 
                      <img src={selectedProfile.image} alt="Profile" className="w-full h-full object-cover" /> : 
                      (selectedType === 'BUSINESS' ? <Building2 className="w-14 h-14 text-zinc-300" /> : <User className="w-14 h-14 text-zinc-300" />)
                    }
                  </div>
                  <h2 className="text-2xl font-black mb-1">{selectedProfile.businessName || selectedProfile.name}</h2>
                  <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase mb-5 ${selectedType === 'BUSINESS' ? 'bg-purple-500/10 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                    {selectedProfile.niche || 'Pro Member'}
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-zinc-500 font-medium justify-center"><MapPin className="w-3.5 h-3.5 text-primary" /> Verified Location</div>
                    <div className="flex items-center gap-2 text-zinc-500 font-medium justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Verified</div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button className="flex-1 p-3 rounded-xl bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/20"><PhoneCall className="w-4 h-4" /> Call</button>
                    <button className="flex-1 p-3 rounded-xl bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"><MessageSquare className="w-4 h-4" /> Chat</button>
                    <button className="flex-1 p-3 rounded-xl bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"><Video className="w-4 h-4" /> Video</button>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-3">{selectedType === 'BUSINESS' ? 'About the Brand' : 'About'}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl text-sm italic font-medium">
                      "{selectedProfile.bio || 'Passionate about creating value.'}"
                    </p>
                  </div>
                  {selectedProfile.achievements && (
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Key Achievements</h3>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed bg-amber-500/5 p-5 rounded-2xl text-sm border border-amber-500/10">
                        {selectedProfile.achievements}
                      </p>
                    </div>
                  )}
                  {selectedType === 'INFLUENCER' && selectedProfile.platformStats && selectedProfile.platformStats.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Social Metrics</h3>
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
                              <div className="text-center"><Users className="w-3.5 h-3.5 mx-auto text-primary mb-1" /><div className="text-sm font-black">{stat.followers >= 1000 ? `${(stat.followers/1000).toFixed(1)}K` : stat.followers || 0}</div><div className="text-[8px] text-zinc-400 font-bold uppercase">Followers</div></div>
                              <div className="text-center"><Eye className="w-3.5 h-3.5 mx-auto text-blue-500 mb-1" /><div className="text-sm font-black">{stat.avgViews >= 1000 ? `${(stat.avgViews/1000).toFixed(1)}K` : stat.avgViews || 0}</div><div className="text-[8px] text-zinc-400 font-bold uppercase">Views</div></div>
                              <div className="text-center"><Heart className="w-3.5 h-3.5 mx-auto text-red-500 mb-1" /><div className="text-sm font-black">{stat.avgLikes >= 1000 ? `${(stat.avgLikes/1000).toFixed(1)}K` : stat.avgLikes || 0}</div><div className="text-[8px] text-zinc-400 font-bold uppercase">Likes</div></div>
                              <div className="text-center"><MessageCircle className="w-3.5 h-3.5 mx-auto text-green-500 mb-1" /><div className="text-sm font-black">{stat.avgComments >= 1000 ? `${(stat.avgComments/1000).toFixed(1)}K` : stat.avgComments || 0}</div><div className="text-[8px] text-zinc-400 font-bold uppercase">Comments</div></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedType === 'BUSINESS' && selectedProfile.dealingProducts && (
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-3">Products</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.dealingProducts.split(';').filter((p: string) => p.trim()).map((p: string, i: number) => (
                          <span key={i} className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 text-xs font-bold border border-purple-500/20">{p.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="mt-8 w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 transition-all text-sm">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
