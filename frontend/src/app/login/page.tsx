"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

      const response = await axios.post(`${apiUrl}/auth/login`, {
        email: values.email,
        passwordHash: values.password, // backend expects passwordHash as the field name but value is plain password here
      });
      
      setAuth(response.data.user, response.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 md:p-10 premium-card bg-white dark:bg-zinc-900"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-zinc-500 text-sm">Log in to your Monetize Connect account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
              placeholder="name@company.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-5 py-3.5 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:bg-zinc-800 dark:border-white/5"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
