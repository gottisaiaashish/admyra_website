import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Trophy, Library, Home as HomeIcon, CheckCircle2 } from 'lucide-react';
import { Card, Badge, RatingStars } from '../components/ui';
import { colleges, reviews } from '../data/mock-data';

export function CollegeDetails() {
  const { id } = useParams();
  const collegeId = id || "1"; // Fallback for pure demonstration
  const college = colleges.find(c => c.id === collegeId) || colleges[0];
  const collegeReviews = reviews.filter(r => r.collegeId === collegeId);

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
              {['Foundation Year', 'Core Subjects', 'Internships & Projects', 'Placements & Final Project'].map((year, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-primary-start" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-main">Year {i + 1}: {year}</h3>
                    <p className="text-text-muted mt-1">Focuses on building the respective skills required for the industry.</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6 text-text-main">Student Reviews</h2>
            <div className="space-y-4">
              {collegeReviews.length > 0 ? (
                collegeReviews.map(review => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-semibold text-lg text-text-main">{review.name}</div>
                      <div className="flex items-center gap-1">
                        <RatingStars rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-text-muted italic">"{review.text}"</p>
                  </Card>
                ))
              ) : (
                <p className="text-text-muted">No reviews available for this college yet.</p>
              )}
            </div>
          </section>

        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="p-6">
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

          <Card className="p-6 border-primary-start/50 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
            <h3 className="font-bold text-xl mb-4 text-text-main">Ratings Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Faculty', score: 4.5 },
                { label: 'Placements', score: 4.8 },
                { label: 'Hostel', score: 3.9 },
                { label: 'Campus Life', score: 4.7 }
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
        </div>

      </div>
    </div>
  );
}
