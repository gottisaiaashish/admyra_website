"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { colleges } from "../../data/mock-data";
import { AnimatedLetterText } from "./AnimatedLetterText";
import InteractiveHoverButton from "./InteractiveHoverButton";

// --- Real Student Grievances Data ---
const grievances = [
  {
    text: "The labs in block B are seriously outdated. Half the computers don't even boot up during practical exams.",
    name: "Rahul S.",
    role: "VNRVJIET Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  },
  {
    text: "Placement cell is extremely active, but the coordination during the final rounds is messy. Needs better management.",
    name: "Sneha Reddy",
    role: "CBIT student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
  },
  {
    text: "The hostel food quality has dropped significantly in the last 3 months. Multiple complaints to the warden were ignored.",
    name: "Karthik P.",
    role: "JNTU Hyderabad student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik"
  },
  {
    text: "Library timings are too restricted. We need access at least until 10 PM during mid-exams.",
    name: "Ananya",
    role: "Vasavi College student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
  },
  {
    text: "The sports ground is poorly maintained. It turns into a swamp even after a small drizzle.",
    name: "Vishnu V.",
    role: "GRIET Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vishnu"
  },
  {
    text: "Wi-Fi connectivity is a joke in the CS department. We are forced to use our own mobile data.",
    name: "Sai Kiran",
    role: "MGIT Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sai"
  },
  {
    text: "The canteen prices are rising every month but the hygiene levels are still the same (terrible).",
    name: "Meghana",
    role: "CVR Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meghana"
  },
  {
    text: "Attendance policy is too rigid. 75% even for those who are doing internships is not fair.",
    name: "Abhinav",
    role: "BVRIT Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhinav"
  },
  {
    text: "Faculty in the EEE department are great, but the syllabus is 10 years old. We need industry-relevant tech.",
    name: "Priyanka",
    role: "SNIST Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priyanka"
  },
];

const firstColumn = grievances.slice(0, 3);
const secondColumn = grievances.slice(3, 6);
const thirdColumn = grievances.slice(6, 9);

const GrievanceColumn = ({ className, testimonials, duration = 10 }) => {
  return (
    <div className={className}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4 list-none m-0 p-0"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, name, role }, i) => (
              <motion.li 
                key={`${index}-${i}`}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-4 rounded-lg bg-black/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[220px] w-full transition-all duration-500 group relative overflow-hidden" 
              >
                {/* Internal Glow Accent */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/15 transition-all" />
                
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <blockquote className="relative z-10 m-0 p-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">Reported</span>
                  </div>
                  <p className="text-white/60 leading-relaxed font-medium m-0 transition-colors group-hover:text-white text-xs italic">
                    "{text}"
                  </p>
                  <footer className="flex items-center gap-4 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                        {role}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </motion.li>
            ))}
          </React.Fragment>
        ))}
      </motion.ul>
    </div>
  );
};

export function GrievanceWall() {
  const [isListOpen, setIsListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [issueText, setIssueText] = useState("");

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, isListOpen && searchTerm === "" ? 20 : 5);

  return (
    <section className="bg-black pt-12 pb-32 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl px-6 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto mb-20 text-center">
          <AnimatedLetterText 
            text="Grievance Wall" 
            letterToReplace="a" 
            className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic whitespace-nowrap" 
          />
          <p className="mt-8 text-white/40 text-sm font-medium leading-relaxed max-w-lg mx-auto">
            Real campus issues reported by students, ensuring transparency and driving real changes in every college.
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[320px] overflow-hidden relative">
          <GrievanceColumn testimonials={firstColumn} duration={8} />
          <GrievanceColumn testimonials={secondColumn} className="hidden md:block" duration={12} />
          <GrievanceColumn testimonials={thirdColumn} className="hidden lg:block" duration={10} />
        </div>

        {/* SUBMIT YOUR COLLEGE ISSUE - PREMIUM CARD UI */}
        <div className="mt-8 max-w-2xl mx-auto relative z-30 space-y-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-lg bg-black/80 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] relative overflow-hidden group"
          >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
            
            <div className="relative z-10 text-center mb-10">
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black text-white tracking-wide uppercase italic leading-none">
                  Submit
                </span>
                <AnimatedLetterText 
                  text="Your Issue" 
                  letterToReplace="i" 
                  className="text-2xl md:text-3xl font-black text-white tracking-wide uppercase italic mt-2" 
                />
              </div>
              <p className="mt-4 text-white/30 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
                Secure. Anonymous. Direct. <br />Your voice matters.
              </p>
            </div>

            <div className="relative z-10">
              {!selectedCollege ? (
                <div className="relative">
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-3 text-left px-2">
                    Tag your college
                  </p>
                  
                  <div className="relative group/input">
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowResults(true);
                        setIsListOpen(false);
                      }}
                      onFocus={() => setShowResults(true)}
                      placeholder="Search" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all text-[10px] font-black uppercase tracking-widest text-center"
                    />
                  </div>
                  
                  <AnimatePresence>
                    {(showResults && (searchTerm.length > 1 || isListOpen)) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#0A0B10] border border-white/10 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-2xl z-50 max-h-52 overflow-y-auto custom-scrollbar"
                      >
                        {filteredColleges.length > 0 ? (
                          filteredColleges.map((college) => (
                            <button 
                              key={college.id}
                              onClick={() => {
                                setSelectedCollege(college);
                                setShowResults(false);
                                setIsListOpen(false);
                                setSearchTerm("");
                              }}
                              className="w-full text-left px-6 py-4 hover:bg-red-500/10 border-b border-white/5 last:border-0 transition-all flex items-center justify-between group/item"
                            >
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black text-white/60 group-hover/item:text-white transition-colors tracking-tight uppercase italic">{college.name}</span>
                                <span className="text-[9px] text-white/20 uppercase tracking-widest mt-0.5">{college.location}</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-6 py-4 text-white/20 text-[10px] font-bold uppercase tracking-widest italic">Target not found</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="relative inline-block">
                    <button 
                      onClick={() => {
                        setSelectedCollege(null);
                        setIssueText("");
                      }}
                      className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all group"
                      title="Change College"
                    >
                      <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">
                      You are reporting to
                    </p>
                    <h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">
                      {selectedCollege.name}
                    </h4>
                  </div>
                </motion.div>
              )}

              {/* PERMANENT FLOW: ISSUE TEXTAREA & SUBMIT */}
              <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-3 text-left px-2">
                  Enter your issue
                </p>
                
                <textarea 
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="Describe the problem in detail..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all text-sm font-medium min-h-[140px] resize-none"
                />

                <div className="flex justify-center mt-10">
                  <InteractiveHoverButton 
                    text="Submit Audit"
                    disabled={!(selectedCollege && issueText.length > 0)}
                    onComplete={() => {
                      // actual submission logic would go here
                      setTimeout(() => {
                        setSelectedCollege(null);
                        setIssueText("");
                      }, 2000);
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
