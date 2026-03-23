"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Phone, MessageSquare, Mail, 
  Instagram, Facebook, Youtube, Twitter, Linkedin, 
  Send, Hash, Camera, Globe, CheckCircle2, Save,
  PhoneCall, Video, LayoutDashboard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const platforms = [
  { name: 'Instagram', icon: Instagram },
  { name: 'Facebook', icon: Facebook },
  { name: 'YouTube', icon: Youtube },
  { name: 'X', icon: Twitter },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Threads', icon: Hash },
  { name: 'Snapchat', icon: Camera },
  { name: 'Telegram', icon: Send },
  { name: 'WhatsApp Channel', icon: MessageSquare },
  { name: 'Others 1', icon: Globe },
  { name: 'Others 2', icon: Globe },
  { name: 'Others 3', icon: Globe },
];

const InfluencerDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '',
    pincode: '',
    mobile: user?.phone || '',
    whatsapp: '',
    email: user?.email || '',
    bio: '',
    niche: '',
    image: null as string | null,
  });

  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      const response = await axios.get(`${apiUrl}/users/${user?.id}`);
      const data = response.data;
      
      setFormData({
        name: data.name || '',
        address: data.address || '',
        pincode: data.pincode || '',
        mobile: data.phone || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        bio: data.bio || '',
        niche: data.niche || '',
        image: data.image || null,
      });

      if (data.platformStats) {
        const statsObj: any = {};
        data.platformStats.forEach((s: any) => {
          statsObj[s.platform] = {
            followers: s.followers,
            views: s.avgViews,
            likes: s.avgLikes,
            comments: s.avgComments,
          };
        });
        setMetrics(statsObj);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMetricChange = (platform: string, field: string, value: string) => {
    setMetrics({
      ...metrics,
      [platform]: {
        ...metrics[platform],
        [field]: value
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const statsArray = Object.entries(metrics).map(([platform, m]: [string, any]) => ({
        platform,
        followers: Number(m.followers || 0),
        avgViews: Number(m.views || 0),
        avgLikes: Number(m.likes || 0),
        avgComments: Number(m.comments || 0),
      }));

      await axios.patch(`${apiUrl}/users/${user?.id}`, {
        phone: formData.mobile,
        whatsapp: formData.whatsapp,
        address: formData.address,
        pincode: formData.pincode,
        bio: formData.bio,
        niche: formData.niche,
        image: formData.image,
        platformStats: statsArray
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save profile. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6">
        {/* Dashboard Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-black tracking-tight">Influencer Dashboard</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-11">Manage your profile. This data is saved and shown to brands looking to collaborate.</p>
        </div>

        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 font-bold text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Profile saved successfully! Your card is now live.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-lg border border-zinc-100 dark:border-white/5">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-wider text-primary">
              <User className="w-5 h-5" /> Personal Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} readOnly
                  className="w-full px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} readOnly
                  className="w-full px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Mobile Number</label>
                <input type="text" name="mobile" required onChange={handleInputChange} value={formData.mobile}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-zinc-800" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">WhatsApp Number</label>
                <input type="text" name="whatsapp" required onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-zinc-800" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Address</label>
                <input type="text" name="address" required onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-zinc-800" placeholder="Full address..." />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Pincode</label>
                <input type="text" name="pincode" required onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-zinc-800" placeholder="400001" />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-lg border border-zinc-100 dark:border-white/5">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-wider text-primary">
              <Camera className="w-5 h-5" /> Profile Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed flex items-center justify-center overflow-hidden">
                    {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-zinc-400" />}
                  </div>
                  <input type="file" onChange={handleImageUpload} className="text-xs" accept="image/*" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Niche</label>
                <input type="text" name="niche" required onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-zinc-800" placeholder="e.g. Tech, Fashion, Food" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Bio</label>
                <textarea name="bio" rows={3} required onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none text-sm dark:bg-zinc-800"
                  placeholder="Tell brands why they should work with you..." />
              </div>
            </div>
          </div>

          {/* Social Media Metrics */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-lg border border-zinc-100 dark:border-white/5">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-wider text-primary">
              <Instagram className="w-5 h-5" /> Social Media Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {platforms.map((platform) => (
                <div key={platform.name} className="p-5 rounded-2xl border dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/50 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-2 mb-4">
                    <platform.icon className="w-4 h-4 text-primary" />
                    <span className="font-black text-sm">{platform.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['followers', 'views', 'comments', 'likes'].map(field => (
                      <div key={field}>
                        <label className="block text-[9px] uppercase font-black text-zinc-400 mb-1">{field}</label>
                        <input 
                          type="number"
                          onChange={(e) => handleMetricChange(platform.name, field, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border text-xs dark:bg-zinc-900 focus:ring-1 focus:ring-primary outline-none"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save & Publish Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfluencerDashboard;
