'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, CheckCircle2, PhoneCall, LayoutDashboard, Clock, ShieldCheck, X, TrendingUp, Users, Zap, Target, DollarSign, Minus, Plus, Menu } from 'lucide-react';

export default function LandingPage() {
  // ROI Calculator state
  const [monthlyLeads, setMonthlyLeads] = useState(150);
  const [currentRate, setCurrentRate] = useState(20);
  const [improvedRate, setImprovedRate] = useState(22);
  const [revenuePerAdmit, setRevenuePerAdmit] = useState(15000);
  const softwareCost = 750;

  const calcResults = useMemo(() => {
    const currentAdmits = monthlyLeads * (currentRate / 100);
    const projectedAdmits = monthlyLeads * (improvedRate / 100);
    const incrementalAdmits = projectedAdmits - currentAdmits;
    const incrementalMonthlyRevenue = incrementalAdmits * revenuePerAdmit;
    const annualizedRevenue = incrementalMonthlyRevenue * 12;
    const monthlyROI = softwareCost > 0 ? ((incrementalMonthlyRevenue - softwareCost) / softwareCost) : 0;
    const paybackAdmits = revenuePerAdmit > 0 ? softwareCost / revenuePerAdmit : 0;
    return {
      currentAdmits: Math.round(currentAdmits * 10) / 10,
      projectedAdmits: Math.round(projectedAdmits * 10) / 10,
      incrementalAdmits: Math.round(incrementalAdmits * 10) / 10,
      incrementalMonthlyRevenue: Math.round(incrementalMonthlyRevenue),
      annualizedRevenue: Math.round(annualizedRevenue),
      monthlyROI: Math.round(monthlyROI * 100) / 100,
      paybackAdmits: Math.round(paybackAdmits * 100) / 100,
    };
  }, [monthlyLeads, currentRate, improvedRate, revenuePerAdmit]);

  // Pricing state
  const [locations, setLocations] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const pricePerLocation = billingCycle === 'yearly' ? 675 : 750;
  const totalPrice = pricePerLocation * locations;

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <header className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Admit<span>Flow</span>AI
            </Link>
          </div>
          
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <a href="#why" onClick={() => setIsMobileMenuOpen(false)}>Why AdmitFlow</a>
            <a href="#matchmaker" onClick={() => setIsMobileMenuOpen(false)}>Matchmaker</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <Link href="/app" onClick={() => { setIsMobileMenuOpen(false); }}>Log In</Link>
            <Link href="/app" className="btn btn-primary btn-sm" onClick={() => setIsMobileMenuOpen(false)}>Start Intake</Link>
          </nav>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="section section-dark hero">
        <p className="hero-eyebrow">ADMISSIONS PIPELINE FOR BEHAVIORAL HEALTH</p>
        <h1 className="hero-title">
          Admissions follow-up, <span>without the chaos.</span>
        </h1>
        <p className="hero-subtitle">
          AdmitFlowAI helps treatment and sober-living teams capture inquiries, route urgent leads, assign owners, and schedule next steps — without turning intake into a clinical chart.
        </p>
        <div className="hero-actions">
          <Link href="/app" className="btn btn-primary">
            Start Intake <ArrowRight size={20} />
          </Link>
          <a href="#why" className="btn btn-ghost">
            See the Business Case
          </a>
        </div>
      </section>

      {/* 2. Product Preview Section */}
      <section className="container" style={{ marginTop: '2rem', marginBottom: '-2rem', position: 'relative', zIndex: 10 }}>
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

      {/* 3. Problem Section */}
      <section className="section section-dark" style={{ paddingTop: '5rem' }}>
        <div className="container">
          <div className="section-header">
            <h2>Admissions shouldn&apos;t feel this hard.</h2>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--color-sla-breached)', borderColor: 'var(--color-sla-breached)' }}>
                <PhoneCall size={24} />
              </div>
              <h3>Lost in the Noise</h3>
              <p>Inquiries come from too many channels — calls, web forms, referral partners. Finding out who called who is impossible.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--color-sla-warning)', borderColor: 'var(--color-sla-warning)' }}>
                <Clock size={24} />
              </div>
              <h3>Missed Follow-Ups</h3>
              <p>Urgent leads aren&apos;t prioritized, ownership is unclear, and hot leads go cold because someone forgot to call back.</p>
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

      {/* 4. Solution Section */}
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>The lightweight admissions command center.</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
              Built specifically for behavioral health operations, AdmitFlowAI strips away the clinical clutter so your team can focus on what matters: speed to contact, clear ownership, and seamless routing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Capture inquiries quickly without massive forms',
                'Route leads visually by urgency level',
                'Assign explicit ownership to reps',
                'Track exact intake stages instantly',
                'Schedule the very next follow-up action',
                'Keep notes operational, low-PHI, and compliant'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle2 style={{ color: 'var(--color-brand)', flexShrink: 0 }} size={24} />
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

      {/* 5. Workflow Section */}
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
                <p>Never leave a lead hanging. Assign a concrete next step and due date to keep the intake moving forward.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 Matchmaker Section */}
      <section id="matchmaker" className="section" style={{ backgroundColor: 'var(--color-surface-card)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--color-brand)', color: 'white' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} /> Deep Psychographic Matching
                </h4>
                <p style={{ opacity: 0.9 }}>
                  &quot;Patient needs high structure and direct accountability.&quot;
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', color: 'var(--color-text)', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--color-surface-card)', border: '2px solid var(--color-sla-fresh)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-sla-fresh)' }}>95%</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Dr. Sarah Jenkins</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Lead Therapist • Direct • Highly Structured</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="section-eyebrow" style={{ color: 'var(--color-brand)' }}>INTRODUCING ADMITFLOW MATCHMAKER</p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>Stop guessing. Start pairing patients for lasting recovery.</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Premature discharges (AMA) happen when a patient&apos;s personality clashes with the clinical environment. AdmitFlow Matchmaker uses purely operational, logistical psychographics to recommend the exact therapist or housing environment where the patient will thrive—keeping your intake pipeline lightweight and completely free of heavy clinical or HIPAA requirements.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text)', fontWeight: 500 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--color-brand)', marginTop: '2px' }} />
                  <span><strong>Zero Clinical Data:</strong> We map communication preferences and structure needs—not symptoms or diagnoses.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--color-brand)', marginTop: '2px' }} />
                  <span><strong>Higher Conversion:</strong> Give families confidence by showing exactly *why* your facility is the perfect fit.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--color-brand)', marginTop: '2px' }} />
                  <span><strong>Premium Tier Upgrades:</strong> Unlock deep personnel matching to pair patients directly to the therapist that matches their behavioral profile.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* 6. Why AdmitFlow OS — Value Proposition Section */}
      <section id="why" className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">THE COST OF MISSED ADMITS</p>
            <h2>Every dropped lead is $15,000 walking out the door.</h2>
            <p>Most centers convert only 15–25% of inquiries into admits. Tighter follow-up and accountability close the gap — without adding headcount.</p>
          </div>

          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon">
                <Zap size={28} />
              </div>
              <h3>Faster Response = More Admits</h3>
              <p>Speed to first contact is the single strongest predictor of conversion. AdmitFlow enforces SLA timers so no inquiry sits unanswered.</p>
              <div className="value-stat">Centers that respond within 15 min convert 3× more leads.</div>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Target size={28} />
              </div>
              <h3>Follow-Up That Actually Happens</h3>
              <p>Every lead gets a concrete next action, an owner, and a due date. No more &quot;I thought someone else was handling that.&quot;</p>
              <div className="value-stat">Most lost admits aren&apos;t a bad fit — they&apos;re a missed callback.</div>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Users size={28} />
              </div>
              <h3>Accountability Without Micromanaging</h3>
              <p>Admissions directors see exactly which reps are on track, which leads are breaching SLA, and where the pipeline is stuck.</p>
              <div className="value-stat">Real-time visibility without standing over anyone&apos;s shoulder.</div>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <TrendingUp size={28} />
              </div>
              <h3>No Added Headcount Needed</h3>
              <p>Better process, not more people. One admissions rep with AdmitFlow handles the volume that used to require two.</p>
              <div className="value-stat">Save $40K+/yr versus hiring another admissions coordinator.</div>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <ShieldCheck size={28} />
              </div>
              <h3>Built for Admissions, Not Clinical</h3>
              <p>No diagnosis codes, no therapy notes, no insurance ID storage. AdmitFlow stays in the admissions lane so your team stays compliant.</p>
              <div className="value-stat">Operational intake data only — no HIPAA-heavy clinical fields.</div>
            </div>
          </div>

          <div className="roi-proof-block">
            <DollarSign size={32} />
            <div>
              <p className="roi-proof-headline">At $750/month, recovering one extra admit per quarter delivers 5× ROI.</p>
              <p className="roi-proof-sub">One recovered admit per month? That&apos;s a 19× return. The math isn&apos;t complicated — it&apos;s just expensive to ignore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ROI Calculator Section */}
      <section id="calculator" className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">ROI CALCULATOR</p>
            <h2>Run the numbers with your data.</h2>
            <p>Use your own assumptions. See what even a small improvement in conversion means for your bottom line.</p>
          </div>

          <div className="calculator-wrapper">
            <div className="calc-inputs">
              <h3>Your Numbers</h3>
              <p className="calc-helper">Adjust the sliders — the results update instantly.</p>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label>Monthly Leads</label>
                  <span className="calc-field-value">{monthlyLeads}</span>
                </div>
                <input type="range" min="20" max="500" step="10" value={monthlyLeads} onChange={(e) => setMonthlyLeads(Number(e.target.value))} className="calc-slider" />
                <div className="calc-range-labels"><span>20</span><span>500</span></div>
              </div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label>Current Conversion Rate</label>
                  <span className="calc-field-value">{currentRate}%</span>
                </div>
                <input type="range" min="5" max="40" step="1" value={currentRate} onChange={(e) => setCurrentRate(Number(e.target.value))} className="calc-slider" />
                <div className="calc-range-labels"><span>5%</span><span>40%</span></div>
              </div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label>Improved Conversion Rate</label>
                  <span className="calc-field-value">{improvedRate}%</span>
                </div>
                <input type="range" min={currentRate} max="50" step="1" value={improvedRate} onChange={(e) => setImprovedRate(Number(e.target.value))} className="calc-slider" />
                <div className="calc-range-labels"><span>{currentRate}%</span><span>50%</span></div>
              </div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label>Revenue Per Admit</label>
                  <span className="calc-field-value">${revenuePerAdmit.toLocaleString()}</span>
                </div>
                <input type="range" min="5000" max="50000" step="1000" value={revenuePerAdmit} onChange={(e) => setRevenuePerAdmit(Number(e.target.value))} className="calc-slider" />
                <div className="calc-range-labels"><span>$5K</span><span>$50K</span></div>
              </div>

              <div className="calc-software-cost">
                <span>Software Cost</span>
                <span className="calc-field-value">${softwareCost}/mo</span>
              </div>
            </div>

            <div className="calc-results">
              <h3>Your Projected Impact</h3>

              <div className="calc-result-grid">
                <div className="calc-result-item">
                  <span className="calc-result-label">Current Admits/Mo</span>
                  <span className="calc-result-number">{calcResults.currentAdmits}</span>
                </div>
                <div className="calc-result-item">
                  <span className="calc-result-label">Projected Admits/Mo</span>
                  <span className="calc-result-number calc-result-highlight">{calcResults.projectedAdmits}</span>
                </div>
                <div className="calc-result-item">
                  <span className="calc-result-label">Incremental Admits</span>
                  <span className="calc-result-number">+{calcResults.incrementalAdmits}</span>
                </div>
                <div className="calc-result-item">
                  <span className="calc-result-label">Payback Threshold</span>
                  <span className="calc-result-number">{calcResults.paybackAdmits} admits</span>
                </div>
              </div>

              <div className="calc-result-hero">
                <div className="calc-result-hero-item">
                  <span className="calc-result-label">Incremental Monthly Revenue</span>
                  <span className="calc-result-big">${calcResults.incrementalMonthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="calc-result-hero-item">
                  <span className="calc-result-label">Annualized Revenue Impact</span>
                  <span className="calc-result-big">${calcResults.annualizedRevenue.toLocaleString()}</span>
                </div>
                <div className="calc-result-hero-item calc-roi-box">
                  <span className="calc-result-label">Monthly ROI</span>
                  <span className="calc-result-roi">{calcResults.monthlyROI > 0 ? `${Math.round(calcResults.monthlyROI * 100)}%` : '—'}</span>
                </div>
              </div>

              <p className="calc-interpretation">
                {calcResults.incrementalAdmits > 0
                  ? `With a ${improvedRate - currentRate} percentage-point improvement in conversion, your team would recover ~${calcResults.incrementalAdmits} additional admits per month — worth $${calcResults.incrementalMonthlyRevenue.toLocaleString()} in monthly revenue against a $${softwareCost} software cost.`
                  : 'Increase the improved conversion rate above your current rate to see projected results.'}
              </p>

              <p className="calc-disclaimer">
                * Estimates are illustrative and based on your inputs. Actual results depend on market conditions, team execution, and lead quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Pricing Section */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">SIMPLE PRICING</p>
            <h2>Less than the cost of one lost admit.</h2>
            <p>One plan. Everything included. No per-seat fees.</p>
          </div>

          <div className="pricing-card-wrapper">
            <div className="pricing-card glass-panel">
              {/* Billing Toggle */}
              <div className="pricing-toggle-wrapper">
                <button
                  className={`pricing-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`pricing-toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly
                  <span className="pricing-discount-badge">-10%</span>
                </button>
              </div>

              {/* Price Display */}
              <div className="pricing-header">
                <div className="pricing-plan-name">AdmitFlow OS</div>
                <div className="pricing-amount">
                  <span className="pricing-dollar">$</span>
                  <span className="pricing-number">{totalPrice.toLocaleString()}</span>
                  <span className="pricing-period">/mo</span>
                </div>
              </div>

              <div className="pricing-free-trial">
                <strong>Includes 14-Day Free Trial</strong>
                <span>Full access, cancel anytime</span>
              </div>

              <p className="pricing-description">
                Everything you need to run admissions intake at {locations > 1 ? `${locations} locations` : '1 location'}.
              </p>

              {/* Location Slider */}
              <div className="pricing-slider-box">
                <div className="pricing-slider-header">
                  <span>Locations</span>
                  <span className="pricing-slider-value">{locations}</span>
                </div>
                <div className="pricing-slider-controls">
                  <button className="pricing-slider-btn" onClick={() => setLocations(Math.max(1, locations - 1))}>
                    <Minus size={16} />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={locations}
                    onChange={(e) => setLocations(Number(e.target.value))}
                    className="calc-slider"
                  />
                  <button className="pricing-slider-btn" onClick={() => setLocations(Math.min(10, locations + 1))}>
                    <Plus size={16} />
                  </button>
                </div>
                <div className="pricing-per-loc">${pricePerLocation}/location/mo</div>
              </div>

              {/* Feature List */}
              <ul className="pricing-features">
                {[
                  'Unlimited Intakes',
                  'SLA Timers & Breach Alerts',
                  'Team Reports & Analytics',
                  'Client-Side Encryption',
                  'Admin Settings & User Roles',
                  'Daily Admissions Reporting',
                ].map((f, i) => (
                  <li key={i}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-sla-fresh)', flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/app" className="btn btn-primary pricing-cta">
                Start 14-Day Free Trial
              </Link>

              <p className="pricing-footnote">No credit card required to start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Trust / Compliance Section */}
      <section className="section section-glass">
        <div className="container">
          <div className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
            <ShieldCheck size={300} style={{ position: 'absolute', top: '-50px', right: '-50px', color: 'var(--color-brand)', opacity: 0.1, transform: 'rotate(15deg)' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', position: 'relative', zIndex: 10 }}>Built to keep intake operational, not clinical.</h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '2.5rem', maxWidth: '800px', position: 'relative', zIndex: 10 }}>
              We actively prevent your admissions workflow from becoming a HIPAA liability. AdmitFlowAI uses client-side encryption for contact info and strictly bans the collection of heavy clinical data in the intake process.
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

      {/* 10. CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Stop losing admits to missed follow-ups.</h2>
          <p>One recovered admit pays for AdmitFlow OS for 20 months. Start proving it today.</p>
          <Link href="/app" className="btn btn-primary">
            Start Your First Intake
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>AdmitFlowAI</div>
        <p style={{ fontSize: '0.875rem' }}>© {new Date().getFullYear()} AdmitFlowAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
