import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, ArrowRight, Info, Sparkles, ChevronDown, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { predictRankFromMarks, marksRankData } from '../data/marks-rank-data';
import SEO from '../components/SEO';

export function MarksPredictor() {
  const navigate = useNavigate();
  const [marks, setMarks] = useState('');
  const [stream, setStream] = useState('engineering');
  const [results, setResults] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [lastPredictedMarks, setLastPredictedMarks] = useState(0);

  const handlePredict = (e) => {
    e.preventDefault();
    const m = parseFloat(marks);
    if (isNaN(m) || m < 0 || m > 160) return;

    setAnimating(true);
    setTimeout(() => {
      const predicted = predictRankFromMarks(m, stream);
      setResults(predicted);
      setLastPredictedMarks(m);
      setAnimating(false);
    }, 600);
  };

  const formatRank = (num) => num.toLocaleString('en-IN');

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Admyra EAPCET Rank Estimator",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "description": "Predict your TG EAPCET rank from normalized marks. Based on official 2024 & 2025 data."
  };

  return (
    <div className="min-h-screen bg-[#05060A] pb-24">
      <SEO
        title="EAPCET Rank Estimator 2026 | Admyra"
        description="Predict your TG EAPCET rank based on normalized marks. Official 2024 & 2025 data used for accurate rank estimations."
        keywords="EAPCET rank estimator, TG EAPCET rank predictor, EAPCET normalized marks, marks to rank converter, EAPCET 2026 rank prediction"
        schema={[schema]}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Rank Estimator
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Enter your normalized marks (out of 160) and instantly see your predicted EAPCET rank range based on official 2024 & 2025 data.
          </p>
        </div>
      </section>

      {/* Input Section */}
      <section className="max-w-2xl mx-auto px-4 mb-12">
        <form onSubmit={handlePredict}>
          <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/20">
            {/* Stream Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wide uppercase">Stream</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStream('engineering')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border ${
                    stream === 'engineering'
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10'
                      : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  Engineering (E)
                </button>
                <button
                  type="button"
                  onClick={() => setStream('agriculture')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border ${
                    stream === 'agriculture'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  Agriculture & Pharmacy
                </button>
              </div>
            </div>

            {/* Marks Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wide uppercase">
                Normalized Marks <span className="text-white/30 font-normal normal-case">(out of 160)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g. 75"
                  min="0"
                  max="160"
                  step="0.01"
                  required
                  className="w-full h-12 px-5 text-sm font-semibold rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-white/20 font-medium">/160</span>
              </div>
              {marks && (parseFloat(marks) < 0 || parseFloat(marks) > 160) && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Marks must be between 0 and 160
                </p>
              )}
            </div>

            {/* Predict Button */}
            <button
              type="submit"
              disabled={!marks || parseFloat(marks) < 0 || parseFloat(marks) > 160 || animating}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm tracking-wide hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
            >
              {animating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Predicting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Predict My Rank
                </span>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {results && results.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto px-4 mb-16 space-y-6"
          >
          {/* Predicted 2026 Result (Hero Card) */}
          {results.filter(r => r.isPredicted).map(r => (
            <div key="predicted" className="relative p-6 sm:p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 shadow-2xl overflow-hidden group">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] -ml-16 -mb-16" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20">
                      <TrendingUp className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-400/80">Prediction Analysis</h4>
                      <p className="text-[10px] text-white/30">2026 Algorithmic Estimate</p>
                    </div>
                  </div>
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-none text-[9px] px-2 py-0.5">ESTIMATED</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-white/30 mb-2 uppercase tracking-wider font-semibold">Predicted Rank Range</p>
                    <motion.div 
                      key={`${r.rankLow}-${r.rankHigh}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        y: [0, -4, 0] // Looping Float
                      }}
                      transition={{ 
                        x: { type: "spring", stiffness: 100, damping: 15 },
                        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="flex items-baseline gap-2"
                    >
                      {r.rankLow <= 1 ? (
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter flex items-baseline">
                          <motion.span 
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ 
                              opacity: [0.4, 1, 0.4],
                              scale: [1, 1.1, 1] 
                            }}
                            transition={{ 
                              opacity: { duration: 2, repeat: Infinity },
                              scale: { duration: 2, repeat: Infinity },
                              delay: 0.3
                            }}
                            className="text-indigo-400 text-2xl sm:text-3xl font-light mr-1"
                          >
                            &lt;
                          </motion.span>
                          {formatRank(r.rankHigh)}
                        </span>
                      ) : (
                        <motion.span 
                          animate={{ opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                            {formatRank(r.rankLow)}
                          </span>
                          <span className="text-white/20 text-xl font-light mx-2">—</span>
                          <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
                            {formatRank(r.rankHigh)}
                          </span>
                        </motion.span>
                      )}
                    </motion.div>
                    
                  </div>

                  {/* Visual Distribution Graph */}
                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 relative overflow-hidden group/graph">
                    {/* Scanning Line Effect */}
                    <motion.div 
                      initial={{ left: "-10%" }}
                      animate={{ left: "110%" }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 bottom-0 w-[20%] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent z-10 pointer-events-none"
                    />

                    <div className="flex justify-between items-end mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Rank Probability Chart</span>
                      </div>
                      <span className="text-[9px] text-indigo-400/40 font-medium">Most Likely Range</span>
                    </div>
                    
                    <div className="relative h-16 w-full flex items-end gap-[3px]">
                      {[...Array(24)].map((_, i) => {
                        const m = lastPredictedMarks || 40;
                        let centerIndex = 0;
                        
                        // Custom Non-Linear Mapping as per user request:
                        // 40 to 60 marks -> maps to first half of graph (index 0 to 11.5)
                        // 60 to 110 marks -> maps to second half of graph (index 11.5 to 23)
                        if (m <= 60) {
                          const p = Math.max(0, (m - 40) / 20);
                          centerIndex = p * 11.5;
                        } else {
                          const p = Math.min(1, (m - 60) / 50);
                          centerIndex = 11.5 + (p * 11.5);
                        }
                        
                        centerIndex = Math.round(centerIndex);
                        const isHighlighted = i >= centerIndex - 3 && i <= centerIndex + 3;
                        
                        const basePulse = Math.sin(i * 0.5) * 10 + 20;
                        const finalHeight = isHighlighted 
                          ? 40 + basePulse + (Math.sin(i * 1.2) * 20 + 20) 
                          : 15 + basePulse;
                        
                        return (
                          <motion.div 
                            key={i} 
                            initial={{ height: "0%" }}
                            animate={{ height: `${finalHeight}%` }}
                            transition={{ 
                              duration: 1.2, 
                              delay: 0.1 + (i * 0.03),
                              ease: [0.33, 1, 0.68, 1]
                            }}
                            className={`flex-1 rounded-t-[1px] transition-colors duration-500 ${
                              isHighlighted 
                                ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                                : 'bg-white/5 group-hover/graph:bg-white/10'
                            }`}
                            style={{ 
                              opacity: isHighlighted ? 1 : 0.3
                            }}
                          />
                        );
                      })}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center text-[9px] text-white/20">
                      <span>Least Rank</span>
                      <span>Mid Range</span>
                      <span>Top Rank</span>
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <Button
                      onClick={() => navigate('/predictor')}
                      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2.5 text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                      Find Colleges <ArrowRight className="h-3.5 w-3.5 ml-2 inline" />
                    </Button>
                  </div>
                </div>


              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            {results.filter(r => !r.isPredicted).sort((a, b) => b.year - a.year).map((r, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 * (idx + 1) }}
                key={r.year} 
                className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/30">EAPCET {r.year}</span>
                </div>
                <p className="text-[10px] text-white/20 mb-1">Rank Range</p>
                <p className="text-lg font-bold text-white tracking-tight">
                  {r.rankLow <= 1 ? `< ${formatRank(r.rankHigh)}` : `${formatRank(r.rankLow)} — ${formatRank(r.rankHigh)}`}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Normalization Info Card */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden"
          >
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Info className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-white/80 mb-1 uppercase tracking-wider">Normalization Pro-Tip</h5>
                <p className="text-[10px] text-white/30 leading-relaxed">
                  Final ranks are calculated using Normalized Marks to ensure fairness across different shifts. This accounts for variations in difficulty levels between exam sessions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15">
            <Info className="h-5 w-5 text-amber-400/60 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-200/40 leading-relaxed">
              <strong className="text-amber-300/60">Disclaimer:</strong> Predictions are based on official TG EAPCET 2024 & 2025 normalization data. Actual 2026 ranks may vary based on difficulty level, total candidates, and other factors.
            </p>
          </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* No match */}
      {results && results.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 mb-16">
          <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/8 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-400/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {parseFloat(marks) < 40 ? 'Not Qualified' : 'No Rank Data Available'}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {parseFloat(marks) < 40 
                ? 'A minimum of 40 marks (25%) is required to qualify for TG EAPCET. Unfortunately, you did not meet the qualifying criteria.' 
                : "The entered marks don't fall within the available rank band ranges (40-160). Please check your marks and try again."}
            </p>
          </div>
        </section>
      )}

      {/* Official Data Table Toggle */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-white/15 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-indigo-400/60" />
            <span className="text-sm font-bold text-white/60 group-hover:text-white/80 transition-colors">
              View Official Marks vs Rank Table
            </span>
          </div>
          <ChevronDown className={`h-5 w-5 text-white/30 transition-transform duration-300 ${showTable ? 'rotate-180' : ''}`} />
        </button>

        {showTable && (
          <div className="mt-4 space-y-8">
            {Object.entries(marksRankData).sort(([a], [b]) => b - a).map(([year, bands]) => (
              <div key={year} className="rounded-2xl bg-white/[0.02] border border-white/8 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-base font-bold text-white/70">TG EAPCET {year}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-6 py-3 text-left text-xs font-bold text-white/30 uppercase tracking-wider">Marks (out of 160)</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white/30 uppercase tracking-wider">Engineering Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white/30 uppercase tracking-wider">Agri & Pharmacy Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bands.map((band, i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-3 text-white/60 font-medium">{band.minMarks} and above</td>
                          <td className="px-6 py-3 text-white/50">
                            {band.engRankLow === 1 ? `Below ${formatRank(band.engRankHigh)}` : `${formatRank(band.engRankLow)} — ${formatRank(band.engRankHigh)}`}
                          </td>
                          <td className="px-6 py-3 text-white/50">
                            {band.agRankLow === 1 ? `Below ${formatRank(band.agRankHigh)}` : `${formatRank(band.agRankLow)} — ${formatRank(band.agRankHigh)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA to College Predictor */}
      <section className="max-w-2xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-600/8 via-transparent to-purple-600/5 border border-white/8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Already Know Your Rank?</h3>
          <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">Use our College Predictor to find the best colleges you can get into based on your rank.</p>
          <Button
            onClick={() => navigate('/predictor')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-8 py-4 text-sm font-bold hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20"
          >
            Go to College Predictor <ArrowRight className="h-4 w-4 ml-2 inline" />
          </Button>
        </div>
      </section>
    </div>
  );
}
