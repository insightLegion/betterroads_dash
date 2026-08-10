import React, { useState, useRef } from 'react';
import { GrainGradient } from '@paper-design/shaders-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const termsText = (
  <span style={{ fontSize: 13, color: '#475569' }}>
    By creating an account, you agree to our{' '}
    <a
      href="#terms"
      onClick={(e) => e.preventDefault()}
      style={{ color: '#e0611c', fontWeight: 600, textDecoration: 'underline' }}
    >
      Terms and Services
    </a>{' '}
    and{' '}
    <a
      href="#privacy"
      onClick={(e) => e.preventDefault()}
      style={{ color: '#e0611c', fontWeight: 600, textDecoration: 'underline' }}
    >
      Privacy Policy
    </a>
  </span>
);

export function AuthComponent() {
  const containerRef = useRef(null);
  const downloadBtnRef = useRef(null);

  // GSAP animation for smooth stagger entrance of form fields and card hero
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });
      tl.fromTo('.auth-left-box', { opacity: 0, x: -30 }, { opacity: 1, x: 0 })
        .fromTo('.auth-field', { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.06 }, '-=0.3')
        .fromTo('.auth-right-box', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1 }, '-=0.4');
    },
    { scope: containerRef }
  );

  // GSAP hover animation for the download button
  const handleMouseEnter = () => {
    gsap.to(downloadBtnRef.current, {
      scale: 1.03,
      borderColor: 'rgba(255, 255, 255, 0.65)',
      boxShadow: '0 8px 24px rgba(252, 120, 25, 0.25)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(downloadBtnRef.current, {
      scale: 1,
      borderColor: 'rgba(255, 255, 255, 0.25)',
      boxShadow: 'none',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-[#fafaf9] p-4 text-black antialiased [font-synthesis:none] dark:bg-[#09090b] dark:text-white font-sans relative flex items-center justify-center"
    >
      {/* Navigation Header overlay */}
      <div className="absolute top-6 left-8 right-8 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 rounded-lg bg-[#e0611c] text-white font-black flex items-center justify-center text-xs shadow-sm">
            BR
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
            betterroads<span className="text-[#e0611c]">.</span>
          </span>
        </div>
        <button
          onClick={() => {
            window.location.hash = '#map';
          }}
          className="pointer-events-auto px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold rounded-full transition-all shadow-sm flex items-center gap-1.5"
        >
          ← Back to Map
        </button>
      </div>

      <div
        className="grid w-full max-w-[1280px] gap-6 lg:grid-cols-[0.94fr_1.06fr] pt-12 lg:pt-0"
        style={{ minHeight: 'calc(100vh - 3rem)' }}
      >
        {/* Left Column Form */}
        <div className="auth-left-box flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-12 sm:px-10 dark:border-white/10 dark:bg-[#09090b] lg:px-14 lg:py-16 xl:px-20 shadow-sm">
          <div className="mx-auto w-full max-w-[480px]">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[42px] lg:leading-[1.05]">
                Create an account
              </h1>
              <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                Monitor road health & empower civic action
              </p>
            </div>

            <div className="auth-field mt-8 grid gap-4 sm:grid-cols-2">
              <SocialButton icon={<GoogleIcon />} label="Sign up with Google" />
              <SocialButton icon={<AppleIcon />} label="Sign up with Apple" />
            </div>

            <div
              className="auth-field my-8 text-center text-sm font-semibold text-slate-400"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              OR EMAIL
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.hash = '#map';
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="auth-field">
                  <FieldBox label="First Name" value="Harshit" placeholder="e.g. Harshit" />
                </div>
                <div className="auth-field">
                  <FieldBox label="Last Name" value="Sharma" placeholder="e.g. Sharma" />
                </div>
              </div>

              <div className="auth-field">
                <FieldBox
                  label="Email"
                  value="harshitlog@gmail.com"
                  type="email"
                  placeholder="name@example.com"
                />
              </div>

              <div className="auth-field">
                <FieldBox
                  label="Password"
                  value="*************"
                  type="password"
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="auth-field space-y-3 pt-2">
                <CheckboxLine>
                  <span style={{ fontSize: 13, color: '#475569' }}>
                    I want to receive alerts about ward SLA breaches and road updates
                  </span>
                </CheckboxLine>
                <CheckboxLine>{termsText}</CheckboxLine>
              </div>

              <button
                type="submit"
                className="auth-field mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-[#e0611c] text-base font-bold text-white transition-all hover:bg-[#c85315] shadow-md shadow-orange-600/10 cursor-pointer"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>

        {/* Right Column Shader Hero */}
        <div className="auth-right-box relative flex min-h-[560px] overflow-hidden rounded-2xl bg-black p-8 text-white sm:p-12 lg:min-h-0">
          <GrainGradient
            speed={1.2}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.4}
            intensity={0.6}
            noise={0.2}
            shape="corners"
            frame={2854.5}
            colors={['#FFFFFF', '#FC7819', '#FC7819', '#FFFFFF']}
            colorBack="#00000000"
            className="absolute inset-0 bg-black"
          />

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <h2 className="max-w-[620px] pt-0 text-5xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:pt-12 lg:text-[60px] lg:leading-[0.98]">
              Think fast,
              <br />
              Build better roads
            </h2>

            <a
              ref={downloadBtnRef}
              href="#download"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.preventDefault();
                alert('BetterRoads Mobile App for iOS & Android is launching soon!');
              }}
              className="mb-0 inline-flex h-12 max-w-full items-center gap-3 rounded-xl border border-white/25 px-5 text-base font-bold text-white backdrop-blur-md transition-all xl:mb-16"
            >
              <SmartphoneIcon />
              <span className="truncate whitespace-nowrap">
                Download the BetterRoads App
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialButton({ icon, label }) {
  return (
    <button
      type="button"
      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function FieldBox({ label, value, type = 'text', placeholder }) {
  const [inputValue, setInputValue] = useState(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{label}</span>
      <input
        type={type}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          width: '100%',
          height: '42px',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '0 14px',
          fontSize: '14px',
          background: '#ffffff',
          color: '#0f172a',
          outline: 'none',
          boxShadow: 'none',
          transition: 'all 0.15s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#e0611c';
          e.target.style.boxShadow = '0 0 0 2px rgba(224, 97, 28, 0.15)';
          if (inputValue === value) setInputValue('');
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#cbd5e1';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

function CheckboxLine({ children }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className="relative mt-0.5 size-4 shrink-0">
        <input
          type="checkbox"
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            width: '100%',
            height: '100%',
            borderRadius: '4px',
            border: '1.5px solid #cbd5e1',
            background: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            padding: 0,
          }}
          onChange={(e) => {
            const el = e.target;
            if (el.checked) {
              el.style.background = '#e0611c';
              el.style.borderColor = '#e0611c';
            } else {
              el.style.background = '#ffffff';
              el.style.borderColor = '#cbd5e1';
            }
          }}
        />
        <svg
          viewBox="0 0 12 12"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            padding: '2px',
            color: '#ffffff',
            pointerEvents: 'none',
          }}
          fill="none"
        >
          <path
            d="M3 6.2 5 8.1 9 3.9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}

function SmartphoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
