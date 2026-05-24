import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, CheckCircle2, PhoneCall, LayoutDashboard, Clock, Users, ShieldCheck, X } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* Navbar */}
      <header className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            Admit<span>Flow</span> OS
          </div>
          <nav className="nav-links">
            <Link href="/app">Log In</Link>
            <Link href="/app" className="btn btn-primary btn-sm">Start Intake</Link>
          </nav>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="section section-dark hero">
        <h1 className="hero-title">
          Admissions follow-up, <br/><span>without the chaos.</span>
        </h1>
        <p className="hero-subtitle">
          AdmitFlow OS helps treatment and sober-living teams capture inquiries, route urgent leads, assign owners, and schedule next steps without turning intake into a clinical chart.
        </p>
        <div className="hero-actions">
          <Link href="/app" className="btn btn-primary">
            Start Intake <ArrowRight size={20} />
          </Link>
          <a href="#workflow" className="btn btn-ghost">
            View Demo Workflow
          </a>
        </div>
      </section>

      {/* 5. Product Preview Section (Visual Hook) */}
      <section className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
        <div className="preview-box">
          <div className="preview-inner">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LayoutDashboard style={{ color: 'var(--color-brand)' }}/> Admissions Command Center
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="badge badge-warning">2 Due Today</span>
                <span className="badge badge-danger">1 Urgent</span>
              </div>
            </div>
            
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', background: 'var(--color-surface-card)' }}>
              
              <div className="lead-card" data-sla="breached" style={{ background: 'var(--color-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 'bold' }}>AF-99214</span>
                  <span className="badge badge-danger">Immediate</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Caller: Parent</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>Next: Urgent Assessment</div>
              </div>

              <div className="lead-card" data-sla="warning" style={{ background: 'var(--color-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 'bold' }}>AF-88123</span>
                  <span className="badge badge-warning">Due Today</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Sober Living Inquiry</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>Next: Verification Call</div>
              </div>

              <div className="lead-card" data-sla="fresh" style={{ background: 'var(--color-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 'bold' }}>AF-77492</span>
                  <span className="badge">New</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Web Form</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>Next: Assign Owner</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Admissions shouldn't feel this hard.</h2>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--color-sla-breached)', borderColor: 'var(--color-sla-breached)' }}>
                <PhoneCall size={24} />
              </div>
              <h3>Lost in the Noise</h3>
              <p>Inquiries come from too many channels—calls, web forms, referral partners. Finding out who called who is impossible.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--color-sla-warning)', borderColor: 'var(--color-sla-warning)' }}>
                <Clock size={24} />
              </div>
              <h3>Missed Follow-Ups</h3>
              <p>Urgent leads aren't prioritized, ownership is unclear, and hot leads go cold because someone forgot to call back.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--color-text-secondary)' }}>
                <ShieldAlert size={24} />
              </div>
              <h3>Cluttered with PHI</h3>
              <p>CRMs become bloated with sensitive clinical notes, diagnoses, and meds when reps just need to know the logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>The lightweight admissions command center.</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
              Built specifically for behavioral health operations, AdmitFlow OS strips away the clinical clutter so your team can focus on what matters: speed to contact, clear ownership, and seamless routing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Capture inquiries quickly without massive forms',
                'Route leads visually by urgency level',
                'Assign explicit ownership to reps',
                'Track exact pipeline stages instantly',
                'Schedule the very next follow-up action',
                'Keep notes operational, low-PHI, and compliant'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle2 style={{ color: 'var(--color-brand)' }} size={24} />
                  <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ height: '3rem', borderRadius: '0.5rem', background: 'var(--color-brand)', opacity: 0.2 }}></div>
             <div style={{ height: '3rem', borderRadius: '0.5rem', background: 'var(--color-surface-card)', border: '1px solid var(--color-border)', width: '80%' }}></div>
             <div style={{ height: '3rem', borderRadius: '0.5rem', background: 'var(--color-surface-card)', border: '1px solid var(--color-border)', width: '60%' }}></div>
          </div>
        </div>
      </section>

      {/* 4. Workflow Section */}
      <section id="workflow" className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Three steps to a closed admit.</h2>
          </div>
          <div className="step-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Capture</h3>
                <p>Quickly capture the caller, their relationship, and the program interest using our fast, progressive intake form.</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Route & Qualify</h3>
                <p>Flag immediate safety concerns, verify payment paths, and route the lead to the correct admissions representative.</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Set Next Action</h3>
                <p>Never leave a lead hanging. Assign a concrete next step and due date to keep the pipeline moving forward.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust / Compliance Boundary Section */}
      <section className="section section-glass">
        <div className="container">
          <div className="glass-panel" style={{ padding: '4rem', position: 'relative', overflow: 'hidden' }}>
            <ShieldCheck size={300} style={{ position: 'absolute', top: '-50px', right: '-50px', color: 'var(--color-brand)', opacity: 0.1, transform: 'rotate(15deg)' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', position: 'relative', zIndex: 10 }}>Built to keep intake operational, not clinical.</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '3rem', maxWidth: '800px', position: 'relative', zIndex: 10 }}>
              We actively prevent your admissions workflow from becoming a HIPAA liability. AdmitFlow OS uses client-side encryption for contact info and strictly bans the collection of heavy clinical data in the pipeline.
            </p>
            
            <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
              <div style={{ background: 'var(--color-surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-sla-fresh)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={24}/> What we capture
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  <li>• Caller logistics & relationship</li>
                  <li>• Program interest (e.g. Sober Living)</li>
                  <li>• Basic payment path (e.g. Commercial)</li>
                  <li>• Operational scheduling notes</li>
                  <li>• Next action due dates</li>
                </ul>
              </div>
              <div style={{ background: 'var(--color-surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-sla-breached)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <X size={24}/> What we explicitly ban
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  <li>• Diagnosis & medication names</li>
                  <li>• Full Date of Birth & SSNs</li>
                  <li>• Insurance policy or group numbers</li>
                  <li>• Therapy or psychiatric notes</li>
                  <li>• Document & ID uploads</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Give every inquiry a clear next step.</h2>
          <p>Stop losing admissions to messy spreadsheets and disorganized CRM boards.</p>
          <Link href="/app" className="btn btn-primary">
            Start Your First Intake
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>AdmitFlow OS</div>
        <p style={{ fontSize: '0.875rem' }}>© {new Date().getFullYear()} AdmitFlow OS. All rights reserved.</p>
      </footer>
    </div>
  );
}
