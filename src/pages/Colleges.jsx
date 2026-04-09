import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { Button, Card, Input, RatingStars } from '../components/ui';
import { colleges } from '../data/mock-data';

export function Colleges() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Colleges</h1>
          <p className="text-text-muted">Find the best engineering colleges for your future.</p>
        </div>
        
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search colleges..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="px-3">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((college) => (
          <Card key={college.id} className="flex flex-col h-full group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={college.image} 
                alt={college.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="flex items-center gap-1.5 text-sm bg-card/80 backdrop-blur-md px-2 py-1 rounded-md text-text-main border border-border-subtle">
                  <MapPin className="h-3 w-3" />
                  {college.location.split(',')[0]}
                </div>
                <div className="bg-card/90 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-border-subtle">
                  <span className="font-bold text-sm text-text-main">{college.rating}</span>
                  <RatingStars rating={Math.floor(college.rating)} />
                </div>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-xl mb-2 line-clamp-2">{college.name}</h3>
              <p className="text-text-muted text-sm line-clamp-2 mb-6 flex-grow">
                {college.description}
              </p>
              
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-primary-start group-hover:text-black group-hover:border-primary-start transition-colors"
                onClick={() => navigate(`/colleges/${college.id}`)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredColleges.length === 0 && (
        <div className="py-20 text-center text-text-muted">
          No colleges found matching your search.
        </div>
      )}
    </div>
  );
}
