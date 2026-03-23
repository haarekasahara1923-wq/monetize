"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageSquare, CreditCard, ShieldCheck } from 'lucide-react';

const FEATURE_LIST = [
  {
    icon: <ShoppingBag className="w-6 h-6 text-primary" />,
    title: "Campaign Management",
    description: "Businesses can create, manage, and track campaigns with ease. Find the right talent in seconds."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-secondary" />,
    title: "Real-time Negotiation",
    description: "Direct chat and negotiation with creators. Counter-offers, status updates, and transparent deal-making."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-accent" />,
    title: "Secure Escrow",
    description: "Payments are held securely in our system and released only when deliverables are approved."
  },
  {
    icon: <CreditCard className="w-6 h-6 text-indigo-500" />,
    title: "Transparent Payouts",
    description: "Influencers get paid instantly on deal completion. Automated invoicing and payout tracking."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 uppercase tracking-widest text-sm">
            Everything You Need
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">Built For Modern Collaboration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURE_LIST.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="premium-card"
            >
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
