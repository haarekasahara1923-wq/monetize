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
import { User, Briefcase, ChevronRight, ChevronLeft, CheckCircle2, MapPin, Phone, Instagram, Send } from 'lucide-react';
import { Suspense } from 'react';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Full name required'),
  role: z.enum(['INFLUENCER', 'BUSINESS']),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  // Influencer specific
  bio: z.string().optional(),
  achievements: z.string().optional(),
  // Business specific
  businessName: z.string().optional(),
  ownerName: z.string().optional(),
  address: z.string().optional(),
  targetLocation: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupFormContent = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as 'INFLUENCER' | 'BUSINESS' | null) || 'INFLUENCER';

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: initialRole,
    }
  });

  const { setAuth } = useAuth();
  const selectedRole = watch('role');

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

      const response = await axios.post(`${apiUrl}/auth/signup`, {
        ...values,
        passwordHash: values.password,
      });
      
      setAuth(response.data.user, response.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup Error:', err);
      setError(err?.response?.data?.message || 'Signup failed. Please try again. (Make sure API_URL is correct)');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl p-8 md:p-10 premium-card bg-white dark:bg-zinc-900 overflow-hidden relative"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create Your Account</h1>
          <p className="text-zinc-500 text-sm">Step {step} of 3: {step === 1 ? 'Choose Role' : step === 2 ? 'Basic Information' : 'Role Details'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'INFLUENCER')}
                    className={`p-8 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 ${
                      selectedRole === 'INFLUENCER' 
                      ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg' 
                      : 'border-zinc-100 hover:border-zinc-200 dark:border-white/5 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className={`p-4 rounded-full ${selectedRole === 'INFLUENCER' ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="font-bold text-lg block">Influencer</span>
                      <p className="text-xs text-zinc-500 mt-1">Monetize your content & reach</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('role', 'BUSINESS')}
                    className={`p-8 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 ${
                      selectedRole === 'BUSINESS' 
                      ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg' 
                      : 'border-zinc-100 hover:border-zinc-200 dark:border-white/5 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className={`p-4 rounded-full ${selectedRole === 'BUSINESS' ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="font-bold text-lg block">Business</span>
                      <p className="text-xs text-zinc-500 mt-1">Find best creators for your brand</p>
                    </div>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-4 mt-6 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Continue to Personal Info <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5 px-1">Full Name</label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 px-1">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                      placeholder="name@mail.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 px-1">Password</label>
                    <input
                      type="password"
                      {...register('password')}
                      className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 px-1">Phone Number</label>
                    <input
                      type="text"
                      {...register('phone')}
                      className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 px-1">WhatsApp</label>
                    <input
                      type="text"
                      {...register('whatsapp')}
                      className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 px-1">City</label>
                    <input
                      type="text"
                      {...register('city')}
                      className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 px-1">State</label>
                    <input
                      type="text"
                      {...register('state')}
                      className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    Almost There <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {selectedRole === 'INFLUENCER' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5 px-1">Bio</label>
                      <textarea
                        {...register('bio')}
                        rows={3}
                        className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                        placeholder="Tell brands about yourself..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5 px-1">Major Achievements</label>
                      <textarea
                        {...register('achievements')}
                        rows={3}
                        className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                        placeholder="e.g., 100k+ followers on IG, Worked with Brands like Nike..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 px-1">Business Name</label>
                        <input
                          type="text"
                          {...register('businessName')}
                          className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 px-1">Owner Name</label>
                        <input
                          type="text"
                          {...register('ownerName')}
                          className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                          placeholder="John Owner"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-1.5 px-1">Business Address</label>
                        <textarea
                          {...register('address')}
                          rows={2}
                          className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                          placeholder="123 Street, Business Park..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-1.5 px-1">Target Location/Market</label>
                        <input
                          type="text"
                          {...register('targetLocation')}
                          className="w-full px-5 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
                          placeholder="India, Global, Mumbai..."
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Complete Registration <CheckCircle2 className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

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

