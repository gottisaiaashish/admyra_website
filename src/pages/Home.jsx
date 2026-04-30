import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Users,
  Book,
  MapPin,
  ArrowRight,
  BarChart3,
} from "lucide-react";

import { Card, Button, Badge, RatingStars, Input } from "../components/ui";
import { colleges } from "../data/mock-data";
import DarkVeil from "../components/DarkVeil";
import { VelocityText } from "../components/VelocityText";

export function Home() {
  const navigate = useNavigate();
  const trending = colleges.slice(0, 4);

  return (
    <div className="w-full pb-24">

      {/* HERO */}
      <section className="relative h-[620px] sm:h-[680px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <DarkVeil />
          <div className="absolute inset-100 bg-slate-950/80" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="w-full max-w-4xl text-center">
            <Badge variant="brand" className="mb-9 text-sm">
              Admyra — Admit My Rank
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6x1 font-extrabold leading-tight tracking-tight text-white mb-6">
              Know Where You Stand.
              <span className="block bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
                Choose the Right College.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-slate-200">
              Enter your rank and instantly discover colleges you can get into — powered by real cutoff data and student insights.
            </p>
            <div className="mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="px-8 py-5" onClick={() => navigate("/predictor") }>
                <Book className="h-4 w-4 mr-2" /> Predict
              </Button>
              <Button colour="primary" size="lg" className="px-8 py-5" onClick={() => navigate("/colleges") }>
                Explore Colleges
              </Button>
            </div>

            <p className="mt-6 text-sm text-slate-300">
              Used by thousands of students • Updated for 2026
            </p>
          </div>
        </div>
      </section>

      {/* TRUST / SOCIAL PROOF */}
      <section className="border-y border-border-subtle py-6 text-center text-sm text-text-muted">
        Built with real cutoff data • Trusted by students • No guesswork
      </section>

      {/* PRODUCT FEATURES */}
      <section className="py-24 max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">

        <Card className="p-8">
          <Target className="h-10 w-10 text-primary-start mb-6" />
          <h3 className="text-xl font-bold mb-3">Rank-Based Prediction</h3>
          <p className="text-text-muted">
            Instantly see which colleges you can realistically get based on previous cutoff trends.
          </p>
        </Card>

        <Card className="p-8">
          <BarChart3 className="h-10 w-10 text-primary-start mb-6" />
          <h3 className="text-xl font-bold mb-3">College Insights</h3>
          <p className="text-text-muted">
            Explore placements, academics, campus life, and real performance metrics.
          </p>
        </Card>

        <Card className="p-8">
          <Users className="h-10 w-10 text-primary-start mb-6" />
          <h3 className="text-xl font-bold mb-3">Real Student Reviews</h3>
          <p className="text-text-muted">
            Understand what life actually feels like inside each college.
          </p>
        </Card>

      </section>

      {/* HOW IT WORKS (VERY IMPORTANT FOR TRUST) */}
      <section className="py-24 bg-card border-y border-border-subtle">
        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            How Admyra Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-left">

            <div>
              <h4 className="font-semibold mb-2">1. Enter Rank</h4>
              <p className="text-text-muted text-sm">
                Input your entrance exam rank and category.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Get Predictions</h4>
              <p className="text-text-muted text-sm">
                See colleges where you have high, medium, or low chances.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Explore & Decide</h4>
              <p className="text-text-muted text-sm">
                Compare colleges and make confident admission decisions.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* TRENDING COLLEGES */}
      <section className="py-24 max-w-6xl mx-auto px-4">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Trending Colleges</h2>

          <Button variant="ghost" onClick={() => navigate("/colleges")}>
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {trending.map((college) => (
            <Card key={college.id} className="overflow-hidden group">

              <img
                src={college.image}
                className="h-40 w-full object-cover group-hover:scale-105 transition"
              />

              <div className="p-4">
                <h3 className="font-semibold">{college.name}</h3>

                <div className="flex items-center gap-1 text-sm text-text-muted mb-2">
                  <MapPin className="h-3 w-3" />
                  {college.location}
                </div>

                <div className="flex justify-between items-center">
                  <RatingStars rating={Math.floor(college.rating)} />
                  <Button size="sm" onClick={() => navigate(`/colleges/${college.id}`)}>
                    View
                  </Button>
                </div>
              </div>

            </Card>
          ))}
        </div>

      </section>

       <VelocityText />

      {/* FINAL CTA */}
    <section className="relative py-28 px-6 overflow-hidden">
  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 blur-2xl opacity-60"></div>

  <div className="relative max-w-4xl mx-auto text-center">

    {/* Badge */}
    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
    
    </div>

     

    {/* Heading */}
    <h2 className="text-5xl font-extrabold leading-tight mb-6">
      Stop Guessing Your Future 🎯
    </h2>

    {/* Subtitle */}
    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
      Use real admission data, rank trends, and AI insights to choose the right college with confidence.
    </p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button
        size="lg"
        className="px-8 py-6 text-lg shadow-md"
        onClick={() => navigate("/predictor")}
      >
        Predict My College
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="px-8 py-6 text-lg"
      >
        Explore Colleges
      </Button>
    </div>

    {/* Trust Line */}
    <p className="text-sm text-gray-400 mt-6">
      Trusted by thousands of students across India 🇮🇳
    </p>

  </div>
</section>

    </div>
  );
}