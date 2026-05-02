import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, AlertCircle, Check } from 'lucide-react';
import { Button, Card, Input, Select, Badge, RatingStars, MultiSelect } from '../components/ui';
import { predictorMockLogic } from '../data/mock-data';

const EXAM_CARD = {
  name: 'TG EAPCET',
  title: 'Telangana Engineering Entrance',
  tags: ['ENGINEERING', 'rank'],
};

const BRANCH_OPTIONS = [
  "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AI & DS", "CSE (AI & ML)", "CSE (Cyber Security)", "Data Science", "Chemical", "EIE"
];

export function Predictor() {
  const navigate = useNavigate();
  
  // Load initial state from sessionStorage if available
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
    sessionStorage.setItem('predictor_results', JSON.stringify(results));
  }, [currentStep, selectedExam, rank, category, gender, selectedBranches, results]);

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
  }, [rank, category, gender, selectedBranches]);

  const handleSelectExam = (exam) => setSelectedExam(exam);
  const goNext = () => setCurrentStep((step) => Math.min(4, step + 1));
  const goBack = () => setCurrentStep((step) => Math.max(1, step - 1));
  const canContinueStep1 = selectedExam === EXAM_CARD.name;
  const canContinueStep2 = rank.trim().length > 0;
  const canContinueStep3 = category.length > 0 && gender.length > 0;
  const canPredict = selectedBranches.length > 0;

  const handlePredict = (e) => {
    e.preventDefault();
    if (!selectedExam || !rank || !category || !gender) return;

    setLoading(true);
    setTimeout(() => {
      let predicted = predictorMockLogic(
        selectedExam,
        parseInt(rank, 10),
        category,
        gender
      );

      // Filter by selected branches if any
      if (selectedBranches.length > 0) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-30">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
        <div className="h-20 w-20 bg-accent-cyan/10 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-accent-cyan/20">
          <Target className="h-10 w-10 text-accent-cyan" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold sm:font-bold mb-6 tracking-tight text-text-main">Rank Predictor</h1>
        <p className="text-base sm:text-xl text-text-muted font-medium leading-relaxed">
          Enter your rank and category details to get an accurate prediction of colleges and branches you can secure.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Form Card (Left) */}
        <div className="lg:col-span-4 h-max lg:sticky lg:top-24">
          <Card className="p-6 sm:p-8 shadow-xl shadow-black/5 border-border-subtle/50 rounded-3xl">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Step {currentStep} of 4</p>
                  <h2 className="text-2xl font-bold mt-3">
                    {currentStep === 1 ? 'Select Exam' : 
                     currentStep === 2 ? 'Enter Exam Rank' : 
                     currentStep === 3 ? 'Category & Gender' : 
                     'Select Branches'}
                  </h2>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {['1', '2', '3', '4'].map((step) => (
                    <div
                      key={step}
                      className={
                        'h-10 w-10 flex items-center justify-center rounded-full border text-sm font-semibold ' +
                        (parseInt(step, 10) === currentStep
                          ? 'border-primary-start bg-primary-start text-white'
                          : 'border-border-subtle bg-background text-text-muted')
                      }
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handlePredict} className="space-y-6">
              {currentStep === 1 && (
                <div>
                  <div
                    onClick={() => handleSelectExam(EXAM_CARD.name)}
                    className={
                      'cursor-pointer rounded-3xl border p-4 sm:p-6 transition ' +
                      (selectedExam === EXAM_CARD.name
                        ? 'border-primary-start bg-primary-start/10 shadow-sm'
                        : 'border-border-subtle hover:border-primary-start hover:bg-white/70')
                    }
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-muted">{EXAM_CARD.name}</p>
                        <h3 className="mt-3 text-lg sm:text-xl font-semibold sm:font-bold text-text-main">{EXAM_CARD.title}</h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {EXAM_CARD.tags.map((tag) => (
                            <Badge key={tag} variant="brand" className="rounded-full px-2.5 py-1 text-[10px] sm:text-xs uppercase tracking-[0.16em]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedExam === EXAM_CARD.name && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-start/10 px-2.5 py-1 text-[0.68rem] font-semibold text-primary-start">
                          <Check className="h-3 w-3" />
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
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
              )}

               {currentStep === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-2 ml-1">Category</label>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="rounded-2xl border-border-subtle/70 h-14 text-base"
                    >
                      <option value="">Select Category</option>
                      <option value="OC">OC</option>
                      <option value="EWS">EWS</option>
                      <option value="BC-A">BC-A</option>
                      <option value="BC-B">BC-B</option>
                      <option value="BC-C">BC-C</option>
                      <option value="BC-D">BC-D</option>
                      <option value="BC-E">BC-E</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-main mb-2 ml-1">Gender</label>
                    <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="rounded-2xl border-border-subtle/70 h-14 text-base"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Select>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <div>
                  <label className="block text-sm font-bold text-text-main mb-2 ml-1">Preferred Branches</label>
                  <MultiSelect
                    options={BRANCH_OPTIONS}
                    value={selectedBranches}
                    onChange={setSelectedBranches}
                    placeholder="Search and select branches..."
                    className="rounded-2xl border-border-subtle/70 h-14 text-base"
                  />
                  <p className="mt-4 text-sm text-text-muted leading-relaxed">
                    Select the branches you are interested in. We will filter the predictions to show only these options.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                <div className="w-full sm:w-auto">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={goBack}
                    >
                      Back
                    </Button>
                  )}
                </div>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    disabled={
                      currentStep === 1 ? !canContinueStep1 : 
                      currentStep === 2 ? !canContinueStep2 : 
                      !canContinueStep3
                    }
                    onClick={goNext}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={!canPredict || loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Predicting...
                      </div>
                    ) : 'Predict'}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Results Section (Right) */}
        <div className="lg:col-span-8">
          {!results && !loading ? (
            <Card className="py-32 px-8 border-dashed border-2 border-border-subtle/40 bg-card/30 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 bg-border-subtle/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-text-muted" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No Predictions Yet</h3>
              <p className="text-lg text-text-muted max-w-md">
                Fill your details and click predict to see your options here.
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
                <Badge variant="brand" className="px-4 py-1.5 text-sm rounded-full">
                  {results.length} Colleges Found
                </Badge>
              </div>
              
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={`${result.collegeId}-${result.branch}`} className="p-7 md:p-8 hover:border-primary-start/40 transition-all hover:shadow-xl hover:shadow-primary-start/5 group rounded-3xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <h3 className="font-bold text-base md:text-2xl text-text-main group-hover:text-primary-start transition-colors leading-tight line-clamp-2">
                            {result.collegeName}
                          </h3>
                          <Badge variant={getChanceColor(result.chance)} className="rounded-lg px-3 w-fit self-start">
                            {result.chance} Chance
                          </Badge>
                        </div>
                        <p className="text-xl text-text-muted mb-4 font-bold">{result.branch}</p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <RatingStars rating={result.rating} />
                            <span className="text-sm font-bold text-text-main">{result.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="rounded-2xl px-8 border-border-subtle/70 hover:border-primary-start hover:text-primary-start group-hover:bg-primary-start/5"
                        onClick={() => navigate(`/colleges/${result.collegeId}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-16 text-center rounded-[2.5rem] bg-card/50 border-2 border-border-subtle/30">
              <p className="text-2xl font-bold text-text-main mb-6 leading-relaxed">
                Currently, there are no matching colleges available for your rank. We're continuously updating our data to improve accuracy. Please check back later.
              </p>
              <p className="text-lg text-text-muted">
                Try checking alternate categories or explore private colleges.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}