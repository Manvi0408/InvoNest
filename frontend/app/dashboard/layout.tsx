'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Briefcase, 
  MessageSquare, 
  UploadCloud, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  Bell, 
  User, 
  Settings,
  HelpCircle,
  Menu,
  ChevronDown
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [unreadNotifications, setUnreadNotifications] = useState([
    { id: 1, title: 'High Risk Exposure Alert', message: 'Delinquent accounts exceed ₹5L. Collect now.', type: 'WARNING', time: '10m ago' },
    { id: 2, title: 'Invoice OCR Complete', message: 'Invoice INV-2041 parsed with 97% confidence.', type: 'SUCCESS', time: '1h ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-[#0d2227] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#abc6d8]/15 border-r border-[#0d2227]/15 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo and Tenant Selector */}
          <div className="p-5 border-b border-[#0d2227]/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0d2227] to-[#abc6d8] flex items-center justify-center font-bold text-white text-xs">
                N
              </div>
              <span className="font-extrabold text-sm tracking-tight text-[#0d2227] font-editorial uppercase">InvoNest</span>
            </Link>
            <span className="text-[10px] text-zinc-500 font-mono bg-white border border-zinc-200 px-2 py-0.5 rounded uppercase">v2.0</span>
          </div>

          <div className="p-4 border-b border-[#0d2227]/10">
            <div className="flex items-center justify-between text-xs text-[#0d2227]/85 bg-white border border-[#0d2227]/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-zinc-50 transition-all">
              <span className="font-semibold truncate max-w-[120px]">Global Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#0d2227]/50" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold text-[#0d2227]/80">
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive('/dashboard') 
                  ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm' 
                  : 'hover:bg-[#abc6d8]/15 hover:text-[#0d2227]'
              }`}
            >
              <Activity className="w-4 h-4 text-[#0d2227]" /> Overview Panel
            </Link>
            <div className="px-3 py-2.5 text-[10px] uppercase font-bold text-[#0d2227]/40 tracking-wider font-mono">A/R Ledger</div>
            <a href="#invoices" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#abc6d8]/15 hover:text-[#0d2227] transition-all">
              <Briefcase className="w-4 h-4 text-[#0d2227]/70" /> Client Ledger
            </a>
            <a href="#ocr-upload" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#abc6d8]/15 hover:text-[#0d2227] transition-all">
              <UploadCloud className="w-4 h-4 text-[#0d2227]/70" /> Invoice Upload
            </a>
            <div className="px-3 py-2.5 text-[10px] uppercase font-bold text-[#0d2227]/40 tracking-wider font-mono">AI Intelligence</div>
            <a href="#ai-cfo" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#abc6d8]/15 hover:text-[#0d2227] transition-all">
              <MessageSquare className="w-4 h-4 text-[#0d2227]/70" /> AI CFO Copilot
            </a>
            <a href="#scenario-simulator" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#abc6d8]/15 hover:text-[#0d2227] transition-all">
              <TrendingUp className="w-4 h-4 text-[#0d2227]/70" /> Scenario Simulator
            </a>

            <Link href="/dashboard/documentation#automation-workflow" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#abc6d8]/15 hover:text-[#0d2227] transition-all">
              <Zap className="w-4 h-4 text-[#0d2227]/70" /> Reminder Builder
            </Link>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#0d2227]/10 space-y-2 text-xs font-medium text-[#0d2227]/70">
          <Link 
            href="/dashboard/setup" 
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
              isActive('/dashboard/setup') 
                ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm font-semibold' 
                : 'hover:text-[#0d2227] hover:bg-[#abc6d8]/15'
            }`}
          >
            <Settings className="w-4 h-4" /> Setup & Ledgers
          </Link>
          <Link 
            href="/dashboard/documentation" 
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
              isActive('/dashboard/documentation') 
                ? 'bg-[#abc6d8]/35 text-[#0d2227] shadow-sm font-semibold' 
                : 'hover:text-[#0d2227] hover:bg-[#abc6d8]/15'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Documentation
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 bg-white border border-[#0d2227]/15 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#0d2227] text-white flex items-center justify-center font-extrabold text-xs">
              SJ
            </div>
            <div>
              <div className="font-bold text-[#0d2227] text-[11px] leading-none">Sarah Jenkins</div>
              <span className="text-[10px] text-[#0d2227]/60 font-bold font-mono">FINANCE ADMIN</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN SCREEN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER TOOLBAR */}
        <header className="h-16 border-b border-[#0d2227]/10 bg-white px-6 flex justify-between items-center z-30 shrink-0">
          <button className="md:hidden text-zinc-600 hover:text-[#0d2227]">
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="font-extrabold text-sm text-[#0d2227] hidden md:block">Financial Command Center</div>
          
          <div className="flex items-center gap-4 relative">
            
            {/* Notifications Dropdown Toggle */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-lg bg-[#abc6d8]/10 border border-[#abc6d8]/20 flex items-center justify-center text-[#0d2227] hover:bg-[#abc6d8]/20 relative transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-11 w-80 bg-white border border-[#0d2227]/15 rounded-xl p-4 shadow-xl z-50 text-xs">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-[#0d2227]">System Notifications</span>
                  <button onClick={() => setUnreadNotifications([])} className="text-[10px] text-[#0d2227] hover:underline font-bold">Clear all</button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {unreadNotifications.length === 0 ? (
                    <div className="text-zinc-500 text-center py-4 font-mono text-[10px]">No new alerts.</div>
                  ) : (
                    unreadNotifications.map((n) => (
                      <div key={n.id} className="pb-2.5 border-b border-zinc-100 last:border-b-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <span className={`font-bold ${n.type === 'WARNING' ? 'text-red-600' : 'text-green-600'}`}>{n.title}</span>
                          <span className="text-[9px] text-zinc-400">{n.time}</span>
                        </div>
                        <p className="text-zinc-500 text-[10px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <button className="flex items-center gap-2 bg-[#0d2227] hover:bg-[#1a3339] px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors">
              <Zap className="w-3.5 h-3.5 fill-white/10" /> Sync Ledger
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT BODY */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          {children}
        </main>
      </div>

    </div>
  );
}
