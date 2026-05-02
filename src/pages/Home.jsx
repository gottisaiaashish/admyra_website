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
} from "lucide-react";

import { Card, Button, Badge, RatingStars, Input, ShinyButton } from "../components/ui";
import { colleges } from "../data/mock-data";
import DarkVeil from "../components/DarkVeil";
import LogoLoop from "../components/ui/LogoLoop";

export function Home() {
  const navigate = useNavigate();
  
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

  return (
    <div className="w-full pb-24 bg-[#05060A]">

      {/* HERO */}
      <section className="relative h-[700px] sm:h-[680px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            <DarkVeil
              hueShift={342}
              noiseIntensity={0}
              scanlineIntensity={1}
              speed={6}
              scanlineFrequency={0.8}
              warpAmount={0}
              resolutionScale={2}
            />
          </div>
          <div className="absolute inset-0 bg-slate-80/80" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-0 pt-32 sm:pt-40">
          <div className="w-full max-w-4xl text-center">
            <Badge variant="brand" className="mb-4 text-sm">
              Admyra — Admit My Rank
            </Badge>

            <h1 className="px-0 py-4 text-2xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white mb-6">
              Know Where You Stand.
              <span className="px-0 py-0 block bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
                ChooseTheRightCollege.
              </span>
            </h1>

            <p className="px-2 mx-auto mb-11 max-w-2xl text-base sm:text-lg text-slate-200">
              Enter your rank and instantly discover colleges you can get into — powered by real cutoff data and student insights.
            </p>
            <div className="mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
              <ShinyButton className="px-8 py-3" onClick={() => navigate("/predictor") }>
                predict my college
              </ShinyButton>
              <ShinyButton className="px-4 py-3" onClick={() => navigate("/colleges") }>
                Explore Colleges
              </ShinyButton>
            </div>

            <p className="px-16 h-0 mr-0 mt-20 text-sm text-slate-300">
              Used by thousands of students • Updated for 2026
            </p>
          </div>
        </div>
      </section>

      {/* TRUST RIBBON - BALANCED */}
      <section className="pt-8 pb-4 bg-[#05060A]">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center text-[13px] font-normal text-white/50">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={14} className="text-indigo-500/40" />
            <span>Real Cutoff Data</span>
          </div>
          <div className="h-4 w-px bg-white/5" />
          <div className="flex items-center gap-3">
            <CheckCircle2 size={14} className="text-indigo-500/40" />
            <span>Student Verified</span>
          </div>
          <div className="h-4 w-px bg-white/5" />
          <div className="flex items-center gap-3">
            <CheckCircle2 size={14} className="text-indigo-500/40" />
            <span>2026 Updated</span>
          </div>
        </div>
      </section>

      {/* PRODUCT FEATURES - HIGH TECH GLASS */}
      <section className="pt-4 pb-12 bg-[#05060A] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="p-10 rounded-3xl bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group">
            <Target className="h-10 w-10 text-indigo-500 mb-8" />
            <h3 className="text-2xl font-bold mb-4 text-white">Rank Matrix</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Proprietary prediction engine utilizing category-specific historical cutoff matrices.
            </p>
          </div>

          <div className="p-10 rounded-3xl bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group">
            <BarChart3 className="h-10 w-10 text-indigo-500 mb-8" />
            <h3 className="text-2xl font-bold mb-4 text-white">Audit System</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Comprehensive institutional verification covering placement reality and academic rigor.
            </p>
          </div>

          <div className="p-10 rounded-3xl bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group">
            <Users className="h-10 w-10 text-indigo-500 mb-8" />
            <h3 className="text-2xl font-bold mb-4 text-white">Peer Network</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Authentic feedback loops from currently enrolled students across top-tier campuses.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - TECH FLOW */}
      <section className="pt-12 pb-32 bg-[#05060A] relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-4 text-white">How Admyra Works</h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="space-y-20">
            <div className="flex gap-10 group">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)]">1</div>
                <div className="w-px h-full bg-indigo-600/20 mt-4" />
              </div>
              <div className="pb-10">
                <h4 className="text-xl font-bold mb-3 text-white">Initialization</h4>
                <p className="text-white/40 text-sm max-w-xl">Input your entrance rank and category profile to begin the algorithmic matching process.</p>
              </div>
            </div>

            <div className="flex gap-10 group">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border border-indigo-600/50 flex items-center justify-center text-white font-bold">2</div>
                <div className="w-px h-full bg-indigo-600/20 mt-4" />
              </div>
              <div className="pb-10">
                <h4 className="text-xl font-bold mb-3 text-white">Data Audit</h4>
                <p className="text-white/40 text-sm max-w-xl">Our engine traverses years of cutoff data to identify high-probability admission pathways.</p>
              </div>
            </div>

            <div className="flex gap-10 group">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border border-indigo-600/50 flex items-center justify-center text-white font-bold">3</div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-3 text-white">Final Selection</h4>
                <p className="text-white/40 text-sm max-w-xl">Access your personalized shortlist with detailed institutional reality scores and metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP COLLEGES SECTION */}
      <section className="py-32 bg-[#05060A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none">
              Top Institutions
            </h2>
            <p className="text-sm md:text-base text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
              Explore the most prestigious engineering institutions across Telangana.
            </p>
          </div>
          
          <div className="pt-8 pb-4 relative overflow-hidden">
            <LogoLoop 
              speed={25}
              logoHeight={24}
              gap={80}
              fadeOut={false}
              pauseOnHover={true}
              logos={topColleges}
            />
          </div>

          <div className="flex justify-center mt-10">
            <Button variant="outline" onClick={() => navigate("/colleges")} className="px-10 py-6 border-indigo-500/20 text-indigo-400 font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-indigo-500/5 transition-all">
              Explore More Colleges <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 px-6 overflow-hidden bg-[#05060A]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 blur-2xl opacity-60"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-6 text-white leading-none">
            Stop Guessing Your Future.🎯
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto mb-10 font-medium">
            Use real admission data and institutional insights to choose the right college with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <ShinyButton className="px-8 py-6 text-lg" onClick={() => navigate("/predictor")}>
              Predict My College
            </ShinyButton>
            <ShinyButton className="px-8 py-6 text-lg" onClick={() => navigate("/colleges")}>
              Explore Colleges
            </ShinyButton>
          </div>
        </div>
      </section>
    </div>
  );
}