"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Users, Building2, UserCheck, Shield, 
  Search, Filter, ExternalLink, Download 
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'influencers' | 'businesses'>('influencers');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      // For demo, I'll allow access but in reality we check role
      // router.push('/login');
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
      
      const infRes = await axios.get(`${apiUrl}/users/influencers`);
      const busRes = await axios.get(`${apiUrl}/users/businesses`);
      
      setInfluencers(infRes.data);
      setBusinesses(busRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary" /> Admin Command Center
            </h1>
            <p className="text-zinc-500 font-medium">Real-time user monitoring and verification</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border text-sm font-bold hover:bg-zinc-100 transition-all">
              Refresh Data
            </button>
            <button className="px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 flex items-center gap-2 hover:bg-primary-dark transition-all">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-xl border-b-8 border-primary">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Total Users</span>
            </div>
            <div className="text-4xl font-black">{influencers.length + businesses.length}</div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-xl border-b-8 border-indigo-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Influencers</span>
            </div>
            <div className="text-4xl font-black">{influencers.length}</div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-xl border-b-8 border-purple-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Businesses</span>
            </div>
            <div className="text-4xl font-black">{businesses.length}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-white/5">
          <div className="flex border-b border-zinc-100 dark:border-white/5">
            <button 
              onClick={() => setTab('influencers')}
              className={`flex-1 py-6 font-bold transition-all ${tab === 'influencers' ? 'bg-primary text-white' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              Influencer Database
            </button>
            <button 
              onClick={() => setTab('businesses')}
              className={`flex-1 py-6 font-bold transition-all ${tab === 'businesses' ? 'bg-primary text-white' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              Business Directory
            </button>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-zinc-400 text-xs font-black uppercase tracking-widest border-b border-zinc-100 dark:border-white/5">
                  <tr>
                    <th className="py-5 px-4 font-black">Details</th>
                    <th className="py-5 px-4 font-black">Contact Info</th>
                    <th className="py-5 px-4 font-black">Address/Pincode</th>
                    <th className="py-5 px-4 font-black">Status</th>
                    <th className="py-5 px-4 font-black">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center italic text-zinc-400">Loading master database...</td>
                    </tr>
                  ) : (tab === 'influencers' ? influencers : businesses).map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-black">
                            {item.name?.charAt(0) || item.businessName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-lg">{item.businessName || item.name}</div>
                            <div className="text-xs text-zinc-400">{item.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="space-y-1">
                          <div className="text-sm font-bold flex items-center gap-2">
                             <span className="text-zinc-400">P:</span> {item.phone || 'N/A'}
                          </div>
                          <div className="text-sm font-bold flex items-center gap-2">
                             <span className="text-zinc-400">W:</span> {item.whatsapp || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="text-sm font-medium w-48 truncate">
                           {item.pincode ? <span>[{item.pincode}] </span> : ''}
                           {item.address || 'Pending Update'}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.isVerified ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {item.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <button className="p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && (tab === 'influencers' ? influencers : businesses).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-zinc-400 italic">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
