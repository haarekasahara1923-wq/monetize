"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Phone, MessageSquare, Mail, 
  Instagram, Facebook, Youtube, Twitter, Linkedin, 
  Send, Hash, Camera, Globe, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

const InfluencerProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    }
  }, [user, router]);

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
    // Simulating API call
    setTimeout(() => {
      setProfile({ ...formData, metrics });
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card bg-white dark:bg-zinc-900 p-8 md:p-12"
          >
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-extrabold mb-2">Create Your Influencer Profile</h1>
              <p className="text-zinc-500">Let brands find you with accurate data</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Info Section */}
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
                  <User className="w-5 h-5 text-primary" /> Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input 
                      type="text" name="name" value={formData.name} readOnly
                      className="w-full px-5 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 italic text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input 
                      type="email" name="email" value={formData.email} readOnly 
                      className="w-full px-5 py-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800 italic text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Pincode</label>
                    <input 
                      type="text" name="pincode" required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                      placeholder="400001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <input 
                      type="text" name="address" required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                      placeholder="123 Road, Colony..."
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

              {/* Bio & Niche Section */}
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
                  <Camera className="w-5 h-5 text-primary" /> Profile Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold mb-2">Profile Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed flex items-center justify-center overflow-hidden">
                        {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="text-zinc-400" />}
                      </div>
                      <input type="file" onChange={handleImageUpload} className="text-xs" accept="image/*" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Niche (e.g., Tech, Fashion, Food)</label>
                    <input 
                      type="text" name="niche" required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                      placeholder="Tech Influencer"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Bio</label>
                    <textarea 
                      name="bio" rows={3} required onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-zinc-800"
                      placeholder="Tell brands why they should work with you..."
                    />
                  </div>
                </div>
              </section>

              {/* Social Metrics Section */}
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-2">
                  <Instagram className="w-5 h-5 text-primary" /> Social Media Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {platforms.map((platform) => (
                    <div key={platform.name} className="p-5 rounded-2xl border dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-3 mb-4">
                        <platform.icon className="w-5 h-5 text-primary" />
                        <span className="font-bold">{platform.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {['followers', 'views', 'comments', 'likes'].map(field => (
                          <div key={field}>
                            <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">{field}</label>
                            <input 
                              type="number"
                              onChange={(e) => handleMetricChange(platform.name, field, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border text-sm dark:bg-zinc-900"
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-primary text-white font-extrabold text-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Generate My Professional Profile <CheckCircle2 /></>}
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Profile Generated Successfully!</h1>
              <p className="text-zinc-500">Here is how you appear to brands</p>
            </div>

            {/* Profile Card Preview */}
            <div className="flex justify-center">
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setProfile({ ...profile, showModal: true })}
                className="w-full max-w-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl p-8 cursor-pointer relative group overflow-hidden"
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-800 mb-6 border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden">
                    {profile.image ? <img src={profile.image} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-full h-full p-6 text-zinc-300" />}
                  </div>
                  <h2 className="text-2xl font-black mb-1">{profile.name}</h2>
                  <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                    {profile.niche}
                  </div>
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-6">
                    {profile.bio}
                  </p>
                  
                  <div className="w-full grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                      <div className="text-xs text-zinc-400 font-bold uppercase">Followers</div>
                      <div className="text-lg font-black text-primary">120K+</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                      <div className="text-xs text-zinc-400 font-bold uppercase">Engagement</div>
                      <div className="text-lg font-black text-primary">4.8%</div>
                    </div>
                  </div>

                  <button className="w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-bold flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                    View Full Profile <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Public Profile Modal */}
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
                        <div className="aspect-square rounded-[2rem] bg-zinc-100 mb-6 overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800">
                           {profile.image ? <img src={profile.image} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-full h-full p-10 text-zinc-300" />}
                        </div>
                        <h2 className="text-3xl font-black mb-2">{profile.name}</h2>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
                           {profile.niche}
                        </div>
                        
                        <div className="space-y-4 text-sm">
                          <div className="flex items-center gap-3 text-zinc-500">
                            <MapPin className="w-4 h-4" /> {profile.pincode}, {profile.address}
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
                          <h3 className="text-xl font-bold mb-4">About Me</h3>
                          <p className="text-zinc-500 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl">
                             {profile.bio}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold mb-4">Social Presence</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Object.entries(profile.metrics).map(([name, m]: any) => (
                              <div key={name} className="p-4 rounded-2xl border dark:border-white/5 bg-zinc-50 dark:bg-zinc-800">
                                <span className="block text-[10px] font-black uppercase text-primary mb-1">{name}</span>
                                <span className="block text-lg font-black">{m.followers || 0}</span>
                                <span className="text-[10px] text-zinc-400 font-medium">Followers</span>
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
                      Close Profile
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-center">
              <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline">
                Edit My Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerProfilePage;
