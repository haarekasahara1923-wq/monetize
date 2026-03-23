"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface StatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const StatCard = ({ label, value, icon, trend }: StatProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all">
          {icon}
        </div>
        {trend && (
          <div className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${trend.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <div>
        <div className="text-zinc-500 text-sm font-semibold mb-2">{label}</div>
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
