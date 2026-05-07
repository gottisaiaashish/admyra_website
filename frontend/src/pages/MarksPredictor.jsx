import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handlePredict = (e) => {
    e.preventDefault();
    const m = parseFloat(marks);
    if (isNaN(m) || m < 0 || m > 160) return;

    setAnimating(true);
    setTimeout(() => {
      const predicted = predictRankFromMarks(m, stream);
      setResults(predicted);
      setAnimating(false);
    }, 600);
  };

  const formatRank = (num) => num.toLocaleString('en-IN');

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Admyra EAPCET Marks vs Rank Predictor",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "description": "Predict your TG EAPCET rank from normalized marks. Based on official 2024 & 2025 data."
  };

  return (
    <div className="min-h-screen bg-[#05060A] pb-24">
      <SEO
        title="EAPCET Marks vs Rank Predictor 2026 | Admyra"
        description="Predict your TG EAPCET rank based on normalized marks. Official 2024 & 2025 data used for accurate rank predictions."
        keywords="EAPCET marks vs rank, TG EAPCET rank predictor, EAPCET normalized marks, marks to rank converter, EAPCET 2026 rank prediction"
        schema={[schema]}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">Based on Official EAPCET Data</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Marks to Rank
            <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Predictor
            </span>
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
            <div className="mb-8">
              <label className="block text-sm font-bold text-white/70 mb-3 tracking-wide uppercase">Stream</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStream('engineering')}
                  className={`px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                    stream === 'engineering'
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10'
                      : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  🎓 Engineering (E)
                </button>
                <button
                  type="button"
                  onClick={() => setStream('agriculture')}
                  className={`px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                    stream === 'agriculture'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  🌿 Agriculture & Pharmacy
                </button>
              </div>
            </div>

            {/* Marks Input */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-white/70 mb-3 tracking-wide uppercase">
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
                  className="w-full h-16 px-6 text-lg font-semibold rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-white/20 font-medium">/160</span>
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
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base tracking-wide hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
            >
              {animating ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Predicting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Predict My Rank
                </span>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Results Section */}
      {results && results.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 mb-16 space-y-6">
          {/* Predicted 2026 Result (Hero Card) */}
          {results.filter(r => r.isPredicted).map(r => (
            <div key="predicted" className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative">
                <div className="mb-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">Predicted for 2026</span>
                </div>
                <p className="text-white/40 text-sm mb-6">Based on averaging 2024 & 2025 rank bands</p>

                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-8">
                  <div>
                    <p className="text-sm text-white/40 mb-1">Your Predicted Rank Range</p>
                    <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                      {formatRank(r.rankLow)} <span className="text-white/30 text-2xl">—</span> {formatRank(r.rankHigh)}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={() => navigate('/predictor')}
                    className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 rounded-xl px-6 py-3 text-sm font-bold"
                  >
                    Find Colleges for This Rank <ArrowRight className="h-4 w-4 ml-2 inline" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Historical Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {results.filter(r => !r.isPredicted).sort((a, b) => b.year - a.year).map(r => (
              <div key={r.year} className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-4 w-4 text-white/30" />
                  <span className="text-xs font-bold tracking-widest uppercase text-white/40">EAPCET {r.year}</span>
                </div>
                <p className="text-sm text-white/30 mb-2">Rank Range</p>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {formatRank(r.rankLow)} — {formatRank(r.rankHigh)}
                </p>
                <p className="mt-3 text-xs text-white/20">For {r.marksRange} marks</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15">
            <Info className="h-5 w-5 text-amber-400/60 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-200/40 leading-relaxed">
              <strong className="text-amber-300/60">Disclaimer:</strong> Predictions are based on official TG EAPCET 2024 & 2025 normalization data. Actual 2026 ranks may vary based on difficulty level, total candidates, and other factors.
            </p>
          </div>
        </section>
      )}

      {/* No match */}
      {results && results.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 mb-16">
          <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-400/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Rank Data Available</h3>
            <p className="text-white/40 text-sm">The entered marks don't fall within the available rank band ranges (40-160). Please check your marks and try again.</p>
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
