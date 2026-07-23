'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  FileText, 
  Zap, 
  Activity, 
  HelpCircle, 
  User, 
  Send, 
  ArrowRight, 
  Plus, 
  UploadCloud, 
  Share2, 
  Slack, 
  Mail, 
  Briefcase, 
  DollarSign,
  Maximize2,
  Lock,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import BookDemoModal from './components/BookDemoModal';

function parseMetric(value: string) {
  const match = value.match(/^([^0-9]*)([0-9,.]+)([^0-9]*)$/);
  if (!match) {
    return { prefix: '', numberStr: '', suffix: '', targetVal: NaN, decimalPlaces: 0 };
  }
  const prefix = match[1] || '';
  const numberStr = match[2] || '';
  const suffix = match[3] || '';
  const decimalIndex = numberStr.indexOf('.');
  const decimalPlaces = decimalIndex === -1 ? 0 : numberStr.length - decimalIndex - 1;
  const targetVal = parseFloat(numberStr.replace(/,/g, ''));
  return { prefix, numberStr, suffix, targetVal, decimalPlaces };
}

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 2500 }) => {
  const { prefix, suffix, targetVal, decimalPlaces } = parseMetric(value);
  const [displayValue, setDisplayValue] = useState(() => {
    if (isNaN(targetVal)) return value;
    const zeroNum = (0).toFixed(decimalPlaces);
    return prefix + zeroNum + suffix;
  });
  
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
    if (isNaN(targetVal)) return;

    // easeInOutExpo curve: smoothly accelerates then decelerates, stopping at the final value.
    const easeInOutExpo = (t: number) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if (t < 0.5) {
        return Math.pow(2, 20 * t - 10) / 2;
      }
      return (2 - Math.pow(2, -20 * t + 10)) / 2;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animationStarted.current) {
          animationStarted.current = true;
          let startTime: number | null = null;

          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            const easedProgress = easeInOutExpo(progress);
            const currentVal = targetVal * easedProgress;

            const formattedNum = currentVal.toFixed(decimalPlaces);
            const parts = formattedNum.split('.');
            parts[0] = Number(parts[0]).toLocaleString('en-US');
            const newDisplay = prefix + parts.join('.') + suffix;

            setDisplayValue(newDisplay);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [value, duration, prefix, suffix, targetVal, decimalPlaces]);

  return <span ref={elementRef}>{displayValue}</span>;
};

export default function LandingPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [bookDemoEmail, setBookDemoEmail] = useState('');
  const [isEnterpriseDemo, setIsEnterpriseDemo] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Autoplay slideshow state for the dashboard centerpiece
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 7);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // OCR upload simulation state
  const [ocrStep, setOcrStep] = useState(0);
  useEffect(() => {
    if (activeTab === 3) {
      const t1 = setTimeout(() => setOcrStep(1), 1000); // OCR active
      const t2 = setTimeout(() => setOcrStep(2), 2500); // AI Validate
      const t3 = setTimeout(() => setOcrStep(3), 4000); // Complete
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setOcrStep(0);
    }
  }, [activeTab]);

  return (
    <div ref={containerRef} className="relative bg-white text-[#0d2227] selection:bg-[#abc6d8]/50 overflow-x-hidden">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#abc6d8]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[120vh] right-1/4 w-[500px] h-[500px] bg-[#abc6d8]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[280vh] left-1/3 w-[600px] h-[600px] bg-[#abc6d8]/8 rounded-full blur-[160px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-white/95 border-b border-[#0d2227]/10 text-[#0d2227] shadow-sm backdrop-blur' : 'bg-transparent border-b border-kaiterra-dark/10 text-[#0d2227]'}`}>
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0d2227] to-[#abc6d8] flex items-center justify-center font-bold text-white shadow-lg">
            N
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#0d2227]">InvoNest</span>
        </Link>

        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium z-40 transition-colors duration-300 text-[#0d2227]/80`}>
          <a href="#features" className="transition-colors hover:text-black font-semibold">Features</a>
          
          {/* Product Dropdown Trigger */}
          <div 
            className="relative py-2 cursor-pointer flex items-center gap-1 transition-colors hover:text-black font-semibold"
            onMouseEnter={() => setOpenDropdown('product')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span>Product</span>
            <ChevronDown className="w-3.5 h-3.5" />
            
            <AnimatePresence>
              {openDropdown === 'product' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-white border border-[#0d2227]/15 rounded-xl shadow-2xl p-2 z-50 text-left flex flex-col gap-1"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center font-bold text-xs text-purple-700">C</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">AI CFO Advisor</span>
                      <span className="text-zinc-500 text-[10px] block">Check hiring & payroll limits</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-700">S</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">Scenario Simulator</span>
                      <span className="text-zinc-500 text-[10px] block">Test operational changes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-pink-100 flex items-center justify-center font-bold text-xs text-pink-700">H</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">Client Health Score</span>
                      <span className="text-zinc-500 text-[10px] block">Track reliability ratings</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center font-bold text-xs text-red-700">R</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">Risk Engine</span>
                      <span className="text-zinc-500 text-[10px] block">Payment curves & credits</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Integrations Dropdown Trigger */}
          <div 
            className="relative py-2 cursor-pointer flex items-center gap-1 transition-colors hover:text-black font-semibold"
            onMouseEnter={() => setOpenDropdown('integrations')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span>Integrations</span>
            <ChevronDown className="w-3.5 h-3.5" />

            <AnimatePresence>
              {openDropdown === 'integrations' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[310px] bg-white border border-[#0d2227]/15 rounded-xl shadow-2xl p-2.5 z-50 text-left flex flex-col gap-1"
                >
                  <div className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-zinc-100 border border-zinc-200 flex items-center justify-center font-extrabold text-[9px] text-[#0d2227]">N</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">Netsuite</span>
                      <span className="text-zinc-500 text-[10px] block">Your ERP data, actionable</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center font-bold text-[9px] text-green-700">S</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">Sage Intacct</span>
                      <span className="text-zinc-500 text-[10px] block">Accelerate your cash collection</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center font-bold text-[9px] text-indigo-700">S</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">Stripe Billing</span>
                      <span className="text-zinc-500 text-[10px] block">When smart-retries won't cut it</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center font-bold text-[9px] text-teal-700">Z</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">Zuora</span>
                      <span className="text-zinc-500 text-[10px] block">Drive your cash collection</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center font-bold text-[9px] text-orange-700">C</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">Chargebee</span>
                      <span className="text-zinc-500 text-[10px] block">Deal with offline reminders</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-[#abc6d8]/10 transition-all text-[#0d2227]">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center font-bold text-[9px] text-emerald-700">Q</span>
                    <div>
                      <span className="text-[#0d2227] text-xs font-bold block">QuickBooks</span>
                      <span className="text-zinc-500 text-[10px] block">Maximize collection efficiency</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#pricing" className="transition-colors hover:text-black font-semibold">Pricing</a>
          <Link href="/about" className="transition-colors hover:text-black font-semibold">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full border transition-all duration-300 flex items-center justify-center ${
              isScrolled
                ? 'border-[#0d2227]/10 text-[#0d2227] hover:bg-[#0d2227]/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5'
                : 'border-kaiterra-dark/15 text-[#0d2227] hover:bg-[#0d2227]/5'
            }`}
            aria-label="Toggle Dark Mode"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </motion.div>
          </button>

          <Link href="/dashboard" className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-zinc-400 hover:text-white' : 'text-[#0d2227]/80 hover:text-black'}`}>
            Sign In
          </Link>
          <Link href="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md duration-300 ${isScrolled ? 'bg-white text-black hover:bg-zinc-200 shadow-white/5' : 'bg-[#0d2227] text-white hover:bg-black shadow-[#0d2227]/10'}`}>
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 bg-kaiterra-blue text-kaiterra-dark w-full overflow-hidden border-b border-kaiterra-dark/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 md:px-12">
          {/* Left Column: Text and Interactive Input Form */}
          <div className="text-left space-y-6">
            <span className="inline-block text-[11px] uppercase font-extrabold tracking-[0.2em] text-[#0d2227]/70 font-mono">
              Financial Relationship Management
            </span>
            
            <h1 className="text-3xl md:text-5.5xl font-normal tracking-tight leading-[1.1] text-kaiterra-dark uppercase font-editorial">
              Faster Payments.<br />
              Stronger Customer<br />
              Relationships. Efficient &<br />
              Profitable Growth.
            </h1>

            <p className="text-[#0d2227]/80 text-xs md:text-sm leading-relaxed max-w-md font-semibold">
              Join thousands of next-level finance leaders and go from chasing invoices to engaging customers.
            </p>

            {/* Interactive Input Form */}
            {demoSubmitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-kaiterra-dark/10 border border-kaiterra-dark/20 rounded-xl p-3.5 max-w-md text-xs font-bold text-kaiterra-dark flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 shrink-0 text-kaiterra-dark" /> Demo requested for {demoEmail}! We'll contact you shortly.
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input 
                  type="email" 
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="bg-white border border-kaiterra-dark/25 rounded-xl text-xs px-4 py-3 flex-1 focus:outline-none focus:border-kaiterra-dark text-[#0d2227] placeholder-[#0d2227]/50"
                />
                <button 
                  onClick={() => {
                    if (demoEmail.trim()) {
                      setBookDemoEmail(demoEmail);
                      setIsEnterpriseDemo(false);
                      setIsBookDemoOpen(true);
                    }
                  }}
                  className="bg-[#0d2227] hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#0d2227]/10 shrink-0"
                >
                  Request a demo
                </button>
              </div>
            )}

            <div>
              <a href="#cashflow-overview" className="text-xs font-bold text-[#0d2227] hover:underline flex items-center gap-1">
                or explore InvoNest via our Virtual Product Tour <ArrowRight className="w-3.5 h-3.5 text-[#0d2227]" />
              </a>
            </div>
          </div>

          {/* Right Column: Floating Interactive Cards Grid */}
          <div className="relative h-[430px] w-full hidden lg:block select-none">
            
            {/* Card 1: 26 Days DSO */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute top-0 left-0 w-[240px] bg-white border border-kaiterra-dark/15 rounded-xl p-5 shadow-2xl z-10 text-kaiterra-dark"
            >
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wide">Days sales outstanding</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#0d2227]">26 days</span>
                <span className="px-1.5 py-0.5 rounded bg-green-100 text-[9px] text-green-700 font-bold flex items-center gap-0.5">↘ -9 days</span>
              </div>
              
              {/* mini bar graph */}
              <div className="h-16 flex items-end gap-2 mt-4 border-b border-kaiterra-dark/10 pb-1">
                <div className="flex-1 bg-zinc-200/80 h-[80%] rounded-sm relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-zinc-500 hidden group-hover:block font-mono">46</span></div>
                <div className="flex-1 bg-zinc-200/80 h-[66%] rounded-sm relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-zinc-500 hidden group-hover:block font-mono">38</span></div>
                <div className="flex-1 bg-zinc-200/80 h-[50%] rounded-sm relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-zinc-500 hidden group-hover:block font-mono">29</span></div>
                <div className="flex-1 bg-zinc-200/80 h-[60%] rounded-sm relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-zinc-500 hidden group-hover:block font-mono">35</span></div>
                <div className="flex-1 bg-green-500 h-[44%] rounded-sm relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-green-700 font-bold hidden group-hover:block font-mono">26</span></div>
              </div>
              <div className="flex justify-between text-[8px] text-zinc-500 font-mono mt-1 px-0.5">
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </motion.div>

            {/* Card 2: Aging Balance */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute top-6 right-0 w-[220px] bg-white border border-kaiterra-dark/15 rounded-xl p-5 shadow-2xl text-kaiterra-dark"
            >
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wide mb-3">Aging Balance</span>
              <div className="h-20 flex items-end gap-3 relative border-b border-kaiterra-dark/10 pb-1">
                <div className="absolute inset-0 flex flex-col justify-between opacity-20 text-[8px] font-mono pointer-events-none text-zinc-400">
                  <div>$400k</div>
                  <div>$200k</div>
                  <div>$0</div>
                </div>
                <div className="w-1/3 bg-zinc-200/80 h-[20%] rounded-t-sm" />
                <div className="w-1/3 bg-zinc-200/80 h-[35%] rounded-t-sm" />
                <div className="w-1/3 bg-blue-500 h-[85%] rounded-t-sm relative"><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-blue-600 font-bold font-mono">Due</span></div>
              </div>
            </motion.div>

            {/* Card 3: Dunning Actions */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute bottom-6 left-4 w-[220px] bg-kaiterra-dark border border-white/5 rounded-xl p-5 shadow-2xl z-20 text-white"
            >
              <div className="text-3xl font-extrabold text-white">18</div>
              <span className="text-[10px] text-zinc-300 font-bold block mt-1">Dunning actions to do</span>
              <button className="text-[9px] font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-3 py-1.5 mt-4 transition-all w-full flex items-center justify-between">
                Recover unpaid invoices <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>

            {/* Card 4: Chat Quick Help */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute bottom-0 right-4 w-[230px] bg-white border border-kaiterra-dark/15 rounded-xl p-4 shadow-2xl flex flex-col gap-2.5 text-kaiterra-dark"
            >
              <div className="flex justify-between items-center border-b border-kaiterra-dark/10 pb-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Quick Help</span>
                <div className="flex gap-1.5">
                  <span className="w-4 h-4 rounded bg-[#3b82f6]/10 flex items-center justify-center text-[8px] font-bold text-[#3b82f6]">in</span>
                  <span className="w-4 h-4 rounded bg-purple-500/10 flex items-center justify-center text-[8px] font-bold text-purple-600">#</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-kaiterra-dark flex items-center justify-center text-white text-[9px] font-bold shrink-0">R</div>
                <div className="bg-zinc-100 border border-kaiterra-dark/10 rounded-lg p-2.5 text-[10px] text-zinc-700">
                  Hello Harvey, check this overdue status summary...
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* BRAND & METADATA GRID */}
      <section className="bg-white py-12 px-6 md:px-12 border-b border-kaiterra-dark/10 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-left text-kaiterra-dark">
          <div className="border-l border-kaiterra-dark/20 pl-4 py-1">
            <span className="text-[10px] uppercase font-bold text-kaiterra-dark/50 block tracking-wider font-mono">Brand</span>
            <span className="text-xs font-extrabold font-editorial uppercase mt-1 block">InvoNest Core</span>
          </div>
          <div className="border-l border-kaiterra-dark/20 pl-4 py-1">
            <span className="text-[10px] uppercase font-bold text-kaiterra-dark/50 block tracking-wider font-mono">Client</span>
            <span className="text-xs font-extrabold font-editorial uppercase mt-1 block">Fintech Ventures</span>
          </div>
          <div className="border-l border-kaiterra-dark/20 pl-4 py-1">
            <span className="text-[10px] uppercase font-bold text-kaiterra-dark/50 block tracking-wider font-mono">Stack</span>
            <span className="text-xs font-extrabold font-editorial uppercase mt-1 block">Next.js + NestJS</span>
          </div>
          <div className="border-l border-kaiterra-dark/20 pl-4 py-1">
            <span className="text-[10px] uppercase font-bold text-kaiterra-dark/50 block tracking-wider font-mono">Scale</span>
            <span className="text-xs font-extrabold font-editorial uppercase mt-1 block">100K+ Businesses</span>
          </div>
        </div>
      </section>      {/* STORYTELLING INTERACTIVE SLIDESHOW CONTAINER (MATCHING ADCHITECTS CASE STUDY VIDEO SLIDER STYLE) */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[#0d2227]/10 w-full text-center relative z-20">
        
        {/* Slideshow Title Header */}
        <div className="mb-10 text-center">
          <span className="inline-block text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#0d2227]/60 font-mono mb-2">
            Interactive Product Tour
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-[#0d2227] uppercase font-editorial tracking-tight leading-tight">
            See the Platform in Action
          </h2>
          <p className="text-zinc-600 text-sm md:text-base mt-4 max-w-xl mx-auto">
            Cycle through key functional panels automatically or pick a workspace feature from the timeline selector below.
          </p>
        </div>

        {/* Feature Navigation Dots / Tabs Timeline */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
          {[
            "Overview",
            "AR Ledger",
            "AI Copilot Chat",
            "Invoice OCR",
            "Risk Engine",
            "Cash Forecast",
            "Automation"
          ].map((title, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setIsPlaying(false); // pause on interaction
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${activeTab === idx ? 'bg-[#0d2227] text-white shadow-sm' : 'bg-[#abc6d8]/15 hover:bg-[#abc6d8]/30 text-[#0d2227]'}`}
            >
              {title}
            </button>
          ))}
          
          {/* Play / Pause Toggle Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-full text-xs font-mono font-bold bg-[#abc6d8]/25 text-[#0d2227] hover:bg-[#abc6d8]/40 transition-colors flex items-center gap-1.5"
            title={isPlaying ? "Pause Tour" : "Play Tour"}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-red-600 inline-block ${isPlaying ? 'animate-ping' : ''}`} />
            {isPlaying ? "PAUSE" : "AUTOPLAY"}
          </button>
        </div>

        {/* Outer Dashboard frame container */}
        <div className="w-full max-w-5xl mx-auto min-h-[65vh] bg-white border border-[#0d2227]/15 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col text-left">
          {/* Window chrome header */}
          <div className="bg-[#f0f4f7] px-4 py-3 border-b border-[#0d2227]/15 flex justify-between items-center text-xs text-zinc-600">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <div className="bg-white border border-[#0d2227]/10 rounded px-8 py-0.5 text-zinc-500 font-mono scale-95">
              app.invonest.co/dashboard
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded bg-[#abc6d8]/30 border border-[#abc6d8]/50 text-[10px] text-[#0d2227] font-semibold font-mono">LIVE SLIDESHOW</span>
            </div>
          </div>

          {/* Sidebar + Main Screen Container */}
          <div className="flex-1 flex overflow-hidden bg-[#f8fafc]">
            {/* Sidebar */}
            <div className="w-16 md:w-48 border-r border-[#0d2227]/10 bg-[#abc6d8]/15 p-3 flex flex-col gap-1 hidden sm:flex">
              <div className="mb-4 px-2 py-1 font-extrabold text-sm text-[#0d2227] tracking-wider uppercase font-editorial">Global Ledger</div>
              <div 
                onClick={() => { setActiveTab(0); setIsPlaying(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 0 ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm' : 'text-[#0d2227]/70 hover:text-[#0d2227]'}`}
              >
                <Activity className="w-4 h-4" /> Overview
              </div>
              <div 
                onClick={() => { setActiveTab(1); setIsPlaying(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 1 ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm' : 'text-[#0d2227]/70 hover:text-[#0d2227]'}`}
              >
                <Briefcase className="w-4 h-4" /> Client Health
              </div>
              <div 
                onClick={() => { setActiveTab(2); setIsPlaying(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 2 ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm' : 'text-[#0d2227]/70 hover:text-[#0d2227]'}`}
              >
                <MessageSquare className="w-4 h-4" /> AI CFO Chat
              </div>
              <div 
                onClick={() => { setActiveTab(3); setIsPlaying(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 3 ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm' : 'text-[#0d2227]/70 hover:text-[#0d2227]'}`}
              >
                <UploadCloud className="w-4 h-4" /> Invoice OCR
              </div>
              <div 
                onClick={() => { setActiveTab(4); setIsPlaying(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 4 ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm' : 'text-[#0d2227]/70 hover:text-[#0d2227]'}`}
              >
                <ShieldAlert className="w-4 h-4" /> Risk Engine
              </div>
              <div 
                onClick={() => { setActiveTab(5); setIsPlaying(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 5 ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm' : 'text-[#0d2227]/70 hover:text-[#0d2227]'}`}
              >
                <TrendingUp className="w-4 h-4" /> Cash Forecast
              </div>
              <div 
                onClick={() => { setActiveTab(6); setIsPlaying(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${activeTab === 6 ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm' : 'text-[#0d2227]/70 hover:text-[#0d2227]'}`}
              >
                <Zap className="w-4 h-4" /> Automation
              </div>
            </div>

            {/* Main Workspace Frame */}
            <div className="flex-1 p-6 overflow-y-auto relative bg-[#f8fafc] min-w-0 min-h-[50vh]">
              <AnimatePresence mode="wait">
                
                {/* TAB 0: HERO OVERVIEW SCREEN */}
                {activeTab === 0 && (
                  <motion.div 
                    key="tab0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-none"
                  >
                    {/* Metric cards floating */}
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="bg-white border border-[#0d2227]/15 rounded-xl p-4 shadow-sm text-[#0d2227]">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1 font-mono">Outstanding Revenue</span>
                      <div className="text-2xl font-extrabold text-[#0d2227]">₹5.2L</div>
                      <span className="text-[10px] text-zinc-400 mt-2 block">Pending settlement</span>
                    </motion.div>

                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="bg-white border border-[#0d2227]/15 rounded-xl p-4 shadow-sm text-[#0d2227]">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1 font-mono">Recovery Rate</span>
                      <div className="text-2xl font-extrabold text-green-700">87%</div>
                      <span className="text-[10px] text-zinc-400 mt-2 block">+4% this month</span>
                    </motion.div>

                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }} className="bg-white border border-[#0d2227]/15 rounded-xl p-4 shadow-sm text-[#0d2227] border-red-200">
                      <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block mb-1 font-mono">At Risk Revenue</span>
                      <div className="text-2xl font-extrabold text-red-600">₹1.1L</div>
                      <span className="text-[10px] text-zinc-400 mt-2 block">Critical overdue status</span>
                    </motion.div>

                    <motion.div animate={{ y: [0, -4.5, 0] }} transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }} className="bg-white border border-[#0d2227]/15 rounded-xl p-4 shadow-sm text-[#0d2227]">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1 font-mono">Expected Collections</span>
                      <div className="text-2xl font-extrabold text-[#0d2227]">₹12.4L</div>
                      <span className="text-[10px] text-zinc-400 mt-2 block">Next 30 days</span>
                    </motion.div>

                    {/* Forecast Trend Graph Mockup */}
                    <div className="col-span-1 md:col-span-4 bg-white border border-[#0d2227]/15 rounded-xl p-5 mt-4 text-[#0d2227] shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-[#0d2227]">Baseline Cash Flow Trend</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-600 font-mono">Confidence Level: 88%</span>
                      </div>
                      <div className="w-full h-32 flex items-end gap-1 px-2 border-b border-zinc-100 relative">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 text-[9px] font-mono text-zinc-500 pt-2 pb-1">
                          <div>₹15L</div>
                          <div>₹10L</div>
                          <div>₹5L</div>
                        </div>
                        
                        {/* Graph wave bars */}
                        <div className="h-[40%] bg-zinc-200 hover:bg-zinc-300 transition-all rounded-t-sm flex-1" />
                        <div className="h-[48%] bg-zinc-200 hover:bg-zinc-300 transition-all rounded-t-sm flex-1" />
                        <div className="h-[52%] bg-zinc-200 hover:bg-zinc-300 transition-all rounded-t-sm flex-1" />
                        <div className="h-[65%] bg-[#abc6d8]/40 border-t border-[#0d2227] rounded-t-sm flex-1 relative group">
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#0d2227] text-white rounded px-1.5 py-0.5 text-[9px] shadow">₹12.4L</div>
                        </div>
                        <div className="h-[70%] bg-[#abc6d8]/40 border-t border-[#0d2227] rounded-t-sm flex-1" />
                        <div className="h-[74%] bg-[#abc6d8]/40 border-t border-[#0d2227] rounded-t-sm flex-1" />
                        <div className="h-[80%] bg-[#abc6d8]/40 border-t border-[#0d2227] rounded-t-sm flex-1" />
                        <div className="h-[86%] bg-[#abc6d8]/50 border-t-2 border-[#0d2227]/80 rounded-t-sm flex-1" />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-zinc-500 mt-2 px-1">
                        <span>Today</span>
                        <span>+10 Days</span>
                        <span>+20 Days</span>
                        <span>+30 Days</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 1: AI COLLECTIONS (ACCOUNTS RECEIVABLE WORKSPACE) */}
                {activeTab === 1 && (
                  <motion.div 
                    key="tab1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-xs"
                  >
                    <div className="flex justify-between items-center text-[#0d2227] mb-2">
                      <h3 className="font-bold text-sm">Accounts Receivable Exposure</h3>
                      <span className="text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded">3 Delinquent Profiles</span>
                    </div>

                    <div className="border border-[#0d2227]/15 rounded-lg overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-[#0d2227]/15 text-[#0d2227]/85 font-bold uppercase tracking-wider text-[9px] font-mono">
                              <th className="p-3">Client</th>
                              <th className="p-3">Unpaid Bal</th>
                              <th className="p-3 text-center">Late Period</th>
                              <th className="p-3">Risk Assessment</th>
                              <th className="p-3">Auto Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[#0d2227]/10 text-zinc-800 hover:bg-[#abc6d8]/10 transition-colors">
                              <td className="p-3 font-semibold text-[#0d2227]">ABC Corp</td>
                              <td className="p-3 font-semibold">₹45,000</td>
                              <td className="p-3 text-red-600 font-mono text-center">15 Days</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 bg-red-50 border border-red-200 rounded text-[10px] text-red-700 font-bold">83% Critical</span>
                              </td>
                              <td className="p-3 text-[#0d2227] font-bold font-mono">Send WhatsApp Reminder</td>
                            </tr>
                            <tr className="border-b border-[#0d2227]/10 text-zinc-800 hover:bg-[#abc6d8]/10 transition-colors">
                              <td className="p-3 font-semibold text-[#0d2227]">XYZ Ltd</td>
                              <td className="p-3 font-semibold">₹80,000</td>
                              <td className="p-3 text-amber-600 font-mono text-center">26 Days</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-700 font-bold">66% Monitor</span>
                              </td>
                              <td className="p-3 text-[#0d2227] font-bold font-mono">Email Payment Link</td>
                            </tr>
                            <tr className="text-zinc-800 hover:bg-[#abc6d8]/10 transition-colors">
                              <td className="p-3 font-semibold text-[#0d2227]">Acquirer Corp</td>
                              <td className="p-3 font-semibold">₹400,000</td>
                              <td className="p-3 text-red-600 font-mono text-center">12 Days</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 bg-red-50 border border-red-200 rounded text-[10px] text-red-700 font-bold">84% Critical</span>
                              </td>
                              <td className="p-3 text-[#0d2227] font-bold font-mono">Initiate Phone Escalation</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* AI Recommendation Alert */}
                      <div className="mt-4 p-3.5 bg-[#abc6d8]/20 border border-[#abc6d8]/40 rounded-xl flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#abc6d8]/30 flex items-center justify-center text-[#0d2227]">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="text-xs text-[#0d2227]">
                          <span className="font-bold text-[#0d2227]">Smart Collection Recommendation:</span> Send automated WhatsApp payment link to ABC Corp today. Average delay indicates a 84% prompt recovery rate via text.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: AI COPILOT CHAT */}
                  {activeTab === 2 && (
                    <motion.div 
                      key="tab2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col h-full max-h-[48vh] justify-between animate-none"
                    >
                      {/* Chat log mock */}
                      <div className="space-y-4 overflow-y-auto pr-1">
                        <div className="flex gap-2.5 max-w-[85%]">
                          <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] text-zinc-700">AP</div>
                          <div className="bg-zinc-100 border border-zinc-200 p-3 rounded-2xl rounded-tl-none text-xs leading-relaxed text-zinc-800 shadow-sm">
                            Which customers are most likely to pay late?
                          </div>
                        </div>

                        <div className="flex gap-2.5 max-w-[85%] ml-auto flex-row-reverse">
                          <div className="w-7 h-7 rounded-full bg-[#0d2227] text-white font-bold flex items-center justify-center text-[10px]">CFO</div>
                          <div className="bg-[#abc6d8]/30 border border-[#abc6d8]/50 p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed text-[#0d2227] shadow-sm">
                            Based on historical payments ledger, these accounts present high risk:
                            <div className="mt-2 space-y-1 font-mono text-[10px] text-[#0d2227]">
                              <div>1. **Acquirer Corp** (₹4.0L overdue, 84% late risk)</div>
                              <div>2. **ABC Corp** (₹45K overdue, 83% late risk)</div>
                            </div>
                            <div className="mt-2 text-zinc-600 text-[10px]">
                              **Potential Revenue At Risk:** ₹4.45L.<br />
                              **Suggested Actions:** Send reminder link, schedule WhatsApp follow-up.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chat Input */}
                      <div className="border border-zinc-200 bg-zinc-50 rounded-xl p-2 mt-4 flex items-center gap-2">
                        <input 
                          type="text" 
                          placeholder="Ask AI CFO: 'Will I have enough cash for payroll?'..." 
                          className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs px-2 py-1.5 flex-1 text-zinc-700"
                          disabled
                        />
                        <button className="w-8 h-8 rounded-lg bg-[#0d2227] text-white flex items-center justify-center hover:bg-[#1a3339]">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: OCR INVOICE EXTRACTION */}
                  {activeTab === 3 && (
                    <motion.div 
                      key="tab3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center justify-center h-full min-h-[38vh] animate-none"
                    >
                      {ocrStep === 0 && (
                        <div className="border border-dashed border-zinc-200 rounded-2xl p-8 text-center max-w-sm flex flex-col items-center">
                          <UploadCloud className="w-10 h-10 text-zinc-400 mb-3" />
                          <p className="text-xs font-bold text-[#0d2227] mb-1">Drag and drop invoice PDF</p>
                          <p className="text-[10px] text-zinc-500">Files up to 10MB (PDF, PNG, JPG)</p>
                        </div>
                      )}

                      {ocrStep === 1 && (
                        <div className="w-full max-w-md bg-white border border-[#0d2227]/15 rounded-xl p-4 shadow-sm text-[#0d2227]">
                          <div className="flex justify-between items-center text-xs mb-3">
                            <span className="font-mono text-zinc-500">Processing: standard_invoice.pdf</span>
                            <span className="text-[#0d2227] font-bold">Scanning OCR layers...</span>
                          </div>
                          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 1.5 }} className="bg-[#0d2227] h-full" />
                          </div>
                        </div>
                      )}

                      {ocrStep >= 2 && (
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-white border border-[#0d2227]/15 rounded-xl p-4 shadow-sm text-[#0d2227]">
                          <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-100 mb-3">
                            <div className="flex items-center gap-1.5 text-green-700 font-bold">
                              <CheckCircle className="w-3.5 h-3.5" /> OCR Complete
                            </div>
                            <span className="text-[10px] text-[#0d2227] bg-[#abc6d8]/20 px-2 py-0.5 rounded font-bold font-mono">97% AI Confidence Score</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3.5 text-[11px] font-mono">
                            <div>
                              <span className="text-zinc-500 block text-[9px] uppercase font-bold">Client Name</span>
                              <span className="text-[#0d2227] font-semibold">ABC Corp</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block text-[9px] uppercase font-bold">Invoice Number</span>
                              <span className="text-[#0d2227] font-semibold">INV-2041</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block text-[9px] uppercase font-bold">Amount Extracted</span>
                              <span className="text-[#0d2227] font-semibold">₹45,000.00</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block text-[9px] uppercase font-bold">Due Date</span>
                              <span className="text-[#0d2227] font-semibold">30 Days (Net 30)</span>
                            </div>
                          </div>

                          <div className="mt-3.5 pt-2 border-t border-zinc-100 flex justify-end">
                            <span className="text-[9px] text-zinc-400 italic">Auto-validated & created ledger invoice</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 4: PAYMENT RISK ENGINE */}
                  {activeTab === 4 && (
                    <motion.div 
                      key="tab4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-none"
                    >
                      <div className="bg-white border border-[#0d2227]/15 rounded-xl p-4 flex flex-col justify-between shadow-sm text-[#0d2227]">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">Low Risk</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                          </div>
                          <div className="text-[#0d2227] font-extrabold text-sm mb-1">XYZ Technologies</div>
                          <p className="text-[10px] text-zinc-500 leading-relaxed">Historically settles invoices within 3 days. Strong liquidity credentials.</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-zinc-100 text-[9px] font-mono text-zinc-400">Risk Score: 18</div>
                      </div>

                      <div className="bg-white border border-[#0d2227]/15 rounded-xl p-4 flex flex-col justify-between shadow-sm text-[#0d2227]">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">Medium Risk</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          </div>
                          <div className="text-[#0d2227] font-extrabold text-sm mb-1">Stripe billing Inc</div>
                          <p className="text-[10px] text-zinc-500 leading-relaxed">Minor late payment history on Q1 services (+6 days). Credit limit at ₹5L.</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-zinc-100 text-[9px] font-mono text-zinc-400">Risk Score: 42</div>
                      </div>

                      <div className="bg-white border border-red-200 rounded-xl p-4 flex flex-col justify-between shadow-sm text-[#0d2227]">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-red-600 font-bold uppercase">High Risk</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          </div>
                          <div className="text-[#0d2227] font-extrabold text-sm mb-1">ABC Corp</div>
                          <p className="text-[10px] text-zinc-500 leading-relaxed">Historically pays 23 days late. Has 2 overdue invoices. Balance exceeds creditworthiness limit.</p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-zinc-100 text-[9px] font-mono text-red-600 font-bold">Risk Score: 84</div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 5: CASH FLOW FORECASTING */}
                  {activeTab === 5 && (
                    <motion.div 
                      key="tab5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col h-full animate-none"
                    >
                      <div className="flex justify-between items-center mb-3 text-[#0d2227]">
                        <div>
                          <h4 className="text-sm font-bold">30-60-90 Day Liquidity Projections</h4>
                          <span className="text-[9px] text-zinc-500">Model includes seasonal billing cycles</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200 text-[9px] font-semibold text-green-700 font-mono">Best Case</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200 text-[9px] font-semibold text-[#0d2227] font-mono">Expected</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200 text-[9px] font-semibold text-red-600 font-mono">Worst Case</span>
                        </div>
                      </div>

                      {/* Forecasting Chart Area */}
                      <div className="bg-white border border-[#0d2227]/15 rounded-xl p-4 flex-1 flex flex-col justify-end relative h-36 shadow-sm">
                        {/* Background mesh grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 p-4">
                          <hr className="border-zinc-200" />
                          <hr className="border-zinc-200" />
                          <hr className="border-zinc-200" />
                        </div>
                        
                        {/* Interactive confidence band paths inside SVG */}
                        <svg className="w-full h-24 overflow-visible" viewBox="0 0 400 100">
                          {/* Confidence Band shading */}
                          <polygon 
                            points="0,60 100,50 200,38 300,30 400,20 400,90 300,85 200,80 100,75 0,70" 
                            fill="rgba(171, 198, 216, 0.25)"
                          />
                          
                          {/* Upper curve (Best) */}
                          <path d="M 0,60 Q 100,45 200,30 T 400,10" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 3" />
                          
                          {/* Middle curve (Expected) */}
                          <path d="M 0,65 Q 100,55 200,45 T 400,30" fill="none" stroke="#0d2227" strokeWidth="2" />
                          
                          {/* Lower curve (Worst) */}
                          <path d="M 0,70 Q 100,68 200,65 T 400,60" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 3" />
                        </svg>

                        <div className="flex justify-between text-[9px] font-mono text-zinc-500 mt-2 px-1">
                          <span>Today</span>
                          <span>30 Days</span>
                          <span>60 Days</span>
                          <span>90 Days</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 6: AUTOMATION WORKFLOW BUILDER */}
                  {activeTab === 6 && (
                    <motion.div 
                      key="tab6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center justify-center h-full min-h-[38vh] animate-none"
                    >
                      {/* Workflow Nodes */}
                      <div className="flex flex-col items-center gap-3.5 w-full max-w-sm">
                        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-xs font-semibold text-green-700 flex items-center gap-2 shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Invoice Created
                        </div>
                        <div className="w-0.5 h-4 bg-zinc-300" />
                        
                        <div className="bg-white border border-zinc-200 rounded-xl px-4 py-2 text-xs font-semibold text-zinc-700 flex items-center gap-2 shadow-sm">
                          <Mail className="w-3.5 h-3.5 text-zinc-500" /> Send Soft Email Reminder
                        </div>
                        <div className="w-0.5 h-4 bg-zinc-300" />

                        <div className="bg-[#abc6d8]/30 border border-[#abc6d8]/50 rounded-xl px-4 py-2 text-xs font-semibold text-[#0d2227] flex items-center gap-2 relative shadow-sm">
                          <MessageSquare className="w-3.5 h-3.5 animate-pulse" /> Trigger WhatsApp Link (Overdue +3d)
                          <div className="absolute -left-1/2 top-1/2 w-4 h-0.5 bg-[#abc6d8]/30 hidden md:block" />
                        </div>
                        <div className="w-0.5 h-4 bg-zinc-300" />

                        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-xs font-semibold text-green-700 flex items-center gap-2 shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5" /> Payment Received (Auto reconcile)
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div> {/* main workspace frame */}
            </div> {/* sidebar + main screen container */}
          </div> {/* outer dashboard frame container */}

          {/* Dots Indicator for slideshow progress */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveTab(i);
                  setIsPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeTab ? 'bg-[#0d2227] w-5' : 'bg-zinc-200 hover:bg-[#0d2227]/30'}`}
              />
            ))}
          </div>
        </section>

      {/* SECTION: CASH FLOW OVERVIEW */}
      <section id="cashflow-overview" className="py-20 px-6 md:px-12 max-w-5xl mx-auto border-t border-zinc-200 relative">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#0d2227]/60 font-mono">Liquidity Pulse</span>
          <h2 className="text-3xl md:text-5xl font-normal mt-2 text-[#0d2227] uppercase font-editorial">Cash Flow Overview</h2>
          <p className="text-zinc-600 text-sm md:text-base mt-4 max-w-xl mx-auto">
            Keep track of incoming collections, forecast runways, and accounts receivable efficiency metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-[#0d2227]">
          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 hover:border-[#abc6d8] transition-all duration-300 shadow-sm">
            <span className="text-zinc-500 font-semibold text-xs block mb-1">Forecast Runway</span>
            <div className="text-3xl font-extrabold text-[#0d2227] mt-1 font-editorial">9.4 Months</div>
            <span className="text-[10px] text-zinc-500 font-mono mt-3 block">Based on ₹12.4L baseline position</span>
          </div>

          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 hover:border-[#abc6d8] transition-all duration-300 shadow-sm">
            <span className="text-zinc-500 font-semibold text-xs block mb-1">Bad Debt Write-off Risk</span>
            <div className="text-3xl font-extrabold text-red-600 mt-1 font-editorial">1.8%</div>
            <span className="text-[10px] text-zinc-500 font-mono mt-3 block">Well below industry threshold of 5%</span>
          </div>

          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 hover:border-[#abc6d8] transition-all duration-300 shadow-sm">
            <span className="text-zinc-500 font-semibold text-xs block mb-1">Average Collection Speed</span>
            <div className="text-3xl font-extrabold text-green-700 mt-1 font-editorial">14.2 Days</div>
            <span className="text-[10px] text-zinc-500 font-mono mt-3 block">Improved from 22 days last quarter</span>
          </div>
        </div>
      </section>

      {/* SECTION: AUTOMATED FOLLOW-UP (MATCHING SCREENSHOT) */}
      <section id="automated-follow-up" className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-zinc-200 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN: INTERACTIVE VISUAL TIMELINE & MODAL OVERLAP */}
          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-8 relative min-h-[340px] flex flex-col justify-between shadow-sm text-[#0d2227]">
            
            {/* Timeline header */}
            <div className="flex justify-between items-center text-xs text-zinc-500 border-b border-zinc-100 pb-3">
              <span className="font-mono">Timeline · Invoice #1042</span>
              <span className="font-bold text-[#0d2227] text-sm">₹1,20,000</span>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-6 my-6 text-xs pl-2">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#abc6d8]/30 border border-[#abc6d8]/50 flex items-center justify-center text-[#0d2227] shrink-0 mt-0.5 font-bold">✓</span>
                <div>
                  <h4 className="font-bold text-[#0d2227] text-[11px]">Reminder scheduled</h4>
                  <p className="text-zinc-500 text-[10px] mt-0.5">Auto-queued 7 days before due date</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#abc6d8]/30 border border-[#abc6d8]/50 flex items-center justify-center text-[#0d2227] shrink-0 mt-0.5 font-bold">✓</span>
                <div>
                  <h4 className="font-bold text-[#0d2227] text-[11px]">Email sent to Manvi</h4>
                </div>
              </div>
            </div>

            {/* SUPERIMPOSED FLOATING MODAL (WhatsApp Preview) */}
            <motion.div 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-6 left-6 right-6 bg-[#FAF7F0] rounded-xl p-5 shadow-2xl text-black border border-[#e5e0d8] flex flex-col gap-3.5 z-10"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#c29b68] text-white flex items-center justify-center font-bold text-xs">
                    MT
                  </div>
                  <div>
                    <h4 className="font-bold text-[11px] text-zinc-900 leading-tight">Meridian Textiles</h4>
                    <span className="text-[9px] text-zinc-500 leading-none">WhatsApp reminder</span>
                  </div>
                </div>
                <span className="font-extrabold text-xs text-zinc-900">₹1,20,000</span>
              </div>

              <div className="text-[10px] text-zinc-700 leading-relaxed font-sans bg-[#F0ECE3] rounded-lg p-2.5 border border-[#e0dacd]">
                Hi Manvi, your invoice #1042 for ₹1,20,000 is <span className="text-[#a16207] font-bold">7 days overdue</span>.<br /><br />
                Here's your payment link — takes less than a minute:<br />
                <span className="text-blue-600 font-bold underline">pay.invonest.com/1042</span>
              </div>

              <div className="flex justify-end shrink-0">
                <button className="bg-[#c29b68] hover:bg-[#b08958] text-white font-bold text-[10px] px-4 py-1.5 rounded-lg shadow-sm transition-colors">
                  Send
                </button>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: TEXT INSIGHTS */}
          <div className="space-y-6 text-left">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#0d2227]/60 uppercase font-mono">— AUTOMATED FOLLOW-UP</span>
            <h2 className="text-3xl md:text-4xl font-normal text-[#0d2227] leading-tight uppercase font-editorial">
              Collections that<br />run themselves.
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#abc6d8]/20 border border-[#abc6d8]/40 flex items-center justify-center text-[#0d2227] shrink-0 text-[10px] font-bold">✓</span>
                <p className="text-zinc-600 text-xs leading-relaxed">Every overdue invoice gets a reminder — automatically, on schedule</p>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#abc6d8]/20 border border-[#abc6d8]/40 flex items-center justify-center text-[#0d2227] shrink-0 text-[10px] font-bold">✓</span>
                <p className="text-zinc-600 text-xs leading-relaxed">Escalates from email to WhatsApp when a client goes quiet</p>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#abc6d8]/20 border border-[#abc6d8]/40 flex items-center justify-center text-[#0d2227] shrink-0 text-[10px] font-bold">✓</span>
                <p className="text-zinc-600 text-xs leading-relaxed">Payment link embedded in every message, no back-and-forth</p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/dashboard/documentation#automation-workflow" className="text-xs font-bold text-[#0d2227] hover:underline flex items-center gap-1 group transition-colors">
                See how automation works <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9: INTERACTIVE INTEGRATIONS (10-NODE SVG HUBSPOT REAL-TIME SYNC) */}
      <section id="integrations" className="py-24 px-6 md:px-12 bg-white border-t border-zinc-200 relative overflow-hidden w-full text-center">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#0d2227]/60 font-mono">Universal Ledgers</span>
          <h2 className="text-3xl md:text-5xl font-normal mt-2 text-[#0d2227] uppercase font-editorial">Your Accounting Stack. Seamlessly Synced.</h2>
          <p className="text-zinc-600 text-sm md:text-base mt-4 max-w-xl mx-auto font-medium">No tedious configuration. Connect InvoNest to your standard financial databases in one click.</p>
        </div>

        {/* 10-Node Hub-and-Spoke Grid Container */}
        <div className="relative w-full max-w-5xl mx-auto h-[600px] border border-[#0d2227]/10 rounded-3xl bg-[#abc6d8]/5 overflow-hidden shadow-sm">
          
          {/* Animated SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <defs>
              <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[
              { x: 600, y: 30, index: 0 },   // Gmail
              { x: 936, y: 90, index: 1 },   // Stripe
              { x: 1020, y: 210, index: 2 }, // Razorpay
              { x: 1056, y: 330, index: 3 }, // HubSpot
              { x: 984, y: 450, index: 4 },  // Salesforce
              { x: 840, y: 528, index: 5 },  // Zoho Books
              { x: 264, y: 90, index: 6 },   // QuickBooks
              { x: 180, y: 210, index: 7 },  // Slack
              { x: 144, y: 330, index: 8 },  // Outlook
              { x: 216, y: 450, index: 9 },  // Xero
            ].map((node) => {
              const isHovered = hoveredIndex === node.index;
              // Bezier S-curve starting from center (600, 300) pulling out horizontally first
              const path = `M 600 300 C ${600 + (node.x - 600) * 0.4} 300, ${node.x - (node.x - 600) * 0.15} ${node.y}, ${node.x} ${node.y}`;
              return (
                <g key={node.index}>
                  {/* Base connection path */}
                  <path
                    d={path}
                    stroke="#0d2227"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    strokeOpacity={isHovered ? 0.35 : 0.08}
                    fill="none"
                    className="transition-all duration-300"
                  />
                  
                  {/* Glowing data particle going outward */}
                  <circle r={isHovered ? 5 : 3.5} fill={isHovered ? "#3b82f6" : "#abc6d8"} filter="url(#glow-effect)" opacity={isHovered ? 1 : 0.75}>
                    <animateMotion
                      dur={`${isHovered ? 1.2 : 3.5 + (node.index % 3) * 0.5}s`}
                      repeatCount="indefinite"
                      path={path}
                      keyPoints="0;1"
                      keyTimes="0;1"
                      calcMode="linear"
                    />
                  </circle>

                  {/* Offset glowing data particle going outward */}
                  <circle r={isHovered ? 3.5 : 2.5} fill={isHovered ? "#60a5fa" : "#0d2227"} filter="url(#glow-effect)" opacity={isHovered ? 0.9 : 0.6}>
                    <animateMotion
                      dur={`${isHovered ? 1.2 : 3.5 + (node.index % 3) * 0.5}s`}
                      begin={`${(isHovered ? 1.2 : 3.5 + (node.index % 3) * 0.5) / 2}s`}
                      repeatCount="indefinite"
                      path={path}
                      keyPoints="0;1"
                      keyTimes="0;1"
                      calcMode="linear"
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Central AI Financial Hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#0d2227]/15 rounded-full w-40 h-40 flex flex-col items-center justify-center text-center shadow-xl z-30 transition-all duration-300 hover:border-[#abc6d8]">
            <div className="absolute inset-[-8px] rounded-full bg-[#abc6d8]/10 animate-pulse pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0d2227] to-[#abc6d8] flex items-center justify-center font-bold text-white shadow-md mb-2">
              N
            </div>
            <span className="font-extrabold text-sm text-[#0d2227] leading-none font-editorial">InvoNest</span>
            <span className="text-[9px] text-[#0d2227]/60 font-mono font-bold mt-1.5 uppercase tracking-wider">AI Financial Hub</span>
          </div>

          {/* Surround Integration Nodes */}
          {[
            { name: "Gmail", desc: "Emails & Alerts", icon: "G", color: "bg-red-100 text-red-700", lx: "50%", ty: "5%", index: 0 },
            { name: "Stripe", desc: "Payments", icon: "S", color: "bg-blue-100 text-blue-700", lx: "78%", ty: "15%", index: 1 },
            { name: "Razorpay", desc: "Payments", icon: "R", color: "bg-blue-50 text-blue-800", lx: "85%", ty: "35%", index: 2 },
            { name: "HubSpot", desc: "CRM Sync", icon: "H", color: "bg-orange-100 text-orange-700", lx: "88%", ty: "55%", index: 3 },
            { name: "Salesforce", desc: "CRM Sync", icon: "SF", color: "bg-blue-100 text-blue-600", lx: "82%", ty: "75%", index: 4 },
            { name: "Zoho Books", desc: "Accounting Sync", icon: "Z", color: "bg-red-100 text-red-700", lx: "70%", ty: "88%", index: 5 },
            { name: "QuickBooks", desc: "Accounting Sync", icon: "Q", color: "bg-green-100 text-green-700", lx: "22%", ty: "15%", index: 6 },
            { name: "Slack", desc: "Notifications", icon: "SL", color: "bg-purple-100 text-purple-700", lx: "15%", ty: "35%", index: 7 },
            { name: "Outlook", desc: "Emails & Calendar", icon: "O", color: "bg-blue-100 text-blue-800", lx: "12%", ty: "55%", index: 8 },
            { name: "Xero", desc: "Accounting Sync", icon: "X", color: "bg-cyan-100 text-cyan-700", lx: "18%", ty: "75%", index: 9 },
          ].map((item) => (
            <div
              key={item.index}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ left: item.lx, top: item.ty }}
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-white border border-[#0d2227]/15 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-sm transition-all duration-300 hover:border-[#abc6d8] hover:shadow-md z-20 cursor-pointer group"
            >
              <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black uppercase shrink-0 ${item.color}`}>
                {item.icon}
              </span>
              <div className="text-left">
                <span className="text-xs text-[#0d2227] font-bold block leading-tight">{item.name}</span>
                <span className="text-[9px] text-zinc-500 block leading-tight font-medium mt-0.5 whitespace-nowrap">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time workflow stream */}
        <div className="mt-16 bg-white border border-[#0d2227]/10 rounded-2xl p-5 max-w-4xl mx-auto shadow-sm text-[#0d2227]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative text-left">
            <div className="flex items-center gap-3 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100 flex-1 w-full md:w-auto">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-mono">$</span>
              <div>
                <span className="text-xs font-bold block text-[#0d2227]">Payment Received</span>
                <span className="text-[9px] text-zinc-500 block font-medium">via Stripe Integration</span>
              </div>
            </div>
            
            <div className="hidden md:block text-zinc-400 font-bold">→</div>

            <div className="flex items-center gap-3 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100 flex-1 w-full md:w-auto">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold font-mono">✓</span>
              <div>
                <span className="text-xs font-bold block text-[#0d2227]">Invoice Updated</span>
                <span className="text-[9px] text-zinc-500 block font-medium">in InvoNest Ledger</span>
              </div>
            </div>

            <div className="hidden md:block text-zinc-400 font-bold">→</div>

            <div className="flex items-center gap-3 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100 flex-1 w-full md:w-auto">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold font-mono">📈</span>
              <div>
                <span className="text-xs font-bold block text-[#0d2227]">Forecast Recalculated</span>
                <span className="text-[9px] text-zinc-500 block font-medium">Cash flow runway updated</span>
              </div>
            </div>

            <div className="hidden md:block text-zinc-400 font-bold">→</div>

            <div className="flex items-center gap-3 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100 flex-1 w-full md:w-auto">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold font-mono">🔔</span>
              <div>
                <span className="text-xs font-bold block text-[#0d2227]">Slack Alert Sent</span>
                <span className="text-[9px] text-zinc-500 block font-medium">Finance team notified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live sync stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-10">
          <div className="bg-white border border-[#0d2227]/10 rounded-2xl p-5 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-[#0d2227] font-editorial">15+</div>
            <div className="text-[10px] uppercase font-bold text-zinc-500 mt-1 font-mono">Integrations</div>
          </div>
          <div className="bg-white border border-[#0d2227]/10 rounded-2xl p-5 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-green-700 font-editorial">99.9%</div>
            <div className="text-[10px] uppercase font-bold text-zinc-500 mt-1 font-mono">Sync Reliability</div>
          </div>
          <div className="bg-white border border-[#0d2227]/10 rounded-2xl p-5 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-[#0d2227] font-editorial">Real-Time</div>
            <div className="text-[10px] uppercase font-bold text-zinc-500 mt-1 font-mono">Data Updates</div>
          </div>
          <div className="bg-white border border-[#0d2227]/10 rounded-2xl p-5 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-[#0d2227] font-editorial">&lt; 2 Min</div>
            <div className="text-[10px] uppercase font-bold text-zinc-500 mt-1 font-mono">Average Setup Time</div>
          </div>
        </div>
      </section>

      {/* SECTION 10: EXECUTIVE INSIGHTS ANALYTICS */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-zinc-200">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#0d2227]/60 font-mono">Decision Analytics</span>
          <h2 className="text-3xl md:text-5xl font-normal mt-2 text-[#0d2227] uppercase font-editorial">Full-Spectrum Financial Command</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 hover:border-[#abc6d8] transition-all duration-300 shadow-sm text-[#0d2227]">
            <TrendingUp className="w-7 h-7 text-[#0d2227] mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[#0d2227]">Scenario Simulators</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">Model payment delay hypotheses instantly (e.g. client default, payroll hikes) to analyze runway cash position outcomes.</p>
          </div>

          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 hover:border-[#abc6d8] transition-all duration-300 shadow-sm text-[#0d2227]">
            <ShieldAlert className="w-7 h-7 text-[#0d2227] mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[#0d2227]">AI Creditworthiness Index</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">Assess safe credit ceilings for new customers automatically using historical behavior patterns and risk exposures.</p>
          </div>

          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 hover:border-[#abc6d8] transition-all duration-300 shadow-sm text-[#0d2227]">
            <Clock className="w-7 h-7 text-[#0d2227] mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[#0d2227]">AR Timeline Audits</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">Audit the complete accounts receivable cycle (sent, viewed, reminder open, and processed payment dates) in real-time.</p>
          </div>
        </div>
      </section>

      {/* SECTION 11: SOCIAL PROOF COUNTERS */}
      <section className="py-20 bg-[#abc6d8]/10 border-y border-[#0d2227]/10 text-center text-[#0d2227] w-full">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          <div>
            <div className="text-3xl md:text-5xl font-black text-[#0d2227] font-editorial">
              <AnimatedCounter value="₹12Cr+" />
            </div>
            <div className="text-xs uppercase font-semibold text-[#0d2227]/70 tracking-wider mt-2">Recovered Cash Flow</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-black text-[#0d2227] font-editorial">
              <AnimatedCounter value="120K+" />
            </div>
            <div className="text-xs uppercase font-semibold text-[#0d2227]/70 tracking-wider mt-2">Invoices Processed</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-black text-[#0d2227] font-editorial">
              <AnimatedCounter value="38%" />
            </div>
            <div className="text-xs uppercase font-semibold text-[#0d2227]/70 tracking-wider mt-2">Faster Invoice Recovery</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-black text-[#0d2227] font-editorial">
              <AnimatedCounter value="95%" />
            </div>
            <div className="text-xs uppercase font-semibold text-[#0d2227]/70 tracking-wider mt-2">OCR Document Confidence</div>
          </div>
        </div>
      </section>

      {/* SECTION: CLIENT TESTIMONIAL (ADCHITECTS CASE STUDY STYLE) */}
      <section className="py-24 px-6 md:px-12 bg-white text-kaiterra-dark border-t border-b border-kaiterra-dark/10 w-full">
        <div className="max-w-4xl mx-auto bg-[#abc6d8]/10 border border-[#0d2227]/15 rounded-3xl p-8 md:p-14 relative shadow-sm text-left">
          <span className="text-[10px] uppercase font-bold text-kaiterra-dark/50 tracking-wider block mb-4 font-mono">Client Testimony</span>
          <h3 className="text-xl md:text-3.5xl font-normal font-editorial uppercase leading-tight mb-12 text-[#0d2227]">
            "This was the best team we’ve ever worked with. The AI CFO runway projections completely redefined our fundraising cycle."
          </h3>
          <div>
            <div className="font-extrabold text-xs uppercase text-[#0d2227]">Laura L.</div>
            <p className="text-[10px] text-[#0d2227]/60 font-bold uppercase mt-1">CMO, Fintech Ventures</p>
          </div>
        </div>
      </section>

      {/* SECTION: PRICING CARD MATRIX */}
      <section id="pricing" className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-zinc-200">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#0d2227]/60 font-mono">Flexible Tiers</span>
          <h2 className="text-3xl md:text-5xl font-normal mt-2 text-[#0d2227] uppercase font-editorial">Pragmatic Plans for Growing Ledgers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[#0d2227]">
          {/* Starter Plan */}
          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">Starter</span>
              <div className="text-3xl font-normal text-[#0d2227] mt-4 font-editorial">₹4,999<span className="text-zinc-500 text-xs font-normal"> / month</span></div>
              <p className="text-zinc-600 text-xs mt-4 leading-relaxed">For startups and boutique organizations ready to automate collections.</p>
              
              <ul className="mt-8 space-y-3.5 text-xs text-zinc-600">
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0" /> Up to 50 active client ledgers</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0" /> OCR parsing (97% accuracy)</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0" /> Stripe and QuickBooks integrations</li>
              </ul>
            </div>
            <Link href="/dashboard" className="bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-800 font-bold text-xs py-3 rounded-lg text-center mt-8 block">
              Start Free Trial
            </Link>
          </div>

          {/* Growth Plan */}
          <div className="bg-[#abc6d8]/20 border border-[#abc6d8]/40 rounded-2xl p-8 flex flex-col justify-between shadow-sm relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d2227] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
            <div>
              <span className="text-[#0d2227] font-bold text-xs uppercase tracking-wider block">Growth</span>
              <div className="text-3xl font-normal text-[#0d2227] mt-4 font-editorial">₹12,999<span className="text-zinc-500 text-xs font-normal"> / month</span></div>
              <p className="text-zinc-700 text-xs mt-4 leading-relaxed">For high-throughput SaaS companies looking to optimize cash runways.</p>
              
              <ul className="mt-8 space-y-3.5 text-xs text-[#0d2227]">
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0 font-bold" /> Unlimited active client profiles</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0 font-bold" /> AI CFO copilot chat assistant</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0 font-bold" /> 30-60-90 Day forecasting models</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0 font-bold" /> Visual reminder workflows builder</li>
              </ul>
            </div>
            <Link href="/dashboard" className="bg-[#0d2227] hover:bg-black text-white font-bold text-xs py-3 rounded-lg text-center mt-8 block shadow-md shadow-[#0d2227]/10">
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block">Enterprise</span>
              <div className="text-3xl font-normal text-[#0d2227] mt-4 font-editorial">Custom pricing</div>
              <p className="text-zinc-600 text-xs mt-4 leading-relaxed">For massive finance divisions needing dedicated Digital Twin sims.</p>
              
              <ul className="mt-8 space-y-3.5 text-xs text-zinc-600">
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0" /> Dedicated database cluster isolation</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0" /> Custom Financial Digital Twin API</li>
                <li className="flex gap-2.5"><CheckCircle className="w-4 h-4 text-[#0d2227] shrink-0" /> SLA support agreements</li>
              </ul>
            </div>
            <button 
              onClick={() => {
                setBookDemoEmail('');
                setIsEnterpriseDemo(true);
                setIsBookDemoOpen(true);
              }}
              className="w-full bg-[#0d2227] hover:bg-[#1a3339] text-white hover:scale-[1.01] font-bold text-xs py-3 rounded-lg text-center mt-8 block shadow-md transition-all active:scale-[0.99]"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 13: FINAL CTA */}
      <section className="py-28 px-6 text-center bg-[#abc6d8] final-cta relative overflow-hidden border-t border-[#0d2227]/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-normal text-[#0d2227] leading-tight mb-6 uppercase font-editorial">
            Every Unpaid Invoice Is A Cash Flow Problem Waiting To Happen.
          </h2>
          <p className="text-[#0d2227]/80 text-base max-w-xl mb-10 leading-relaxed font-semibold">
            Let AI predict payment risk, automate collections outreach, and help your finance team secure receivables faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="bg-[#0d2227] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-[#0d2227]/15">
              Start Free Trial
            </Link>
            <button 
              onClick={() => {
                setBookDemoEmail('');
                setIsEnterpriseDemo(false);
                setIsBookDemoOpen(true);
              }}
              className="bg-white/80 border border-[#0d2227]/20 hover:bg-white text-[#0d2227] px-8 py-3.5 rounded-xl font-bold transition-all"
            >
              Book Demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#0d2227]/10 py-12 px-6 md:px-12 text-center text-xs text-zinc-600 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-[#0d2227]">InvoNest Technologies</span>
          </div>
          <div>© {new Date().getFullYear()} InvoNest Inc. All rights reserved.</div>
        </div>
      </footer>

      <BookDemoModal 
        isOpen={isBookDemoOpen}
        onClose={() => setIsBookDemoOpen(false)}
        initialEmail={bookDemoEmail}
        isEnterprise={isEnterpriseDemo}
        onSuccess={(email) => {
          setDemoEmail(email);
          setDemoSubmitted(true);
        }}
      />

    </div>
  );
}
