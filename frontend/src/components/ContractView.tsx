"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/store/useAuth';
import ReactMarkdown from 'react-markdown';
import { FileText, Wand2, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContractProps {
  deal: any;
  onUpdate?: () => void;
}

const ContractView = ({ deal, onUpdate }: ContractProps) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const generateContract = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/deals/${deal.id}/generate-contract`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to generate contract', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card bg-zinc-50 dark:bg-zinc-950 p-10 border-2 border-dashed border-zinc-200 dark:border-white/10 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">AI Agreement</h3>
            <p className="text-sm text-zinc-500 font-medium">Professional contract generated in seconds</p>
          </div>
        </div>

        {user?.role === 'BUSINESS' && !deal.contractUrl && (
          <button 
            onClick={generateContract}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Now
              </>
            )}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {deal.contractUrl ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <div className={`prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-serif leading-relaxed text-sm ${!showFull ? 'max-h-60 overflow-hidden mask-fade' : ''}`}>
               <ReactMarkdown>{deal.contractUrl}</ReactMarkdown>
            </div>
            
            <div className={`flex items-center justify-center gap-4 mt-8 ${!showFull ? 'absolute bottom-0 left-0 right-0 py-10 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent' : ''}`}>
               <button 
                 onClick={() => setShowFull(!showFull)}
                 className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-200 dark:border-white/10 shadow-lg hover:bg-zinc-100 transition-all text-sm"
               >
                 {showFull ? 'Show Less' : 'Read Full Agreement'}
               </button>
               {showFull && (
                 <button className="p-3 bg-zinc-950 text-white rounded-2xl hover:scale-105 transition-all shadow-xl dark:bg-zinc-50 dark:text-zinc-950">
                    <Download className="w-5 h-5" />
                 </button>
               )}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 opacity-30">
            <Wand2 className="w-16 h-16 mx-auto mb-6 text-zinc-400" />
            <p className="italic text-lg font-medium">No agreement has been drafted yet.</p>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .mask-fade {
          mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
        }
      `}</style>
    </div>
  );
};

export default ContractView;
