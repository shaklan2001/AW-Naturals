import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroScene } from './components/HeroScene';
import { ClinicalNatureHero } from '@/shared/components/ClinicalNatureHero';
import { Button } from './components/Button';
import { BundleCard } from './components/BundleCard';
import { RitualStepCard, QuizCard, BlogCard, TestimonialCard } from './components/ContentCards';
import { Leaf, Moon, Sun, Activity, Sparkles, Brain, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section:not(.cnh-root)');
    gsap.fromTo(
      sections,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.home-primary-hero-inner',
        { y: 110, opacity: 0.12, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.home-primary-hero',
            start: 'top bottom',
            end: 'top 72%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#0c0907] min-h-screen text-[#f0e8d4] font-[Inter] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0c0907]/90 backdrop-blur-md border-b border-[#3d1a0a]/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-['Playfair_Display'] font-bold text-2xl tracking-wide text-[#d4af37]">
            AW NATURALS
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#f0e8d4]/80">
            <a href="#" className="hover:text-[#d4af37] transition-colors">Shop</a>
            <a href="#" className="text-[#d4af37] transition-colors">Protocol</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Science</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">About</a>
          </div>
          <Button variant="gold" className="px-6 py-2 text-xs uppercase tracking-widest">
            Take Assessment
          </Button>
        </div>
      </nav>

      <ClinicalNatureHero variant="home" blendBottomColor="#0c0907" sectionId="home-clinical-hero" />

      {/* Primary hero — same #0c0907 as botanical veil end + soft top fade for blend */}
      <section className="home-primary-hero relative z-[25] -mt-[min(46vh,480px)] flex min-h-[100svh] items-center overflow-hidden rounded-t-[2rem] border-t border-[#d4af37]/[0.12] bg-[#0c0907] pt-24 shadow-[0_-32px_100px_rgba(0,0,0,0.65)] md:-mt-[min(50vh,520px)] md:rounded-t-[2.5rem] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-[5] before:h-44 before:bg-gradient-to-b before:from-black/50 before:to-transparent md:before:h-52">
        <HeroScene />
        <div className="home-primary-hero-inner relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-[min(6vh,64px)] text-center md:pt-[min(7vh,72px)]">
          <span className="mb-6 text-[10px] font-bold uppercase tracking-[3px] text-[#d4af37]">
            Clinical Science Meets Organic Healing
          </span>
          <h1 className="mb-8 max-w-4xl font-['Playfair_Display'] text-5xl font-medium leading-tight md:text-7xl">
            Rewire Your Baseline <br />
            <span className="italic text-[#d4af37]">Naturally.</span>
          </h1>
          <p className="mb-10 max-w-xl text-lg font-light leading-relaxed text-[#f0e8d4]/70">
            Premium botanical protocols rigorously tested for bioavailability to support deep cellular resilience and
            balance.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="gold" className="px-8 py-4 text-sm font-bold uppercase tracking-widest">
              Explore Products
            </Button>
            <Button
              variant="ghost"
              className="border-[#d4af37]/30 px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10"
            >
              Our Science
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] font-medium text-4xl mb-4 text-[#d4af37]">
            Foundational Protocols
          </h2>
          <p className="font-light text-[#f0e8d4]/60 max-w-xl mx-auto">
            Synergistic formulas designed to address root-cause imbalances.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <BundleCard 
            title="Morning Clarity"
            subtitle="Focus & cognitive support"
            oldPrice="$85"
            price="$72"
            description="Lions Mane and adaptogenic blend for sustained mental energy without the crash."
            tag="Nootropic"
            icon={Sun}
          />
          <BundleCard 
            isFeatured
            saveText="Save 20%"
            title="Complete Balance"
            subtitle="3-part harmony protocol"
            oldPrice="$180"
            price="$140"
            description="A full monthly supply of our top synergistic formulas for total system optimization."
            tag="Bestseller"
            icon={Activity}
          />
          <BundleCard 
            saveText="Save 15%"
            title="Deep Rest"
            subtitle="Cellular repair protocol"
            oldPrice="$95"
            price="$80"
            description="Calm the nervous system and enhance REM sleep cycles organically."
            tag="Recovery"
            icon={Moon}
          />
        </div>
      </section>

      {/* Assessment Quiz Preview */}
      <section className="py-24 bg-[#140e0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3">
              <h2 className="font-['Playfair_Display'] font-medium text-4xl mb-6 text-[#d4af37]">
                Personalize Your Path
              </h2>
              <p className="font-light text-[#f0e8d4]/60 mb-8 leading-relaxed">
                Take our 3-minute clinical assessment to discover the exact botanical profile your system needs right now.
              </p>
              <Button variant="gold" className="px-8 py-4 text-sm font-bold uppercase tracking-widest">
                Start Assessment
              </Button>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <QuizCard 
                icon={Brain}
                title="Cognitive Optimization"
                desc="Focusing on mental clarity, memory, and sustained focus."
                selected={selectedQuiz === 0}
                onSelect={() => setSelectedQuiz(0)}
              />
              <QuizCard 
                icon={ShieldCheck}
                title="Immune Resilience"
                desc="Focusing on deep immune support and vitality."
                selected={selectedQuiz === 1}
                onSelect={() => setSelectedQuiz(1)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] font-medium text-4xl mb-4 text-[#d4af37]">
            The Daily Ritual
          </h2>
          <p className="font-light text-[#f0e8d4]/60 max-w-xl mx-auto">
            Small, intentional steps for profound long-term results.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-center gap-8 items-center lg:items-stretch">
          <RitualStepCard 
            step={1}
            time="Morning"
            title="Awaken & Align"
            desc="Take 2 full droppers of Clarity under the tongue. Hold for 30 seconds before swallowing."
          />
          <RitualStepCard 
            step={2}
            time="Afternoon"
            title="Sustain & Protect"
            desc="Mix 1 scoop of Resilience powder into water or tea to maintain energy reserves."
          />
          <RitualStepCard 
            step={3}
            time="Evening"
            title="Unwind & Repair"
            desc="Consume 2 capsules of Deep Rest 45 minutes before sleep for optimal nervous system reset."
          />
        </div>
      </section>

      <section className="py-24 bg-[#140e0a]">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <h2 className="font-['Playfair_Display'] font-medium text-4xl mb-16 text-center text-[#d4af37]">
            Clinical Results, <br/>Felt Daily
          </h2>
          <div className="flex gap-8 overflow-x-auto pb-8 snap-x">
            <div className="snap-center shrink-0">
              <TestimonialCard 
                initials="MS"
                name="Marie S."
                review="The most noticeable shift has been in my morning energy levels. Using the harmony protocol for just two weeks completely reset my sleep-wake cycles. Highly recommended for anyone burning the candle at both ends."
              />
            </div>
            <div className="snap-center shrink-0">
              <TestimonialCard 
                initials="DR"
                name="David R."
                review="I've tried countless adaptogen blends, but AW Naturals is the first where I actually feel the cognitive lift within 20 minutes. It's clean, sustained focus without the crash."
              />
            </div>
            <div className="snap-center shrink-0">
              <TestimonialCard 
                initials="EL"
                name="Elena L."
                review="As a functional medicine practitioner, I am incredibly discerning about the supplements I recommend. The purity and extraction methods used here are top-tier."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-['Playfair_Display'] font-medium text-4xl mb-4 text-[#d4af37]">
              The Journal
            </h2>
            <p className="font-light text-[#f0e8d4]/60 max-w-xl">
              Latest research and insights from our clinical team.
            </p>
          </div>
          <Button variant="ghost" className="border-[#d4af37]/30 text-[#d4af37] hover:border-[#d4af37] hover:bg-[#d4af37]/10 hidden sm:block">
            View All Articles
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <BlogCard 
            imagePath="https://images.unsplash.com/photo-1757802412806-433e4e60eec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBvcmdhbmljJTIwbmF0dXJhbHxlbnwxfHx8fDE3NzQxODc2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            date="MAR 12, 2026"
            title="The Bioavailability Problem in Modern Supplements"
            desc="Discover the profound science bridging ancient herbal wisdom with modern extraction techniques to maximize bioavailability."
          />
          <BlogCard 
            imagePath="https://images.unsplash.com/photo-1582008104926-f3048e757d27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMGVzc2VudGlhbCUyMG9pbHMlMjBvcmdhbmljfGVufDF8fHx8MTc3NDE4NzYyN3ww&ixlib=rb-4.1.0&q=80&w=1080"
            date="FEB 28, 2026"
            title="Adaptogens for Adrenal Fatigue"
            desc="How rhodiola and ashwagandha work synergistically to lower cortisol levels and restore baseline metabolic function."
          />
          <BlogCard 
            imagePath="https://images.unsplash.com/photo-1713573997375-3fb3f77797eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGFwdG9nZW5zJTIwbXVzaHJvb21zJTIwb3JnYW5pYyUyMGhlYWx0aHxlbnwxfHx8fDE3NzQxODc2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            date="FEB 15, 2026"
            title="Mycelial Networks and Cellular Immunity"
            desc="Exploring the latest clinical trials on turkey tail and reishi extracts for long-term immune system resilience."
          />
        </div>
      </section>

      <footer className="border-t border-[#3d1a0a]/30 pt-16 pb-8 px-6 bg-[#0c0907]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-[13px] text-[#f0e8d4]/70">
          <div>
            <div className="font-['Playfair_Display'] font-bold text-2xl tracking-wide text-[#d4af37] mb-6">
              AW NATURALS
            </div>
            <p className="font-light leading-relaxed max-w-xs">
              Formulated by clinicians. Backed by science. Rooted in nature.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#f0e8d4] mb-6 uppercase tracking-wider text-xs">Shop</h4>
            <div className="flex flex-col gap-3 font-light">
              <a href="#" className="hover:text-[#d4af37]">All Products</a>
              <a href="#" className="hover:text-[#d4af37]">Bundles & Protocols</a>
              <a href="#" className="hover:text-[#d4af37]">Take Assessment</a>
              <a href="#" className="hover:text-[#d4af37]">Gift Cards</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#f0e8d4] mb-6 uppercase tracking-wider text-xs">Learn</h4>
            <div className="flex flex-col gap-3 font-light">
              <a href="#" className="hover:text-[#d4af37]">Our Science</a>
              <a href="#" className="hover:text-[#d4af37]">Ingredient Glossary</a>
              <a href="#" className="hover:text-[#d4af37]">The Journal</a>
              <a href="#" className="hover:text-[#d4af37]">About Us</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#f0e8d4] mb-6 uppercase tracking-wider text-xs">Connect</h4>
            <div className="flex flex-col gap-3 font-light">
              <a href="#" className="hover:text-[#d4af37]">Contact Support</a>
              <a href="#" className="hover:text-[#d4af37]">Instagram</a>
              <a href="#" className="hover:text-[#d4af37]">Wholesale</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#3d1a0a]/30 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] font-light text-[#f0e8d4]/40">
          <p>© 2026 AW Naturals. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-[#f0e8d4]">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-[#f0e8d4]">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
