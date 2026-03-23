"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { 
  PlusSquare, Calendar, MapPin, 
  DollarSign, Package, CheckCircle2,
  Instagram, Youtube, Facebook, Globe,
  Briefcase, Save, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const CreateCampaign = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    budget: '',
    platform: 'Instagram',
    description: '',
    location: '',
    durationDays: '7',
  });

  const durationOptions = [
    { label: '1 Day', value: '1' },
    { label: '3 Days', value: '3' },
    { label: '7 Days', value: '7' },
    { label: '15 Days', value: '15' },
    { label: '30 Days', value: '30' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      await axios.post(`${apiUrl}/campaigns`, {
        ...formData,
        budget: parseFloat(formData.budget),
        durationDays: parseInt(formData.durationDays)
      });
      
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/campaigns'), 2000);
    } catch (err) {
      console.error('Campaign creation failed', err);
      alert('Failed to create campaign. Please check balance or try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'BUSINESS') return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6">
        <Link 
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-all mb-8 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Campaigns
        </Link>
        
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <PlusSquare className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-black tracking-tight">Create New Campaign</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-11 italic font-medium">Define your requirements and start finding the perfect influencer.</p>
        </div>

        {success ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-12 text-center shadow-xl border border-green-500/20">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-black mb-3">Campaign Created!</h2>
            <p className="text-zinc-500 mb-8">Your campaign is now live for influencers to apply. Redirecting you to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-zinc-100 dark:border-white/5">
              <h2 className="text-lg font-black mb-8 flex items-center gap-2 uppercase tracking-wider text-purple-600">
                <Briefcase className="w-5 h-5" /> Campaign Overview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Campaign Title</label>
                  <input 
                    type="text" required value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800"
                    placeholder="e.g. Summer Beach Shoot for Organic Sunscreen"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Platform</label>
                    <select 
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-10"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Facebook">Facebook</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="X">X (Twitter)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Target Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" required value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full pl-11 pr-5 py-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800"
                        placeholder="e.g. North India, USA, Global"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Total Budget (Fixed)</label>
                    <div className="relative">
                      <p className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-foreground">₹</p>
                      <input 
                        type="number" required value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full pl-10 pr-5 py-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none font-black text-sm dark:bg-zinc-800"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Campaign Duration</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {durationOptions.map((opt) => (
                         <button
                           key={opt.value}
                           type="button"
                           onClick={() => setFormData({ ...formData, durationDays: opt.value })}
                           className={`p-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${
                             formData.durationDays === opt.value
                             ? 'border-purple-600 bg-purple-500/10 text-purple-600 ring-2 ring-purple-500/20'
                             : 'border-zinc-50 hover:border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/20 text-zinc-400'
                           }`}
                         >
                           {opt.label}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Description & Deliverables</label>
                  <textarea 
                    rows={6} required value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800"
                    placeholder="Describe exactly what you need. (e.g. 1 Story + 1 Reel showcasing our product features...)"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-purple-600 text-white font-black text-xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-6 h-6" /> Publish Campaign</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
