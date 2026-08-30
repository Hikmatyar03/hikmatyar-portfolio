"use client";

import { useState, useRef, useEffect, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

// ── Project type choices — maps to the three service pillars + a safe default
const PROJECT_TYPES = [
  { id: "brand-identity", label: "Brand & Identity" },
  { id: "campaign-content", label: "Campaign & Content" },
  { id: "growth-automation", label: "Growth & Automation" },
  { id: "not-sure", label: "Not sure yet" },
] as const;

type ProjectTypeId = (typeof PROJECT_TYPES)[number]["id"];
type Step = 1 | 2 | 3 | "success" | "error";

// ── Success message options — pick one before launch ──────────────────────
// Option A: "Got it. I'll read this properly and come back to you within 48 hours."
// Option B: "Received. Give me a day or two, and I'll come back with thoughts."
// Option C: "I've got your message. Looking forward to hearing more."
// ──────────────────────────────────────────────────────────────────────────
const SUCCESS_MESSAGE =
  "Got it. I'll read this properly and come back to you within 48 hours.";

// ── UI-transition tier: 250-450ms, cubic-bezier(0.4, 0, 0.2, 1)
const UI_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const UI_DURATION = 0.35;

const STEP_LABELS: Record<number, string> = {
  1: "Project type",
  2: "Your details",
  3: "Message",
};

export default function ContactFlow() {
  const prefersReducedMotion = useReducedMotion();
  const rm = prefersReducedMotion;

  const [step, setStep] = useState<Step>(1);
  const [projectType, setProjectType] = useState<ProjectTypeId | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  // Auto-focus first focusable element on step change + announce step
  useEffect(() => {
    if (step === 2 && nameRef.current) {
      setTimeout(() => nameRef.current?.focus(), 350); // after transition
    }
    if (step === 3 && messageRef.current) {
      setTimeout(() => messageRef.current?.focus(), 350);
    }
    if (liveRegionRef.current && typeof step === "number") {
      liveRegionRef.current.textContent = `Step ${step} of 3: ${STEP_LABELS[step]}`;
    }
    if (step === "success" && liveRegionRef.current) {
      liveRegionRef.current.textContent = SUCCESS_MESSAGE;
    }
  }, [step]);

  // ── Step variants — slide + fade (UI-transition tier)
  const stepVariants = {
    initial: { opacity: 0, x: rm ? 0 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: rm ? 0 : -20 },
  };

  const stepTransition = {
    duration: rm ? 0.01 : UI_DURATION,
    ease: UI_EASE,
  };

  // ── Advance step 1 → 2
  const handleStep1Continue = () => {
    if (!projectType) return;
    setStep(2);
  };

  // ── Advance step 2 → 3
  const handleStep2Continue = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Please enter your name.";
    if (!email.trim()) errors.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) setStep(3);
  };

  // ── Submit
  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!message.trim()) errors.message = "Please write a short message.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectType, name, email, message }),
      });

      if (res.ok) {
        setStep("success");
      } else {
        setStep("error");
      }
    } catch {
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (error?: string) =>
    [
      "w-full bg-white/[0.03] border rounded-full px-6 py-3.5 font-body text-body text-text placeholder-text/30",
      "transition-all duration-micro ease-out outline-none",
      "focus:border-accent focus:bg-white/[0.06]",
      error ? "border-accent/80" : "border-white/[0.1]",
    ].join(" ");

  const labelClass =
    "font-body text-eyebrow uppercase tracking-widest text-text/50 block mb-3";

  return (
    <div className="container pt-32 md:pt-40 pb-24 md:pb-32">
      {/* Screen-reader live region — step announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="grid grid-cols-mobile gap-grid-mobile md:grid-cols-tablet md:gap-grid-tablet lg:grid-cols-desktop lg:gap-grid-laptop xl:gap-grid-desktop">
        {/* Page header */}
        <div className="col-span-4 md:col-span-5 lg:col-span-8 mb-14 md:mb-16">
          <SectionLabel className="mb-4">
            Contact
          </SectionLabel>
          <h1
            className="font-display text-display text-text"
            style={{ lineHeight: 0.9 }}
          >
            Tell me what you&rsquo;re
            <br />
            working on.
          </h1>
        </div>

        {/* ── Form area in rounded-3xl glass card ── */}
        <div className="col-span-4 md:col-span-5 lg:col-span-8 p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">

          {/* Step indicator — only shown during form steps */}
          {typeof step === "number" && (
            <div
              className="flex items-center gap-3 mb-10 pb-6 border-b border-white/[0.06]"
              aria-hidden="true"
            >
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-3">
                  <div
                    className={[
                      "h-1 rounded-full transition-all duration-ui ease-ui",
                      n === 1 ? "w-10" : "w-8",
                      step >= n ? "bg-accent" : "bg-white/[0.1]",
                    ].join(" ")}
                  />
                  <p
                    className={[
                      "font-body text-eyebrow uppercase tracking-widest transition-colors duration-ui ease-ui",
                      step === n ? "text-accent" : "text-text/30",
                    ].join(" ")}
                  >
                    {n}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Animated step container ── */}
          <AnimatePresence mode="wait" initial={false}>

            {/* ─── STEP 1 — Project type ─── */}
            {step === 1 && (
              <motion.div
                key="step-1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
              >
                <fieldset className="border-0 m-0 p-0">
                  <legend className={`${labelClass} mb-6`}>
                    What type of project?
                  </legend>

                  <div className="flex flex-col gap-3 mb-10">
                    {PROJECT_TYPES.map((type) => {
                      const isActive = projectType === type.id;
                      return (
                        <button
                          key={type.id}
                          id={`${formId}-type-${type.id}`}
                          aria-pressed={isActive}
                          onClick={() => setProjectType(type.id)}
                          data-cursor="true"
                          data-cursor-text="Select"
                          className={[
                            "text-left font-body text-body py-4 px-6 rounded-2xl border",
                            "transition-all duration-ui ease-ui",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                            isActive
                              ? "border-accent text-accent bg-accent/[0.08] shadow-sm"
                              : "border-white/[0.1] bg-white/[0.02] text-text/70 hover:border-white/[0.25] hover:bg-white/[0.05] hover:text-text",
                          ].join(" ")}
                        >
                          {type.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleStep1Continue}
                    disabled={!projectType}
                    id={`${formId}-step1-continue`}
                    data-cursor="true"
                    data-cursor-text="Next"
                    className="font-body text-eyebrow uppercase tracking-widest bg-accent text-bg px-7 py-3.5 rounded-full shadow-[0_0_20px_rgba(255,74,74,0.3)] transition-all duration-micro ease-out hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    Continue →
                  </button>
                </fieldset>
              </motion.div>
            )}

            {/* ─── STEP 2 — Name + email ─── */}
            {step === 2 && (
              <motion.div
                key="step-2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
              >
                <div className="flex flex-col gap-6 mb-10">
                  <div>
                    <label htmlFor={`${formId}-name`} className={labelClass}>
                      Name
                    </label>
                    <input
                      ref={nameRef}
                      id={`${formId}-name`}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="How should I address you?"
                      autoComplete="name"
                      className={inputClass(fieldErrors.name)}
                      aria-describedby={
                        fieldErrors.name ? `${formId}-name-error` : undefined
                      }
                    />
                    {fieldErrors.name && (
                      <p
                        id={`${formId}-name-error`}
                        role="alert"
                        className="font-body text-eyebrow uppercase tracking-widest text-accent mt-2 ml-4"
                      >
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${formId}-email`} className={labelClass}>
                      Email
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Where should I reply?"
                      autoComplete="email"
                      className={inputClass(fieldErrors.email)}
                      aria-describedby={
                        fieldErrors.email ? `${formId}-email-error` : undefined
                      }
                    />
                    {fieldErrors.email && (
                      <p
                        id={`${formId}-email-error`}
                        role="alert"
                        className="font-body text-eyebrow uppercase tracking-widest text-accent mt-2 ml-4"
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    id={`${formId}-step2-back`}
                    className="font-body text-eyebrow uppercase tracking-widest border border-white/[0.12] bg-white/[0.03] text-text/60 px-6 py-3.5 rounded-full transition-all duration-micro ease-out hover:border-white/[0.25] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleStep2Continue}
                    id={`${formId}-step2-continue`}
                    className="font-body text-eyebrow uppercase tracking-widest bg-accent text-bg px-7 py-3.5 rounded-full shadow-[0_0_20px_rgba(255,74,74,0.3)] transition-all duration-micro ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3 — Message ─── */}
            {step === 3 && (
              <motion.div
                key="step-3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
              >
                <div className="mb-10">
                  <label
                    htmlFor={`${formId}-message`}
                    className={labelClass}
                  >
                    What&rsquo;s the project?
                  </label>
                  <textarea
                    ref={messageRef}
                    id={`${formId}-message`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="A few sentences is enough — what you're building, where you're stuck, or what you want to achieve."
                    rows={5}
                    maxLength={600}
                    className={[
                      "w-full bg-white/[0.03] border rounded-2xl p-5 font-body text-body text-text",
                      "placeholder-text/30 resize-none outline-none",
                      "transition-all duration-micro ease-out focus:border-accent focus:bg-white/[0.06]",
                      fieldErrors.message ? "border-accent/80" : "border-white/[0.1]",
                    ].join(" ")}
                    aria-describedby={
                      fieldErrors.message
                        ? `${formId}-message-error`
                        : `${formId}-message-count`
                    }
                  />
                  <div className="flex items-center justify-between mt-2">
                    {fieldErrors.message ? (
                      <p
                        id={`${formId}-message-error`}
                        role="alert"
                        className="font-body text-eyebrow uppercase tracking-widest text-accent ml-2"
                      >
                        {fieldErrors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p
                      id={`${formId}-message-count`}
                      className="font-body text-eyebrow uppercase tracking-widest text-text/30"
                      aria-label={`${message.length} of 600 characters used`}
                    >
                      {message.length}/600
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    id={`${formId}-step3-back`}
                    className="font-body text-eyebrow uppercase tracking-widest border border-white/[0.12] bg-white/[0.03] text-text/60 px-6 py-3.5 rounded-full transition-all duration-micro ease-out hover:border-white/[0.25] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    id={`${formId}-submit`}
                    aria-busy={loading}
                    className="font-body text-eyebrow uppercase tracking-widest bg-accent text-bg px-7 py-3.5 rounded-full shadow-[0_0_20px_rgba(255,74,74,0.3)] transition-all duration-micro ease-out hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {loading ? "Sending…" : "Send it →"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── SUCCESS ─── */}
            {step === "success" && (
              <motion.div
                key="success"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
                role="status"
              >
                <p
                  className="font-display text-text mb-6"
                  style={{
                    fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {SUCCESS_MESSAGE}
                </p>
                <p className="font-body text-body text-text/50">
                  I&rsquo;ll reply to <span className="text-text">{email}</span>.
                </p>
              </motion.div>
            )}

            {/* ─── ERROR ─── */}
            {step === "error" && (
              <motion.div
                key="error"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
                role="alert"
              >
                <p className="font-body text-body-lg text-text/80 leading-relaxed mb-6">
                  Something didn&rsquo;t send — no data was lost. Try again
                  below, or reach me directly at{" "}
                  <a
                    href="mailto:hikmodesiner03@gmail.com"
                    className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    hikmodesiner03@gmail.com
                  </a>
                  .
                </p>
                <button
                  onClick={() => setStep(3)}
                  id={`${formId}-retry`}
                  className="font-body text-eyebrow uppercase tracking-widest border border-white/[0.12] bg-white/[0.03] text-text px-6 py-3 rounded-full transition-all duration-micro ease-out hover:border-white/[0.25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Try again
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right col — quiet context on desktop */}
        <div className="hidden lg:block lg:col-span-3 lg:col-start-10 lg:pt-0">
          <p className="font-body text-eyebrow uppercase tracking-widest text-text/25 leading-loose">
            Brand & Identity
            <br />
            Campaign & Content
            <br />
            Growth & Automation
          </p>
          <p className="font-body text-eyebrow uppercase tracking-widest text-text/20 mt-8">
            Replies within 48 h
          </p>
        </div>

      </div>
    </div>
  );
}
