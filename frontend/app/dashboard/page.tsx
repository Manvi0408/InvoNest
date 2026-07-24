'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  UploadCloud, 
  Zap, 
  Activity, 
  ChevronRight, 
  User, 
  Plus, 
  ArrowUpRight, 
  Mail, 
  Send,
  MoreVertical,
  Sliders,
  DollarSign,
  AlertTriangle,
  Heart
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'DUE' | 'OVERDUE' | 'PAID';
  dueDate: string;
  riskScore: number;
  timeline: Array<{ status: string; date: string; description: string }>;
  comments: Array<{ userName: string; text: string; date: string }>;
}

export default function DashboardOverview() {
  // Mock initial invoices state
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-1001',
      clientName: 'ABC Corp',
      amount: 45000,
      status: 'OVERDUE',
      dueDate: '2026-07-07',
      riskScore: 83,
      timeline: [
        { status: 'DRAFT', date: '2026-06-07', description: 'Invoice initialized via OCR scan.' },
        { status: 'SENT', date: '2026-06-07', description: 'Emailed PDF to billing@abccorp.com.' },
        { status: 'VIEWED', date: '2026-06-09', description: 'Invoice opened by client accounts payable.' },
        { status: 'REMINDER_SENT', date: '2026-07-08', description: 'Soft reminder email triggered.' }
      ],
      comments: [
        { userName: 'Sarah Jenkins', text: 'Spoke with ABC AP coordinator. They are pushing invoice processing to next Tuesday.', date: '2026-07-19T10:00:00Z' }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2001',
      clientName: 'XYZ Ltd',
      amount: 80000,
      status: 'OVERDUE',
      dueDate: '2026-06-26',
      riskScore: 26,
      timeline: [
        { status: 'DRAFT', date: '2026-05-26', description: 'Created draft invoice.' },
        { status: 'SENT', date: '2026-05-26', description: 'Sent to accounts department.' },
        { status: 'VIEWED', date: '2026-05-27', description: 'Viewed by client billing.' }
      ],
      comments: []
    },
    {
      id: '3',
      invoiceNumber: 'INV-3002',
      clientName: 'Acquirer Corp',
      amount: 400000,
      status: 'OVERDUE',
      dueDate: '2026-07-10',
      riskScore: 84,
      timeline: [
        { status: 'DRAFT', date: '2026-06-10', description: 'Invoice drafted.' },
        { status: 'SENT', date: '2026-06-11', description: 'Dispatched via system ledger.' },
        { status: 'REMINDER_SENT', date: '2026-07-11', description: 'Automated WhatsApp template sent.' }
      ],
      comments: [
        { userName: 'System Alert', text: 'WhatsApp reminder successfully sent containing Stripe Checkout payment link.', date: '2026-07-11T12:00:00Z' }
      ]
    },
    {
      id: '4',
      invoiceNumber: 'INV-3001',
      clientName: 'Acquirer Corp',
      amount: 120000,
      status: 'SENT',
      dueDate: '2026-08-20',
      riskScore: 40,
      timeline: [
        { status: 'DRAFT', date: '2026-07-20', description: 'Invoice initialized.' },
        { status: 'SENT', date: '2026-07-20', description: 'Dispatched to customer AP portal.' }
      ],
      comments: []
    }
  ]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Selected invoice for detail panel
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('1');
  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || invoices[0];

  // Comment input state
  const [newComment, setNewComment] = useState('');

  // AI Copilot state
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string; category?: string }>>([
    { role: 'assistant', text: '### InvoNest Financial Advisor Active\n\nI am connected to your live QuickBooks ledger, Stripe billing feed, and accounts receivable pipeline.\n\n* Try asking me:\n  * *"Will we have enough cash for payroll?"*\n  * *"Can we afford to hire two software designers?"*\n  * *"Which customers are threatening our cash flow?"*\n  * *"What if our primary client defaults?"* (Digital Twin simulation)' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Scenario Simulator state
  const [selectedScenario, setSelectedScenario] = useState('NONE');
  const [simResults, setSimResults] = useState<{
    originalCash: number;
    simulatedCash: number;
    delta: number;
    explanation: string;
  } | null>(null);

  // OCR Upload simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [orgId, setOrgId] = useState<string>('6d73cfce-5470-46b8-a398-5523fc9962a9');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Fetch live backend invoices on mount
  useEffect(() => {
    async function initDashboard() {
      try {
        const orgsRes = await fetch(`${API_BASE}/api/organizations`);
        if (orgsRes.ok) {
          const orgs = await orgsRes.json();
          if (orgs && orgs.length > 0) {
            const currentOrgId = orgs[0].id;
            setOrgId(currentOrgId);
            const invsRes = await fetch(`${API_BASE}/api/invoices/org/${currentOrgId}`);
            if (invsRes.ok) {
              const invsData = await invsRes.json();
              if (invsData && invsData.length > 0) {
                const mapped = invsData.map((inv: any) => ({
                  id: inv.id,
                  invoiceNumber: inv.invoiceNumber,
                  clientName: inv.client?.name || 'Unknown Client',
                  amount: Number(inv.amount),
                  status: inv.status,
                  dueDate: new Date(inv.dueDate).toISOString().split('T')[0],
                  riskScore: inv.riskPrediction?.riskScore || 30,
                  timeline: inv.timeline || [],
                  comments: inv.comments || []
                }));
                setInvoices(mapped);
                setSelectedInvoiceId(mapped[0].id);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard live data:', err);
      }
    }
    initDashboard();
  }, []);

  // Auto-calculated summary metrics based on state
  const totalOutstanding = invoices.reduce((sum, inv) => inv.status !== 'PAID' ? sum + inv.amount : sum, 0);
  const totalOverdue = invoices.reduce((sum, inv) => inv.status === 'OVERDUE' ? sum + inv.amount : sum, 0);
  const paidCount = invoices.filter(inv => inv.status === 'PAID').length;
  const recoveryRate = invoices.length > 0 ? Math.round((paidCount / invoices.length) * 100) : 0;
  
  // Handlers
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setInvoices(prev => prev.map(inv => {
      if (inv.id === selectedInvoice.id) {
        return {
          ...inv,
          comments: [
            ...inv.comments,
            { userName: 'Sarah Jenkins (Finance)', text: newComment, date: new Date().toISOString() }
          ]
        };
      }
      return inv;
    }));
    setNewComment('');
  };

  const handleAskCFO = (customQuery?: string) => {
    const askQuery = customQuery || query;
    if (!askQuery.trim()) return;

    setChatLog(prev => [...prev, { role: 'user', text: askQuery }]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const norm = askQuery.toLowerCase();

      if (norm.includes('hire') || norm.includes('afford')) {
        reply = `### 💼 AI CFO Hire Assessment: **APPROVED**\n\nBased on baseline cash forecast, the organization can absorb this overhead.\n\n* **Current Liquidity:** ₹12.4L\n* **Estimated Runway:** ~8.4 months (including estimated headcount overhead).\n* **Overdue risk exposure:** ₹5.25L is outstanding, but collections recovery efficiency has improved 14%.`;
      } else if (norm.includes('payroll') || norm.includes('enough cash')) {
        reply = `### 🏦 Payroll Solvency Analysis\n\nYou have **sufficient reserves** to cover the upcoming payroll of ₹4.5L.\n\n* **Buffer:** ₹7.9L surplus cash remaining after payroll disbursements.\n* **Inflows:** ₹2.45L expected collections is scheduled to settle before month-end.`;
      } else if (norm.includes('threaten') || norm.includes('risk') || norm.includes('late')) {
        reply = `### 🔍 Accounts Receivable Risk Report\n\nThe following clients present the highest cash flow risk due to payment delays:\n\n* **Acquirer Corp** (Exposure: ₹4.0L, Risk Score: 84)\n* **ABC Corp** (Exposure: ₹45K, Risk Score: 83)\n\n* **Suggested Mitigation:** Trigger automated reminder link sequences immediately.`;
      } else if (norm.includes('default') || norm.includes('what if')) {
        reply = `### 🤖 Financial Digital Twin Simulation\n\nI have modeled a complete write-off/default by your primary client **Acquirer Corp**:\n\n* **Baseline Cash:** ₹1,240,000\n* **Simulated Cash:** ₹720,000\n* **Liquidity Delta:** **-₹520,000**\n\n**Digital Twin Impact:** If Acquirer Corp defaults, cash reserves fall below payroll solvency thresholds. Triggering immediate safety credit boundaries is highly recommended.`;
      } else {
        reply = `I am connected to your live billing ledger. Ask me about payroll cash buffers, new hiring runtimes, creditworthiness scores, or run Digital Twin scenarios.`;
      }

      setChatLog(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleRunSimulation = (scenario: string) => {
    setSelectedScenario(scenario);
    const base = 1240000;

    let res = {
      originalCash: base,
      simulatedCash: base,
      delta: 0,
      explanation: ''
    };

    if (scenario === 'XYZ_LATE') {
      res.delta = -80000;
      res.simulatedCash = base - 80000;
      res.explanation = 'XYZ Ltd overdue balance of ₹80,000 shifts past the 30-day forecast horizon, dropping immediate liquidity projections.';
    } else if (scenario === 'IMPROVE_AR') {
      res.delta = 78750; // 15% of overdue
      res.simulatedCash = base + 78750;
      res.explanation = 'Improving collections collection efficiency by 15% recovers ₹78,750 of overdue receivables, boosting cash levels.';
    } else if (scenario === 'ACQUIRER_DEFAULT') {
      res.delta = -520000;
      res.simulatedCash = base - 520000;
      res.explanation = 'Acquirer Corp defaults on entire ₹5.2L active balances. Immediate bad-debt adjustment forced, cash drops by 41%.';
    } else if (scenario === 'SALES_DROP') {
      res.delta = -46500;
      res.simulatedCash = base - 46500;
      res.explanation = 'A 15% drop in new invoiced bookings reduces cash reserves by ₹46,500 over the next 30 days.';
    } else if (scenario === 'PAYROLL_UP') {
      res.delta = -80000;
      res.simulatedCash = base - 80000;
      res.explanation = 'Adding ₹80,000 in monthly salary overhead shifts baseline operating expenditures up immediately.';
    }

    setSimResults(res);
  };

  const handleMockPay = async () => {
    setIsPaying(true);
    try {
      const res = await fetch(`${API_BASE}/api/invoices/${selectedInvoice.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(selectedInvoice.amount),
          method: 'STRIPE',
          transactionId: `ch_${Math.random().toString(36).substring(2, 11)}`
        })
      });

      if (!res.ok) {
        throw new Error(`Payment failed: ${res.statusText}`);
      }

      setInvoices(prev => prev.map(inv => {
        if (inv.id === selectedInvoice.id) {
          const updatedTimeline = [
            ...inv.timeline,
            { status: 'PAID', date: new Date().toISOString(), description: 'Payment of ₹' + Number(inv.amount).toLocaleString('en-IN') + ' processed via Stripe Checkout.' }
          ];
          return {
            ...inv,
            status: 'PAID',
            timeline: updatedTimeline
          };
        }
        return inv;
      }));
      
      setIsPaymentModalOpen(false);
    } catch (err) {
      console.error('Payment execution failed:', err);
      alert(`Payment Processing Failed: ${(err as any).message}`);
    } finally {
      setIsPaying(false);
    }
  };

  const handleOcrUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(15);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        setUploadProgress(45);
        const base64Data = reader.result as string;

        try {
          const res = await fetch(`${API_BASE}/api/ocr/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              base64Data,
              fileName: file.name,
              orgId: orgId
            })
          });

          setUploadProgress(85);

          if (!res.ok) {
            throw new Error(`OCR service failed with status ${res.status}`);
          }

          const responseData = await res.json();
          setUploadProgress(100);

          const data = responseData.extractedData || responseData;
          const newInv: Invoice = {
            id: data.invoiceId || data.id,
            invoiceNumber: data.invoiceNumber,
            clientName: data.clientName || data.client?.name || 'Unknown Client',
            amount: Number(data.amount),
            status: data.status || 'DRAFT',
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            riskScore: data.riskPrediction?.riskScore || 30,
            timeline: data.timeline || [
              { status: 'DRAFT', date: new Date().toISOString(), description: 'Invoice parsed via OCR system.' }
            ],
            comments: data.comments || []
          };

          setInvoices(prev => [newInv, ...prev]);
          setSelectedInvoiceId(newInv.id);
        } catch (err) {
          console.error('OCR Upload Error:', err);
          alert(`OCR Scan failed: ${(err as any).message}`);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset input
          }
        }
      };

      reader.onerror = () => {
        alert('Could not read the selected file.');
        setIsUploading(false);
        setUploadProgress(0);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('FileReader initialization failed:', err);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* 4 CORE KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-[#abc6d8] transition-all duration-300 text-[#0d2227]">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Outstanding Revenue</span>
          <div className="text-2xl font-extrabold text-[#0d2227]">₹{(totalOutstanding / 100000).toFixed(2)}L</div>
          <span className="text-[10px] text-zinc-400 mt-2 block">Unpaid invoices</span>
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#abc6d8]/10 flex items-center justify-center text-[#0d2227] text-xs">₹</div>
        </div>

        <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-[#abc6d8] transition-all duration-300 text-[#0d2227]">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Recovery Rate</span>
          <div className="text-2xl font-extrabold text-green-700">{recoveryRate}%</div>
          <span className="text-[10px] text-zinc-400 mt-2 block">+4% this month</span>
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center text-green-700 text-xs">↑</div>
        </div>

        <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-[#abc6d8] transition-all duration-300 border-red-200">
          <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block mb-1">At Risk Revenue</span>
          <div className="text-2xl font-extrabold text-red-600">₹{(totalOverdue / 100000).toFixed(2)}L</div>
          <span className="text-[10px] text-zinc-400 mt-2 block">Overdue invoices</span>
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 text-xs">!</div>
        </div>

        <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-[#abc6d8] transition-all duration-300 text-[#0d2227]">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Expected Collections</span>
          <div className="text-2xl font-extrabold text-[#0d2227]">₹12.40L</div>
          <span className="text-[10px] text-zinc-400 mt-2 block">Next 30 days</span>
          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#abc6d8]/20 flex items-center justify-center text-[#0d2227] text-xs">⚡</div>
        </div>
      </div>

      {/* MID PANEL: SCENARIO SIMULATOR & CLIENT HEALTH SCOREBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SCENARIO SIMULATOR (2 COLS) */}
        <div id="scenario-simulator" className="lg:col-span-2 bg-white border border-[#0d2227]/15 rounded-2xl p-6 flex flex-col justify-between shadow-sm text-[#0d2227]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-[#0d2227]">Scenario Simulator</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Model payment assumptions to test runway solvency outcomes</p>
              </div>
              <Sliders className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Selection tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'XYZ_LATE', text: 'XYZ pays 20 days late' },
                { id: 'IMPROVE_AR', text: 'Collections improve by 15%' },
                { id: 'ACQUIRER_DEFAULT', text: 'Acquirer defaults' },
                { id: 'SALES_DROP', text: 'Sales drop 15%' },
                { id: 'PAYROLL_UP', text: 'Payroll increases ₹80K' }
              ].map((s) => (
                <button 
                  key={s.id}
                  onClick={() => handleRunSimulation(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${selectedScenario === s.id ? 'bg-[#0d2227] text-white border-[#0d2227] shadow-sm shadow-[#0d2227]/15' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200/80'}`}
                >
                  {s.text}
                </button>
              ))}
            </div>

            {/* Results Display */}
            {simResults && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3 text-xs"
              >
                <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase block font-bold font-mono">Baseline Runway Cash</span>
                    <span className="text-[#0d2227] font-mono font-bold">₹{simResults.originalCash.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase block font-bold font-mono">Simulated Projection</span>
                    <span className={`font-mono font-bold ${simResults.delta < 0 ? 'text-red-600' : 'text-green-700'}`}>₹{simResults.simulatedCash.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase block font-bold font-mono">Liquidity Impact</span>
                    <span className={`font-mono font-bold ${simResults.delta < 0 ? 'text-red-600' : 'text-green-700'}`}>
                      {simResults.delta > 0 ? '+' : ''}₹{simResults.delta.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <p className="text-zinc-600 leading-relaxed text-[11px]"><span className="font-bold text-[#0d2227]">Virtual Twin Narrative:</span> {simResults.explanation}</p>
              </motion.div>
            )}

            {!simResults && (
              <div className="text-center py-10 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl text-[11px] text-zinc-500 font-mono">
                Select a scenario template above to compute digital twin cash implications.
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-mono">
            <span>Confidence Index: 89%</span>
            <span>Scenario Engine Active</span>
          </div>
        </div>

        {/* CLIENT HEALTH SCOREBOARD */}
        <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 flex flex-col justify-between shadow-sm text-[#0d2227]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-[#0d2227]">Client Health Scoreboard</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Categorized settlement metrics</p>
              </div>
              <Heart className="w-4 h-4 text-[#abc6d8]" />
            </div>

            <div className="space-y-3.5">
              {[
                { name: 'ABC Corp', score: 17, category: 'CRITICAL', reliability: 40, contribution: 15, limit: '₹1L' },
                { name: 'XYZ Ltd', score: 74, category: 'MONITOR', reliability: 74, contribution: 25, limit: '₹3L' },
                { name: 'Acquirer Corp', score: 16, category: 'CRITICAL', reliability: 35, contribution: 60, limit: '₹2L' }
              ].map((c, i) => (
                <div key={i} className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100 last:border-0 last:pb-0">
                  <div>
                    <span className="font-semibold text-[#0d2227] block">{c.name}</span>
                    <span className="text-[9px] font-mono text-zinc-500">Credit Limit: {c.limit} | Contrib: {c.contribution}%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.category === 'CRITICAL' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
                        {c.category}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 block mt-0.5">Reliability: {c.reliability}%</span>
                    </div>

                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-[10px] ${c.score < 30 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                      {c.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTIONS: AI CO-PILOT AND INVOICE LEDGER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEDGER AND INVOICES LIST (2 COLS) */}
        <div id="invoices" className="lg:col-span-2 space-y-6">
          
          {/* LEDGER LIST */}
          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 shadow-sm text-[#0d2227]">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-extrabold text-sm text-[#0d2227]">Accounts Receivable Ledger</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">List of outstanding billing agreements</p>
              </div>
              
              {/* Dropzone file input & button */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf,.png,.jpg,.jpeg" 
                style={{ display: 'none' }} 
              />
              <button 
                id="ocr-upload"
                onClick={handleOcrUploadClick} 
                disabled={isUploading}
                className="bg-[#0d2227] hover:bg-[#1a3339] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" /> 
                {isUploading ? `Extracting (${uploadProgress}%)...` : 'OCR Upload Invoice'}
              </button>
            </div>

            <div className="border border-[#0d2227]/15 rounded-xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-[#0d2227]/15 text-[#0d2227]/80 font-bold uppercase tracking-wider text-[9px] font-mono">
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5 text-right">Amount</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-center">Delay Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr 
                      key={inv.id} 
                      onClick={() => setSelectedInvoiceId(inv.id)}
                      className={`border-b border-[#0d2227]/10 last:border-b-0 cursor-pointer transition-all hover:bg-zinc-50 ${selectedInvoice.id === inv.id ? 'bg-[#abc6d8]/15 border-l-2 border-l-[#0d2227]' : ''}`}
                    >
                      <td className="p-3.5 font-bold text-[#0d2227]">{inv.invoiceNumber}</td>
                      <td className="p-3.5 font-semibold text-zinc-800">{inv.clientName}</td>
                      <td className="p-3.5 text-right font-bold text-[#0d2227]">₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-zinc-500 font-mono">{inv.dueDate}</td>
                      <td className="p-3.5">
                        <select
                          value={inv.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={async (e) => {
                            const newStatus = e.target.value as any;
                            // Update local state immediately for instant feedback
                            setInvoices(prev => prev.map(item => item.id === inv.id ? { ...item, status: newStatus } : item));
                            
                            try {
                              const res = await fetch(`${API_BASE}/api/invoices/${inv.id}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: newStatus })
                              });
                              if (!res.ok) {
                                throw new Error(`Status update failed: ${res.statusText}`);
                              }
                            } catch (err) {
                              console.error('Failed to update status on server:', err);
                              // Revert state if backend call fails
                              setInvoices(prev => prev.map(item => item.id === inv.id ? { ...item, status: inv.status } : item));
                              alert(`Failed to update status: ${(err as any).message}`);
                            }
                          }}
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border outline-none cursor-pointer ${
                            inv.status === 'OVERDUE'
                              ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400'
                              : inv.status === 'PAID'
                              ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/20 dark:border-teal-900/50 dark:text-teal-400'
                              : inv.status === 'SENT' || inv.status === 'VIEWED'
                              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400'
                              : 'bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="SENT">SENT</option>
                          <option value="VIEWED">VIEWED</option>
                          <option value="DUE">DUE</option>
                          <option value="OVERDUE">OVERDUE</option>
                          <option value="PAID">PAID</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`font-mono font-bold ${inv.riskScore > 70 ? 'text-red-600' : 'text-zinc-600'}`}>{inv.riskScore}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* INVOICE DETAILS PANEL */}
          <div className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 shadow-sm text-[#0d2227]">
            <div className="flex justify-between items-center mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h4 className="font-extrabold text-sm text-[#0d2227]">Ledger Inspector: {selectedInvoice.invoiceNumber}</h4>
              {selectedInvoice.status !== 'PAID' && (
                <button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="bg-[#0d2227] hover:bg-[#1a3339] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono shadow transition-all flex items-center gap-1.5"
                >
                  <DollarSign className="w-3 h-3" /> Pay Now
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Timeline */}
              <div className="space-y-4">
                <h5 className="font-bold text-zinc-500 uppercase tracking-wider text-[9px] mb-2.5 font-mono">Accounts Receivable Timeline</h5>
                
                <div className="relative border-l border-zinc-200 pl-4 ml-2 space-y-4 text-[11px]">
                  {selectedInvoice.timeline.map((t, idx) => (
                    <div key={idx} className="relative">
                      {/* Node circle */}
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0d2227] ring-4 ring-white" />
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="font-bold text-[#0d2227]">{t.status}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-zinc-600 leading-normal">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaboration comments */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-zinc-500 uppercase tracking-wider text-[9px] mb-2.5 font-mono">Team Collaboration Comments</h5>
                  
                  <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                    {selectedInvoice.comments.length === 0 ? (
                      <div className="text-zinc-400 text-center py-6 font-mono text-[10px]">No team comments logged. Add a comment below.</div>
                    ) : (
                      selectedInvoice.comments.map((c, idx) => (
                        <div key={idx} className="bg-zinc-50 border border-zinc-100 rounded-lg p-2.5 text-[11px]">
                          <div className="flex justify-between text-[9px] text-zinc-500 mb-1.5">
                            <span className="font-bold text-[#0d2227]">{c.userName}</span>
                            <span className="font-mono">{new Date(c.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-zinc-700 leading-relaxed">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Comment writer */}
                <form onSubmit={handleAddComment} className="flex gap-2 mt-4 pt-3.5 border-t border-zinc-100">
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Log comments on customer account..."
                    className="bg-white border border-zinc-300 rounded-lg text-xs px-3 py-1.5 flex-1 focus:outline-none focus:border-[#0d2227] text-zinc-800"
                  />
                  <button type="submit" className="bg-[#0d2227] hover:bg-[#1a3339] px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors">
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* AI CFO CO-PILOT (1 COL) */}
        <div id="ai-cfo" className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 flex flex-col h-[520px] justify-between shadow-sm text-[#0d2227]">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-extrabold text-sm text-[#0d2227]">AI CFO Advisor</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Real-time ledger audit chat assistant</p>
              </div>
              <MessageSquare className="w-4 h-4 text-[#0d2227]" />
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2 text-xs">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`flex gap-2 ${chat.role === 'user' ? 'justify-end' : ''}`}>
                  {chat.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-[#0d2227] text-white flex items-center justify-center text-[10px] font-bold shrink-0">AI</div>
                  )}
                  
                  <div className={`p-3 rounded-2xl max-w-[85%] ${chat.role === 'user' ? 'bg-[#abc6d8]/35 border border-[#abc6d8]/50 text-[#0d2227] font-semibold rounded-tr-none' : 'bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-tl-none'}`}>
                    {/* Render basic custom markdown structures for clean visual formatting */}
                    <div className="space-y-1.5 leading-relaxed">
                      {chat.text.split('\n').map((line, lIdx) => {
                        if (line.startsWith('###')) {
                          return <div key={lIdx} className="font-bold text-[#0d2227] text-[11px] mt-2 mb-1">{line.replace('###', '')}</div>;
                        }
                        if (line.startsWith('*')) {
                          return <div key={lIdx} className="pl-2 border-l border-[#0d2227]/30 my-1">{line.replace('*', '')}</div>;
                        }
                        return <div key={lIdx}>{line}</div>;
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0d2227] text-white flex items-center justify-center text-[10px] font-bold">AI</div>
                  <div className="bg-zinc-100 border border-zinc-200 p-3 rounded-2xl rounded-tl-none text-[11px] text-zinc-500 font-mono">
                    Synthesizing forecast models...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick templates input buttons */}
          <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2 shrink-0">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1 font-mono">CFO Queries</div>
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => handleAskCFO('Can we afford to hire two software designers?')}
                className="bg-[#abc6d8]/15 border border-[#abc6d8]/30 hover:bg-[#abc6d8]/30 text-[#0d2227] px-2 py-1 rounded text-[10px] font-semibold transition-all"
              >
                Can we afford to hire?
              </button>
              <button 
                onClick={() => handleAskCFO('Will we have enough cash for payroll?')}
                className="bg-[#abc6d8]/15 border border-[#abc6d8]/30 hover:bg-[#abc6d8]/30 text-[#0d2227] px-2 py-1 rounded text-[10px] font-semibold transition-all"
              >
                 Solvency runway check
              </button>
              <button 
                onClick={() => handleAskCFO('Which customers present high accounts receivable risk?')}
                className="bg-[#abc6d8]/15 border border-[#abc6d8]/30 hover:bg-[#abc6d8]/30 text-[#0d2227] px-2 py-1 rounded text-[10px] font-semibold transition-all"
              >
                 Accounts receivable risks
              </button>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2 mt-3.5">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskCFO()}
                placeholder="Ask AI CFO ledger questions..."
                className="bg-white border border-zinc-300 rounded-lg text-xs px-3 py-2 flex-1 focus:outline-none focus:border-[#0d2227] text-zinc-800"
              />
              <button 
                onClick={() => handleAskCFO()}
                className="bg-[#0d2227] text-white hover:bg-[#1a3339] p-2 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* MOCK PAYMENT MODAL */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#0d2227]/15 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#0d2227] space-y-6"
            >
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">Process Settlement</h3>
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-zinc-400 hover:text-[#0d2227] font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Invoice Number</span>
                  <span className="font-bold font-mono">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Customer Client</span>
                  <span className="font-bold">{selectedInvoice.clientName}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-zinc-100 pb-3.5">
                  <span className="text-zinc-500 font-medium">Card Credentials</span>
                  <span className="font-bold font-mono">Visa Ending in **** 1234</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 font-medium">Amount Due</span>
                  <span className="text-xl font-extrabold">₹{Number(selectedInvoice.amount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-[#abc6d8]/10 border border-[#0d2227]/5 rounded-lg p-3 text-[10px] text-zinc-500 leading-relaxed font-mono">
                💡 Currently this uses a simulated payment flow. In production, this would integrate with Stripe Checkout and webhooks.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 border border-zinc-200 hover:bg-zinc-50 font-bold py-2.5 rounded-lg text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMockPay}
                  disabled={isPaying}
                  className="flex-1 bg-[#0d2227] hover:bg-[#1a3339] text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {isPaying ? 'Processing...' : 'Pay Invoice'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
