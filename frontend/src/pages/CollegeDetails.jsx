import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  MapPin, Trophy, Star, Info, 
  Users, ShieldAlert, Zap, 
  ShieldCheck, ArrowRight, Library, 
  Map as MapIcon, Heart, CheckCircle2,
  Activity, ThumbsUp, Flag, Camera, Play,
  Globe, ChevronRight, X, User as UserIcon, MessageCircle, Send, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, RatingStars, Button, Input } from '../components/ui';
import { colleges, reviews } from '../data/mock-data';
import { cn } from '../lib/utils';
import { fetchGrievances, createGrievance, applyPartner, fetchCollegePosts, toggleGrievanceAgree, resolveGrievance } from '../api';

export function CollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const collegeId = id || "1";
  const college = colleges.find(c => String(c.id) === String(collegeId)) || colleges[0];
  
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'insights');
  const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerFormSuccess, setPartnerFormSuccess] = useState(false);
  const [partnerData, setPartnerData] = useState({ instagram: '', purpose: '' });
  const [grievances, setGrievances] = useState([]);
  const [loadingGrievances, setLoadingGrievances] = useState(false);
  const [hasAgreed, setHasAgreed] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [collegePosts, setCollegePosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (college) {
      document.title = `${college.name} - College Details | Admyra`;
    }
    loadGrievances();
    loadCollegePosts();
  }, [collegeId, college]);

  const loadCollegePosts = async () => {
    if (!college?.name) return;
    setLoadingPosts(true);
    try {
      const { data } = await fetchCollegePosts(college.name);
      setCollegePosts(data);
    } catch (err) {
      console.error('Failed to load college posts');
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadGrievances = async () => {
    setLoadingGrievances(true);
    try {
      const { data } = await fetchGrievances();
      // Filter for current college (or just show all if that's the wall design)
      setGrievances(data);
    } catch (err) {
      console.error('Failed to load grievances');
    } finally {
      setLoadingGrievances(false);
    }
  };

  const handleReportSubmit = async () => {
    try {
      await createGrievance({
        college: college.name,
        issueType: 'Institutional',
        description: reportText,
        isAnonymous: true
      });
      setReportSubmitted(true);
      setReportText('');
      loadGrievances(); // Refresh list
    } catch (err) {
      alert('Failed to submit report. Please login first.');
    }
  };

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    try {
      await applyPartner({
        name: 'Applicant', // These could be gathered from user profile if logged in
        email: 'applicant@example.com',
        organization: partnerData.instagram,
        message: partnerData.purpose
      });
      setPartnerFormSuccess(true);
    } catch (err) {
      alert('Failed to submit partner application');
    }
  };

  useEffect(() => {
    if (reportSubmitted) {
      const timer = setTimeout(() => {
        setShowReportModal(false);
        setReportSubmitted(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [reportSubmitted]);

  if (!college) return <div className="p-20 text-center">College not found</div>;

  const tabs = [
    { id: 'insights', label: 'About', icon: Info },
    { id: 'grievances', label: 'Grievances', icon: ShieldAlert },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'community', label: 'Partners', icon: Heart },
    { id: 'facilities', label: 'Infra', icon: Library },
    { id: 'location', label: 'Map', icon: MapIcon }
  ];

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    
    if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    } else if (info.offset.x < -swipeThreshold && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const [showCommentDrawer, setShowCommentDrawer] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const openComments = (g) => {
    setSelectedGrievance(g);
    setShowCommentDrawer(true);
    // In a real app, we would fetch comments for this grievance
    setComments([
      { id: 1, text: "Totally agree with this! The labs need urgent upgrade.", user: { name: "Rahul K.", avatar: "" }, createdAt: new Date(), isPinned: true },
      { id: 2, text: "I've complained about this too, but no response yet.", user: { name: "Anjali M.", avatar: "" }, createdAt: new Date() }
    ]);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      text: newComment,
      user: { name: "You", avatar: "" },
      createdAt: new Date()
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      
      {/* Refined Cinematic Header */}
      <section className="relative pt-32 pb-20 px-4 md:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[150%] md:w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            {/* Navigation removed as requested */}

             <div className="space-y-4 md:space-y-8 w-full px-4 flex flex-col items-center">
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                  <div className="flex items-center gap-2 text-white/40 font-bold text-[10px] md:text-sm uppercase tracking-widest">
                    <MapPin size={16} className="text-indigo-500/50" />
                    {college.location}
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-yellow-500/80 font-black text-[10px] md:text-sm uppercase tracking-widest">
                    <Star size={16} fill="currentColor" className="text-yellow-500/50" />
                    {college.rating} Rating
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2 text-emerald-500/50 font-bold text-[10px] md:text-sm uppercase tracking-widest">
                    <ShieldCheck size={16} />
                    Verified
                  </div>
                </div>

               <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight md:leading-[1.1] bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent italic break-words max-w-4xl">
                 {college.name}
               </h1>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Improved Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-[#05060A]/90 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex justify-start md:justify-center gap-6 md:gap-12 h-16 md:h-20 items-center min-w-max mx-auto px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all relative h-full shrink-0",
                  activeTab === tab.id ? "text-indigo-400" : "text-white/20 hover:text-white"
                )}
              >
                <tab.icon size={14} className={cn("transition-all duration-300", activeTab === tab.id ? "scale-110" : "opacity-50")} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="obsidian-underline" 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="cursor-grab active:cursor-grabbing"
          >
            {activeTab === 'insights' && (
              <div className="space-y-24 md:space-y-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                  <div className="lg:col-span-7 space-y-8 md:space-y-12">
                    <div className="space-y-4 md:space-y-6">
                      <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none italic">
                        Institutional <br className="hidden md:block" /> Insights.
                      </h2>
                      <p className="text-lg md:text-xl text-white/40 leading-relaxed font-medium">
                        {college.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                       <Card className="p-6 md:p-8 border-emerald-500/10 bg-emerald-500/[0.02]">
                          <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-4">
                            <CheckCircle2 size={14} /> Authentic Pros
                          </div>
                          <ul className="space-y-3 text-sm font-bold text-white/60">
                             <li>• Strong Alumni Network</li>
                             <li>• Research-Led Faculty</li>
                             <li>• High Tier-1 Placements</li>
                          </ul>
                       </Card>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] bg-[#0A0C14] border border-white/5 space-y-10">
                       <div className="flex items-center justify-between">
                          <h3 className="text-lg font-black uppercase tracking-widest">Reality Audit</h3>
                          <Activity size={18} className="text-indigo-500" />
                       </div>
                       <div className="space-y-8">
                          {[
                            { label: 'FACULTY HONESTY', score: college.ratingsBreakdown?.faculty || 4.2 },
                            { label: 'INFRA INTEGRITY', score: 3.8 },
                            { label: 'PLACEMENT REALITY', score: college.ratingsBreakdown?.placements || 4.7 },
                            { label: 'STUDENT LIBERTY', score: 3.1 }
                          ].map((s, i) => (
                            <div key={i} className="space-y-2">
                               <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
                                  <span>{s.label}</span>
                                  <span className="text-indigo-400">{s.score}</span>
                               </div>
                               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(s.score/5)*100}%` }}
                                    className="h-full bg-indigo-500"
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4 md:gap-8 text-center">
                          <div>
                             <div className="text-xl font-black text-white italic">{college.placements?.avgPackage || 'N/A'}</div>
                             <div className="text-[8px] font-black text-white/20 uppercase mt-1 tracking-widest">Avg Package</div>
                          </div>
                          <div>
                             <div className="text-xl font-black text-emerald-400 italic">NAAC A++</div>
                             <div className="text-[8px] font-black text-white/20 uppercase mt-1 tracking-widest">Quality</div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                   <div className="flex items-center gap-4">
                      <h3 className="text-xl md:text-2xl font-black tracking-widest uppercase text-white/20">The 4-Year Blueprint</h3>
                      <div className="h-[1px] flex-1 bg-white/5" />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      {college.experience?.map((exp, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-[#0A0C14] border border-white/5 hover:border-indigo-500/20 transition-all">
                           <div className="text-3xl font-black text-indigo-500/20 mb-4 italic">0{exp.year}</div>
                           <h4 className="text-lg font-black mb-2">{exp.title}</h4>
                           <p className="text-[12px] text-white/40 font-bold leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'grievances' && (
              <div className="max-w-3xl mx-auto space-y-12 md:space-y-20">
                <div className="text-center space-y-6 md:space-y-10">
                   <div className="space-y-4">
                      <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter">Grievance Wall.</h2>
                      <p className="text-base md:text-lg text-white/40 font-medium leading-relaxed max-w-2xl mx-auto">
                         Anonymous reports verified through our student network. We track issues until they are resolved.
                      </p>
                   </div>
                   
                   <Button 
                    variant="outline"
                    onClick={() => setShowReportModal(true)}
                    className="h-14 px-10 border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-indigo-500/10 transition-all group"
                   >
                    <ShieldAlert size={16} className="mr-3 group-hover:scale-110 transition-transform" />
                    Report An Issue
                   </Button>
                </div>

                <div className="space-y-8">
                  {grievances.map((g) => (
                    <motion.div
                      key={g.id}
                      initial={g.isNew ? { opacity: 0, y: -20, scale: 0.95 } : false}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      <Card className={cn(
                        "p-8 md:p-12 transition-all",
                        g.status === 'Reported' 
                          ? "border-2 border-rose-500/10 bg-rose-500/[0.01] hover:border-rose-500/20" 
                          : "border border-emerald-500/10 bg-emerald-500/[0.02] hover:border-emerald-500/20"
                      )}>
                         <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                            <div className="flex items-center gap-3">
                               <Link to={`/profile/${g.userId}`} className="h-12 w-12 rounded-2xl p-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/40 hover:to-purple-500/40 transition-all overflow-hidden shrink-0">
                                  <div className="w-full h-full rounded-[0.9rem] bg-[#0A0C14] flex items-center justify-center">
                                     {g.user?.avatar ? (
                                       <img src={g.user.avatar} alt="" className="w-full h-full object-cover" />
                                     ) : (
                                       <div className={cn(
                                         "h-full w-full flex items-center justify-center",
                                         g.status === 'Reported' ? "text-rose-500" : "text-emerald-500"
                                       )}>
                                          <UserIcon size={20} />
                                       </div>
                                     )}
                                  </div>
                               </Link>
                               <div>
                                  <Link to={`/profile/${g.userId}`} className="text-base font-black italic hover:text-indigo-400 transition-colors">
                                    {g.user?.name || 'Anonymous Student'}
                                  </Link>
                                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">
                                    {new Date(g.createdAt).toLocaleDateString()}
                                  </div>
                               </div>
                            </div>
                            <Badge className={cn(
                              "border-none px-4 py-1.5 rounded-xl text-[10px] font-black uppercase italic tracking-wider",
                              g.status === 'pending' || g.status === 'Reported' ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                            )}>
                              {g.status === 'pending' || g.status === 'Reported' ? 'Reported' : 'Issue Cleared'}
                            </Badge>
                         </div>
                         <p className={cn(
                           "text-lg md:text-xl font-bold leading-relaxed italic mb-8",
                           g.status === 'pending' || g.status === 'Reported' ? "text-white/80" : "text-white/40 line-through decoration-white/10"
                         )}>
                            "{g.description || g.text}"
                         </p>
                         <div className="flex items-center justify-between pt-8 border-t border-white/5">
                             {g.status === 'Reported' ? (
                               <button 
                                 onClick={async () => {
                                   try {
                                     const { data } = await toggleGrievanceAgree(g.id);
                                     setGrievances(prev => prev.map(item => 
                                       item.id === g.id ? { ...item, agrees: data.agreed ? item.agrees + 1 : item.agrees - 1 } : item
                                     ));
                                     setHasAgreed(prev => ({ ...prev, [g.id]: data.agreed }));
                                   } catch (err) {
                                     alert('Please login to agree with reports');
                                   }
                                 }}
                                 className={cn(
                                   "flex items-center gap-2 text-[10px] font-black transition-all uppercase group",
                                   hasAgreed[g.id] ? "text-emerald-400" : "text-white/40 hover:text-white"
                                 )}
                               >
                                  <ThumbsUp size={16} className={cn("transition-transform", hasAgreed[g.id] ? "text-emerald-500 scale-110" : "text-indigo-500 group-hover:scale-110")} /> 
                                  {g.agrees} Agree
                               </button>
                             ) : (
                               <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">
                                  <Zap size={14} /> Resolved by Management
                               </div>
                             )}

                             {g.userId === currentUser.id && (g.status === 'pending' || g.status === 'Reported') && (
                               <button 
                                 onClick={async () => {
                                   if (window.confirm('Mark this issue as cleared?')) {
                                     try {
                                       await resolveGrievance(g.id);
                                       loadGrievances();
                                     } catch (err) {
                                       alert('Failed to update status');
                                     }
                                   }
                                 }}
                                 className="px-4 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[9px] font-black uppercase tracking-wider hover:bg-emerald-500/10 transition-all"
                               >
                                  Mark as Cleared
                               </button>
                             )}

                            <div className="text-[10px] font-black text-white/20 hover:text-rose-500 uppercase tracking-widest flex items-center gap-2 transition-colors">
                               {g.status === 'Reported' ? (
                                 <><Flag size={14} /> Report Junk</>
                               ) : (
                                 <span className="text-white/10">Closed Thread</span>
                               )}
                            </div>
                         </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-12 md:space-y-20">
                <div className="text-center space-y-6 md:space-y-10">
                   <div className="space-y-4">
                      <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter">Campus Gallery.</h2>
                      <p className="text-base md:text-lg text-white/40 font-medium leading-relaxed max-w-2xl mx-auto">
                         Live visual feed from the student community at {college.name}. Tag the college to contribute.
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-0.5 md:gap-4 md:px-0 -mx-4 md:mx-0">
                   {collegePosts.map((post) => (
                      <motion.div 
                        key={post.id} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        onClick={() => setSelectedPostId(post.id)}
                        className="aspect-square bg-white/5 relative group cursor-pointer overflow-hidden rounded-sm md:rounded-[2rem] border border-white/5"
                      >
                         {post.type === 'reel' || post.type === 'REEL' ? (
                            <video src={post.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         ) : (
                            <img src={post.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         )}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2 text-white">
                               <Heart size={16} className="fill-white" />
                               <span className="text-xs font-black italic">{post._count?.likes || 0}</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">@{post.user?.username || 'user'}</span>
                         </div>
                         {(post.type === 'reel' || post.type === 'REEL') && <Play size={16} className="absolute top-3 right-3 text-white/60 drop-shadow-lg" />}
                      </motion.div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="space-y-12 md:space-y-24">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                       <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">Verified Network.</h2>
                       <p className="text-base text-white/30 leading-relaxed font-medium max-w-md">
                          We collaborate with elite student bodies and institutional hubs to maintain the highest standards of data integrity.
                       </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {college.collaborators?.map((partner, i) => (
                          <a 
                            key={i} 
                            href={partner.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 group flex items-center gap-5 cursor-pointer"
                          >
                             <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all">
                                {partner.platform === 'Instagram' ? <Camera size={22} /> : <Globe size={22} />}
                             </div>
                             <div className="text-left">
                                <h4 className="text-lg font-black text-white tracking-tight">{partner.name}</h4>
                                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-0.5">{partner.followers} Reach</div>
                             </div>
                          </a>
                       ))}
                    </div>
                 </div>
                  <div className="flex justify-center mt-16">
                     <Button 
                        onClick={() => setShowPartnerModal(true)}
                        className="h-14 px-12 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[10px] rounded-full transition-all duration-500 shadow-2xl shadow-white/5"
                     >
                        Become a Verified Partner
                     </Button>
                  </div>
              </div>
            )}

            {activeTab === 'facilities' && (
               <div className="space-y-12 md:space-y-20">
                  <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter">Infrastructure Profile.</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {college.facilities?.map((f, i) => (
                       <div key={i} className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-[#0A0C14] border border-white/5 flex items-center justify-between group">
                          <span className="text-base font-bold text-white/60 group-hover:text-white">{f}</span>
                          <ChevronRight size={16} className="text-white/10 group-hover:text-indigo-500" />
                       </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'location' && (
                <div className="space-y-12 md:space-y-24">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-20">
                      <div className="lg:col-span-8 h-[350px] md:h-auto md:aspect-video rounded-[2.5rem] md:rounded-[4rem] bg-[#0A0C14] border border-white/5 overflow-hidden relative">
                        {college.mapEmbed ? (
                          <iframe 
                            src={college.mapEmbed}
                            className="w-full h-full border-0 grayscale invert opacity-50 contrast-[0.8]"
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-center p-12">
                            <div className="space-y-4">
                               <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-indigo-400 mx-auto">
                                  <MapIcon size={32} />
                               </div>
                               <h3 className="text-2xl md:text-3xl font-black italic">{college.location}</h3>
                               <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">Map visualization in progress</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                          <Button 
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(college.name + ' ' + college.location)}`, '_blank')}
                            className="h-12 px-8 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[9px] shadow-2xl hover:scale-105 transition-all"
                          >
                            Get Directions
                          </Button>
                        </div>
                      </div>
                     
                     <div className="space-y-8 md:space-y-12">
                        <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter">Campus Connectivity.</h2>
                        <div className="space-y-4">
                           {college.connectivity?.bus && (
                             <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                                <div>
                                   <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Nearest Bus Stop</div>
                                   <div className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{college.connectivity.bus.name}</div>
                                </div>
                                <span className="text-lg font-black italic text-indigo-400">{college.connectivity.bus.dist}</span>
                             </div>
                           )}
                           {college.connectivity?.metro && (
                             <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                                <div>
                                   <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Nearest Metro</div>
                                   <div className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{college.connectivity.metro.name}</div>
                                </div>
                                <span className="text-lg font-black italic text-indigo-400">{college.connectivity.metro.dist}</span>
                             </div>
                           )}
                           {college.connectivity?.railway && (
                             <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                                <div>
                                   <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Railway Hub</div>
                                   <div className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{college.connectivity.railway.name}</div>
                                </div>
                                <span className="text-lg font-black italic text-indigo-400">{college.connectivity.railway.dist}</span>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Post Modal (Gallery View) */}
      <AnimatePresence>
        {selectedPostId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedPostId(null)} 
              className="fixed inset-0 bg-black/95 z-[400] backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              className="fixed inset-0 z-[401] overflow-y-auto no-scrollbar bg-[#05060A]"
            >
              <div className="sticky top-0 bg-[#05060A]/80 backdrop-blur-xl p-4 flex items-center justify-between border-b border-white/5 z-20">
                <button onClick={() => setSelectedPostId(null)} className="p-2 flex items-center gap-2 text-sm font-black uppercase text-white/60 hover:text-white transition-colors">
                  <ChevronLeft /> Gallery
                </button>
                <button onClick={() => setSelectedPostId(null)} className="p-2 text-white/60 hover:text-white"><X size={24} /></button>
              </div>

              <div className="max-w-xl mx-auto pb-20">
                {collegePosts.filter(p => p.id === selectedPostId).map(p => (
                  <div key={p.id} className="mb-10">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <Link to={`/profile/${p.userId}`} className="h-8 w-8 rounded-full bg-white/5 overflow-hidden border border-white/10">
                            <img src={p.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.userId}`} className="w-full h-full object-cover" />
                          </Link>
                          <div className="flex flex-col">
                            <Link to={`/profile/${p.userId}`} className="text-xs font-black italic hover:text-indigo-400 transition-colors">@{p.user?.username || 'user'}</Link>
                            <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">{college.name}</span>
                          </div>
                      </div>
                    </div>
                    <div className="aspect-square bg-black overflow-hidden flex items-center relative">
                       {p.type === 'REEL' ? <video src={p.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-contain" /> : <img src={p.mediaUrl} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-6 space-y-4">
                       <div className="flex gap-6">
                          <Heart size={26} className="text-white hover:fill-rose-500 hover:text-rose-500 transition-colors cursor-pointer" />
                          <MessageCircle size={26} className="text-white hover:text-indigo-400 transition-colors cursor-pointer" />
                          <Send size={26} className="text-white hover:text-indigo-400 transition-colors cursor-pointer" />
                       </div>
                       <div className="text-sm font-black italic tracking-tight">{(p._count?.likes || 0).toLocaleString()} likes</div>
                       <p className="text-sm font-medium text-white/90 leading-relaxed">
                          <Link to={`/profile/${p.userId}`} className="font-black italic mr-2 hover:text-indigo-400 transition-colors">@{p.user?.username || 'user'}</Link>
                          {p.caption}
                       </p>
                       <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] pt-2">
                          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Simplified Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 text-center">
         <div className="flex flex-col items-center gap-6">
            <ShieldAlert size={32} className="text-indigo-600/30" />
            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px]">The Transparency Pact</p>
         </div>
       </footer>

      {/* Report Issue Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0C14] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
              
              <button 
                onClick={() => setShowReportModal(false)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {reportSubmitted ? (
                <div className="py-12 text-center space-y-6">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 size={40} className="animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black italic">Report Received.</h3>
                    <p className="text-white/40 text-sm font-medium">Our student community will verify this shortly.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-1">
                      <ShieldAlert size={14} /> Anonymous Reporting
                    </div>
                    <h3 className="text-3xl font-black italic tracking-tight">Submit Grievance.</h3>
                    <p className="text-white/40 text-sm font-medium">Describe the issue clearly. Your identity remains hidden.</p>
                  </div>

                  <div className="space-y-4">
                    <textarea 
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="e.g. The laboratory equipment in the Mechanical dept is outdated..."
                      className="w-full h-40 bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-sm font-medium leading-relaxed"
                    />
                    
                    <Button 
                      disabled={!reportText.trim()}
                      onClick={handleReportSubmit}
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:grayscale transition-all"
                    >
                      Verify & Submit
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
        {showPartnerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#05060A]/95 backdrop-blur-xl"
              onClick={() => {
                setShowPartnerModal(false);
                setPartnerFormSuccess(false);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl"
            >
               <button 
                  onClick={() => {
                    setShowPartnerModal(false);
                    setPartnerFormSuccess(false);
                  }} 
                  className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
               >
                  <X size={24} />
               </button>

               {!partnerFormSuccess ? (
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <div className="inline-flex px-3 py-1 rounded-full bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Verification Portal</div>
                        <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter">Partner with Admyra.</h2>
                        <p className="text-sm text-white/30 font-medium">Apply to join our network of verified institutional hubs.</p>
                     </div>

                     <form className="space-y-6" onSubmit={handlePartnerSubmit}>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Instagram handle / URL</label>
                           <input 
                              required
                              type="text"
                              value={partnerData.instagram}
                              onChange={(e) => setPartnerData({...partnerData, instagram: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-white/30 transition-all"
                              placeholder="@your_community_page"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Community Purpose</label>
                           <input 
                              required
                              type="text"
                              value={partnerData.purpose}
                              onChange={(e) => setPartnerData({...partnerData, purpose: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-white/30 transition-all"
                              placeholder="What is your community's mission?"
                           />
                        </div>

                        <Button 
                           type="submit"
                           className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/90 transition-all duration-500"
                        >
                           Submit Application
                        </Button>
                     </form>
                  </div>
               ) : (
                  <div className="text-center py-12 space-y-8">
                     <div className="space-y-3">
                        <h2 className="text-4xl font-black italic tracking-tighter">Application Received.</h2>
                        <p className="text-base text-white/30 font-medium max-w-xs mx-auto leading-relaxed">
                           Our verification team will audit your credentials and reach out to your Instagram handle within 48 hours.
                        </p>
                     </div>
                     <Button 
                        variant="outline"
                        onClick={() => {
                          setShowPartnerModal(false);
                          setPartnerFormSuccess(false);
                          setPartnerData({ instagram: '', purpose: '' });
                        }}
                        className="px-12 h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-white/10 shadow-none transition-all"
                     >
                        Close Portal
                     </Button>
                  </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
