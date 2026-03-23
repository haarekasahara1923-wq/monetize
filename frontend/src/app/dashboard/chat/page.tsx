"use client";
import React, { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import ContractView from '@/components/ContractView';
import axios from 'axios';
import { useAuth } from '@/store/useAuth';
import { MessageSquare, ShoppingBag, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPage = () => {
  const { user, token } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'CONTRACT'>('CHAT');

  useEffect(() => {
    fetchDeals();
  }, [token]);

  const fetchDeals = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/deals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeals(response.data);
      if (response.data.length > 0 && !selectedDeal) setSelectedDeal(response.data[0]);
    } catch (err) {
      console.error('Failed to fetch deals', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Real-time Negotiation</h1>
      </div>

      <div className="flex gap-8 h-full">
        {/* Deal Sidebar */}
        <div className="w-80 h-full overflow-y-auto space-y-4 pr-4 border-r border-zinc-100 dark:border-white/5">
          {loading ? (
             [1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />)
          ) : deals.length === 0 ? (
             <div className="text-center py-10 text-zinc-400 italic">No active deals found.</div>
          ) : (
            deals.map(deal => (
              <button 
                key={deal.id}
                onClick={() => setSelectedDeal(deal)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                   selectedDeal?.id === deal.id 
                   ? 'border-primary bg-primary/5 ring-4 ring-primary/5' 
                   : 'border-zinc-100 hover:border-zinc-200 dark:border-white/5 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                   <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs flex items-center justify-center font-bold">
                     {user?.role === 'BUSINESS' ? deal.influencer.name.charAt(0) : deal.business.businessName?.charAt(0) || deal.business.name.charAt(0)}
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-primary">₹{deal.finalPrice || deal.proposedPrice}</span>
                </div>
                <div className="font-bold text-sm truncate">
                  {user?.role === 'BUSINESS' ? deal.influencer.name : deal.business.businessName || deal.business.name}
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                  <ShoppingBag className="w-3 h-3" />
                  {deal.campaign?.title || 'Direct Deal'}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat/Contract Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
             {selectedDeal ? (
               <motion.div 
                 key={selectedDeal.id}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.02 }}
                 className="h-full flex flex-col"
               >
                 <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{user?.role === 'BUSINESS' ? selectedDeal.influencer.name : selectedDeal.business.businessName || selectedDeal.business.name}</h2>
                      <div className="text-sm text-zinc-400 capitalize">{selectedDeal.status} - Room: {selectedDeal.id}</div>
                    </div>
                    
                    <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl gap-2">
                       <button 
                          onClick={() => setActiveTab('CHAT')}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'CHAT' ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500'}`}
                       >
                         Chat
                       </button>
                       <button 
                          onClick={() => setActiveTab('CONTRACT')}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'CONTRACT' ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500'}`}
                       >
                         Contract
                       </button>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto">
                    {activeTab === 'CHAT' ? (
                       <ChatInterface roomID={selectedDeal.id} />
                    ) : (
                       <ContractView deal={selectedDeal} onUpdate={fetchDeals} />
                    )}
                 </div>
               </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full flex items-center justify-center text-zinc-400 flex-col gap-4"
               >
                 <MessageSquare className="w-16 h-16 opacity-10" />
                 <p className="font-medium italic text-lg">Select a conversation to start negotiating.</p>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
