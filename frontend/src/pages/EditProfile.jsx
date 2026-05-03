import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Camera, 
  AtSign, 
  FileText, 
  Check,
  ChevronLeft,
  X
} from 'lucide-react';
import { fetchUserProfile, updateUserProfile } from '../api';
import { Button, Card, Input } from '../components/ui';

export function EditProfile() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('userInfo'));
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/');
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await fetchUserProfile(loggedInUser.id);
      setFormData({
        name: data.name || '',
        username: data.username || '',
        bio: data.bio || '',
        avatar: data.avatar || ''
      });
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setError('');
      try {
        let fileToProcess = file;
        
        // Handle HEIC format from iPhones
        if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
          const heic2any = (await import('heic2any')).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          });
          fileToProcess = new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), {
            type: 'image/jpeg'
          });
        }

        if (fileToProcess.size > 2 * 1024 * 1024) {
          setError('Image size should be less than 2MB');
          setLoading(false);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, avatar: reader.result });
          setLoading(false);
        };
        reader.readAsDataURL(fileToProcess);
      } catch (err) {
        console.error('Image processing error:', err);
        setError('Failed to process image. Please try another one.');
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!loggedInUser) {
      navigate('/');
      return;
    }

    try {
      const { data } = await updateUserProfile(formData);
      // Update local storage info if name/avatar changed
      const updatedInfo = { ...loggedInUser, name: data.name, avatar: data.avatar, username: data.username };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      navigate(`/profile/${loggedInUser.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-[#05060A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05060A] text-white font-sans py-20 px-4">
      <div className="max-w-2xl mx-auto space-y-12">
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl font-black italic tracking-tight">Edit Profile.</h1>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold p-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-6">
             <div 
               className="relative group cursor-pointer"
               onClick={() => document.getElementById('avatar-upload').click()}
             >
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden shadow-2xl relative">
                   {formData.avatar ? (
                     <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <UserIcon size={48} className="text-white/10" />
                     </div>
                   )}
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-indigo-600/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Camera size={24} className="text-white mb-2" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white">Change</span>
                   </div>
                </div>
                <input 
                  id="avatar-upload"
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handleFileChange}
                />
             </div>
             
             <div className="w-full text-center space-y-4">
                <Button 
                   type="button"
                   variant="ghost" 
                   onClick={() => document.getElementById('avatar-upload').click()}
                   className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500/10 h-10 px-6 rounded-xl"
                >
                   <Camera size={14} className="mr-2" /> Choose from Gallery
                </Button>
                
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Or Paste Image URL</label>
                   <Input 
                     value={formData.avatar}
                     onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                     placeholder="https://images.unsplash.com/photo-..."
                     className="bg-white/[0.02] border-white/10 text-center italic"
                   />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <UserIcon size={12} /> Full Name
               </label>
               <Input 
                 required
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="bg-white/[0.02] border-white/10"
               />
            </div>
            
            <div className="space-y-2">
               <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <AtSign size={12} /> Username
               </label>
               <Input 
                 value={formData.username}
                 onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                 placeholder="your_handle"
                 className="bg-white/[0.02] border-white/10"
               />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText size={12} /> Profile Bio
             </label>
             <textarea 
               value={formData.bio}
               onChange={(e) => setFormData({...formData, bio: e.target.value})}
               placeholder="Tell the world about yourself..."
               className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-indigo-500/50 transition-all resize-none italic"
             />
          </div>

          <div className="pt-6 flex gap-4">
             <Button 
                type="button"
                variant="outline"
                className="flex-1 border-white/5 bg-white/5 hover:bg-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest h-14 rounded-2xl"
                onClick={() => navigate(-1)}
             >
                Cancel
             </Button>
             <Button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-white text-black hover:bg-white/90 font-black text-[10px] uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-white/5"
             >
                {loading ? 'Saving Changes...' : 'Update Profile'}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
