"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, User, MapPin, Phone, MessageSquare, 
  Mail, ShoppingBag, Globe, Camera, CheckCircle2, 
  ChevronRight, Building2, Package 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const BusinessProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    authorityName: '',
    address: '',
    pincode: '',
    mobile: user?.phone || '',
    whatsapp: '',
    email: user?.email || '',
    bio: '',
    targetArea: '',
    products: ['', '', '', '', ''], // Up to 5
    image: null as string | null,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index: number, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index] = value;
    setFormData({ ...formData, products: newProducts });
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
    // Simulating API call
    setTimeout(() => {
      setProfile(formData);
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6">
        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card bg-white dark:bg-zinc-900 p-8 md:p-12"
          >
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-extrabold mb-2">Create Your Business Profile</h1>
              <p className="text-zinc-500">Showcase your brand to the best influencers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Business Info Section */}
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
                  <Building2 className="w-5 h-5 text-primary" /> Company Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Business Name</label>
                    <input 
                      type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} required
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name of Authority</label>
                    <input 
                      type="text" name="authorityName" required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                      placeholder="Proprietor / Director Name"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold mb-2">Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed flex items-center justify-center overflow-hidden">
                        {formData.image ? <img src={formData.image} alt="Logo" className="w-full h-full object-cover" /> : <Camera className="text-zinc-400" />}
                      </div>
                      <input type="file" onChange={handleImageUpload} className="text-xs" accept="image/*" />
                    </div>
                  </div>
                   <div>
                    <label className="block text-sm font-semibold mb-2">Specific Target Area</label>
                    <input 
                      type="text" name="targetArea" required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                      placeholder="Global, India, Mumbai..."
                    />
                  </div>
                </div>
              </section>

              {/* Contact Info Section */}
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
                  <MapPin className="w-5 h-5 text-primary" /> Contact & Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Pincode</label>
                    <input 
                      type="text" name="pincode" required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Address</label>
                    <input 
                      type="text" name="address" required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mobile Number</label>
                    <input 
                      type="text" name="mobile" required onChange={handleInputChange} value={formData.mobile}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">WhatsApp Number</label>
                    <input 
                      type="text" name="whatsapp" required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                    />
                  </div>
                </div>
              </section>

              {/* Products Section */}
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
                  <Package className="w-5 h-5 text-primary" /> Dealing Products (Up to 5)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.products.map((p, i) => (
                    <div key={i}>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Product {i+1}</label>
                      <input 
                        type="text" 
                        value={p}
                        onChange={(e) => handleProductChange(i, e.target.value)}
                        className="w-full px-5 py-2.5 rounded-xl border focus:ring-2 focus:ring-primary outline-none dark:bg-zinc-800"
                        placeholder={`Product ${i+1}`}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Bio / Brief
                </h2>
                <textarea 
                  name="bio" rows={4} required onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                  placeholder="Describe your brand and what you are looking for in collaborations..."
                />
              </section>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-primary text-white font-extrabold text-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Generate Business Profile <CheckCircle2 /></>}
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Business Profile Live!</h1>
              <p className="text-zinc-500">Your brand card is ready for influencers to discover</p>
            </div>

            {/* Business Card Preview */}
            <div className="flex justify-center">
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setProfile({ ...profile, showModal: true })}
                className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl p-8 cursor-pointer relative group border-t-8 border-primary overflow-hidden"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-6 shadow-lg overflow-hidden flex items-center justify-center">
                    {profile.image ? <img src={profile.image} alt="Logo" className="w-full h-full object-cover" /> : <Building2 className="w-12 h-12 text-zinc-300" />}
                  </div>
                  <h2 className="text-2xl font-black mb-1">{profile.businessName}</h2>
                  <div className="text-primary font-bold text-sm mb-4">
                    {profile.authorityName}
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {profile.products.filter((p: string) => p).map((p: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 uppercase">
                        {p}
                      </span>
                    ))}
                  </div>

                  <p className="text-zinc-500 text-sm line-clamp-3 mb-8 italic">
                    "{profile.bio}"
                  </p>

                  <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    View Brand Page <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Business Public Profile Modal */}
            <AnimatePresence>
              {profile.showModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                  onClick={() => setProfile({ ...profile, showModal: false })}
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      <div className="md:col-span-1">
                        <div className="aspect-square rounded-[2rem] bg-zinc-100 mb-6 overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800 flex items-center justify-center">
                           {profile.image ? <img src={profile.image} alt="Logo" className="w-full h-full object-cover" /> : <Building2 className="w-20 h-20 text-zinc-300" />}
                        </div>
                        <h2 className="text-3xl font-black mb-2">{profile.businessName}</h2>
                        <div className="text-primary font-bold mb-6">
                           {profile.authorityName}
                        </div>
                        
                        <div className="space-y-4 text-sm">
                          <div className="flex items-center gap-3 text-zinc-500">
                            <MapPin className="w-4 h-4" /> {profile.pincode}, {profile.address}
                          </div>
                          <div className="flex items-center gap-3 text-zinc-500">
                            <Globe className="w-4 h-4" /> {profile.targetArea}
                          </div>
                          <div className="flex items-center gap-3 text-zinc-500">
                            <Phone className="w-4 h-4" /> {profile.mobile}
                          </div>
                          <div className="flex items-center gap-3 text-zinc-500">
                            <Mail className="w-4 h-4" /> {profile.email}
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-8">
                        <div>
                          <h3 className="text-xl font-bold mb-4">About the Brand</h3>
                          <p className="text-zinc-500 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl">
                             {profile.bio}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                             <Package className="w-5 h-5 text-primary" /> Our Products
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {profile.products.filter((p: string) => p).map((p: string, i: number) => (
                              <div key={i} className="p-4 rounded-2xl border dark:border-white/5 bg-zinc-50 dark:bg-zinc-800 flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span className="font-bold">{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setProfile({ ...profile, showModal: false })}
                      className="mt-10 w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold hover:bg-zinc-200"
                    >
                      Close Brand Overview
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center">
              <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline">
                Edit Business Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessProfilePage;
