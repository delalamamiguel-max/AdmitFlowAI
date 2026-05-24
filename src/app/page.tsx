import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, CheckCircle2, PhoneCall, LayoutDashboard, Clock, Users, ShieldCheck, X } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page bg-[var(--color-surface)] text-[var(--color-text)]">
      {/* Navbar */}
      <header className="landing-nav sticky top-0 z-50 backdrop-blur-md bg-[var(--color-surface)]/80">
        <div className="landing-nav-content flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="logo font-bold text-2xl tracking-tight text-[var(--color-text)]">
            Admit<span className="text-[var(--color-brand)]">Flow</span> OS
          </div>
          <nav className="flex gap-4 items-center">
            <Link href="/app" className="font-medium text-sm hover:text-[var(--color-brand)] transition-colors">Log In</Link>
            <Link href="/app" className="btn btn-primary btn-sm rounded-full px-6">Start Intake</Link>
          </nav>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="hero py-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-balance mb-6">
          Admissions follow-up, <br/><span className="text-[var(--color-brand)]">without the chaos.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted text-pretty max-w-3xl mb-10 leading-relaxed">
          AdmitFlow OS helps treatment and sober-living teams capture inquiries, route urgent leads, assign owners, and schedule next steps without turning intake into a clinical chart.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/app" className="btn btn-primary btn-lg rounded-full text-lg px-8 py-4 shadow-xl">
            Start Intake <ArrowRight size={20} />
          </Link>
          <a href="#workflow" className="btn btn-ghost btn-lg rounded-full text-lg px-8 py-4 bg-[var(--color-surface-glass)]">
            View Demo Workflow
          </a>
        </div>
      </section>

      {/* 5. Product Preview Section (Visual Hook) */}
      <section className="px-6 pb-20 max-w-6xl mx-auto relative z-10 -mt-10">
        <div className="glass-panel border border-[var(--color-border)] rounded-2xl p-2 shadow-2xl bg-[var(--color-surface-glass)]">
          <div className="bg-[var(--color-surface-card)] rounded-xl border border-[var(--color-border)] p-6 md:p-10 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><LayoutDashboard className="text-[var(--color-brand)]"/> Admissions Command Center</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-[var(--color-sla-warning)]/20 text-[var(--color-sla-warning)] text-xs font-bold uppercase">2 Due Today</span>
                <span className="px-3 py-1 rounded-full bg-[var(--color-sla-breached)]/20 text-[var(--color-sla-breached)] text-xs font-bold uppercase">1 Urgent</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] border-l-4 border-l-[var(--color-sla-breached)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">AF-99214</span>
                  <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-full">Immediate</span>
                </div>
                <div className="text-sm text-muted">Caller: Parent</div>
                <div className="mt-3 text-xs font-medium">Next: Urgent Assessment</div>
              </div>
              <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] border-l-4 border-l-[var(--color-sla-warning)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">AF-88123</span>
                  <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full">Due Today</span>
                </div>
                <div className="text-sm text-muted">Sober Living Inquiry</div>
                <div className="mt-3 text-xs font-medium">Next: Verification Call</div>
              </div>
              <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-border)] border-l-4 border-l-[var(--color-brand)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">AF-77492</span>
                  <span className="text-xs bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-full">New</span>
                </div>
                <div className="text-sm text-muted">Web Form</div>
                <div className="mt-3 text-xs font-medium">Next: Assign Owner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="py-20 bg-[var(--color-surface-card)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">Admissions shouldn't feel this hard.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-sla-breached)]/10 text-[var(--color-sla-breached)] flex items-center justify-center">
                <PhoneCall size={32} />
              </div>
              <h3 className="text-xl font-bold">Lost in the Noise</h3>
              <p className="text-muted text-pretty">Inquiries come from too many channels—calls, web forms, referral partners. Finding out who called who is impossible.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-sla-warning)]/10 text-[var(--color-sla-warning)] flex items-center justify-center">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold">Missed Follow-Ups</h3>
              <p className="text-muted text-pretty">Urgent leads aren't prioritized, ownership is unclear, and hot leads go cold because someone forgot to call back.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-text-secondary)]/10 text-[var(--color-text-secondary)] flex items-center justify-center">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-bold">Cluttered with PHI</h3>
              <p className="text-muted text-pretty">CRMs become bloated with sensitive clinical notes, diagnoses, and meds when reps just need to know the logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The lightweight admissions command center.</h2>
            <p className="text-xl text-muted mb-8 text-pretty">
              Built specifically for behavioral health operations, AdmitFlow OS strips away the clinical clutter so your team can focus on what matters: speed to contact, clear ownership, and seamless routing.
            </p>
            <ul className="flex flex-col gap-4">
              {[
                'Capture inquiries quickly without massive forms',
                'Route leads visually by urgency level',
                'Assign explicit ownership to reps',
                'Track exact pipeline stages instantly',
                'Schedule the very next follow-up action',
                'Keep notes operational, low-PHI, and compliant'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-[var(--color-sla-fresh)] shrink-0 mt-1" size={20} />
                  <span className="text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel p-8 bg-[var(--color-surface-glass)]">
             <div className="flex flex-col gap-4">
                {/* Visual abstract representation of a list */}
                <div className="h-12 rounded-lg bg-[var(--color-brand)]/20 border border-[var(--color-brand)] flex items-center px-4"><div className="w-1/3 h-2 bg-[var(--color-brand)] rounded-full"></div></div>
                <div className="h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center px-4"><div className="w-1/2 h-2 bg-[var(--color-text-secondary)] rounded-full"></div></div>
                <div className="h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center px-4"><div className="w-1/4 h-2 bg-[var(--color-text-secondary)] rounded-full"></div></div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Workflow Section */}
      <section id="workflow" className="py-24 bg-[var(--color-surface-card)] px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Three steps to a closed admit.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-1 bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-sla-fresh)] z-0 rounded-full opacity-30"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-xl border-8 border-[var(--color-surface-card)]">1</div>
              <h3 className="text-2xl font-bold mb-4">Capture</h3>
              <p className="text-muted">Quickly capture the caller, their relationship, and the program interest using our fast, progressive intake form.</p>
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-xl border-8 border-[var(--color-surface-card)]">2</div>
              <h3 className="text-2xl font-bold mb-4">Route & Qualify</h3>
              <p className="text-muted">Flag immediate safety concerns, verify payment paths, and route the lead to the correct admissions representative.</p>
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-[var(--color-sla-fresh)] text-[#fff] flex items-center justify-center text-3xl font-bold mb-6 shadow-xl border-8 border-[var(--color-surface-card)]">3</div>
              <h3 className="text-2xl font-bold mb-4">Set Next Action</h3>
              <p className="text-muted">Never leave a lead hanging. Assign a concrete next step and due date to keep the pipeline moving forward.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust / Compliance Boundary Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="border border-[var(--color-border)] rounded-3xl p-8 md:p-12 bg-gradient-to-b from-[var(--color-surface-glass)] to-[var(--color-surface)] relative overflow-hidden">
          <ShieldCheck size={200} className="absolute -top-10 -right-10 text-[var(--color-brand)] opacity-5 transform rotate-12" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Built to keep intake operational, not clinical.</h2>
          <p className="text-xl text-muted mb-10 max-w-3xl relative z-10 text-pretty">
            We actively prevent your admissions workflow from becoming a HIPAA liability. AdmitFlow OS uses client-side encryption for contact info and strictly bans the collection of heavy clinical data in the pipeline.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <h4 className="font-bold text-lg mb-4 text-[var(--color-sla-fresh)] flex items-center gap-2"><CheckCircle2 size={18}/> What we capture</h4>
              <ul className="space-y-2 text-muted font-medium">
                <li>• Caller logistics & relationship</li>
                <li>• Program interest (e.g. Sober Living)</li>
                <li>• Basic payment path (e.g. Commercial)</li>
                <li>• Operational scheduling notes</li>
                <li>• Next action due dates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[var(--color-sla-breached)] flex items-center gap-2"><X size={18}/> What we explicitly ban</h4>
              <ul className="space-y-2 text-muted font-medium">
                <li>• Diagnosis & medication names</li>
                <li>• Full Date of Birth & SSNs</li>
                <li>• Insurance policy or group numbers</li>
                <li>• Therapy or psychiatric notes</li>
                <li>• Document & ID uploads</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-24 bg-[var(--color-brand)] text-white text-center px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Give every inquiry a clear next step.</h2>
          <p className="text-xl opacity-90 mb-10">
            Stop losing admissions to messy spreadsheets and disorganized CRM boards.
          </p>
          <Link href="/app" className="bg-white text-[var(--color-brand)] hover:bg-gray-100 font-bold text-xl px-10 py-5 rounded-full shadow-2xl transition-transform hover:scale-105">
            Start Your First Intake
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="font-bold text-xl mb-2 text-[var(--color-text)]">AdmitFlow OS</div>
        <p className="text-sm">© {new Date().getFullYear()} AdmitFlow OS. All rights reserved.</p>
      </footer>
    </div>
  );
}
