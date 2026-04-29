import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Trophy, Library, Home as HomeIcon, CheckCircle2, Camera, Users, ExternalLink, Star, Send, MessageSquare } from 'lucide-react';
import { Card, Badge, RatingStars, Button, Input } from '../components/ui';
import { colleges, reviews } from '../data/mock-data';
import { cn } from '../lib/utils';

export function CollegeDetails() {
  const { id } = useParams();
  const collegeId = id || "1"; // Fallback for pure demonstration
  const college = colleges.find(c => c.id === collegeId) || colleges[0];
  
  // Local state for reviews
  const [localReviews, setLocalReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Initialize reviews from mock data
    const initialReviews = reviews.filter(r => r.collegeId === collegeId);
    setLocalReviews(initialReviews);
  }, [collegeId]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const reviewToAdd = {
        id: Date.now().toString(),
        collegeId,
        name: newReview.name,
        rating: newReview.rating,
        text: newReview.text,
        date: new Date().toLocaleDateString()
      };

      setLocalReviews([reviewToAdd, ...localReviews]);
      setNewReview({ name: '', rating: 5, text: '' });
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const FacilitiesSection = ({ className }) => (
    <Card className={cn("p-6", className)}>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-text-main">
        <HomeIcon className="h-5 w-5 text-accent-indigo" />
        Facilities
      </h3>
      <ul className="space-y-3">
        {college.facilities.map((facility, idx) => (
          <li key={idx} className="flex items-center gap-2 text-text-muted">
            <div className="h-2 w-2 rounded-full bg-accent-cyan" />
            {facility}
          </li>
        ))}
      </ul>
    </Card>
  );

  const RatingsSection = ({ className }) => (
    <Card className={cn("p-6 border-primary-start/50 shadow-[0_0_15px_rgba(147,51,234,0.15)]", className)}>
      <h3 className="font-bold text-xl mb-4 text-text-main">Ratings Breakdown</h3>
      <div className="space-y-4">
        {[
          { label: 'Faculty', score: college.ratingsBreakdown?.faculty || 4.5 },
          { label: 'Placements', score: college.ratingsBreakdown?.placements || 4.8 },
          { label: 'Hostel', score: college.ratingsBreakdown?.hostel || 3.9 },
          { label: 'Campus Life', score: college.ratingsBreakdown?.campusLife || 4.7 }
        ].map(stat => (
          <div key={stat.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">{stat.label}</span>
              <span className="font-medium text-text-main">{stat.score}/5</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-start to-accent-cyan h-2 rounded-full" 
                style={{ width: `${(stat.score / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="pb-20">
      {/* Header Banner */}
      <div className="relative h-64 md:h-96 w-full">
        <div className="absolute inset-0 bg-background/60 z-10" />
        <img 
          src={college.image} 
          alt={college.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 max-w-7xl mx-auto px-4 pb-8">
          <Badge variant="brand" className="mb-4">Premium Institution</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-text-main">{college.name}</h1>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-text-muted">
              <MapPin className="h-5 w-5 text-text-muted" />
              {college.location}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-text-main">{college.rating}</span>
              <RatingStars rating={Math.floor(college.rating)} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <Library className="h-6 w-6 text-accent-indigo" />
              About College
            </h2>
            <Card className="p-6">
              <p className="text-text-muted leading-relaxed text-lg">
                {college.description} Established as a center for excellence, this institution offers world-class facilities, highly experienced faculty, and strong industry connections. Students joining here benefit from a holistic curriculum that balances academics with co-curricular growth.
              </p>
            </Card>
          </section>

          {/* Sidebar components for mobile view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
            <RatingsSection />
            <FacilitiesSection />
          </div>

          {/* New Section: Inside the Campus */}
          {college.collaborators && college.collaborators.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-text-main">
                <Users className="h-6 w-6 text-primary-start" />
                Inside the Campus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {college.collaborators.map((collab, idx) => (
                  <Card key={idx} className="p-5 border-primary-start/10 hover:border-primary-start/40 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-20 transition-opacity">
                      {collab.platform === 'Instagram' ? <Camera size={60} /> : <Users size={60} />}
                    </div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge variant="brand" className="mb-2 text-[10px] uppercase tracking-wider px-2 py-0.5">
                          {collab.role}
                        </Badge>
                        <h3 className="text-xl font-bold text-text-main group-hover:text-primary-start transition-colors">
                          {collab.name}
                        </h3>
                      </div>
                      <div className="bg-background/50 p-2 rounded-lg text-text-muted group-hover:text-primary-start transition-colors">
                        {collab.platform === 'Instagram' ? <Camera className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-muted">Reach & Community</span>
                        <span className="text-sm font-semibold text-text-main">{collab.followers}+ Members</span>
                      </div>
                      <a 
                        href={collab.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-bold text-primary-start hover:text-accent-cyan transition-colors"
                      >
                        Visit Page <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <Trophy className="h-6 w-6 text-accent-cyan" />
              Placements & Recruiters
            </h2>
            <Card className="p-6 bg-gradient-to-br from-card to-accent-indigo/10">
              <div className="mb-6">
                <p className="text-text-muted mb-1">Average Package</p>
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-start to-accent-cyan">
                  {college.placements.avgPackage}
                </p>
              </div>
              <div>
                <p className="text-text-muted mb-3">Top Recruiters</p>
                <div className="flex flex-wrap gap-2">
                  {college.placements.topRecruiters.map((recruiter, i) => (
                    <Badge key={i} variant="default" className="text-sm py-1.5 px-3">
                      {recruiter}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-text-main">4-Year Experience</h2>
            <div className="space-y-4">
              {(college.experience || [
                { year: 1, title: 'Foundation Year', description: 'Focuses on building the respective skills required for the industry.' },
                { year: 2, title: 'Core Subjects', description: 'Focuses on building the respective skills required for the industry.' },
                { year: 3, title: 'Internships & Projects', description: 'Focuses on building the respective skills required for the industry.' },
                { year: 4, title: 'Placements & Final Project', description: 'Focuses on building the respective skills required for the industry.' }
              ]).map((exp, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-primary-start" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-main">Year {exp.year}: {exp.title}</h3>
                    <p className="text-text-muted mt-1">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Student Reviews Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-text-main">
                <MessageSquare className="h-6 w-6 text-primary-start" />
                Student Reviews & Experience
              </h2>
              <Badge variant="default" className="px-3 py-1">
                {localReviews.length} Reviews
              </Badge>
            </div>

            {/* Write a Review Form */}
            <Card className="p-6 mb-10 border-primary-start/20 bg-gradient-to-br from-card to-accent-indigo/5">
              <h3 className="text-lg font-bold mb-4 text-text-main">Share Your Experience</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Your Name" 
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    required
                    className="bg-background/50"
                  />
                  <div className="flex items-center gap-3 px-4 h-12 rounded-xl bg-background/50 border border-border-subtle">
                    <span className="text-sm text-text-muted">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={cn(
                              "w-5 h-5",
                              star <= newReview.rating ? "fill-yellow-400 text-yellow-500" : "text-gray-300 dark:text-gray-600"
                            )} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea 
                  placeholder="Tell us about the campus life, faculty, or placements..." 
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  required
                  rows={3}
                  className="w-full rounded-xl border border-border-subtle bg-background/50 px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-indigo transition-all"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Submitting...
                    </span>
                  ) : showSuccess ? (
                    <span className="flex items-center gap-2">
                       <CheckCircle2 className="h-4 w-4" />
                       Submitted!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Post Review
                    </span>
                  )}
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              {localReviews.length > 0 ? (
                localReviews.map(review => (
                  <Card key={review.id} className="p-6 hover:border-primary-start/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-start to-accent-cyan flex items-center justify-center text-white font-bold">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-text-main">{review.name}</div>
                          <div className="text-[10px] text-text-muted uppercase tracking-wider">{review.date || 'Member'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-background/40 px-2 py-1 rounded-lg">
                        <RatingStars rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-text-muted italic leading-relaxed">"{review.text}"</p>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 opacity-50">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-text-muted">No reviews available yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info - Desktop Only */}
        <div className="hidden md:block space-y-8">
          <FacilitiesSection />
          <RatingsSection />
        </div>

      </div>
    </div>
  );
}
