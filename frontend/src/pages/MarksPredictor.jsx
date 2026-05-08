import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowRight, Info, ChevronDown, AlertCircle, BarChart3, Target, Sparkles, Check } from 'lucide-react';
import { Button, Card, Input, Badge, Stepper, Step, HandWrittenTitle } from '../components/ui';
import { cn } from '../lib/utils';
import { predictRankFromMarks, marksRankData } from '../data/marks-rank-data';
import SEO from '../components/SEO';
import { GridPattern } from '../components/ui/grid-pattern';

export function MarksPredictor() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [marks, setMarks] = useState('');
  const [stream, setStream] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [lastPredictedMarks, setLastPredictedMarks] = useState(0);

  const handlePredict = () => {
    const m = parseFloat(marks);
    if (isNaN(m) || m < 0 || m > 160) return;

    setLoading(true);
    setTimeout(() => {
      const predicted = predictRankFromMarks(m, stream);
      setResults(predicted);
      setLastPredictedMarks(m);
      setLoading(false);
      setActiveStep(3);
    }, 1000);
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

  const canContinueStep1 = stream !== '';
  const canContinueStep2 = marks && parseFloat(marks) >= 0 && parseFloat(marks) <= 160;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO
        title="EAPCET Rank Estimator 2026 | Admyra"
        description="Predict your TG EAPCET rank based on normalized marks. Official 2024 & 2025 data used for accurate rank estimations."
        keywords="EAPCET rank estimator, TG EAPCET rank predictor, EAPCET normalized marks, marks to rank converter, EAPCET 2026 rank prediction"
        schema={[schema]}
      />

      <GridPattern
        squares={[
          [4, 4], [5, 1], [8, 2], [5, 3], [5, 5],
          [10, 10], [12, 15], [15, 10], [10, 15],
        ]}
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
          "inset-0 opacity-40 skew-y-12",
        )}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32">
        {/* Header Section */}
        <div className="text-center mb-16">

          
          <div className="mb-6">
            <HandWrittenTitle 
              title="Predict Your Rank" 
              subtitle="Get precise TG EAPCET rank estimations based on multi-year normalization trends and official historical data."
            />
          </div>

          <motion.div 
            animate={{ 
              borderColor: ["rgba(244, 63, 94, 0.2)", "rgba(244, 63, 94, 0.4)", "rgba(244, 63, 94, 0.2)"],
              backgroundColor: ["rgba(0,0,0,0.02)", "rgba(244, 63, 94, 0.03)", "rgba(0,0,0,0.02)"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative py-2 px-3 rounded-xl border border-border-subtle/50 overflow-hidden flex items-center gap-2.5 max-w-lg mx-auto text-left"
          >
            {/* Scanning Effect */}
            <motion.div 
              animate={{ left: ["-100%", "200%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-rose-500/10 to-transparent skew-x-12"
            />

            <div className="relative z-10 h-6 w-6 rounded-full bg-rose-500/10 flex items-center justify-center flex-none">
              <AlertCircle className="h-3 w-3 text-rose-500" />
            </div>
            <p className="relative z-10 text-[10px] text-text-muted leading-relaxed">
              <span className="font-bold text-rose-500 mr-1 tracking-tight uppercase text-[9px]">Disclaimer:</span>
              Predictions are based on official normalization data. Ranks may vary based on session difficulty and total candidate count.
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Stepper Section */}
          <div className="mb-12">
            <Stepper 
              initialStep={activeStep} 
              onStepChange={setActiveStep}
              stepCircleContainerClassName="max-w-md mx-auto mb-12"
              nextButtonProps={{ className: 'hidden' }}
              backButtonProps={{ className: 'hidden' }}
            >
              <Step>
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => {
                        setStream('engineering');
                        setTimeout(() => setActiveStep(2), 300);
                      }}
                      className={cn(
                        "flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group",
                        stream === 'engineering'
                          ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-2xl"
                          : "bg-card/50 border-border-subtle text-text-main hover:bg-text-main/5"
                      )}
                    >
                      <p className="font-black text-base mb-0.5 tracking-tight">Engineering (E)</p>
                      <p className={cn("text-[10px] opacity-60", stream === 'engineering' ? "text-white/70 dark:text-black/70" : "text-text-muted")}>
                        MPC Stream Candidates
                      </p>
                      {stream === 'engineering' && (
                        <motion.div layoutId="check-stream" className="absolute top-4 right-4">
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setStream('agriculture');
                        setTimeout(() => setActiveStep(2), 300);
                      }}
                      className={cn(
                        "flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group",
                        stream === 'agriculture'
                          ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-2xl"
                          : "bg-card/50 border-border-subtle text-text-main hover:bg-text-main/5"
                      )}
                    >
                      <p className="font-black text-base mb-0.5 tracking-tight">Agri & Pharmacy</p>
                      <p className={cn("text-[10px] opacity-60", stream === 'agriculture' ? "text-white/70 dark:text-black/70" : "text-text-muted")}>
                        BiPC Stream Candidates
                      </p>
                      {stream === 'agriculture' && (
                        <motion.div layoutId="check-stream" className="absolute top-4 right-4">
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  </div>
                </div>
              </Step>

              <Step>
                <div className="max-w-md mx-auto">
                  <Card className="p-8 border-border-subtle bg-card/50 backdrop-blur-xl">
                    <div className="mb-6">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">
                        Enter Normalized Marks (Max 160)
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="e.g. 75.5"
                          value={marks}
                          onChange={(e) => setMarks(e.target.value)}
                          className="h-14 text-2xl font-black pr-16 bg-text-main/5 border-transparent focus:bg-transparent"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-text-muted/40 tracking-tighter">/ 160</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveStep(1)}
                        className="flex-1 h-12 rounded-xl text-xs font-black tracking-widest uppercase"
                      >
                        Back
                      </Button>
                      <Button 
                        className="flex-[2] h-12 rounded-xl text-xs font-black tracking-widest uppercase relative overflow-hidden group"
                        disabled={!canContinueStep2 || loading}
                        onClick={handlePredict}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                          animate={{ x: ['100%', '-100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        {loading ? 'Calculating...' : 'Estimate Rank'}
                      </Button>
                    </div>
                  </Card>
                </div>
              </Step>

              <Step>
                <div className="space-y-8" id="rank-results">
                  {/* Hero Prediction Result */}
                  {results && results.filter(r => r.isPredicted).map(r => (
                    <Card key="predicted-hero" className="p-6 sm:p-10 border-border-subtle bg-card/50 backdrop-blur-xl rounded-[2.5rem] relative overflow-hidden group">
                      {/* Technical Background Accents */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <GridPattern width={20} height={20} />
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-text-main/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                      
                      <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-text-main/5 border border-text-main/10 flex items-center justify-center">
                              <Target className="w-6 h-6 text-text-main" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-text-muted mb-0.5">Algorithmic Prediction</p>
                              <h3 className="text-xl sm:text-2xl font-black text-text-main tracking-tight">2026 Expected Rank</h3>
                            </div>
                          </div>

                        </div>

                        <div className="mb-10 sm:mb-14">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] mb-4">Predicted Rank Range</p>
                          <div className="flex items-baseline gap-2 sm:gap-4 overflow-hidden">
                            {r.rankLow <= 1 ? (
                              <span className="text-3xl sm:text-4xl font-black text-text-main tracking-tighter whitespace-nowrap">
                                <span className="text-lg sm:text-2xl font-light text-text-muted/40 mr-1 sm:mr-2">&lt;</span>
                                {formatRank(r.rankHigh)}
                              </span>
                            ) : (
                              <div className="flex items-center gap-2 sm:gap-4 whitespace-nowrap">
                                <span className="text-3xl sm:text-4xl font-black text-text-main tracking-tighter">{formatRank(r.rankLow)}</span>
                                <span className="text-xl sm:text-3xl font-light text-text-muted/50">—</span>
                                <span className="text-3xl sm:text-4xl font-black text-text-main tracking-tighter">{formatRank(r.rankHigh)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                          <Button 
                            variant="outline"
                            size="lg"
                            className="border-border-subtle text-text-main hover:bg-text-main/5 rounded-2xl px-3 sm:px-8 h-12 sm:h-14 font-black text-[10px] sm:text-xs tracking-widest uppercase flex-1 whitespace-nowrap"
                            onClick={() => setActiveStep(1)}
                          >
                            Recalculate
                          </Button>
                          <Button 
                            size="lg"
                            className="bg-black text-white dark:bg-white dark:text-black rounded-2xl px-3 sm:px-8 h-12 sm:h-14 font-black text-[10px] sm:text-xs tracking-widest uppercase shadow-xl hover:opacity-90 active:scale-95 transition-all flex-1 whitespace-nowrap"
                            onClick={() => navigate('/predictor', { state: { initialStep: 2, exam: 'TG EAPCET' } })}
                          >
                            Find Colleges
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Historical Benchmarks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results && results.filter(r => !r.isPredicted).sort((a, b) => b.year - a.year).map((r) => (
                      <Card key={r.year} className="p-6 border-border-subtle bg-card/50 hover:border-text-main/20 transition-all group rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black tracking-widest uppercase text-text-muted">EAPCET {r.year} DATA</p>
                          <div className="w-8 h-8 rounded-lg bg-text-main/5 flex items-center justify-center group-hover:bg-text-main/10 transition-colors">
                            <BarChart3 className="w-4 h-4 text-text-muted" />
                          </div>
                        </div>
                        <p className="text-[10px] text-text-muted mb-1 font-bold uppercase tracking-wider">Actual Rank Band</p>
                        <p className="text-3xl font-black text-text-main tracking-tight">
                          {r.rankLow <= 1 ? `< ${formatRank(r.rankHigh)}` : `${formatRank(r.rankLow)} — ${formatRank(r.rankHigh)}`}
                        </p>
                      </Card>
                    ))}
                  </div>

                  {/* Detailed Analysis / Table Toggle */}
                  <div className="space-y-4">
                    <Card className="p-6 border-text-main/5 bg-text-main/[0.02] rounded-2xl">
                      <div className="flex gap-5">
                        <div className="p-3 rounded-xl bg-text-main/5 h-fit">
                          <Info className="w-5 h-5 text-text-muted" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-text-main uppercase tracking-widest mb-2">How Normalization Works</p>
                          <p className="text-xs text-text-muted leading-relaxed opacity-80">
                            Final ranks are determined using Normalized Marks. This ensures that students in tougher shifts are not disadvantaged compared to those in easier sessions. Our algorithm uses the latest official trends to provide this estimation.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <button
                      onClick={() => setShowTable(!showTable)}
                      className="w-full flex items-center justify-between p-6 rounded-2xl bg-text-main/5 border border-border-subtle hover:bg-text-main/10 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <BarChart3 className="h-5 w-5 text-text-muted opacity-50" />
                        <span className="text-xs font-black text-text-main opacity-70 tracking-widest uppercase group-hover:opacity-100 transition-opacity">
                          View Historical Marks vs Rank Table
                        </span>
                      </div>
                      <ChevronDown className={cn("w-5 h-5 text-text-muted transition-transform duration-300", showTable && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {showTable && (
                        <motion.div 
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6 pt-2"
                        >
                          {Object.entries(marksRankData).sort(([a], [b]) => b - a).map(([year, bands]) => (
                            <Card key={year} className="overflow-hidden border-border-subtle bg-card/30 rounded-2xl">
                              <div className="px-6 py-4 bg-text-main/5 border-b border-border-subtle flex items-center justify-between">
                                <p className="text-xs font-black uppercase tracking-widest text-text-muted">Historical Reference {year}</p>
                                <Badge className="bg-text-main/5 text-text-muted border-none text-[9px] font-bold">OFFICIAL DATA</Badge>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                  <thead>
                                    <tr className="border-b border-border-subtle text-text-muted/60">
                                      <th className="px-8 py-4 font-black uppercase tracking-widest">Normalized Marks</th>
                                      <th className="px-8 py-4 font-black uppercase tracking-widest">Engineering Rank</th>
                                      <th className="px-8 py-4 font-black uppercase tracking-widest">Agri & Pharmacy</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-text-main">
                                    {bands.map((band, i) => (
                                      <tr key={i} className="border-b border-border-subtle/30 hover:bg-text-main/5 transition-colors">
                                        <td className="px-8 py-4 font-black text-sm">{band.minMarks}+</td>
                                        <td className="px-8 py-4 opacity-70 font-medium">
                                          {band.engRankLow === 1 ? `< ${formatRank(band.engRankHigh)}` : `${formatRank(band.engRankLow)} — ${formatRank(band.engRankHigh)}`}
                                        </td>
                                        <td className="px-8 py-4 opacity-70 font-medium">
                                          {band.agRankLow === 1 ? `< ${formatRank(band.agRankHigh)}` : `${formatRank(band.agRankLow)} — ${formatRank(band.agRankHigh)}`}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Card>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Step>
            </Stepper>
          </div>
        </div>


      </div>
    </div>
  );
}
