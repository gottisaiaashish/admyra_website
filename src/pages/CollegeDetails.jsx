import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Trophy, Star, Info, 
  Users, ShieldAlert, Zap, 
  ShieldCheck, ArrowRight, Library, 
  Map as MapIcon, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge, RatingStars, Button, Input } from '../components/ui';
import { colleges, reviews } from '../data/mock-data';
import { cn } from '../lib/utils';

export function CollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const collegeId = id || "1";
  const college = colleges.find(c => String(c.id) === String(collegeId)) || colleges[0];
  
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (college) {
      document.title = `${college.name} - College Details | Admyra`;
    }
  }, [collegeId, college]);

  if (!college) return <div className="p-20 text-center">College not found</div>;

  const tabs = [
    { id: 'insights', label: 'About', icon: Info },
    { id: 'grievances', label: 'Grievances', icon: ShieldAlert },
    { id: 'community', label: 'Partners', icon: Heart },
    { id: 'facilities', label: 'Infra', icon: Library },
    { id: 'location', label: 'Map', icon: MapIcon }
  ];

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
               <div className="flex flex-col items-center gap-4">
                  <div className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.4em] mb-2">College Details</div>
                  
                  <div className="flex items-center gap-6 md:gap-10">
                    <div className="flex items-center gap-2 text-white/40 font-bold text-[10px] md:text-sm uppercase tracking-widest">
                      <MapPin size={16} className="text-indigo-500/50" />
                      {college.location}
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2 text-yellow-500/80 font-black text-[10px] md:text-sm uppercase tracking-widest">
                      <Star size={16} fill="currentColor" className="text-yellow-500/50" />
                      {college.rating} Rating
                    </div>
                  </div>
               </div>

               <h1 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight md:leading-[1.1] bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent italic break-words max-w-4xl">
                 {college.name}
               </h1>

               <div className="flex items-center gap-2 text-white/20 font-bold text-[9px] uppercase tracking-widest pt-2">
                  <ShieldCheck size={14} className="text-emerald-500/40" />
                  Verified Institution
               </div>
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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
                <div className="text-center space-y-4 md:space-y-6">
                   <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter">Grievance Wall.</h2>
                   <p className="text-base md:text-lg text-white/40 font-medium leading-relaxed">
                      Anonymous reports verified through our student network.
                   </p>
                </div>

                <Card className="p-8 md:p-12 border-2 border-rose-500/10 bg-rose-500/[0.01]">
                   <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <ShieldAlert size={20} />
                         </div>
                         <div>
                            <div className="text-base font-black italic">Verified_Student_24</div>
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">2 days ago</div>
                         </div>
                      </div>
                      <Badge className="bg-rose-500/10 text-rose-500 border-none px-3 py-1 rounded-lg text-[9px] font-black uppercase italic">Reported</Badge>
                   </div>
                   <p className="text-lg md:text-xl font-bold leading-relaxed text-white/80 italic mb-8">
                      "The academic pressure is real, but the lab infrastructure in the older blocks needs immediate attention. Some machines are outdated."
                   </p>
                   <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <button className="flex items-center gap-2 text-[10px] font-black text-white/40 hover:text-white transition-all uppercase">
                         <ThumbsUp size={16} className="text-indigo-500" /> 124 Agree
                      </button>
                      <button className="text-[10px] font-black text-white/20 hover:text-rose-500 uppercase tracking-widest flex items-center gap-2">
                         <Flag size={14} /> Report
                      </button>
                   </div>
                </Card>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="space-y-12 md:space-y-24">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                       <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">Community Hub.</h2>
                       <p className="text-lg text-white/40 leading-relaxed font-medium">
                          We partner with elite student bodies to verify every claim.
                       </p>
                       <Button className="h-14 px-10 bg-indigo-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl">
                          Collab
                       </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {college.collaborators?.map((partner, i) => (
                         <div key={i} className="p-8 rounded-[2rem] bg-[#0A0C14] border border-white/5 text-center group">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 text-indigo-500">
                               {partner.platform === 'Instagram' ? <Camera size={20} /> : <Globe size={20} />}
                            </div>
                            <h4 className="text-base font-black italic">{partner.name}</h4>
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">{partner.followers}</div>
                         </div>
                       ))}
                    </div>
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

      {/* Simplified Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 text-center">
         <div className="flex flex-col items-center gap-6">
            <ShieldAlert size={32} className="text-indigo-600/30" />
            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[9px]">The Transparency Pact</p>
         </div>
      </footer>
    </div>
  );
}
