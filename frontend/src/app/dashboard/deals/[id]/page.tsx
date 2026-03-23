"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { 
  CreditCard, ShieldCheck, FileText, 
  CheckCircle2, AlertCircle, DollarSign,
  Briefcase, Zap, Info, ArrowLeft, Trophy
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const DealDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (user && params.id) fetchDeal();
  }, [user, params.id]);

  const fetchDeal = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      const response = await axios.get(`${apiUrl}/deals/${params.id}`);
      setDeal(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initPayment = async () => {
    setPaying(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const res = await axios.post(`${apiUrl}/payments/order`, { dealId: deal.id });
      const order = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_invalid',
        amount: order.amount,
        currency: order.currency,
        name: 'Monetize Connect',
        description: `Escrow payment for ${deal.campaign?.title}`,
        order_id: order.id,
        handler: async (response: any) => {
           // On success, we wait for webhook or call manual confirm
           alert('Payment Successful! Status will update shortly.');
           fetchDeal();
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#8b5cf6' },
      };

      const rzp = (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Failed to start payment.');
    } finally {
      setPaying(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-all mb-8 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>

        {loading ? (
          <div className="h-96 rounded-[3rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
        ) : !deal ? (
            <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-sm">
                <h3 className="text-2xl font-black mb-2">Deal not found</h3>
            </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
               {/* Deal Header */}
               <div className="p-8 md:p-10 rounded-[3rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -z-10" />
                  <div className="flex items-center gap-3 mb-6">
                     <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-600"><Trophy className="w-6 h-6" /></span>
                     <div>
                       <h1 className="text-2xl font-black">{deal.campaign?.title}</h1>
                       <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">Agreement ID: {deal.id.slice(0,8)}</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-50 dark:border-white/5">
                     <div>
                       <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Status</p>
                       <p className={`text-sm font-black uppercase ${deal.status === 'ACTIVE' ? 'text-green-500' : 'text-amber-500'}`}>{deal.status}</p>
                     </div>
                     <div>
                       <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Payment Status</p>
                       <p className={`text-sm font-black uppercase ${deal.paymentStatus === 'HELD' ? 'text-blue-500' : 'text-zinc-400'}`}>{deal.paymentStatus}</p>
                     </div>
                  </div>
               </div>

               {/* AI Generated Contract */}
               <div className="p-8 md:p-10 rounded-[3rem] bg-zinc-900 text-white shadow-2xl relative">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                       <FileText className="w-5 h-5 text-primary" /> AI Generated Contract
                     </h2>
                     <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase">Stored in DB</span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none bg-white/5 p-8 rounded-3xl font-medium leading-relaxed max-h-[400px] overflow-y-auto">
                     {deal.contractUrl ? (
                         <div dangerouslySetInnerHTML={{ __html: deal.contractUrl.replace(/\n/g, '<br/>') }} />
                     ) : (
                         <p className="text-zinc-500 italic">Contract is being generated. Please wait...</p>
                     )}
                  </div>
                  <div className="mt-8 flex items-center gap-2 p-4 bg-primary/20 rounded-2xl border border-primary/30 text-xs font-bold text-primary">
                    <ShieldCheck className="w-4 h-4" /> This agreement is legally binding through the platform's terms of service.
                  </div>
               </div>
            </div>

            {/* Payment Panel */}
            <div className="lg:col-span-1">
               <div className="sticky top-28 p-8 md:p-10 rounded-[3rem] bg-white dark:bg-zinc-900 border-2 border-primary/20 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -z-10" />
                  
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-primary fill-primary" /> Payment Summary
                  </h3>

                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-zinc-400 uppercase text-[10px]">Agreed Deal Budget</span>
                       <span>₹{(deal.finalPrice || deal.proposedPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-zinc-400 uppercase text-[10px]">Platform Fee (Invoiced to Brand)</span>
                       <span className="text-blue-500">₹0 (Included)</span>
                    </div>
                    <div className="pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-between items-end">
                       <div>
                         <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Total to Pay (Escrow)</p>
                         <p className="text-3xl font-black text-primary">₹{(deal.finalPrice || deal.proposedPrice).toLocaleString()}</p>
                       </div>
                    </div>
                  </div>

                  <div className="mb-10 p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5">
                     <div className="flex items-center gap-3 text-xs font-black uppercase text-zinc-500 mb-4 tracking-tighter">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Escrow
                     </div>
                     <p className="text-[11px] text-zinc-400 leading-relaxed font-medium italic">
                        Once paid, the funds will be held securely by Monetize Connect. Influencer will start the work immediately.
                     </p>
                  </div>

                  {user.role === 'BUSINESS' ? (
                      deal.paymentStatus === 'HELD' ? (
                        <div className="w-full py-5 rounded-2xl bg-green-500/10 text-green-600 font-black text-center border border-green-500/20 shadow-inner">
                           ✅ Payment Held in Escrow
                        </div>
                      ) : (
                        <button 
                          onClick={initPayment}
                          disabled={paying}
                          className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
                        >
                          {paying ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><CreditCard className="w-6 h-6" /> Proceed to Pay</>}
                        </button>
                      )
                  ) : (
                    <div className="w-full py-5 rounded-2xl bg-primary/5 text-primary font-black text-center border border-primary/20">
                      Payment pending from brand
                    </div>
                  )}
                  
                  <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-40">
                     <Globe className="w-5 h-5" />
                     <Zap className="w-5 h-5" />
                     <Briefcase className="w-5 h-5" />
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealDetails;
