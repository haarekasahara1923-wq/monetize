"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import axios from 'axios';
import { User, Briefcase } from 'lucide-react';

import { Suspense } from 'react';

const baseSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Full name required'),
  role: z.enum(['INFLUENCER', 'BUSINESS']),
});

type SignupFormValues = z.infer<typeof baseSchema>;

const SignupFormContent = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') as 'INFLUENCER' | 'BUSINESS' | null;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      role: initialRole || 'INFLUENCER',
    }
  });

  const { setAuth } = useAuth();
  const selectedRole = watch('role');

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        ...values,
        passwordHash: values.password,
      });
      
      setAuth(response.data.user, response.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl p-8 md:p-10 premium-card bg-white dark:bg-zinc-900"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create Your Account</h1>
          <p className="text-zinc-500 text-sm">Join the leading marketplace today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 italic">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <label className="block text-sm font-semibold mb-4 text-center">I am an...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue('role', 'INFLUENCER')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                    selectedRole === 'INFLUENCER' 
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg' 
                    : 'border-zinc-100 hover:border-zinc-200 dark:border-white/5 dark:hover:bg-zinc-800'
                  }`}
                >
                  <User className={`w-8 h-8 ${selectedRole === 'INFLUENCER' ? 'text-primary' : 'text-zinc-400'}`} />
                  <span className="font-bold">Influencer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'BUSINESS')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                    selectedRole === 'BUSINESS' 
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg' 
                    : 'border-zinc-100 hover:border-zinc-200 dark:border-white/5 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Briefcase className={`w-8 h-8 ${selectedRole === 'BUSINESS' ? 'text-primary' : 'text-zinc-400'}`} />
                  <span className="font-bold">Business</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-4 mt-6 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
              >
                Continue
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold mb-1.5 px-1">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 px-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 px-1">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                  placeholder="name@mail.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 px-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 px-1">Create Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1 px-1">{errors.password.message}</p>}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center font-bold"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    `Signup as ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}`
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const SignupPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center italic text-zinc-400">Loading signup...</div>}>
      <SignupFormContent />
    </Suspense>
  );
};

export default SignupPage;
