import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Input, RatingStars, Badge } from '../components/ui';
import { colleges } from '../data/mock-data';
import { cn } from '../lib/utils';

export function Colleges() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'All Colleges' },
    { id: 'tier1', label: 'Tier 1 Colleges' },
    { id: 'tier2', label: 'Tier 2 Colleges' },
    { id: 'tier3', label: 'Tier 3 Colleges' },
    { id: 'womens', label: 'Womens Colleges' },
  ];

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'tier1') {
      const topColleges = [
        'jntu', 'osmania', 'cbit', 'vasavi', 'vnr', 'griet', 
        'cvr', 'mgit', 'vardhaman', 'kmit', 'gnits', 'bvrit', 
        'snist', 'iare', 'keshav memorial', 'gokaraju'
      ];
      const isTopName = topColleges.some(name => college.name.toLowerCase().includes(name));
      matchesFilter = college.rating >= 4.4 || isTopName;
    }
    else if (selectedFilter === 'tier2') {
      const isTier2 = college.rating >= 3.8 && college.rating < 4.4;
      // Ensure we don't include colleges already in Tier 1
      const topColleges = ['jntu', 'osmania', 'cbit', 'vasavi', 'vnr', 'griet', 'cvr', 'mgit', 'bvrit'];
      const isTopName = topColleges.some(name => college.name.toLowerCase().includes(name));
      matchesFilter = isTier2 && !isTopName;
    }
    else if (selectedFilter === 'tier3') {
      matchesFilter = college.rating < 3.8;
    }
    else if (selectedFilter === 'womens') {
      const name = college.name.toLowerCase();
      matchesFilter = name.includes('women') || 
                      name.includes('mahila') || 
                      name.includes('girls') ||
                      name.includes('female') ||
                      name.includes('gnits') || // Special case for G. Narayanamma
                      college.type === 'womens';
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-32">
      {/* Advanced Header Section */}
      <div className={cn(
        "relative mb-12 p-8 sm:p-12 rounded-[2.5rem] bg-card/40 border border-border-subtle backdrop-blur-xl shadow-[0_30px_70px_rgba(15,23,42,0.04)]",
        isFilterOpen ? "z-40" : "z-20"
      )}>
        {/* Background Decorative elements - now in their own overflow-hidden container */}
        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-start/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight"
            >
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-start to-accent-cyan">Engineering</span> Colleges
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-text-muted leading-relaxed"
            >
              Discover the perfect institution for your academic journey with detailed insights on placements, faculty, and campus life.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-auto flex items-center gap-3 relative"
          >
            <div className="relative group w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary-start transition-colors" />
              <Input 
                placeholder="Search..." 
                className="pl-12 h-14 rounded-2xl bg-white/50 dark:bg-gray-900/50 border-border-subtle focus:ring-primary-start/20 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Button 
                variant={selectedFilter !== 'all' ? 'primary' : 'outline'}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "h-14 w-14 rounded-2xl p-0 flex-none border-border-subtle bg-white/50 dark:bg-gray-900/50 transition-all",
                  selectedFilter !== 'all' && "bg-primary-start text-white border-primary-start shadow-lg shadow-primary-start/20"
                )}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>

              {/* Filter Dropdown */}
              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsFilterOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-gray-800 border border-border-subtle shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        {filterOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSelectedFilter(option.id);
                              setIsFilterOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 last:mb-0",
                              selectedFilter === option.id 
                                ? "bg-primary-start/10 text-primary-start" 
                                : "text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredColleges.map((college, index) => (
            <motion.div
              key={college.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full flex flex-col overflow-hidden rounded-[2rem] border-border-subtle/50 hover:border-primary-start/30 transition-all hover:shadow-[0_40px_80px_rgba(15,23,42,0.12)] bg-card/60 backdrop-blur-sm">
                {/* College Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img 
                    src={college.image || `https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80`} 
                    alt={college.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  {/* Rating & Truth Pills on Image */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20 shadow-lg">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-text-main">{college.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-7 flex flex-1 flex-col">
                  {/* Advanced Location Badge */}
                  <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3 w-3 text-primary-start" />
                    {college.location}
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-text-main group-hover:text-primary-start transition-colors leading-snug">
                    {college.name}
                  </h2>
                  

                  
                  <div className="mt-auto pt-6">
                    <button 
                      onClick={() => navigate(`/colleges/${college.id}`)}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-start/20 to-accent-cyan/20 hover:from-primary-start hover:to-accent-cyan text-gray-900 hover:text-white border border-primary-start/20 transition-all duration-500 font-bold text-sm shadow-sm hover:shadow-xl hover:shadow-primary-start/30 flex items-center justify-center gap-2 group/btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredColleges.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-card/30 rounded-[3rem] border border-dashed border-border-subtle"
        >
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-card/50 mb-6 border border-border-subtle">
            <Search className="h-8 w-8 text-text-muted opacity-20" />
          </div>
          <h3 className="text-2xl font-bold text-text-main mb-2">No colleges found</h3>
          <p className="text-text-muted max-w-sm mx-auto">We couldn't find any colleges matching your search. Try different keywords or location.</p>
          <Button 
            variant="ghost" 
            onClick={() => setSearchTerm('')}
            className="mt-8 text-primary-start hover:bg-primary-start/5"
          >
            Clear all filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
