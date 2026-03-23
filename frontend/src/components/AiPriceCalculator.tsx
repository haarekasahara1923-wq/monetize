"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, TrendingUp, DollarSign, 
  Info, ShieldCheck, Zap, Instagram, 
  Youtube, Facebook, Globe, Twitter, Linkedin
} from 'lucide-react';

const platforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'X', icon: Twitter, color: 'text-zinc-400' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
];

const niches = [
  'General', 'Tech', 'Finance', 'Fashion', 'Health', 
  'Entertainment', 'Comedy', 'Food', 'Gaming'
];

const AiPriceCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    followers: '',
    avgViews: '',
    avgLikes: '',
    avgComments: '',
    platform: 'Instagram',
    niche: 'General'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculate = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const response = await axios.get(`${apiUrl}/pricing/calculate`, {
        params: {
          followers: formData.followers || 0,
          avgViews: formData.avgViews || 0,
          avgLikes: formData.avgLikes || 0,
          avgComments: formData.avgComments || 0,
          platform: formData.platform,
          niche: formData.niche
        }
      });
      setResult(response.data);
    } catch (err) {
      console.error('Calculation failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="calculator" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            Free AI Powered Tool
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">AI Price Calculator</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Get instant, data-backed pricing insights. Our AI takes into account followers, views, engagement rate, and niche value.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Input Panel */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-zinc-100 dark:border-white/5 order-2 lg:order-1">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> Enter Influencer Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                 <label className="block text-xs font-black uppercase mb-3 text-zinc-400">Platform</label>
                 <div className="flex flex-wrap gap-2">
                   {platforms.map((p) => (
                     <button
                       key={p.name}
                       onClick={() => setFormData({ ...formData, platform: p.name })}
                       className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 flex-1 min-w-[100px] ${
                         formData.platform === p.name 
                         ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg' 
                         : 'border-zinc-50 hover:border-zinc-200 dark:border-white/5 dark:bg-zinc-800/50'
                       }`}
                     >
                       <p.icon className={`w-6 h-6 ${formData.platform === p.name ? p.color : 'text-zinc-400'}`} />
                       <span className={`text-[10px] font-black uppercase ${formData.platform === p.name ? 'text-foreground' : 'text-zinc-400'}`}>{p.name}</span>
                     </button>
                   ))}
                 </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-3 text-zinc-400">Total Followers</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="number" name="followers" value={formData.followers} onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-4 rounded-xl border dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-sm"
                    placeholder="e.g. 50000"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs font-black uppercase mb-3 text-zinc-400">Avg. Views</label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="number" name="avgViews" value={formData.avgViews} onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-4 rounded-xl border dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-sm"
                    placeholder="e.g. 15000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-3 text-zinc-400">Avg. Likes</label>
                <div className="relative">
                  <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="number" name="avgLikes" value={formData.avgLikes} onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-4 rounded-xl border dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-sm"
                    placeholder="e.g. 1200"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs font-black uppercase mb-3 text-zinc-400">Avg. Comments</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="number" name="avgComments" value={formData.avgComments} onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-4 rounded-xl border dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-sm"
                    placeholder="e.g. 45"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase mb-3 text-zinc-400">Niche Category</label>
                <select 
                  name="niche" value={formData.niche} onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-xl border dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-sm appearance-none"
                >
                  {niches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={calculate}
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : 'Calculate AI Price'}
            </button>
          </div>

          {/* Results Panel */}
          <div className="order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col justify-center"
                >
                  <div className="premium-card p-10 md:p-12 relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[2.5rem] shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
                    
                    <div className="flex items-center gap-3 mb-8">
                       <span className="p-3 rounded-2xl bg-green-500 fill-green-500 text-white shadow-lg shadow-green-500/20">
                         <DollarSign className="w-8 h-8 font-black" />
                       </span>
                       <div>
                         <h4 className="text-lg font-black leading-none">Recommended Rate</h4>
                         <p className="text-zinc-400 text-xs mt-1 uppercase font-bold tracking-widest">Based on Real-time Engagement</p>
                       </div>
                    </div>

                    <div className="mb-10">
                      <div className="text-6xl md:text-8xl font-black tracking-tighter text-primary flex items-baseline gap-1">
                        <span className="text-3xl font-black">₹</span>
                        {result.ranges.recommended.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border dark:border-white/5">
                        <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Minimum Price</p>
                        <p className="text-xl font-black">₹{result.ranges.min.toLocaleString()}</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border dark:border-white/5">
                        <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Premium Price</p>
                        <p className="text-xl font-black">₹{result.ranges.premium.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <ShieldCheck className="w-5 h-5 text-green-500" />
                           <span className="text-sm font-black uppercase tracking-tight">AI Confidence Score</span>
                         </div>
                         <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{result.confidence}%</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <p className="text-sm text-zinc-500 italic bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border dark:border-white/5 leading-relaxed">
                        <Info className="w-4 h-4 inline-block mr-2 text-primary" />
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-zinc-100/50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-white/5">
                  <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl flex items-center justify-center mb-6">
                    <DollarSign className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-black mb-3">Check Your Influence Value</h4>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    Fill the form on the left to see what brands should be paying you!
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPriceCalculator;
