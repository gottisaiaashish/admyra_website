import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Heart,
  Share2,
  X as CloseIcon,
  Info,
  MessageCircle,
  ExternalLink,
  Play,
  Repeat,
  Camera,
  ImageIcon,
  Zap,
  Music,
  Smile,
  RefreshCcw,
  Search,
  Check,
  Bookmark,
  Send,
  MoreVertical,
  MoreHorizontal,
  Eye,
  EyeOff,
  ChevronLeft,
  Trash2,
  Pin,
  SmilePlus,
  ArrowUp,
  GraduationCap
} from 'lucide-react';
import { fetchUserProfile, fetchPosts, createPost, toggleLike, toggleSave, changePassword, deletePost } from '../api';
import { Button, Card, Badge } from '../components/ui';
import { colleges } from '../data/mock-data';

export function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('grid');
  
  // Content States with Demo Data

  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [stories, setStories] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  
  // UI States
  const [showCreatorMode, setShowCreatorMode] = useState(false);
  const [creatorType, setCreatorType] = useState('POST');
  const [isCameraFront, setIsCameraFront] = useState(true);
  const [showDraftView, setShowDraftView] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [taggedCollege, setTaggedCollege] = useState(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showAboutAccount, setShowAboutAccount] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState('main'); // main, password, personal, time, insights, notifications
  const [timeSpent, setTimeSpent] = useState(0); // in seconds
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [savedSubTab, setSavedSubTab] = useState('all'); // all, reels

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const streamRef = useRef(null);
  const postRefs = useRef({});
  
  useEffect(() => { localStorage.setItem('user_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('user_reels', JSON.stringify(reels)); }, [reels]);
  useEffect(() => { localStorage.setItem('user_stories', JSON.stringify(stories)); }, [stories]);
  useEffect(() => { localStorage.setItem('liked_posts', JSON.stringify(likedPosts)); }, [likedPosts]);
  useEffect(() => { localStorage.setItem('saved_posts', JSON.stringify(savedPosts)); }, [savedPosts]);

  useEffect(() => {
    const handleOpenCreator = () => setShowCreatorMode(true);
    window.addEventListener('openCreatorMode', handleOpenCreator);
    return () => window.removeEventListener('openCreatorMode', handleOpenCreator);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { loadProfile(); }, [id]);

  const loggedInUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isOwnProfile = String(user?.id) === String(loggedInUser?.id);

  useEffect(() => {
    if (selectedPostId && postRefs.current[selectedPostId]) {
      postRefs.current[selectedPostId].scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, [selectedPostId]);

  const loadProfile = async () => {
    // Faster loading: try API but don't wait more than 1.5s
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
    
    try {
      let storedUserId = null;
      try {
        const stored = localStorage.getItem('userInfo');
        if (stored) storedUserId = JSON.parse(stored)?.id;
      } catch (e) { console.error('Parse error'); }

      if (!id && !storedUserId) {
        setLoading(false);
        return;
      }

      const fetchPromise = fetchUserProfile(id || storedUserId);
      const { data } = await Promise.race([fetchPromise, timeout]);
      setUser(data);
      
      if (data.posts) {
        setPosts(data.posts.filter(p => p.type === 'photo'));
        setReels(data.posts.filter(p => p.type === 'reel'));
      }
      if (data.likes) {
        setLikedPosts(data.likes.map(l => l.postId));
      }
      if (data.saves) {
        setSavedPosts(data.saves.map(s => s.postId));
      }
    } catch (err) {
      console.error('Failed to load real profile:', err);
      // If we can't load the profile and there's no ID, redirect to login
      if (!id) {
        navigate('/');
      }
    } finally { 
      setLoading(false); 
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await toggleLike(postId);
      if (data.liked) {
        setLikedPosts([...likedPosts, postId]);
        updatePostLikeCount(postId, 1);
      } else {
        setLikedPosts(likedPosts.filter(id => id !== postId));
        updatePostLikeCount(postId, -1);
      }
    } catch (err) {
      console.error('Failed to toggle like');
    }
  };

  const updatePostLikeCount = (postId, delta) => {
    const updateFn = list => list.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + delta } : p);
    setPosts(updateFn(posts)); 
    setReels(updateFn(reels));
  };

  const handleLikeStory = (storyId) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isLiked: !s.isLiked } : s));
  };

  const handleDeleteStory = (storyId) => {
    if (window.confirm('Delete this story?')) {
      const newStories = stories.filter(s => s.id !== storyId);
      setStories(newStories);
      if (newStories.length === 0) setShowStoryViewer(false);
      else if (currentStoryIndex >= newStories.length) setCurrentStoryIndex(newStories.length - 1);
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const { data } = await toggleSave(postId);
      if (data.saved) {
        setSavedPosts([...savedPosts, postId]);
      } else {
        setSavedPosts(savedPosts.filter(id => id !== postId));
      }
    } catch (err) {
      console.error('Failed to toggle save');
    }
  };

  const handleAddComment = (postId, emoji = null) => {
    const text = emoji || commentText[postId];
    if (!text?.trim()) return;
    const newComment = { 
      id: Date.now(), 
      username: user?.username || 'user', 
      avatar: user?.avatar, 
      text: text.trim(), 
      timestamp: new Date().toISOString(), 
      isPinned: false, 
      isLiked: false,
      likesCount: 0,
      isReply: replyingTo !== null
    };
    const updateFn = list => list.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p);
    setPosts(updateFn(posts)); setReels(updateFn(reels)); setCommentText(prev => ({ ...prev, [postId]: '' }));
    setReplyingTo(null);
  };

  const handleReply = (postId, username) => {
     setReplyingTo({ username, postId });
     setCommentText({ ...commentText, [postId]: `@${username} ` });
  };

  const handleLikeComment = (postId, commentId) => {
    const updateFn = list => list.map(p => p.id === postId ? { 
      ...p, 
      comments: p.comments.map(c => c.id === commentId ? { ...c, isLiked: !c.isLiked, likesCount: c.isLiked ? (c.likesCount || 1) - 1 : (c.likesCount || 0) + 1 } : c) 
    } : p);
    setPosts(updateFn(posts)); setReels(updateFn(reels));
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Delete this post?')) {
      try {
        await deletePost(postId);
        setPosts(prev => prev.filter(p => p.id !== postId));
        setReels(prev => prev.filter(p => p.id !== postId));
        if (selectedPostId === postId) setSelectedPostId(null);
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    const updateFn = list => list.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p);
    setPosts(updateFn(posts)); setReels(updateFn(reels)); setActiveCommentId(null);
  };

  const handlePinComment = (postId, commentId) => {
    const updateFn = list => list.map(p => p.id === postId ? { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, isPinned: !c.isPinned } : { ...c, isPinned: false }) } : p);
    setPosts(updateFn(posts)); setReels(updateFn(reels)); setActiveCommentId(null);
  };

  const handleToggleHideLikes = (postId) => {
    const updateFn = list => list.map(p => p.id === postId ? { ...p, hideLikes: !p.hideLikes } : p);
    setPosts(updateFn(posts)); setReels(updateFn(reels));
  };

  const handleSendPost = (postId) => {
     setShowShareSuccess(true);
     setTimeout(() => setShowShareSuccess(false), 2000);
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm) return;
    
    setLoading(true);
    try {
      await changePassword({ 
        currentPassword: passwordForm.current, 
        newPassword: passwordForm.new 
      });
      alert('Password updated successfully!');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setSettingsView('main');
    } catch (err) {
      console.error('Password change error:', err);
      alert(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const startCamera = async () => {
    try {
      // For mobile, we should explicitly request video
      const constraints = { 
        video: { 
          facingMode: isCameraFront ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: creatorType === 'REEL' 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Camera Error:', err);
      alert(`Camera Error: ${err.message}. Please ensure you have given camera permissions.`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (showCreatorMode && !selectedMedia) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCreatorMode, isCameraFront, selectedMedia, creatorType]);

  const handleCapture = () => {
    if (creatorType === 'REEL') {
      if (isRecording) {
        // Stop recording
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } else {
        // Start recording
        recordedChunks.current = [];
        const options = { mimeType: 'video/webm;codecs=vp9,opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm';
        }
        mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          // For simplicity in this demo/MVP, we'll use object URL. 
          // Real backend would need a multipart upload.
          setSelectedMedia(url);
          setShowDraftView(true);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      }
    } else {
      // Photo capture
      if (cameraVideoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = cameraVideoRef.current.videoWidth;
        canvas.height = cameraVideoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cameraVideoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedMedia(dataUrl);
        stopCamera();
        if (creatorType === 'STORY') {
          setStories([{ id: Date.now(), url: dataUrl, type: 'STORY' }, ...stories]);
          setShowCreatorMode(false);
        } else setShowDraftView(true);
      }
    }
  };

  const handleFinalShare = async () => {
    setLoading(true);
    try {
      const { data } = await createPost({
        type: creatorType === 'REEL' ? 'reel' : 'photo',
        mediaUrl: selectedMedia,
        caption,
        collegeTag: taggedCollege?.name
      });

      const newItem = { 
        ...data, 
        likes: 0, 
        comments: [], 
        hideLikes: false,
        user: {
          name: user.name,
          username: user.username,
          avatar: user.avatar
        }
      };

      if (creatorType === 'POST') setPosts([newItem, ...posts]);
      else setReels([newItem, ...reels]);

      setShowCreatorMode(false); 
      setShowDraftView(false); 
      setCaption(''); 
      setTaggedCollege(null);
      setActiveTab(creatorType === 'REEL' ? 'reels' : 'grid');
    } catch (err) {
      console.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05060A] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Processing Media...</p>
    </div>
  );

  const currentFeed = activeTab === 'saved' 
    ? [...posts, ...reels].filter(p => savedPosts.includes(p.id) && (savedSubTab === 'reels' ? p.type === 'REEL' : true)) 
    : (activeTab === 'grid' ? posts : reels);
  const activePostForComments = currentFeed.find(p => p.id === commentingPostId);

  const handleTabDragEnd = (event, info) => {
    const swipeThreshold = 50;
    const tabOrder = ['grid', 'reels', 'saved', 'activity'];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    } else if (info.offset.x < -swipeThreshold && currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white selection:bg-indigo-500/30 pb-20 overflow-x-hidden -mt-16 md:-mt-20">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={async (e) => {
        const file = e.target.files[0];
        if (file) {
          setLoading(true);
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

            const reader = new FileReader();
            reader.onloadend = () => {
              setSelectedMedia(reader.result);
              setShowCreatorMode(true);
              setShowDraftView(true);
              setLoading(false);
            };
            reader.readAsDataURL(fileToProcess);
          } catch (err) {
            console.error('Image processing error:', err);
            alert('Failed to process image. Please try another one.');
            setLoading(false);
          }
        }
      }} />

      <motion.div 
        drag={isOwnProfile ? "x" : false} 
        dragConstraints={{ left: 0, right: 0 }} 
        onDragEnd={(_, { offset }) => isOwnProfile && offset.x > 100 && setShowCreatorMode(true)}
      >
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gradient-to-b from-indigo-600/20 to-[#05060A]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-36 relative z-10 text-center flex flex-col items-center">
          
          <div className="mb-6 flex items-center gap-2">
             <button 
               onClick={(e) => {
                 e.preventDefault();
                 navigate('/');
               }}
               className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-indigo-400 group cursor-pointer"
             >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
             </button>
             <div 
               onClick={() => setShowAboutAccount(true)}
               className="bg-indigo-500/5 border border-indigo-500/20 px-6 py-2 rounded-full flex items-center gap-2 group cursor-pointer hover:bg-indigo-500/10 transition-all"
             >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">@{user?.username || 'user'}</span>
                <ChevronLeft size={12} className="-rotate-90 text-indigo-400/40 group-hover:text-indigo-400 transition-colors" />
             </div>
              {isOwnProfile && (
                <button 
                  onClick={() => setShowSettings(true)}
                  className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white"
                >
                   <MoreHorizontal size={20} />
                </button>
              )}
          </div>

          <div className="relative mb-6 cursor-pointer" onClick={() => stories.length > 0 && setShowStoryViewer(true)}>
            {stories.length > 0 && <div className="absolute -inset-2 bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 rounded-full animate-spin-slow opacity-60" />}
            <div className="h-40 w-40 md:h-52 md:w-52 rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 relative z-10 bg-[#0A0C14]">
               <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'default'}`} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter">{user?.name}</h1>
            <div className="flex justify-center">
               <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase text-[9px] font-black italic tracking-[0.15em] px-4 py-1.5 rounded-lg">Verified Student</Badge>
            </div>
            <p className="text-white/40 text-sm md:text-base italic max-w-xl mx-auto leading-relaxed font-medium">
               {user?.bio || 'No bio yet.'}
            </p>
          </div>
          <div className="flex gap-4 w-full max-w-2xl mx-auto px-4">
            <Button variant="outline" className="flex-1 bg-white/5 border-white/10 h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] group flex items-center justify-center gap-3" onClick={() => handleSendPost('profile')}>
              <Send size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Share Profile</span>
            </Button>
            {isOwnProfile && (
              <Button className="flex-1 bg-white text-black h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-white/90 shadow-xl shadow-white/5 flex items-center justify-center" onClick={() => navigate('/edit-profile')}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="mt-4 text-left w-full">

             <div className="grid grid-cols-3 w-full mb-10 border-b border-white/5">
                {[
                  { id: 'activity', label: 'Audit', icon: Activity },
                  { id: 'grid', label: 'Posts', icon: Grid },
                  { id: 'reels', label: 'Reels', icon: Play }
                ].map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-2 py-4 transition-all relative shrink-0", 
                      activeTab === tab.id ? "text-white" : "text-white/20 hover:text-white/40"
                    )}
                  >
                    <tab.icon size={18} className="shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    )}
                  </button>
                ))}
             </div>

             <div className="space-y-6">
                {activeTab === 'activity' ? (
                   user?.grievances?.length > 0 ? (
                     <motion.div 
                        className={cn("space-y-4", isOwnProfile ? "cursor-grab active:cursor-grabbing" : "")}
                        drag={isOwnProfile ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={isOwnProfile ? handleTabDragEnd : undefined}
                     >
                        {user.grievances.map(g => (
                          <Card 
                            key={g.id} 
                            onClick={() => navigate(`/colleges/${g.collegeId || '1'}`, { state: { activeTab: 'grievances' } })}
                            className="p-8 bg-[#0A0C14] border border-white/5 rounded-[2.5rem] hover:border-indigo-500/20 transition-all group relative overflow-hidden mb-4 cursor-pointer active:scale-[0.98]"
                          >
                             {/* Shield Watermark Icon */}
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                                <ShieldAlert size={140} />
                             </div>

                             <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={cn(
                                  "px-4 py-1 rounded-md text-[8px] font-black uppercase tracking-widest",
                                  g.status === 'Cleared' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                )}>
                                   {g.status === 'Cleared' ? 'CLEARED' : 'PENDING'}
                                </div>
                                <span className="text-[10px] font-bold text-white/20 tabular-nums">
                                   {new Date(g.createdAt).toLocaleDateString('en-GB')}
                                </span>
                             </div>

                             <div className="space-y-4 relative z-10">
                                <h3 className="text-indigo-400 text-lg font-black uppercase tracking-wider">{g.college}</h3>
                                <p className="text-white/90 italic font-bold text-xl leading-relaxed">
                                   "{g.description}"
                                </p>
                             </div>

                             <div className="mt-10 flex items-center gap-2 relative z-10 opacity-40">
                                <Activity size={12} className="text-white/60" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">
                                   Verification Status: Student Network Audit
                                </span>
                             </div>
                          </Card>
                        ))}
                     </motion.div>
                   ) : (
                    <Card className="p-8 bg-[#0A0C14] border-white/5 rounded-[2.5rem]">
                       <p className="text-white/60 italic font-bold text-lg">"This is a demo bio content for the activity wall. You can report grievances and manage settings here."</p>
                    </Card>
                  )
                ) : (
                  <motion.div 
                    className={cn("grid grid-cols-3 gap-0.5 w-[calc(100%+2rem)] -mx-4 md:mx-0 md:w-full", isOwnProfile ? "cursor-grab active:cursor-grabbing" : "")}
                    drag={isOwnProfile ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={isOwnProfile ? handleTabDragEnd : undefined}
                  >
                    {currentFeed.map(p => (
                      <div key={p.id} onClick={() => setSelectedPostId(p.id)} className="aspect-square bg-white/5 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform relative">
                        {p.type === 'REEL' ? (
                          <div className="relative w-full h-full">
                             <video src={p.mediaUrl} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Play size={24} className="text-white drop-shadow-2xl" />
                             </div>
                             <Play size={14} className="absolute bottom-2 left-2 text-white/60 shadow-lg" />
                          </div>
                        ) : (
                          <img src={p.mediaUrl} className="w-full h-full object-cover" />
                        )}
                        {likedPosts.includes(p.id) && <div className="absolute top-2 right-2"><Heart size={12} className="fill-rose-500 text-rose-500" /></div>}
                      </div>
                    ))}
                  </motion.div>
                )}
             </div>
          </div>
        </div>
      </motion.div>

      {/* Post Modal (Feed View) */}
      <AnimatePresence>
        {selectedPostId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPostId(null)} className="fixed inset-0 bg-black/95 z-[400]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[401] overflow-y-auto no-scrollbar bg-[#05060A]">
              <div className="sticky top-0 bg-[#05060A]/80 backdrop-blur-xl p-4 flex items-center justify-between border-b border-white/5 z-20">
                <button onClick={() => setSelectedPostId(null)} className="p-2 flex items-center gap-2 text-sm font-black uppercase"><ChevronLeft /> Feed</button>
                <button onClick={() => setSelectedPostId(null)} className="p-2"><CloseIcon size={24} /></button>
              </div>

              <div className="max-w-xl mx-auto pb-20">
                {currentFeed.map(p => (
                  <div key={p.id} ref={el => postRefs.current[p.id] = el} className="mb-10 border-b border-white/5 pb-10">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={user?.avatar} className="h-8 w-8 rounded-full object-cover" />
                        <div className="flex flex-col">
                         <span className="text-xs font-black italic">@{user?.username}</span>
                         {p.collegeName && (
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               navigate(`/colleges/${p.collegeId}`, { state: { activeTab: 'insights' } });
                             }}
                             className="text-[8px] text-indigo-400 font-black uppercase text-left hover:text-indigo-300 transition-colors flex items-center gap-0.5"
                           >
                             <MapPin size={8} />
                             {p.collegeName}
                           </button>
                         )}
                      </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggleHideLikes(p.id)} className="p-2 text-white/40">{p.hideLikes ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        {isOwnProfile && (
                          <button onClick={() => handleDeletePost(p.id)} className="p-2 text-rose-500/40"><Trash2 size={18} /></button>
                        )}
                      </div>
                    </div>
                    <div className="aspect-square bg-black overflow-hidden flex items-center relative" onDoubleClick={() => handleLike(p.id)}>
                       {p.type === 'REEL' ? <video src={p.mediaUrl} autoPlay loop muted playsInline className="w-full" /> : <img src={p.mediaUrl} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-6 space-y-4">
                          <div className="flex justify-between">
                             <div className="flex gap-5">
                                <button onClick={() => handleLike(p.id)} className="transition-transform active:scale-125"><Heart size={26} className={cn(likedPosts.includes(p.id) ? "fill-rose-500 text-rose-500" : "text-white")} /></button>
                                <button onClick={() => setCommentingPostId(p.id)}><MessageCircle size={26} /></button>
                                <button onClick={() => handleSendPost(p.id)}><Send size={26} /></button>
                             </div>
                             <button onClick={() => handleSavePost(p.id)}>
                                <Bookmark size={26} className={cn(savedPosts.includes(p.id) ? "fill-white text-white" : "text-white")} />
                             </button>
                          </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black italic">{p.hideLikes ? "Liked by Admyra students" : `${p.likes || 0} likes`}</p>
                        <p className="text-sm font-medium"><span className="font-black italic mr-2">@{user?.username}</span>{p.caption || "No caption."}</p>
                        <button onClick={() => setCommentingPostId(p.id)} className="text-[10px] text-white/40 font-bold uppercase pt-1">View all {p.comments?.length || 0} comments</button>
                        <p className="text-[10px] text-white/20 font-bold uppercase pt-4">{new Date(p.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Advanced Comment Drawer */}
      <AnimatePresence>
        {commentingPostId && activePostForComments && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {setCommentingPostId(null); setActiveCommentId(null); setReplyingTo(null);}} className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[500]" />
            <motion.div 
               initial={{ y: '100%' }} 
               animate={{ y: 0 }} 
               exit={{ y: '100%' }} 
               transition={{ type: 'spring', damping: 25, stiffness: 300 }} 
               drag="y"
               dragConstraints={{ top: 0 }}
               dragElastic={0.2}
               onDragEnd={(e, info) => {
                 if (info.offset.y > 100) {
                    setCommentingPostId(null);
                    setActiveCommentId(null);
                    setReplyingTo(null);
                 }
               }}
               className="fixed bottom-0 left-0 right-0 h-[80vh] bg-[#0A0C14] rounded-t-[2.5rem] z-[501] flex flex-col shadow-2xl border-t border-white/10 overflow-visible"
            >
               <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
               <div className="p-4 flex items-center justify-between border-b border-white/5 flex-shrink-0">
                  <div className="flex-1 text-center"><h4 className="text-sm font-black italic uppercase tracking-widest">Comments</h4></div>
                  <button onClick={() => setCommentingPostId(null)} className="p-2 absolute right-4"><CloseIcon size={24} /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-40">
                  {activePostForComments.comments?.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                       <MessageCircle size={60} strokeWidth={1} />
                       <div className="text-center"><h3 className="text-xl font-black italic">No comments yet</h3><p className="text-xs uppercase font-bold tracking-widest mt-1">Start the conversation.</p></div>
                    </div>
                  ) : (
                    [...activePostForComments.comments].sort((a,b) => b.isPinned - a.isPinned).map(c => {
                      const isReply = c.text.startsWith('@') || c.isReply;
                      return (
                        <div key={c.id} className={cn("relative transition-all", isReply ? "ml-10" : "")}>
                           <div className="flex gap-3">
                              <div className={cn("rounded-full overflow-hidden flex-shrink-0 bg-white/5", isReply ? "h-6 w-6" : "h-9 w-9")}>
                                 <img src={c.avatar || user?.avatar} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-2">
                                    <span className={cn("font-black italic", isReply ? "text-[11px]" : "text-[13px]")}>@{c.username}</span>
                                    {c.username === user?.username && <Badge className="bg-indigo-500/10 text-indigo-400 border-none text-[7px] px-1 py-0 font-black">Author</Badge>}
                                    {c.isPinned && <Pin size={10} className="text-indigo-400 fill-indigo-400 rotate-45" />}
                                 </div>
                                 <p className={cn("font-medium text-white/90 mt-0.5 leading-snug", isReply ? "text-[12px]" : "text-[14px]")}>
                                    {c.text.startsWith('@') ? (
                                      <>
                                         <span className="text-indigo-400 font-black mr-1">{c.text.split(' ')[0]}</span>
                                         {c.text.split(' ').slice(1).join(' ')}
                                      </>
                                    ) : c.text}
                                 </p>
                                 <div className="flex items-center gap-5 pt-2">
                                    <span className="text-[10px] text-white/30 font-bold">1s</span>
                                    {c.likesCount > 0 && <span className="text-[10px] text-white/60 font-black">{c.likesCount} {c.likesCount === 1 ? 'like' : 'likes'}</span>}
                                    <button onClick={() => handleReply(activePostForComments.id, c.username)} className="text-[10px] font-black text-white/40 uppercase">Reply</button>
                                    <button onClick={(e) => { e.stopPropagation(); setActiveCommentId(activeCommentId === c.id ? null : c.id); }} className="text-[10px] font-black text-white/40 uppercase">Edit</button>
                                 </div>
                              </div>
                              <button onClick={() => handleLikeComment(activePostForComments.id, c.id)} className={cn("h-fit mt-2 transition-transform active:scale-150", c.isLiked ? "text-rose-500" : "text-white/20")}>
                                 <Heart size={isReply ? 11 : 14} className={c.isLiked ? "fill-rose-500" : ""} />
                              </button>
                           </div>
                           <AnimatePresence>
                              {activeCommentId === c.id && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute top-10 right-0 bg-[#1F222C] border border-white/10 rounded-2xl p-1 z-[600] shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[130px]">
                                   <button onClick={() => handlePinComment(activePostForComments.id, c.id)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                      <Pin size={14} className={c.isPinned ? "text-indigo-400" : "text-white/40"} /><span className="text-[10px] font-black uppercase">{c.isPinned ? 'Unpin' : 'Pin'}</span>
                                   </button>
                                   <button onClick={() => handleDeleteComment(activePostForComments.id, c.id)} className="w-full flex items-center gap-3 p-3 hover:bg-rose-500/10 rounded-xl transition-colors text-rose-500">
                                      <Trash2 size={14} /><span className="text-[10px] font-black uppercase">Delete</span>
                                   </button>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      );
                    })
                  )}
               </div>

               <div className="absolute bottom-0 left-0 right-0 bg-[#0A0C14] border-t border-white/5 flex flex-col z-50">
                  <AnimatePresence>
                     {replyingTo && (
                       <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white/5 px-6 py-2.5 flex items-center justify-between border-b border-white/5">
                          <p className="text-[11px] text-white/60 font-medium italic">Replying to <span className="text-white font-black">@{replyingTo.username}</span></p>
                          <button onClick={() => { setReplyingTo(null); setCommentText({ ...commentText, [activePostForComments.id]: '' }); }} className="text-white/40"><CloseIcon size={16} /></button>
                       </motion.div>
                     )}
                  </AnimatePresence>
                  
                  <div className="p-4 pb-12 space-y-6">
                     <div className="flex items-center justify-between px-2">
                        {['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'].map(emoji => (
                          <button key={emoji} onClick={() => handleAddComment(activePostForComments.id, emoji)} className="text-2xl hover:scale-125 transition-transform">{emoji}</button>
                        ))}
                     </div>
                     <div className="flex items-center gap-3">
                        <img src={user?.avatar} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                        <div className="flex-1 bg-white/5 rounded-full px-5 py-2.5 flex items-center gap-3 border border-white/5">
                           <input type="text" placeholder={`Comment as ${user?.username}...`} value={commentText[activePostForComments.id] || ''} onChange={(e) => setCommentText({ ...commentText, [activePostForComments.id]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleAddComment(activePostForComments.id)} className="flex-1 bg-transparent border-none text-sm placeholder:text-white/20 focus:ring-0 p-0 outline-none" />
                           <button onClick={() => handleAddComment(activePostForComments.id)} className={cn("flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 shadow-lg", commentText[activePostForComments.id]?.trim() ? "bg-indigo-500 text-white scale-110 shadow-indigo-500/40" : "bg-indigo-500/20 text-indigo-400")}>
                              <ArrowUp size={20} strokeWidth={4} className="drop-shadow-sm" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Creator Mode UI */}
      <AnimatePresence>
        {showCreatorMode && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[600] bg-[#05060A] flex flex-col">
            {!showDraftView ? (
              <>
                <div className="p-6 flex items-center justify-between">
                  <button onClick={() => setShowCreatorMode(false)}><CloseIcon size={28} /></button>
                  <div className="flex bg-white/5 rounded-full p-1">
                    {['POST', 'REEL', 'STORY'].map(type => (
                      <button key={type} onClick={() => setCreatorType(type)} className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", creatorType === type ? "bg-white text-black" : "text-white/40")}>{type}</button>
                    ))}
                  </div>
                  <button onClick={() => setIsCameraFront(!isCameraFront)}><RefreshCcw size={24} /></button>
                </div>
                
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                   {!selectedMedia ? (
                     <video 
                       ref={cameraVideoRef} 
                       autoPlay 
                       playsInline 
                       className={cn("w-full h-full object-cover", isCameraFront ? "-scale-x-100" : "")}
                     />
                   ) : (
                     creatorType === 'REEL' ? (
                       <video src={selectedMedia} autoPlay loop className="w-full h-full object-cover" />
                     ) : (
                       <img src={selectedMedia} className="w-full h-full object-cover" />
                     )
                   )}
                   <div className="absolute bottom-12 flex flex-col items-center gap-8">
                       {isRecording && (
                         <div className="flex items-center gap-2 px-3 py-1 bg-rose-500 rounded-full animate-pulse">
                            <div className="h-2 w-2 rounded-full bg-white" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Recording</span>
                         </div>
                       )}
                       <button onClick={handleCapture} className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-90 transition-all">
                          <div className={cn(
                            "transition-all duration-300",
                            isRecording ? "h-10 w-10 rounded-sm bg-rose-500" : (creatorType === 'REEL' ? "h-16 w-16 rounded-full bg-rose-500" : "h-16 w-16 rounded-full bg-white group-hover:scale-95")
                          )} />
                       </button>
                      <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40"><ImageIcon size={16} /> Gallery</button>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                  <button onClick={() => setShowDraftView(false)} className="text-[10px] font-black uppercase">Back</button>
                  <h3 className="text-sm font-black italic">New {creatorType}</h3>
                  <button 
                    disabled={loading}
                    onClick={handleFinalShare} 
                    className={cn("text-[10px] font-black uppercase", loading ? "text-white/20 cursor-wait" : "text-indigo-400")}
                  >
                    {loading ? 'Sharing...' : 'Share'}
                  </button>
                </div>
                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                   <div className="flex gap-4">
                      <div className="h-24 w-24 rounded-2xl overflow-hidden bg-white/5"><img src={selectedMedia} className="w-full h-full object-cover" /></div>
                      <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." className="flex-1 bg-transparent border-none outline-none resize-none text-sm placeholder:text-white/20 italic" />
                   </div>
                   <div className="space-y-4 pt-8 border-t border-white/5">
                      <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white/40">
                               <MapPin size={18} />
                               <span className="text-[10px] font-black uppercase tracking-widest">Tag College</span>
                            </div>
                            {taggedCollege && (
                              <button onClick={() => setTaggedCollege(null)} className="text-[8px] font-black text-rose-500 uppercase">Remove</button>
                            )}
                         </div>
                         
                         {!taggedCollege ? (
                           <div className="relative">
                              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                              <input 
                                type="text" 
                                placeholder="Search college to tag..." 
                                value={collegeSearch}
                                onChange={(e) => setCollegeSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-12 pr-4 text-xs outline-none focus:border-indigo-500 transition-all italic"
                              />
                              
                              {collegeSearch && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1D26] border border-white/10 rounded-2xl p-2 z-[700] shadow-2xl max-h-48 overflow-y-auto no-scrollbar">
                                   {colleges.filter(c => c.name.toLowerCase().includes(collegeSearch.toLowerCase())).slice(0, 10).map(c => (
                                     <button 
                                       key={c.id} 
                                       onClick={() => {
                                         setTaggedCollege({ name: c.name, id: String(c.id) });
                                         setCollegeSearch('');
                                       }}
                                       className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center justify-between"
                                     >
                                       <span>{c.name}</span>
                                       <span className="text-[8px] text-white/20 italic">{c.location}</span>
                                     </button>
                                   ))}
                                   {colleges.filter(c => c.name.toLowerCase().includes(collegeSearch.toLowerCase())).length === 0 && (
                                     <div className="p-4 text-center text-[10px] text-white/20 font-black uppercase tracking-widest">No colleges found</div>
                                   )}
                                </div>
                              )}
                           </div>
                         ) : (
                           <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <GraduationCap size={16} className="text-indigo-400" />
                                 <span className="text-sm font-black italic">{taggedCollege.name}</span>
                              </div>
                              <CheckCircle2 size={16} className="text-indigo-400" />
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {showShareSuccess && (
           <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest z-[1000] shadow-2xl">
              Link copied to clipboard!
           </motion.div>
         )}
      </AnimatePresence>

      <AnimatePresence>{showStoryViewer && stories.length > 0 && (
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="fixed inset-0 bg-black z-[700] flex flex-col">
          {stories[currentStoryIndex] ? (
            <>
              <div className="absolute top-0 left-0 w-full p-4 flex gap-1 z-10">
                {stories.map((_, i) => (
                  <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: i === currentStoryIndex ? '100%' : i < currentStoryIndex ? '100%' : 0 }} 
                      transition={{ duration: 5, ease: 'linear' }} 
                      onAnimationComplete={() => i === currentStoryIndex && (currentStoryIndex < stories.length - 1 ? setCurrentStoryIndex(i + 1) : setShowStoryViewer(false))} 
                      className="h-full bg-white" 
                    />
                  </div>
                ))}
              </div>
              
              <div className="p-6 pt-10 flex items-center justify-between z-10">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 border border-white/20 rounded-full overflow-hidden">
                       <img src={user?.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm font-black italic">Your Story</div>
                 </div>
                 <div className="flex items-center gap-4">
                    {isOwnProfile && (
                      <button onClick={() => handleDeleteStory(stories[currentStoryIndex].id)} className="text-white/40 hover:text-rose-500 transition-colors">
                         <Trash2 size={22} />
                      </button>
                    )}
                    <button onClick={() => setShowStoryViewer(false)}>
                       <CloseIcon size={28} />
                    </button>
                 </div>
              </div>

              <div className="flex-1 relative flex items-center justify-center" onDoubleClick={() => handleLikeStory(stories[currentStoryIndex].id)}>
                 <img src={stories[currentStoryIndex].url} className="max-h-full max-w-full object-contain" />
                 <div className="absolute inset-0 flex">
                    <div className="flex-1 h-full" onClick={() => currentStoryIndex > 0 && setCurrentStoryIndex(currentStoryIndex - 1)} />
                    <div className="flex-1 h-full" onClick={() => currentStoryIndex < stories.length - 1 ? setCurrentStoryIndex(currentStoryIndex + 1) : setShowStoryViewer(false)} />
                 </div>
                 {stories[currentStoryIndex].isLiked && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute">
                       <Heart size={80} className="fill-rose-500 text-rose-500" />
                    </motion.div>
                 )}
              </div>

              <div className="p-6 pb-12 flex items-center justify-end z-10">
                 <button 
                   onClick={() => handleLikeStory(stories[currentStoryIndex].id)}
                   className="ml-4 h-12 w-12 flex items-center justify-center"
                 >
                    <Heart 
                      size={28} 
                      className={cn("transition-all", stories[currentStoryIndex].isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-white")} 
                    />
                 </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
               <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      )}</AnimatePresence>

      {/* About This Account Modal */}
      <AnimatePresence>
        {showAboutAccount && (
          <div className="fixed inset-0 z-[800] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowAboutAccount(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-sm bg-[#0A0C14] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
             >
                <div className="p-8 text-center border-b border-white/5">
                   <div className="h-20 w-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-indigo-500/20">
                      <img src={user?.avatar} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="text-xl font-black italic">About this account.</h3>
                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">To help keep our community authentic.</p>
                </div>

                <div className="p-8 space-y-8">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                         <Calendar size={18} className="text-indigo-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Date Joined</p>
                         <p className="text-sm font-bold text-white/80">May 2026</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                         <MapPin size={18} className="text-indigo-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Account Based In</p>
                         <p className="text-sm font-bold text-white/80">India</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                         <Repeat size={18} className="text-indigo-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Former Usernames</p>
                         <p className="text-sm font-bold text-white/80">0</p>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-white/5">
                   <Button 
                    onClick={() => setShowAboutAccount(false)}
                    className="w-full bg-white text-black h-12 rounded-xl font-black text-[10px] uppercase tracking-widest"
                   >
                      Close
                   </Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Settings & Activity Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[900] bg-[#05060A] flex flex-col overflow-y-auto no-scrollbar"
          >
             <div className="sticky top-0 bg-[#05060A]/80 backdrop-blur-xl p-6 flex items-center gap-6 border-b border-white/5 z-20">
                <button onClick={() => settingsView === 'main' ? setShowSettings(false) : setSettingsView('main')} className="hover:bg-white/5 p-2 rounded-full transition-colors"><ChevronLeft size={28} /></button>
                <h3 className="text-xl font-black italic">{settingsView === 'main' ? 'Settings and activity' : settingsView.charAt(0).toUpperCase() + settingsView.slice(1)}</h3>
             </div>

             <div className="p-6 space-y-8 pb-32">
                {settingsView === 'main' && (
                  <>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Your account</p>
                       <div onClick={() => setSettingsView('accounts_centre')} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <UserIcon size={24} className="text-indigo-400" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <p className="text-sm font-black italic">Accounts Centre</p>
                                </div>
                                <p className="text-[10px] text-white/40 font-bold leading-tight mt-0.5">Password, security, personal details</p>
                             </div>
                          </div>
                          <ChevronLeft size={16} className="rotate-180 text-white/20" />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">How you use Admyra</p>
                       <div className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden divide-y divide-white/5">
                          {[
                            { icon: Bookmark, label: 'Saved', action: () => setSettingsView('saved') },
                            { icon: Repeat, label: 'Archive' },
                            { icon: Activity, label: 'Your activity', action: () => setSettingsView('notifications') },
                            { icon: ShieldAlert, label: 'Notifications', action: () => setSettingsView('notifications') },
                            { icon: Calendar, label: 'Time management', action: () => setSettingsView('time') }
                          ].map((item, i) => (
                            <div key={i} onClick={item.action} className="p-6 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                               <div className="flex items-center gap-4">
                                  <item.icon size={20} className="text-white/60" />
                                  <span className="text-sm font-bold">{item.label}</span>
                               </div>
                               <ChevronLeft size={14} className="rotate-180 text-white/10" />
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">For professionals</p>
                       <div className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden divide-y divide-white/5">
                          {[
                            { icon: Activity, label: 'Insights', action: () => setSettingsView('insights') },
                            { icon: CheckCircle2, label: 'Admyra Verified' }
                          ].map((item, i) => (
                            <div key={i} onClick={item.action} className="p-6 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                               <div className="flex items-center gap-4">
                                  <item.icon size={20} className="text-white/60" />
                                  <span className="text-sm font-bold">{item.label}</span>
                               </div>
                               <ChevronLeft size={14} className="rotate-180 text-white/10" />
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-8">
                       <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500/20 transition-all">Log Out</button>
                    </div>
                  </>
                )}

                {settingsView === 'accounts_centre' && (
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Account Settings</p>
                     <div className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden divide-y divide-white/5">
                        {[
                          { icon: ShieldAlert, label: 'Change Password', action: () => setSettingsView('password') },
                          { icon: UserIcon, label: 'Personal Details', action: () => setSettingsView('personal') },
                          { icon: Mail, label: 'Email', action: () => setSettingsView('email') }
                        ].map((item, i) => (
                          <div key={i} onClick={item.action} className="p-6 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                             <div className="flex items-center gap-4">
                                <item.icon size={20} className="text-white/60" />
                                <span className="text-sm font-bold">{item.label}</span>
                             </div>
                             <ChevronLeft size={14} className="rotate-180 text-white/10" />
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {settingsView === 'password' && (
                  <div className="space-y-6">
                     <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Current Password</label>
                           <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 outline-none focus:border-indigo-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">New Password</label>
                           <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 outline-none focus:border-indigo-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Confirm New Password</label>
                           <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 outline-none focus:border-indigo-500 transition-colors" />
                        </div>
                        <Button 
                          disabled={loading || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
                          onClick={handlePasswordChange}
                          className="w-full bg-indigo-500 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-4"
                        >
                           {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                     </div>
                  </div>
                )}

                {settingsView === 'personal' && (
                  <div className="space-y-6">
                     <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                        <div className="text-center">
                           <div className="h-24 w-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-indigo-500/20">
                              <img src={user?.avatar} className="w-full h-full object-cover" />
                           </div>
                           <h3 className="text-xl font-black italic">{user?.name}</h3>
                           <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Personal Identity</p>
                        </div>
                        <div className="space-y-6 border-t border-white/5 pt-8">
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-white/40">Username</span>
                              <span className="font-bold italic">@{user?.username}</span>
                           </div>
                           <Button onClick={() => navigate('/edit-profile')} className="w-full bg-white text-black h-12 rounded-xl text-[9px] font-black uppercase">Edit Profile Data</Button>
                        </div>
                     </div>
                  </div>
                )}

                {settingsView === 'email' && (
                  <div className="space-y-6">
                     <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                        {!isChangingEmail ? (
                          <>
                            <div className="flex items-center gap-4">
                               <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                  <Mail size={28} className="text-indigo-400" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Linked Email</p>
                                  <p className="text-lg font-bold">admin@admyra.com</p>
                               </div>
                            </div>
                            <div className="space-y-4 pt-4">
                               <p className="text-xs text-white/40 leading-relaxed italic">"Your email is used for account recovery and notifications. Ensure you have access to this address."</p>
                               <Button onClick={() => setIsChangingEmail(true)} variant="outline" className="w-full border-white/10 h-12 rounded-xl text-[9px] font-black uppercase">Change Email Address</Button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Enter New Email Address</label>
                                <input 
                                  type="email" 
                                  value={newEmail} 
                                  onChange={(e) => setNewEmail(e.target.value)} 
                                  placeholder="example@domain.com"
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 outline-none focus:border-indigo-500 transition-colors italic text-sm" 
                                />
                             </div>
                             <div className="flex gap-3">
                                <Button onClick={() => setIsChangingEmail(false)} variant="outline" className="flex-1 border-white/10 h-12 rounded-xl text-[9px] font-black uppercase">Cancel</Button>
                                <Button onClick={() => { setIsChangingEmail(false); setNewEmail(''); alert('Email update request sent!'); }} className="flex-[2] bg-indigo-500 h-12 rounded-xl text-[9px] font-black uppercase">Submit</Button>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
                )}

                {settingsView === 'time' && (
                  <div className="text-center space-y-10 pt-10">
                     <div className="relative inline-block">
                        <div className="absolute -inset-10 bg-indigo-500/20 blur-[60px] rounded-full" />
                        <h2 className="text-7xl font-black italic relative">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</h2>
                     </div>
                     <p className="text-white/40 text-sm font-medium">Time spent on Admyra today</p>
                     <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 text-left space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Time Management Tips</h4>
                        <p className="text-sm text-white/60 leading-relaxed italic">"The average student spends 45 minutes daily on academic social networking. Set a reminder to take breaks every 30 minutes."</p>
                     </div>
                  </div>
                )}

                {settingsView === 'insights' && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <Card className="p-6 bg-white/5 border-white/10 rounded-[2rem] space-y-2">
                           <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Accounts Reached</p>
                           <h4 className="text-2xl font-black italic">12.4K</h4>
                           <span className="text-[9px] text-green-400 font-bold">+12% vs last month</span>
                        </Card>
                        <Card className="p-6 bg-white/5 border-white/10 rounded-[2rem] space-y-2">
                           <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Profile Visits</p>
                           <h4 className="text-2xl font-black italic">842</h4>
                           <span className="text-[9px] text-green-400 font-bold">+4% vs last month</span>
                        </Card>
                     </div>
                     <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                        <h4 className="text-sm font-black italic">Recent Performance</h4>
                        <div className="flex items-end gap-2 h-32">
                           {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                             <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-indigo-500/40 rounded-t-lg" />
                           ))}
                        </div>
                        <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-tighter">
                           <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                     </div>
                  </div>
                )}

                {settingsView === 'notifications' && (
                  <div className="space-y-4">
                     {[
                       { type: 'LIKE', user: 'rahul_22', msg: 'liked your post.', time: '2m' },
                       { type: 'COMMENT', user: 'sneha_1', msg: 'commented: "Awesome look!"', time: '1h' },
                       { type: 'SYSTEM', user: 'Admyra', msg: 'Your grievance was cleared.', time: '5h' }
                     ].map((n, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-[1.5rem] border border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-black italic text-xs text-indigo-400">{n.user[0].toUpperCase()}</div>
                             <div>
                                <p className="text-xs font-medium"><span className="font-black italic mr-1">@{n.user}</span> {n.msg}</p>
                                <span className="text-[9px] text-white/20 font-bold uppercase">{n.time} ago</span>
                             </div>
                          </div>
                          {n.type === 'LIKE' && <Heart size={14} className="fill-rose-500 text-rose-500" />}
                       </div>
                     ))}
                  </div>
                )}
                {settingsView === 'saved' && (
                  <div className="space-y-6">
                     <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
                        <button onClick={() => setSavedSubTab('all')} className={cn("text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all", savedSubTab === 'all' ? "bg-white text-black" : "text-white/40 bg-white/5")}>All Posts</button>
                        <button onClick={() => setSavedSubTab('reels')} className={cn("text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all", savedSubTab === 'reels' ? "bg-white text-black" : "text-white/40 bg-white/5")}>Saved Reels</button>
                     </div>
                     
                     <div className="grid grid-cols-3 gap-1">
                        {[...posts, ...reels].filter(p => savedPosts.includes(p.id) && (savedSubTab === 'reels' ? p.type === 'REEL' : true)).map(p => (
                          <div key={p.id} onClick={() => { setSelectedPostId(p.id); setShowSettings(false); }} className="aspect-square bg-white/5 overflow-hidden cursor-pointer active:scale-95 transition-transform relative">
                             {p.type === 'REEL' ? (
                               <div className="relative w-full h-full">
                                  <video src={p.mediaUrl} className="w-full h-full object-cover" />
                                  <Play size={14} className="absolute bottom-2 left-2 text-white/60" />
                               </div>
                             ) : (
                               <img src={p.mediaUrl} className="w-full h-full object-cover" />
                             )}
                          </div>
                        ))}
                     </div>
                     
                     {savedPosts.length === 0 && (
                       <div className="py-20 text-center space-y-4">
                          <Bookmark size={48} className="mx-auto text-white/10" />
                          <p className="text-white/40 text-sm italic font-medium">"No saved items yet. Start bookmarking your favorite campus moments."</p>
                       </div>
                     )}
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes) { return classes.filter(Boolean).join(' '); }
