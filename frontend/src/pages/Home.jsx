import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Users,
  Book,
  MapPin,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

import { Card, Button, Badge, RatingStars, Input, ShinyButton } from "../components/ui";
import { colleges } from "../data/mock-data";
import { LogoCloud } from "../components/ui/LogoCloud";
import { NeonButton } from "../components/ui/NeonButton";
import { CinematicBackground } from "../components/ui/CinematicBackground";
import { CinematicFooter } from "../components/ui/CinematicFooter";
import { AnimatedRoadmap } from "../components/ui/AnimatedRoadmap";
import { GrievanceWall } from "../components/ui/GrievanceWall";
import { LetterRevealHeading } from "../components/ui/LetterRevealHeading";
import { FloatingPaths } from "../components/ui/BackgroundPaths";
import { TextEffect } from "../components/ui/TextEffect";
import { FlipWords } from "../components/ui/FlipWords";
import { AnimatedUnderlineText } from "../components/ui/AnimatedUnderlineText";
import { AnimatedLetterText } from "../components/ui/AnimatedLetterText";
import SEO from "../components/SEO";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Home() {
  const navigate = useNavigate();
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      // Animate sections on scroll
      const sections = rootRef.current.querySelectorAll("section");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const topColleges = React.useMemo(() => [
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">JNTU HYDERABAD (JNTUH)</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">OSMANIA UNIVERSITY (OUCE)</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">CBIT GANDIPET</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">VNR VJIET</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">VASAVI COLLEGE (VCE)</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">GRIET HYDERABAD</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">MGIT GANDIPET</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">BVRIT NARSAPUR</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">BVRIT HYDERABAD (WOMEN)</span> },
    { node: <span className="font-bold text-text-main opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">G.NARAYANAMMA (GNITS)</span> }
  ], []);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Admyra",
    "url": "https://admyra.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://admyra.in/colleges?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://admyra.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "College Predictor",
        "item": "https://admyra.in/predictor"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Explore Colleges",
        "item": "https://admyra.in/colleges"
      }
    ]
  };

  return (
    <div ref={rootRef} className="w-full bg-background">
      <SEO 
        title="Predict Your Engineering College | TS EAMCET & TG EAPCET 2026"
        description="Admyra is the #1 TG EAPCET & TS EAMCET college predictor. Get 99% accurate college predictions based on rank, category, and verified student feedback. Better than CollegeDost."
        keywords="TS EAMCET college predictor, TG EAPCET predictor 2026, engineering colleges in Telangana, EAMCET rank predictor, best colleges in Hyderabad for rank, TG EAPCET cutoff ranks, Admyra college predictor"
        schema={[websiteSchema, breadcrumbSchema]}
      />

      <main className="relative z-10 w-full min-h-[120vh] bg-background shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <CinematicFooter />
        

        {/* HOW IT WORKS */}
        <section className="py-32 bg-background relative overflow-hidden">
          {/* BACKGROUND ANIMATED PATHS */}
          <div className="absolute inset-0 opacity-20">
            <FloatingPaths position={1} />
            <FloatingPaths position={-1} />
          </div>

          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center md:text-left mb-20 md:mb-24 max-w-2xl mx-auto md:mx-0">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-text-main tracking-tighter mb-8 leading-[0.9] uppercase italic">
                How Admyra <br /><span className="text-text-main/20">Architects Your Future.</span>
              </h2>
            </div>

            <div className="space-y-32">
              {[
                { step: "01", title: "Initialization", desc: "Input your entrance rank and category profile to begin the algorithmic matching process." },
                { step: "02", title: "Audit Protocol", desc: "We physically verify every campus to audit travel distances, metro accessibility, and infrastructure reality." },
                { step: "03", title: "Transparency", desc: "Access verified institutional reports with exact commute metrics and peer-vetted campus insights." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-12 group">
                  <div className="text-7xl md:text-9xl font-black text-text-main/5 group-hover:text-indigo-500/20 transition-colors duration-700 select-none">
                    {item.step}
                  </div>
                  <div className="pt-4 md:pt-10">
                    <h4 className="text-2xl md:text-4xl font-black text-text-main mb-6 uppercase italic">{item.title}</h4>
                    <TextEffect per="word" preset="blur" className="text-text-main/40 text-lg md:text-xl font-medium leading-relaxed">
                      {item.desc}
                    </TextEffect>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONNECTIVITY AUDIT - NEW ROADMAP */}
        <section className="pt-20 pb-0 relative overflow-hidden bg-background border-y border-border-subtle">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-2">
              <AnimatedUnderlineText 
                text="Connectivity." 
                textClassName="text-4xl md:text-6xl font-black text-text-main tracking-tighter uppercase italic"
                underlineClassName="text-indigo-500"
                className="mb-16"
              />
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="h-1 w-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                />
                <p className="text-text-main/40 max-w-xl font-medium leading-relaxed">
                  To ensure safety and a seamless commute for everyone—especially female students—we've clearly documented the
                </p>
              </div>
              <div className="text-lg md:text-xl font-bold text-text-main tracking-tight">
                Real-world distance to <br />
                <FlipWords 
                  words={["Metro Stations", "Bus Stops", "Railway Stations", "MMTS Stations"]} 
                  className="text-indigo-500"
                />
              </div>
            </div>

            <div className="-mt-12 md:-mt-24">
              <AnimatedRoadmap 
                milestones={[
                  { id: 1, name: "Campus Zone", status: "complete", position: { top: "70%", left: "5%" } },
                  { id: 2, name: "Metro Access", status: "complete", position: { top: "25%", left: "5%" } },
                  { id: 3, name: "Destination", status: "in-progress", position: { top: "45%", left: "55%" } },
                  { id: 4, name: "Bus Stop", status: "pending", position: { top: "15%", right: "5%" } },
                ]}
                mapImageSrc="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-SsfjxCJh43Hr1dqzkbFWUGH3ICZQbH.png&w=320&q=75"
              />
            </div>
          </div>
        </section>

        <GrievanceWall />

        {/* TOP INSTITUTIONS */}
        <section className="py-40 relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-8">
              <LetterRevealHeading text="Top Institutions" />
            </div>
            
            <div className="py-4 relative overflow-hidden text-center">
              <LogoCloud logos={topColleges} />
              <p className="text-sm text-text-main/40 font-medium max-w-xl mx-auto mt-12">
                Explore the most prestigious engineering institutions across Telangana.
              </p>
            </div>

            <div className="flex justify-center mt-12">
              <NeonButton 
                onClick={() => navigate("/colleges")} 
                className="group text-indigo-300 hover:text-white font-black uppercase tracking-[0.2em] text-[10px]"
              >
                Explore More Colleges
              </NeonButton>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-48 px-6 overflow-hidden bg-black flex items-center justify-center">
          <div className="absolute inset-0">
             <div className="absolute left-1/2 top-1/2 h-[100vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/5 rounded-[50%] blur-[120px]" />
          </div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-8xl md:text-[14rem] font-black tracking-tighter text-white leading-[0.75] uppercase italic select-none">
              2026 <br /><span className="text-white/20">ADMYRA</span>
            </h2>
            <p className="text-white/20 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mt-8 animate-pulse">
              © 2026 Admyra. All Rights Reserved.
            </p>
          </div>
        </section>
      </main>

    </div>
  );
}