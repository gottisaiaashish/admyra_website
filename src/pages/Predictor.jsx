import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Select, Badge, RatingStars } from '../components/ui';
import { predictorMockLogic } from '../data/mock-data';

export function Predictor() {
  const navigate = useNavigate();
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('OC');
  const [gender, setGender] = useState('Male');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = (e) => {
    e.preventDefault();
    if (!rank) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const predicted = predictorMockLogic(parseInt(rank));
      setResults(predicted);
      setLoading(false);
    }, 1000);
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
        <div className="h-16 w-16 bg-accent-cyan/10 rounded-2xl flex items-center justify-center mb-4">
          <Target className="h-8 w-8 text-accent-cyan" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Rank Predictor</h1>
        <p className="text-text-muted">
          Enter your rank and category details to get an accurate prediction of colleges and branches you can secure.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Form Card */}
        <div className="md:col-span-4 h-max sticky top-24">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Your Details</h2>
            <form onSubmit={handlePredict} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Exam Rank</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 1500" 
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Category</label>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="OC">Open Category (OC)</option>
                  <option value="BC">Backward Class (BC)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Gender</label>
                <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg" disabled={!rank || loading}>
                  {loading ? 'Analyzing...' : 'Predict Colleges'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Results Section */}
        <div className="md:col-span-8">
          {!results && !loading ? (
            <Card className="p-38  border-dashed border-2 border-border-subtle bg-transparent flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-text-muted mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Predictions Yet</h3>
              <p className="text-text-muted">Fill your details and click predict to see your options here.</p>
            </Card>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse flex flex-col gap-4">
                    <div className="h-6 bg-border-subtle rounded w-3/4"></div>
                    <div className="h-4 bg-border-subtle rounded w-1/2"></div>
                    <div className="h-10 bg-border-subtle rounded w-full mt-2"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Predicted Options</h2>
                <Badge variant="brand">{results.length} Colleges Found</Badge>
              </div>
              
              {results.map((result) => (
                <Card key={result.id} className="p-6 hover:border-primary-start/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl">{result.collegeName}</h3>
                        <Badge variant={getChanceColor(result.chance)}>{result.chance} Chance</Badge>
                      </div>
                      <p className="text-text-muted mb-2 font-medium">{result.branch}</p>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span>Cutoff Rank: <strong className="text-text-main">{result.cutoff}</strong></span>
                        <div className="flex items-center gap-1">
                          <RatingStars rating={Math.floor(result.rating)} />
                          <span className="ml-1">{result.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      // onClick={() => navigate('/colleges/1')} 
                      onClick={() => navigate(`/colleges/${result.collegeId}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-xl text-text-main mb-2">It seems tough to predict an allocation for this rank. Based on your rank, there are currently no suitable colleges available in our database. We are continuously updating our data. Please check back later.</p>
              <p className="text-text-muted">Try checking alternate categories or explore private colleges.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}