"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { motion } from 'framer-motion';
import { 
  Briefcase, User, MapPin, Phone, MessageSquare, 
  Mail, ShoppingBag, Globe, Camera, CheckCircle2, 
  Building2, Package, Save, LayoutDashboard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    authorityName: '',
    targetArea: '',
    pincode: '',
    address: '',
    mobile: user?.phone || '',
    whatsapp: '',
    email: user?.email || '',
    bio: '',
    image: null as string | null,
  });

  const [products, setProducts] = useState(['', '', '', '', '']);

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
        businessName: data.businessName || '',
        authorityName: data.authorityName || '',
        targetArea: data.targetLocation || '',
        pincode: data.pincode || '',
        address: data.address || '',
        mobile: data.phone || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        bio: data.bio || '',
        image: data.image || null,
      });

      if (data.dealingProducts) {
        const pList = data.dealingProducts.split(';').map((p: string) => p.trim());
        const padded = [...pList, '', '', '', '', ''].slice(0, 5);
        setProducts(padded);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index: number, value: string) => {
    const updated = [...products];
    updated[index] = value;
    setProducts(updated);
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
      
      const productsString = products.filter(p => p.trim()).join('; ');

      await axios.patch(`${apiUrl}/users/${user?.id}`, {
        businessName: formData.businessName,
        authorityName: formData.authorityName,
        targetLocation: formData.targetArea,
        pincode: formData.pincode,
        address: formData.address,
        phone: formData.mobile,
        whatsapp: formData.whatsapp,
        bio: formData.bio,
        image: formData.image,
        dealingProducts: productsString
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
            <LayoutDashboard className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-black tracking-tight">Business Dashboard</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-11">Manage your brand profile. This data helps influencers discover and connect with you.</p>
        </div>

        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 font-bold text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Brand profile saved successfully! Your card is now live.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-lg border border-zinc-100 dark:border-white/5">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-wider text-purple-500">
              <Building2 className="w-5 h-5" /> Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Business Name</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Authority/Owner Name</label>
                <input type="text" name="authorityName" required onChange={handleInputChange} value={formData.authorityName}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Logo / Brand Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed flex items-center justify-center overflow-hidden">
                    {formData.image ? <img src={formData.image} alt="Logo" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-zinc-400" />}
                  </div>
                  <input type="file" onChange={handleImageUpload} className="text-xs" accept="image/*" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Target Area / Region</label>
                <input type="text" name="targetArea" required onChange={handleInputChange} value={formData.targetArea}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800" placeholder="Pan India, North India..." />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Pincode</label>
                <input type="text" name="pincode" required onChange={handleInputChange} value={formData.pincode}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800" placeholder="400001" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Full Address</label>
                <input type="text" name="address" required onChange={handleInputChange} value={formData.address}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800" placeholder="Full office address..." />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-lg border border-zinc-100 dark:border-white/5">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-wider text-purple-500">
              <Phone className="w-5 h-5" /> Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Mobile Number</label>
                <input type="text" name="mobile" required onChange={handleInputChange} value={formData.mobile}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">WhatsApp Number</label>
                <input type="text" name="whatsapp" required onChange={handleInputChange} value={formData.whatsapp}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} readOnly
                  className="w-full px-4 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-sm" />
              </div>
            </div>
          </div>

          {/* Bio & Products */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-lg border border-zinc-100 dark:border-white/5">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-wider text-purple-500">
              <Package className="w-5 h-5" /> Brand Details & Products
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-2">Brand Bio</label>
                <textarea name="bio" rows={3} required onChange={handleInputChange} value={formData.bio}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800"
                  placeholder="What makes your brand unique..." />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-zinc-400 mb-3">Dealing Products (up to 5)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((p, i) => (
                    <input 
                      key={i}
                      type="text" 
                      value={p} 
                      onChange={(e) => handleProductChange(i, e.target.value)}
                      className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:bg-zinc-800"
                      placeholder={`Product ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-purple-600 text-white font-black text-lg hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save & Publish Brand Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessDashboard;
