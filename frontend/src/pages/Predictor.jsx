import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Target, AlertCircle, Check, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Input, Select, Badge, RatingStars, MultiSelect, HandWrittenTitle, Stepper, Step } from '../components/ui';
import { predictorMockLogic } from '../data/mock-data';
import SEO from '../components/SEO';
import { GridPattern } from '../components/ui/grid-pattern';
import { cn } from '../lib/utils';

const EXAM_CARD = {
  id: 'TG EAPCET',
  name: 'TG EAPCET',
  title: 'Telangana Engineering Entrance',
  tags: ['ENGINEERING'],
};

const BRANCH_OPTIONS = [
  "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AI & DS", "CSE (AI & ML)", "CSE (Cyber Security)", "Data Science", "Chemical", "EIE"
];

export function Predictor() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle incoming state from Rank Estimator
  React.useEffect(() => {
    if (location.state?.initialStep && location.state?.exam) {
      setCurrentStep(location.state.initialStep);
      setSelectedExam(location.state.exam);
      // Clear the state to prevent it from re-triggering on manual refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const getInitialState = (key, defaultValue) => {
    const saved = sessionStorage.getItem(`predictor_${key}`);
    try {
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [currentStep, setCurrentStep] = useState(() => getInitialState('currentStep', 1));
  const [selectedExam, setSelectedExam] = useState(() => getInitialState('selectedExam', ''));
  const [rank, setRank] = useState(() => getInitialState('rank', ''));
  const [category, setCategory] = useState(() => getInitialState('category', ''));
  const [gender, setGender] = useState(() => getInitialState('gender', ''));
  const [selectedBranches, setSelectedBranches] = useState(() => getInitialState('selectedBranches', []));
  const [showAllBranches, setShowAllBranches] = useState(() => getInitialState('showAllBranches', false));
  const [results, setResults] = useState(() => getInitialState('results', null));
  const [loading, setLoading] = useState(false);

  // Save state to sessionStorage whenever it changes
  React.useEffect(() => {
    sessionStorage.setItem('predictor_currentStep', JSON.stringify(currentStep));
    sessionStorage.setItem('predictor_selectedExam', JSON.stringify(selectedExam));
    sessionStorage.setItem('predictor_rank', JSON.stringify(rank));
    sessionStorage.setItem('predictor_category', JSON.stringify(category));
    sessionStorage.setItem('predictor_gender', JSON.stringify(gender));
    sessionStorage.setItem('predictor_selectedBranches', JSON.stringify(selectedBranches));
    sessionStorage.setItem('predictor_showAllBranches', JSON.stringify(showAllBranches));
    sessionStorage.setItem('predictor_results', JSON.stringify(results));
  }, [currentStep, selectedExam, rank, category, gender, selectedBranches, showAllBranches, results]);

  // Clear results if user changes critical info (only if we are NOT on the results view)
  // We use a ref to prevent clearing results on initial load when inputs are restored
  const isFirstMount = React.useRef(true);
  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // Only clear results if we are actually editing the inputs
    // If results already exist and we are just viewing them, don't clear
    if (currentStep < 4) {
      setResults(null);
    }
  }, [rank, category, gender, selectedBranches, showAllBranches]);

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    // Auto advance to next step for better UX
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };
  
  const goNext = () => setCurrentStep((step) => Math.min(4, step + 1));
  const goBack = () => setCurrentStep((step) => Math.max(1, step - 1));
  const canContinueStep1 = selectedExam === EXAM_CARD.id || selectedExam === EXAM_CARD.name;
  const canContinueStep2 = rank && rank.toString().trim().length > 0;
  const canContinueStep3 = category && category.length > 0 && gender && gender.length > 0;
  const canPredict = showAllBranches || selectedBranches.length > 0;

  const handlePredict = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedExam || !rank || !category || !gender) return;

    setLoading(true);
    setTimeout(() => {
      let predicted = predictorMockLogic(
        selectedExam,
        parseInt(rank, 10),
        category,
        gender
      );

      // Filter by selected branches if not showing all
      if (!showAllBranches && selectedBranches.length > 0) {
        predicted = predicted.filter(item => selectedBranches.includes(item.branch));
      }

      setResults(predicted);
      setLoading(false);
    }, 300);
  };

  const getChanceColor = (chance) => {
    switch (chance) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'danger';
      default: return 'default';
    }
  };

  const predictorSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Admyra TG EAPCET & TS EAMCET College Predictor",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "The most accurate college predictor for TG EAPCET, TS EAMCET and AP EAPCET. Find engineering colleges by rank and category.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1240"
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
          "opacity-40"
        )}
      />
      
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-32 relative z-10">
      <SEO 
        title="TG EAPCET & TS EAMCET College Predictor 2026 | Rank vs College"
        description="Rank #1 TS EAMCET & TG EAPCET college predictor. Get accurate college lists based on your rank, category, and gender. Better than CollegeDost & CollegeDekho."
        keywords="TS EAMCET college predictor, TG EAPCET predictor 2026, engineering college predictor Telangana, EAMCET rank vs college, TG EAPCET closing ranks, TS EAMCET cutoff 2025, best engineering colleges Hyderabad rank"
        schema={[predictorSchema]}
      />
      {/* Header Section */}
      <div className="pt-0 mb-12">
        <HandWrittenTitle 
          prefix="College"
          title="Predictor" 
          subtitle="Instantly find which engineering colleges you can secure based on your rank. Select an exam below to begin."
        />
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
            Calculated using previous years counseling data. Don't depend only on these predictions; research colleges thoroughly before making final decisions.
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Form Card (Left) */}
        <div className="lg:col-span-4 h-max lg:sticky lg:top-24">
          <Card className="p-4 sm:p-5 shadow-2xl shadow-black/5 border-border-subtle rounded-3xl bg-card/70 backdrop-blur-md">
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                {currentStep === 1 ? 'Select Exam' : 
                 currentStep === 2 ? 'Enter Exam Rank' : 
                 currentStep === 3 ? 'Category & Gender' : 
                 'Select Branches'}
              </h2>
            </div>

            <Stepper
              initialStep={currentStep}
              onStepChange={(step) => setCurrentStep(step)}
              onFinalStepCompleted={handlePredict}
              nextButtonText="Continue"
              backButtonText="Back"
              nextButtonProps={{
                disabled: currentStep === 1 ? !canContinueStep1 : 
                          currentStep === 2 ? !canContinueStep2 : 
                          currentStep === 3 ? !canContinueStep3 : 
                          !canPredict || loading,
                className: (currentStep === 1 ? !canContinueStep1 : 
                            currentStep === 2 ? !canContinueStep2 : 
                            currentStep === 3 ? !canContinueStep3 : 
                            !canPredict || loading) ? 'opacity-50 cursor-not-allowed' : ''
              }}
            >
              <Step>
                <div className="space-y-4 pt-2">
                  <div
                    onClick={() => handleSelectExam(EXAM_CARD.name)}
                    className={
                      'cursor-pointer rounded-2xl border p-3 sm:p-4 transition ' +
                      (selectedExam === EXAM_CARD.name
                        ? 'border-primary-start bg-primary-start/5 shadow-sm'
                        : 'border-border-subtle hover:border-primary-start/30 hover:bg-black/[0.01]')
                    }
                  >
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{EXAM_CARD.name}</p>
                        <h3 className="mt-1 text-base font-bold text-text-main">{EXAM_CARD.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {EXAM_CARD.tags.map((tag) => (
                            <Badge key={tag} variant="brand" className="rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Step>

              <Step>
                <div className="space-y-2 pt-2">
                  <label className="block text-sm font-bold text-text-main mb-2 ml-1">Exam Rank</label>
                  <Input
                    type="number"
                    placeholder="e.g. 1500"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    min="1"
                    className="rounded-2xl border-border-subtle/70 h-14 text-base"
                    required
                  />
                </div>
              </Step>

              <Step>
                <div className="space-y-6 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-2 ml-1">Category</label>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Select Category"
                      options={["OC", "EWS", "BC-A", "BC-B", "BC-C", "BC-D", "BC-E", "SC", "ST"]}
                      className="rounded-2xl border-border-subtle/70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-main mb-2 ml-1">Gender</label>
                    <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      placeholder="Select Gender"
                      options={["Male", "Female"]}
                      className="rounded-2xl border-border-subtle/70"
                    />
                  </div>
                </div>
              </Step>

              <Step>
                <div className="space-y-4 pt-2">
                  <label className="block text-sm font-bold text-text-main mb-2 ml-1">Preferred Branches</label>
                  
                  {/* All Branches Toggle */}
                  <div
                    onClick={() => {
                      setShowAllBranches(!showAllBranches);
                      if (!showAllBranches) setSelectedBranches([]);
                    }}
                    className={
                      'cursor-pointer rounded-2xl border p-4 mb-4 transition flex items-center justify-between ' +
                      (showAllBranches
                        ? 'border-primary-start bg-primary-start/10 shadow-sm'
                        : 'border-border-subtle hover:border-primary-start/50 hover:bg-black/[0.02]')
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className={
                        'h-5 w-5 rounded-md border-2 flex items-center justify-center transition ' +
                        (showAllBranches
                          ? 'border-primary-start bg-primary-start'
                          : 'border-border-subtle')
                      }>
                        {showAllBranches && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={'text-sm font-semibold ' + (showAllBranches ? 'text-primary-start' : 'text-text-main')}>
                        All Branches
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">{BRANCH_OPTIONS.length} branches</span>
                  </div>

                  {!showAllBranches && (
                    <MultiSelect
                      options={BRANCH_OPTIONS}
                      value={selectedBranches}
                      onChange={setSelectedBranches}
                      placeholder="Search and select branches..."
                      className="rounded-2xl border-border-subtle/70 h-14 text-base"
                    />
                  )}
                  <p className="mt-4 text-sm text-text-muted leading-relaxed">
                    {showAllBranches
                      ? 'Showing predictions for all available branches.'
                      : 'Select the branches you are interested in. We will filter the predictions to show only these options.'}
                  </p>
                </div>
              </Step>
            </Stepper>
          </Card>
        </div>

        {/* Results Section (Right) */}
        <div className="lg:col-span-8">
          {!results && !loading ? (
            <Card className="text-center py-12 bg-text-main/5 rounded-3xl border border-dashed border-text-main/20">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-text-main/5 mb-4">
                <AlertCircle className="w-6 h-6 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">No Matching Colleges Found</h3>
              <p className="text-sm text-text-muted max-w-sm mx-auto px-6">
                Currently, there are no colleges matching your rank and category. Try with a different category or wait for the next update.
              </p>
            </Card>
          ) : loading ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <div className="h-8 bg-border-subtle/20 animate-pulse rounded-lg w-48"></div>
                <div className="h-6 bg-border-subtle/20 animate-pulse rounded-full w-32"></div>
              </div>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-8 rounded-3xl">
                  <div className="animate-pulse flex items-center justify-between gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="h-7 bg-border-subtle/20 rounded w-1/3"></div>
                      <div className="h-5 bg-border-subtle/20 rounded w-1/4"></div>
                      <div className="h-4 bg-border-subtle/20 rounded w-1/2"></div>
                    </div>
                    <div className="h-12 bg-border-subtle/20 rounded-xl w-32"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Predicted Options</h2>
              </div>
              
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={`${result.collegeId}-${result.branch}`} className="p-4 hover:border-text-main/20 transition-all hover:shadow-lg hover:shadow-black/5 group rounded-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-1.5">
                          <div className="flex-1">
                            <h3 className="font-bold text-base text-text-main group-hover:text-primary-start transition-colors leading-snug">
                              {result.collegeName}
                            </h3>
                            <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                              {result.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 rounded-lg mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                            <span className="text-[10px] font-bold text-text-main">{result.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="w-fit bg-text-main/5 text-text-main border border-text-main/10 px-2.5 py-1 rounded-lg font-bold text-xs">
                            {result.branch}
                          </div>
                          <Badge variant={getChanceColor(result.chance)} className="rounded-md px-2 py-0.5 text-[10px] whitespace-nowrap flex items-center gap-1">
                            {result.chance === 'High' && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </motion.div>
                            )}
                            {result.chance} Chance
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl px-6 h-10 border-border-subtle/70 hover:border-text-main hover:text-text-main relative overflow-hidden"
                        onClick={() => navigate(`/colleges/${result.collegeId}`)}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full"
                          animate={{ x: ['100%', '-100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="relative z-10">View Details</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-10 text-center rounded-[2.5rem] bg-card/50 border-2 border-border-subtle/30">
              <p className="text-lg font-bold text-text-main mb-4 leading-relaxed">
                Currently, there are no matching colleges available for your rank.
              </p>
              <p className="text-sm text-text-muted">
                Try checking alternate categories or explore private colleges.
              </p>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}