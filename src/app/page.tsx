import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-nav">
        <div className="landing-nav-content">
          <div className="logo font-bold text-xl text-[var(--color-brand)]">AdmitFlow OS</div>
          <nav>
            <Link href="/app" className="btn btn-ghost btn-sm">Log In</Link>
            <Link href="/app" className="btn btn-primary btn-sm ml-2">Start Intake</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title text-balance">Turn every admissions inquiry into a clear next step.</h1>
          <p className="hero-subtitle text-pretty">
            AdmitFlow OS helps treatment and sober-living teams capture leads, route inquiries, schedule follow-ups, and manage admissions without turning your CRM into a clinical chart.
          </p>
          <div className="hero-ctas">
            <Link href="/app" className="btn btn-primary">Start Intake</Link>
            <a href="#how-it-works" className="btn btn-ghost">View Demo Workflow</a>
          </div>
        </div>
        <div className="hero-visual">
          {/* A simple CSS-based visual representation of the UI */}
          <div className="dashboard-preview glass-panel">
            <div className="preview-header"></div>
            <div className="preview-columns">
              <div className="preview-col"><div className="preview-card" data-sla="fresh"></div><div className="preview-card" data-sla="warning"></div></div>
              <div className="preview-col"><div className="preview-card" data-sla="fresh"></div></div>
              <div className="preview-col"><div className="preview-card" data-sla="breached"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="value-props">
        <div className="container">
          <div className="prop-grid">
            <div className="prop-card glass-panel">
              <h3>Fast First Contact</h3>
              <p>Capture only what is needed to route the lead, assign ownership, and schedule follow-up.</p>
            </div>
            <div className="prop-card glass-panel">
              <h3>Smarter Follow-Up</h3>
              <p>Keep every lead tied to a next action, owner, due date, and channel.</p>
            </div>
            <div className="prop-card glass-panel">
              <h3>Low-PHI by Design</h3>
              <p>Avoid unnecessary clinical details, sensitive documents, policy numbers, or diagnostic notes.</p>
            </div>
            <div className="prop-card glass-panel">
              <h3>Built for Admissions Teams</h3>
              <p>Track stages like new, contacted, qualifying, verification pending, tour scheduled, admitted, and lost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step glass-panel">
              <div className="step-number">1</div>
              <h3>Capture the inquiry</h3>
              <p>Web, phone, referral, text, walk-in, or partner source.</p>
            </div>
            <div className="step glass-panel">
              <div className="step-number">2</div>
              <h3>Route and qualify</h3>
              <p>Assign owner, identify urgency, program interest, payment path, and fit signals.</p>
            </div>
            <div className="step glass-panel">
              <div className="step-number">3</div>
              <h3>Set the next action</h3>
              <p>Schedule callback, tour, verification, assessment, or referral.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Intake UX Preview Section */}
      <section className="intake-preview">
        <div className="container">
          <div className="intake-preview-content glass-panel">
            <div className="preview-text">
              <h2>Progressive Intake Model</h2>
              <p>Don't overwhelm callers with a massive form. Our two-layer approach ensures you capture the essential routing information first.</p>
              <ul className="mt-4 flex flex-col gap-sm">
                <li><strong>Layer 1:</strong> Fast First-Contact (Name, Source, Owner, Next Action)</li>
                <li><strong>Layer 2:</strong> Fit-and-Follow-Up (Insurance, Housing, Urgency, History)</li>
              </ul>
            </div>
            <div className="preview-form">
              <div className="mock-form">
                <div className="mock-input"></div>
                <div className="mock-input"></div>
                <div className="mock-button"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="landing-footer">
        <div className="container text-center text-muted">
          &copy; 2026 AdmitFlow OS. All rights reserved. Built for admissions velocity.
        </div>
      </footer>
    </div>
  );
}
