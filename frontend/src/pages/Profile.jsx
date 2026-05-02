import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit3, 
  LogOut, 
  ShieldAlert, 
  CheckCircle2,
  Settings,
  Grid,
  Activity,
  Heart
} from 'lucide-react';
import { fetchUserProfile } from '../api';
import { Button, Card, Badge } from '../components/ui';

export function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const loggedInUser = JSON.parse(localStorage.getItem('userInfo'));
  const isOwnProfile = !id || id === loggedInUser?.id;
  const profileId = id || loggedInUser?.id;

  useEffect(() => {
    if (!profileId) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      const { data } = await fetchUserProfile(profileId);
      setUser(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05060A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen bg-[#05060A] flex flex-col items-center justify-center text-white p-4">
      <h2 className="text-2xl font-black italic mb-4">{error || 'User not found'}</h2>
      <Button onClick={() => navigate('/')}>Back Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05060A] text-white font-sans selection:bg-indigo-500/30 pb-20">
      
      {/* Cinematic Cover / Gradient Background */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-[#05060A]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6 md:gap-10 mb-12">
          {/* Avatar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="h-32 w-32 md:h-44 md:w-44 rounded-[2.5rem] p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl">
              <div className="w-full h-full rounded-[2.2rem] bg-[#0A0C14] overflow-hidden flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={64} className="text-white/10" />
                )}
              </div>
            </div>
            {isOwnProfile && (
              <Link 
                to="/edit-profile"
                className="absolute bottom-2 right-2 p-3 bg-white text-black rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-95"
              >
                <Edit3 size={18} />
              </Link>
            )}
          </motion.div>

          {/* User Info Header */}
          <div className="flex-1 space-y-4 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-5xl font-black italic tracking-tight">{user.name}</h1>
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest italic">
                    Verified Student
                  </Badge>
                </div>
                <p className="text-indigo-400/60 font-black text-xs md:text-sm tracking-[0.2em] uppercase">
                  @{user.username || user.email.split('@')[0]}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isOwnProfile ? (
                  <>
                    <Button 
                      variant="outline"
                      className="border-white/5 bg-white/5 hover:bg-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest px-6 h-12 rounded-2xl"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} className="mr-2" /> Logout
                    </Button>
                    <Button 
                      className="bg-white text-black hover:bg-white/90 font-black text-[10px] uppercase tracking-widest px-8 h-12 rounded-2xl"
                      onClick={() => navigate('/edit-profile')}
                    >
                      Settings
                    </Button>
                  </>
                ) : (
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest px-8 h-12 rounded-2xl shadow-xl shadow-indigo-600/20">
                    Follow
                  </Button>
                )}
              </div>
            </div>

            {/* Bio & Details */}
            <div className="space-y-4 max-w-2xl">
              <p className="text-white/60 font-medium text-sm md:text-base leading-relaxed italic">
                {user.bio || "This user is on a mission to build the future of education with Admyra. No bio provided yet."}
              </p>
              
              <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-white/20">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-500/50" />
                  Hyderabad, IN
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-500/50" />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-indigo-500/50" />
                  {user.grievances?.length || 0} Reports
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Tabs */}
        <div className="mt-16 space-y-12">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em]">
                <Grid size={16} /> Activity Wall
             </div>
             <div className="h-px flex-1 bg-white/5" />
          </div>

          {user.grievances?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.grievances.map((g) => (
                <Card key={g.id} className="p-8 border-white/5 bg-[#0A0C14] hover:border-indigo-500/20 transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <ShieldAlert size={80} className="text-indigo-500" />
                   </div>
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                         <Badge className={cn(
                           "border-none px-3 py-1 rounded-lg text-[8px] font-black uppercase italic tracking-wider",
                           g.status === 'pending' ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                         )}>
                           {g.status}
                         </Badge>
                         <span className="text-[9px] font-bold text-white/20">{new Date(g.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest">{g.college}</h3>
                      <p className="text-base font-bold text-white/60 italic leading-relaxed">"{g.description}"</p>
                      <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
                         <Activity size={12} /> Verification Status: Student Network Audit
                      </div>
                   </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-6">
               <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/10">
                  <Activity size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black italic">Nothing to see here.</h3>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">No grievances reported by this user yet.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
