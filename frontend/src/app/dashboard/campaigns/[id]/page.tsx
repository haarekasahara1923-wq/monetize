"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { 
  Users, User, MapPin, 
  DollarSign, TrendingUp, CheckCircle2,
  XCircle, MessageSquare,
  Instagram, Youtube, Facebook, Globe,
  ArrowLeft, Info, Trophy, Heart, Eye
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ApplicantsView = () => {
  const params = useParams();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && params.id) fetchData();
  }, [user, params.id]);

  const fetchData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const [campRes, dealsRes] = await Promise.all([
        axios.get(`${apiUrl}/campaigns/${params.id}`),
        axios.get(`${apiUrl}/deals`, { params: { campaignId: params.id } })
      ]);
      
      setCampaign(campRes.data);
      setDeals(dealsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDealStatus = async (dealId: string, status: string) => {
    setProcessingId(dealId);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      await axios.patch(`${apiUrl}/deals/${dealId}/status`, { status });
      
      if (status === 'ACCEPTED') {
         await axios.post(`${apiUrl}/deals/${dealId}/generate-contract`).catch(console.error);
         alert('Deal Accepted! AI Contract has been generated.');
      }
      
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Action failed.');
    } finally {
      setProcessingId(null);
    }
  };

  if (!user || user.role !== 'BUSINESS') return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <Link 
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-all mb-8 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Campaigns
        </Link>

        {loading ? (
          <div className="space-y-6">
            <div className="h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            </div>
          </div>
        ) : !campaign ? (
            <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-sm">
                <h3 className="text-2xl font-black mb-2">Campaign not found</h3>
            </div>
        ) : (
          <>
            <div className="mb-12 p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -z-10" />
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <span className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                         {campaign.platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                         {campaign.platform === 'YouTube' && <Youtube className="w-5 h-5 text-red-500" />}
                         {campaign.platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                       </span>
                       <h1 className="text-3xl font-black tracking-tight">{campaign.title}</h1>
                    </div>
                    <p className="text-zinc-500 text-sm ml-11 max-w-xl italic font-medium line-clamp-2">"{campaign.description}"</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Campaign Budget</p>
                    <p className="text-3xl font-black text-purple-600">₹{campaign.budget.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs font-bold text-zinc-500">
                      <MapPin className="w-3.5 h-3.5" /> {campaign.location} • {campaign.durationDays} Days
                    </div>
                  </div>
               </div>
            </div>

            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black">Influencer Applicants ({deals.length})</h2>
              </div>

              {deals.length === 0 ? (
                <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-white/5">
                  <p className="text-zinc-400 font-medium">Waiting for influencers to apply.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {deals.map((deal, idx) => (
                    <motion.div 
                      key={deal.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 shadow-xl border border-zinc-100 dark:border-white/5 flex flex-col"
                    >
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                           {deal.influencer.image ? <img src={deal.influencer.image} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-zinc-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-black truncate">{deal.influencer.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">{deal.influencer.niche}</span>
                             <span className="text-[10px] font-bold text-zinc-500 line-clamp-1"><MapPin className="w-2.5 h-2.5 inline mr-1" />{deal.influencer.city}</span>
                          </div>
                        </div>
                        {deal.status !== 'SUGGESTED' && (
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                             deal.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                           }`}>
                             {deal.status}
                           </span>
                        )}
                      </div>

                      <div className="mb-8 space-y-3">
                         <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between border-2 border-dashed border-zinc-100 dark:border-white/5">
                            <div>
                              <p className="text-[9px] font-black uppercase text-zinc-400 mb-1">Influencer Quote</p>
                              <p className="text-2xl font-black text-primary">₹{deal.proposedPrice.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                               <p className={`text-[10px] font-black uppercase ${deal.proposedPrice > campaign.budget ? 'text-amber-500' : 'text-green-500'}`}>
                                 {deal.proposedPrice > campaign.budget ? '⚠️ High' : '✅ Fair'}
                               </p>
                            </div>
                         </div>
                      </div>

                      <div className="mt-auto flex gap-3">
                         <button 
                           onClick={() => updateDealStatus(deal.id, 'ACCEPTED')}
                           disabled={!!processingId || deal.status !== 'SUGGESTED'}
                           className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                             deal.status === 'ACCEPTED' ? 'bg-zinc-100 text-zinc-400' : 'bg-green-500 text-white hover:bg-green-600'
                           }`}
                         >
                           {processingId === deal.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Accept Application'}
                         </button>
                         <button 
                           onClick={() => updateDealStatus(deal.id, 'CANCELLED')}
                           disabled={!!processingId || deal.status !== 'SUGGESTED'}
                           className="px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-all font-bold text-sm"
                         >
                           Reject
                         </button>
                      </div>

                      {deal.status === 'ACCEPTED' && (
                        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                           <Trophy className="w-5 h-5 text-amber-500" />
                           <div className="flex-1 min-w-0">
                             <p className="text-[10px] font-black text-amber-600 uppercase mb-0.5">Contract Ready</p>
                             <p className="text-[10px] text-amber-500 font-bold truncate">Agreement is signed. Proceed to payment.</p>
                           </div>
                           <Link href={`/dashboard/deals/${deal.id}`} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-black uppercase">Escrow</Link>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicantsView;
