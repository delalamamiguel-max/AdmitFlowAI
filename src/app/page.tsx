import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, CheckCircle2, PhoneCall, Clock, LayoutList } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="font-bold text-xl">
          Admit<span className="text-[var(--color-brand)]">Flow</span> OS
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/app" className="text-sm font-medium text-muted hover:text-[var(--color-text)]">Log In</Link>
          <Link href="/app" className="btn btn-primary btn-sm">Start Intake</Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-sm font-medium mb-4">
            <span>Now with Priority Worklist</span>
          </div>
          <h1 className="hero-title">
            Admissions follow-up, <br/><span>without the chaos.</span>
          </h1>
          <p className="hero-subtitle">
            AdmitFlow OS helps treatment and sober-living teams capture inquiries, route urgent leads, assign owners, and schedule next steps without turning intake into a clinical chart.
          </p>
          <div className="hero-actions">
            <Link href="/app" className="btn btn-primary btn-lg">
              Start Your Free Trial <ArrowRight size={20} />
            </Link>
            <a href="#demo" className="btn btn-ghost btn-lg">
              Watch Demo
            </a>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="section section-bg">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Admissions shouldn't feel this hard.</h2>
              <p className="text-lg text-muted">Stop losing admissions to messy spreadsheets and disorganized CRM boards.</p>
            </div>
            
            <div className="grid-3">
              <div className="feature-card">
                <div className="feature-icon bg-amber-500/20 text-amber-500">
                  <PhoneCall size={24} />
                </div>
                <h3>Lost in the Noise</h3>
                <p>Inquiries come from too many channels—calls, web forms, referral partners. Finding out who called who is impossible.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon bg-red-500/5 text-[var(--color-sla-breached)]">
                  <Clock size={24} />
                </div>
                <h3>Missed Follow-Ups</h3>
                <p>Urgent leads aren't prioritized, ownership is unclear, and hot leads go cold because someone forgot to call back.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon text-muted bg-[var(--color-border)]/50">
                  <ShieldAlert size={24} />
                </div>
                <h3>Cluttered with PHI</h3>
                <p>CRMs become bloated with sensitive clinical notes, diagnoses, and meds when reps just need to know the logistics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Priority Worklist Callout */}
        <section className="section">
          <div className="container grid-2">
            <div>
              <h2 className="text-3xl font-bold mb-6">The lightweight admissions command center.</h2>
              <p className="text-lg text-muted mb-8">
                Built specifically for behavioral health operations, AdmitFlow OS strips away the clinical clutter so your team can focus on what matters: speed to contact, clear ownership, and seamless routing.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  'Capture inquiries quickly without massive forms',
                  'Route leads visually by urgency level',
                  'Assign explicit ownership to reps',
                  'Schedule the very next follow-up action',
                  'Keep notes operational, low-PHI, and compliant'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-[var(--color-sla-fresh)] shrink-0" size={24} />
                    <span className="font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel p-6 shadow-lg">
              <div className="flex items-center gap-2 text-[var(--color-brand)] mb-6 border-b border-[var(--color-border)] pb-4">
                <LayoutList size={24} />
                <h3 className="font-bold text-lg">Priority Worklist</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="p-4 border-l-4 border-[var(--color-sla-breached)] bg-[var(--color-surface)] rounded shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">AF-99214</span>
                    <span className="badge badge-danger text-xs">Immediate</span>
                  </div>
                  <div className="text-sm text-muted">Next: Urgent Assessment</div>
                </div>
                <div className="p-4 border-l-4 border-[var(--color-sla-warning)] bg-[var(--color-surface)] rounded shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">AF-88123</span>
                    <span className="badge badge-warning text-xs">Due Today</span>
                  </div>
                  <div className="text-sm text-muted">Next: Verification Call</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust/Compliance Section */}
        <section className="section section-bg">
          <div className="container text-center max-w-3xl mx-auto">
            <ShieldAlert size={48} className="mx-auto text-[var(--color-brand)] mb-6" />
            <h2 className="text-3xl font-bold mb-4">Built to keep intake operational, not clinical.</h2>
            <p className="text-lg text-muted mb-8">
              We actively prevent your admissions workflow from becoming a HIPAA liability. AdmitFlow OS uses client-side encryption for contact info and strictly bans the collection of heavy clinical data in the pipeline.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="glass-panel p-6">
                <h4 className="font-bold text-lg mb-4 text-[var(--color-sla-fresh)]">✓ What we capture</h4>
                <ul className="text-sm text-muted flex flex-col gap-2">
                  <li>• Caller logistics & relationship</li>
                  <li>• Program interest (e.g. Sober Living)</li>
                  <li>• Basic payment path (e.g. Commercial)</li>
                  <li>• Operational scheduling notes</li>
                </ul>
              </div>
              <div className="glass-panel p-6">
                <h4 className="font-bold text-lg mb-4 text-[var(--color-sla-breached)]">✕ What we explicitly ban</h4>
                <ul className="text-sm text-muted flex flex-col gap-2">
                  <li>• Diagnosis & medication names</li>
                  <li>• Full Date of Birth & SSNs</li>
                  <li>• Insurance policy or group numbers</li>
                  <li>• Therapy or psychiatric notes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 text-center bg-[var(--color-surface)]">
        <div className="font-bold text-xl mb-2">AdmitFlow OS</div>
        <p className="text-sm text-muted">© {new Date().getFullYear()} AdmitFlow OS. All rights reserved.</p>
      </footer>
    </div>
  );
}
