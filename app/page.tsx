"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Circle,
  Cpu,
  FileDown,
  Radar,
  ShieldCheck,
  Trophy,
  Workflow,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Metric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  display?: string;
};

type Layer = {
  title: string;
  detail: string;
};

type Project = {
  slug: string;
  eyebrow: string;
  title: string;
  positioning: string;
  repoUrl?: string;
  liveUrl?: string;
  diagramSrc: string;
  diagramAlt: string;
  problem: string;
  impact: string[];
  stack: string[];
  metrics: Metric[];
  layers: Layer[];
  story: { title: string; body: string }[];
};

type Capability = {
  title: string;
  summary: string;
  href: string;
  external?: boolean;
  cta: string;
};

type AwardImage = {
  title: string;
  file: string;
  note?: string;
};

const projects: Project[] = [
  {
    slug: "qforce",
    eyebrow: "Mission 01",
    title: "QForce",
    positioning: "Operational risk intelligence for financial markets.",
    diagramSrc: "/diagrams/qforce-diagram.png?v=20260518-2",
    diagramAlt: "QForce portfolio intelligence pipeline diagram",
    problem:
      "Traditional stock models treat companies in isolation. QForce modeled market relationships directly, letting signals travel through a dynamic company graph before inference.",
    impact: [
      "Reduced prediction error from 6.1% to 4.9% MAPE.",
      "Reached 82% crash-recall for downside event sensitivity.",
      "Delivered real-time inference through FastAPI in under 2 seconds.",
    ],
    stack: ["Graph Neural Networks", "FastAPI", "Python", "React", "S&P 500 (2018-2025)"],
    metrics: [
      { value: 4.9, suffix: "%", decimals: 1, label: "MAPE" },
      { value: 82, suffix: "%", label: "Crash recall" },
      { value: 2, prefix: "<", suffix: "s", label: "Inference latency" },
    ],
    layers: [
      { title: "Ingestion", detail: "Historical S&P 500 time series and company relationship signals." },
      { title: "Processing", detail: "Graph construction, feature normalization, and dependency-aware representations." },
      { title: "Model", detail: "Graph neural network optimized for market context propagation and crash sensitivity." },
      { title: "Serving", detail: "FastAPI inference endpoint for near real-time predictions and risk outputs." },
      { title: "Dashboard", detail: "Decision-facing UI surfacing trend predictions and operational risk signals." },
    ],
    story: [
      {
        title: "Problem Surface",
        body:
          "Market behavior is relational, but most predictors flatten it into tabular rows. QForce reframed the problem around inter-company dependency, which mattered most during rapid market movement.",
      },
      {
        title: "System Design",
        body:
          "I structured the pipeline so graph building, feature processing, model inference, and API serving could move independently without breaking end-to-end latency.",
      },
      {
        title: "Operational Outcome",
        body:
          "The result was not just a better model score. It was a system that could surface risk faster, with metrics decision-makers could actually act on.",
      },
    ],
  },
  {
    slug: "boardsight",
    eyebrow: "Mission 02",
    title: "BoardSight Copilot",
    positioning: "Agentic meeting intelligence with approval-aware execution.",
    repoUrl: "https://github.com/kagent2704/BOARDSIGHT_COPILOT",
    liveUrl: "https://boardsight-copilot.vercel.app/",
    diagramSrc: "/diagrams/boardsight-diagram.png?v=20260518-2",
    diagramAlt: "BoardSight Copilot workflow and meeting intelligence agent diagram",
    problem:
      "Critical meeting outcomes often vanish into recordings, scattered notes, and unowned follow-ups. BoardSight Copilot turns uploaded or live meetings into structured intelligence, then lets an agent surface, preview, and approve downstream action plans.",
    impact: [
      "Analyzes recorded and live meeting sessions through a multimodal AI pipeline.",
      "Exports JSON, Markdown, PDF, XLSX, transcript CSV, and summary image outputs for review and handoff.",
      "Exposes six approval-aware agent endpoints so actions can be previewed before execution.",
    ],
    stack: ["FastAPI", "faster-whisper", "CLIP", "DeepFace", "YOLO", "Google Agent Builder"],
    metrics: [
      { value: 6, label: "Agent APIs" },
      { value: 6, label: "Export formats" },
      { value: 2, label: "Recorded + live modes" },
    ],
    layers: [
      { title: "Ingestion", detail: "Recorded uploads and live meeting sessions enter as multimodal evidence streams." },
      { title: "Processing", detail: "ASR, visual classification, speaker activity, emotion, attention, and workflow extraction run through the AI pipeline." },
      { title: "Model", detail: "Decision and action understanding are grounded into agent-ready context rather than loose summaries." },
      { title: "Serving", detail: "FastAPI-backed endpoints expose capabilities, context, execution previews, approvals, and status retrieval." },
      { title: "Dashboard", detail: "A copilot interface lets users review meetings, inspect traces, and approve the next operational step." },
    ],
    story: [
      {
        title: "Problem Surface",
        body:
          "Organizations do not just need better meeting notes. They need a system that can understand what happened, identify what matters, and hold off on execution until a human approves the next step.",
      },
      {
        title: "System Design",
        body:
          "BoardSight Copilot separates meeting ingestion, multimodal understanding, structured context assembly, and agent-facing execution previews so the system can move from analysis into action without becoming opaque.",
      },
      {
        title: "Operational Outcome",
        body:
          "The result is an actual AI agent for meetings: one that can answer against grounded meeting context, generate exports, and prepare downstream actions through approval-aware workflows instead of hallucinated automation.",
      },
    ],
  },
  {
    slug: "lytica",
    eyebrow: "Mission 03",
    title: "Lytica",
    positioning: "Analytics automation and decision intelligence.",
    repoUrl: "https://github.com/kagent2704/Lytica",
    diagramSrc: "/diagrams/lytica-diagram.png?v=20260518-2",
    diagramAlt: "Lytica automated analytics workflow diagram",
    problem:
      "Complete analytics workflows still demand too much manual preprocessing, ETL, exploration, visualization, and interpretation. Lytica compressed that fragmented work into a unified, explainable analytics system.",
    impact: [
      "Automated end-to-end ETL and exploratory data analysis from a single workflow.",
      "Used XAI to generate human-readable insights and summaries alongside BI visualizations.",
      "Surfaced trends, anomalies, and predictive recommendations as decision-ready outputs.",
    ],
    stack: ["ETL Automation", "Automated EDA", "Explainable AI", "BI Visualizations", "Reporting Automation"],
    metrics: [
      { value: 1, display: "E2E", label: "Unified pipeline" },
      { value: 1, display: "AI", label: "Insight layer" },
      { value: 1, display: "BI", label: "Dashboard output" },
    ],
    layers: [
      { title: "Ingestion", detail: "Structured datasets and business inputs entering a guided analytics workflow." },
      { title: "Processing", detail: "Automated preprocessing, cleaning, profiling, and exploratory analysis." },
      { title: "Model", detail: "Explainable analytics and recommendation logic for trends, anomalies, and interpretation." },
      { title: "Serving", detail: "Report generation, dashboard assembly, and reusable analytics outputs." },
      { title: "Dashboard", detail: "Business-facing interface surfacing insights without requiring deep technical expertise." },
    ],
    story: [
      {
        title: "Problem Surface",
        body:
          "Many teams want analytics, but not everyone has time to wrangle raw data, run ETL, design dashboards, and interpret outputs from scratch. Lytica treated the whole analytics workflow as the product.",
      },
      {
        title: "System Design",
        body:
          "I positioned Lytica as an end-to-end decision-intelligence layer: ETL, preprocessing, EDA, BI visualization, human-readable XAI summaries, reporting, and explainable recommendations in one pipeline.",
      },
      {
        title: "Operational Outcome",
        body:
          "Instead of shipping isolated charts, the system aims to deliver usable intelligence faster, with automation doing the repetitive work and XAI making the outputs easier for people to understand and act on.",
      },
    ],
  },
  {
    slug: "zerotrace",
    eyebrow: "Mission 04",
    title: "ZeroTrace",
    positioning: "Secure enterprise communication with intelligent threat detection.",
    repoUrl: "https://github.com/kagent2704/ZEROTRACE",
    diagramSrc: "/diagrams/zerotrace-diagram.png?v=20260518-2",
    diagramAlt: "ZeroTrace secure enterprise communication diagram",
    problem:
      "Sensitive organizational communication often runs through platforms optimized for convenience rather than privacy. ZeroTrace was built as a security-first communication layer with controlled exposure and threat visibility.",
    impact: [
      "Reached 95% threat-detection accuracy across suspicious communication patterns.",
      "Flagged anomaly cases including abnormally large payloads and rapid spam across multiple users in short time windows.",
      "Combined encrypted peer-to-peer messaging, TTL lifecycles, and audit controls in one enterprise-ready system.",
    ],
    stack: ["AES-256", "RSA", "SHA", "Threat Detection", "P2P Messaging", "TTL Messaging"],
    metrics: [
      { value: 95, suffix: "%", label: "Threat detection" },
      { value: 2, display: "2+", label: "Anomaly classes" },
      { value: 1, display: "TTL", label: "Message control" },
    ],
    layers: [
      { title: "Ingestion", detail: "Secure message events, metadata, and behavioral patterns from enterprise communication flows." },
      { title: "Processing", detail: "Encryption handling, payload checks, and anomaly feature extraction across message activity." },
      { title: "Model", detail: "Threat detection logic identifying suspicious payload behavior and burst-pattern spam activity." },
      { title: "Serving", detail: "Secure messaging controls, monitoring outputs, and privacy-aware audit pathways." },
      { title: "Dashboard", detail: "Enterprise security surface for threat visibility, communication controls, and incident review." },
    ],
    story: [
      {
        title: "Problem Surface",
        body:
          "Security teams need communication channels that do not force a tradeoff between usability and privacy. ZeroTrace starts from the assumption that sensitive information should have controlled exposure by design.",
      },
      {
        title: "System Design",
        body:
          "I framed the platform around layered encryption, disappearing-message controls, audit modes, and AI-based anomaly detection so that communication security and threat visibility could coexist.",
      },
      {
        title: "Operational Outcome",
        body:
          "The result is a cybersecurity-oriented communication system that does more than send messages. It actively monitors risk patterns while preserving confidentiality and enterprise control.",
      },
    ],
  },
  {
    slug: "damien-os",
    eyebrow: "Mission 05",
    title: "Damien OS",
    positioning: "Human intent to executable system workflows.",
    repoUrl: "https://github.com/kagent2704/DAMIEN_OS",
    diagramSrc: "/diagrams/damien-diagram.png?v=20260518-2",
    diagramAlt: "Damien OS AI productivity and operating system diagram",
    problem:
      "Most operating-system tasks remain fragmented, manual, and error-prone. Damien OS introduced an orchestration layer that could interpret intent, structure commands, and execute safely.",
    impact: [
      "Parsed voice and text intent into structured JSON commands.",
      "Enabled Python-based automation across files, browser actions, and Excel workflows.",
      "Maintained SQLite audit logs with confirmations and kill-switch protection.",
    ],
    stack: ["LLM Intent Parsing", "Python Automation", "SQLite", "Speech I/O", "Flask", "Streamlit"],
    metrics: [
      { value: 1, prefix: "~", suffix: "x", label: "Unified workflow layer" },
      { value: 100, suffix: "%", label: "Auditable execution path" },
      { value: 2, label: "Safety rails" },
    ],
    layers: [
      { title: "Ingestion", detail: "Voice and text capture through ASR-enabled multi-modal input." },
      { title: "Processing", detail: "LLM parsing into structured command JSON with task-level intent mapping." },
      { title: "Model", detail: "Intent resolution and action planning with explicit confirmation checkpoints." },
      { title: "Serving", detail: "Python execution engine for OS, browser, file, and spreadsheet automation." },
      { title: "Dashboard", detail: "Interactive UI and SQLite-backed logs for traceability, analytics, and rollback awareness." },
    ],
    story: [
      {
        title: "Problem Surface",
        body:
          "The hard part was not automation itself. It was preserving control while translating messy human instructions into reliable executable steps.",
      },
      {
        title: "System Design",
        body:
          "I designed the system around structured intent, modular execution, and a trace-first data layer so actions could stay safe, inspectable, and extensible.",
      },
      {
        title: "Operational Outcome",
        body:
          "Damien OS made workflows conversational without becoming opaque, balancing speed with safety through confirmations, logging, and an emergency kill-switch.",
      },
    ],
  },
];

const capabilities: Capability[] = [
  {
    title: "Real-Time ML",
    summary: "Best shown through a model pipeline with metrics, latency, architecture, and a clear decision surface.",
    href: "#qforce",
    cta: "See QForce",
  },
  {
    title: "Decision Intelligence",
    summary: "Best shown through an agent that turns meetings into grounded context, structured outputs, and approval-aware execution plans.",
    href: "https://github.com/kagent2704/BOARDSIGHT_COPILOT",
    external: true,
    cta: "Open Repo",
  },
  {
    title: "Workflow Automation",
    summary: "Best shown through an orchestration layer that turns human input into safe, executable actions.",
    href: "https://github.com/kagent2704/DAMIEN_OS",
    external: true,
    cta: "Open Repo",
  },
  {
    title: "Auditability",
    summary: "Best shown through logs, decision traces, approvals, integrity checks, and a defensible evidence trail.",
    href: "https://github.com/kagent2704/ZEROTRACE",
    external: true,
    cta: "Open Repo",
  },
  {
    title: "Scalable APIs",
    summary: "Best shown through a serving layer with clean contracts, fast responses, and production-minded backend design.",
    href: "https://github.com/kagent2704/Lytica",
    external: true,
    cta: "Open Repo",
  },
];

const achievementSignals = [
  "Winner — Smart India Hackathon 2025",
  "Winner — HackMIT 2025",
  "MIT-WPU Student Achiever Award 2025, 2026",
  "Winner — CACC Coders' Arena",
  "IEEE Publications x2",
  "State-Level Lawn Tennis Champion (Women’s Open)",
];

const awardPreviewSlots: AwardImage[] = [
  { title: "Smart India Hackathon", file: "/gallery-sih.jpg", note: "National-winning team moment" },
  { title: "Student Achiever Award", file: "/gallery-achiever.jpeg", note: "MIT-WPU recognition" },
  { title: "Lawn Tennis Championship", file: "/award-tennis.jpg", note: "State-level title moment" },
];

const awardGalleryImages: AwardImage[] = [
  ...awardPreviewSlots,
  { title: "Visionary Vanguard Team", file: "/gallery-team-2.jpg", note: "Team photo and collaboration" },
  { title: "AIU Tennis Squad", file: "/gallery-aiu.jpg", note: "Team tennis lineup" },
  { title: "AIU Squad Portrait", file: "/gallery-aiu1.jpg", note: "Tournament team portrait" },
  { title: "Lawn Tennis Winner", file: "/gallery-vsm2.jpeg", note: "Trophy presentation" },
  { title: "Student Achiever Trophy", file: "/gallery-trophy.jpeg", note: "Award close-up" },
  { title: "Certificate of Honour", file: "/gallery-cdc.jpg", note: "Career Development Centre recognition" },
  { title: "SIH Special Appreciation", file: "/gallery-span.jpg", note: "Special appreciation and trophy" },
  { title: "SIH Achievement Certificate", file: "/gallery-certificate.jpeg", note: "Winner recognition certificate" },
  { title: "Spandan Winner Stage", file: "/gallery-spandan.jpg", note: "Stage recognition moment" },
  { title: "Karad Recognition", file: "/gallery-karad.jpg", note: "Recognition with leadership" },
  { title: "Karad Delegation", file: "/gallery-karad1.jpg", note: "Delegation and felicitation" },
  { title: "Me with the Trophy", file: "/gallery-vsm1.jpg", note: "Trophy presentation portrait" },
  { title: "Tennis Action Shot I", file: "/gallery-tennis-action-1.jpg", note: "Live on-court action" },
  { title: "Tennis Action Shot II", file: "/gallery-tennis-action-2.jpg", note: "Serve sequence" },
  { title: "Tennis Action Shot III", file: "/gallery-tennis-action-3.jpg", note: "Match movement" },
];

function MetricCounter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const spring = useSpring(0, { stiffness: 90, damping: 20 });
  const [displayValue, setDisplayValue] = useState(metric.display ?? "0");

  useEffect(() => {
    if (!metric.display && inView) {
      spring.set(metric.value);
    }
  }, [inView, metric.display, metric.value, spring]);

  useMotionValueEvent(spring, "change", (latest) => {
    if (metric.display) {
      return;
    }
    if (metric.decimals) {
      setDisplayValue(latest.toFixed(metric.decimals));
      return;
    }
    setDisplayValue(Math.round(latest).toString());
  });

  return (
    <div ref={ref} className="metric-card">
      <div className="metric-value">
        {metric.prefix ?? ""}
        <span>{displayValue}</span>
        {metric.suffix ?? ""}
      </div>
      <div className="metric-label">{metric.label}</div>
    </div>
  );
}

function ArchitectureDiagram({ layers, slug }: { layers: Layer[]; slug: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.45, once: false });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(layers.length - 1, Math.floor(latest * layers.length));
    setActiveIndex(nextIndex);
  });

  return (
    <div ref={ref} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="section-kicker">Architecture zoom</p>
          <h4 className="text-lg font-medium text-white">Traceable execution pipeline</h4>
        </div>
        <div className="rounded-full border border-blue-300/25 bg-blue-300/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-blue-100">
          {slug}
        </div>
      </div>
      <div className="relative grid gap-4 md:grid-cols-5">
        {layers.map((layer, index) => {
          const isActive = index <= activeIndex;

          return (
            <motion.div
              key={layer.title}
              className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#090b10] p-4"
              animate={{
                opacity: inView ? (isActive ? 1 : 0.35) : 0.3,
                boxShadow: isActive
                  ? "0 0 0 1px rgba(120,255,214,0.22), 0 12px 30px rgba(0,0,0,0.28)"
                  : "0 0 0 1px rgba(255,255,255,0.06), 0 12px 30px rgba(0,0,0,0.18)",
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Circle size={10} className="text-blue-300" />
              </div>
              <p className="mb-2 text-sm font-medium text-white">{layer.title}</p>
              <p className="text-sm leading-6 text-white/62">{layer.detail}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function HorizontalCapabilityRail() {
  return (
    <section className="relative border-y border-white/8 bg-[#06080d] py-14 md:py-18">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="section-kicker">Systems I Build</p>
            <h2 className="max-w-2xl text-3xl font-medium text-white md:text-5xl">
              Real products for ambiguous environments, not portfolio exercises.
            </h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 text-white/55 md:block">
            These are the recurring patterns across my best work: turning messy inputs into systems people can
            trust, run, and act on.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              whileHover={{ rotateX: 6, rotateY: -8, y: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="group relative min-h-[19rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(120,255,214,0.15),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 md:min-h-[20rem] md:p-7"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)] opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/42">
                    Capability {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.26em] text-white/38">
                    Core pattern
                  </span>
                </div>
                <div className="space-y-4">
                  <p className="max-w-[12rem] text-[2.55rem] font-medium leading-[0.92] tracking-[-0.05em] text-white md:max-w-[11rem] md:text-[3rem]">
                    {capability.title}
                  </p>
                  <p className="max-w-md text-sm leading-6 text-white/58">
                    {capability.summary}
                  </p>
                  <a
                    href={capability.href}
                    target={capability.external ? "_blank" : undefined}
                    rel={capability.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-300/8 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-blue-100/85 transition hover:border-blue-300/35 hover:bg-blue-300/12"
                  >
                    {capability.cta}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionSection({ project, index }: { project: Project; index: number }) {
  return (
    <section className="mission-shell" id={project.slug}>
      <div className="mission-grid">
        <div className="mission-sticky">
          <p className="section-kicker">{project.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-medium text-white md:text-6xl">{project.title}</h2>
          <p className="mt-4 max-w-md text-lg leading-8 text-blue-100/84">{project.positioning}</p>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/62">{project.problem}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/78 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                Open Repo
                <ArrowUpRight size={14} />
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-300/8 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-blue-100/85 transition hover:border-blue-300/35 hover:bg-blue-300/12"
              >
                Open Agent
                <ArrowUpRight size={14} />
              </a>
            ) : null}
            <a
              href={project.diagramSrc}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-300/12 bg-blue-300/6 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-blue-100/78 transition hover:border-blue-300/25 hover:bg-blue-300/10"
            >
              Open Diagram
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="mt-8 grid gap-3">
            {project.metrics.map((metric) => (
              <MetricCounter key={metric.label} metric={metric} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="rounded-full border border-white/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/62">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mission-flow">
          <motion.div
            initial={{ opacity: 0.55, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mission-card"
          >
            <p className="card-label">Compact brief</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.impact.map((line) => (
                <div key={line} className="rounded-full border border-blue-300/20 bg-blue-300/8 px-4 py-2 text-sm text-blue-100/84">
                  {line}
                </div>
              ))}
            </div>
          </motion.div>

          {project.story.map((entry, storyIndex) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0.3, scale: 0.95, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, delay: storyIndex * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mission-card"
            >
              <p className="card-label">{["Problem", "System Design", "Impact"][storyIndex] ?? `Panel ${storyIndex + 1}`}</p>
              <h3 className="mt-4 text-2xl font-medium text-white">{entry.title}</h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/67">{entry.body}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0.35, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mission-card"
          >
            <p className="card-label">Project diagram</p>
            <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.02]">
              <Image
                src={project.diagramSrc}
                alt={project.diagramAlt}
                width={1600}
                height={1200}
                unoptimized
                className="h-auto w-full object-cover"
                sizes="(max-width: 900px) 100vw, 70vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0.35, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mission-card"
          >
            <ArchitectureDiagram layers={project.layers} slug={project.slug} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0.25, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mission-card"
          >
            <p className="card-label">Mission log</p>
            <div className="mt-6 grid gap-4">
              {project.impact.map((line, lineIndex) => (
                <div
                  key={line}
                  className="flex items-start gap-4 rounded-[1.25rem] border border-white/8 bg-black/30 p-4 text-sm leading-7 text-white/68"
                >
                  <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-blue-200/85">
                    {String(index + 1)}.{lineIndex + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [activeAwardIndex, setActiveAwardIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [0.9, 0.2]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".boot-line",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" },
      );
      gsap.fromTo(
        ".hero-chip",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, delay: 0.35, ease: "power2.out" },
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (activeAwardIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveAwardIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveAwardIndex((current) =>
          current === null ? 0 : (current + 1) % awardGalleryImages.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveAwardIndex((current) =>
          current === null
            ? awardGalleryImages.length - 1
            : (current - 1 + awardGalleryImages.length) % awardGalleryImages.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAwardIndex]);

  const iconMap = useMemo(
      () => [Radar, ShieldCheck, Workflow, Trophy, Cpu, Trophy],
      [],
  );
  const activeAwardImage = activeAwardIndex === null ? null : awardGalleryImages[activeAwardIndex];

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <motion.div className="grid-backdrop" style={{ y: gridY, opacity: gridOpacity }} />

      <section ref={heroRef} className="relative isolate overflow-hidden px-5 pb-24 pt-5 md:px-8 md:pb-32 md:pt-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="top-shell">
            <div className="flex items-center gap-3">
              <span className="status-dot" />
              <span>Operational AI Systems Portfolio</span>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">Data / ML / Backend / Automation</div>
          </div>

          <div className="relative mt-12 grid gap-12 md:mt-20 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-300/8 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-blue-100/80">
                <span className="status-dot" />
                Mission-ready portfolio
              </div>

              <div className="space-y-3">
                <p className="boot-line section-kicker">Mission profile</p>
                <h1 className="boot-line max-w-4xl text-[3rem] font-medium leading-[0.95] tracking-[-0.04em] text-white md:text-[7rem]">
                  Kashmira Patil
                </h1>
                <p className="boot-line max-w-3xl text-xl leading-9 text-white/78 md:text-3xl md:leading-[1.5]">
                  Building operational intelligence from messy, high-stakes data
                </p>
                <p className="boot-line max-w-2xl text-base leading-8 text-white/58 md:text-lg">
                  I design data-heavy, operational AI systems that transform fragmented inputs into traceable
                  decisions, risk signals, and executable workflows.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a className="hero-cta" href="#missions">
                  View Mission Projects
                </a>
                <a className="hero-cta hero-cta-muted" href="/KASHMIRA_PATIL_RESUME.pdf" download>
                  <FileDown size={16} />
                  Download Resume
                </a>
                <a className="hero-cta hero-cta-muted" href="http://www.github.com/kagent2704" target="_blank" rel="noreferrer">
                  <ArrowUpRight size={16} />
                  GitHub
                </a>
                <a className="hero-cta hero-cta-muted" href="https://www.linkedin.com/in/kashmira-patil" target="_blank" rel="noreferrer">
                  <ArrowUpRight size={16} />
                  LinkedIn
                </a>
                <a
                  className="hero-cta hero-cta-muted"
                  href="https://www.kaggle.com/kashmirapatil"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ArrowUpRight size={16} />
                  Kaggle
                </a>
                <a
                  className="hero-cta hero-cta-muted"
                  href="https://medium.com/@kashmiraspatil/modern-ai-for-dummies-how-ai-detects-cyber-threats-using-lda-gnn-a9b67457b987"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ArrowUpRight size={16} />
                  Medium
                </a>
                <a
                  className="hero-cta hero-cta-muted"
                  href="https://credit-risk-intelligence-dashboard.streamlit.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ArrowUpRight size={16} />
                  Streamlit
                </a>
              </div>

              <div className="mt-16 max-w-5xl text-center md:mx-auto">
                <p className="font-mono text-[11px] uppercase tracking-[0.36em] text-white/38">Primary directive</p>
                <p className="mt-4 text-4xl font-medium leading-tight tracking-[-0.04em] text-white md:text-7xl">
                  Building systems where data becomes action.
                </p>
                <p className="mt-4 text-sm uppercase tracking-[0.28em] text-white/42">
                  Real-time ML. Operational workflows. Decision intelligence.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="hero-panel">
                <div className="hero-panel-header">
                  <span>Achievement archive</span>
                  <span>Live dossier</span>
                </div>
                <div className="grid gap-3">
                  {achievementSignals.map((signal, index) => {
                    const Icon = iconMap[index];
                    return (
                      <div key={signal} className="hero-chip">
                        <Icon size={18} className="text-blue-200" />
                        <span>{signal}</span>
                      </div>
                    );
                  })}
                </div>
                  <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-[#07090d] p-4">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/42">Award gallery</span>
                      <button
                        type="button"
                        onClick={() => setActiveAwardIndex(0)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.05]"
                      >
                        More images
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {awardPreviewSlots.map((slot) => (
                        <button
                          key={slot.title}
                          type="button"
                          onClick={() =>
                            setActiveAwardIndex(
                              awardGalleryImages.findIndex((image) => image.file === slot.file),
                            )
                          }
                          className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem]">
                          <Image
                            src={slot.file}
                            alt={slot.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 20vw"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3">
                            <p className="text-sm text-white/86">{slot.title}</p>
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                              Click to expand
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HorizontalCapabilityRail />

      <section id="missions" className="mx-auto max-w-[1600px] px-5 pb-6 pt-20 md:px-8">
        <p className="section-kicker">Featured Mission Projects</p>
        <h2 className="mt-5 max-w-4xl text-4xl font-medium tracking-[-0.04em] text-white md:text-6xl">
          Proof that complex inputs can be modeled, operationalized, and pushed into decision-ready systems.
        </h2>
      </section>

      {projects.map((project, index) => (
        <MissionSection key={project.slug} project={project} index={index} />
      ))}

      <section className="relative overflow-hidden px-5 pb-24 pt-24 md:px-8 md:pb-32">
        <div className="mx-auto grid max-w-[1600px] gap-8 rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(120,255,214,0.12),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div>
            <p className="section-kicker">Deployment-ready</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-0.04em] text-white md:text-6xl">
              Available for software engineering, data, and AI systems roles
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/65">
              I build where ambiguity meets execution. The environments I care about most are the ones where the
              data is messy, the workflow matters, and the outcome has to hold up in the real world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="hero-cta" href="mailto:kashmiraspatil@gmail.com">
                Start the conversation
              </a>
              <a className="hero-cta hero-cta-muted" href="/KASHMIRA_PATIL_PORTFOLIO.pdf" download>
                Open full portfolio
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/38">Additional signal</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-blue-100/78">Publications</p>
                <p className="mt-3 text-base leading-8 text-white/65">
                  IEEE publications spanning encryption systems and fake-job detection using NLP and machine learning.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-blue-100/78">Leadership</p>
                <p className="mt-3 text-base leading-8 text-white/65">
                  Strategic and Content Head for the CDC Student Body, managing cross-functional execution and continuity.
                </p>
              </div>
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-blue-100/78">Operating principle</p>
                  <p className="mt-3 text-base leading-8 text-white/65">
                    Build for traceability, speed, and consequences. Ship systems that someone can actually run.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-blue-100/78">Live notebooks</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      className="rounded-full border border-blue-300/20 bg-blue-300/8 px-4 py-2 text-sm text-blue-100/84 transition hover:border-blue-300/35 hover:bg-blue-300/12"
                      href="https://www.kaggle.com/code/kashmirapatil/credit-risk-intelligence-system"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Credit Risk Intelligence
                    </a>
                    <a
                      className="rounded-full border border-blue-300/20 bg-blue-300/8 px-4 py-2 text-sm text-blue-100/84 transition hover:border-blue-300/35 hover:bg-blue-300/12"
                      href="https://www.kaggle.com/code/kashmirapatil/ai-powered-bitcoin-market-intelligence-system"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Bitcoin Market Intelligence
                    </a>
                    <a
                      className="rounded-full border border-blue-300/20 bg-blue-300/8 px-4 py-2 text-sm text-blue-100/84 transition hover:border-blue-300/35 hover:bg-blue-300/12"
                      href="https://www.kaggle.com/code/kashmirapatil/ai-powered-fraud-intelligence-system"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Fraud Intelligence
                    </a>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {activeAwardImage ? (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/82 p-5 backdrop-blur-sm"
            onClick={() => setActiveAwardIndex(null)}
          >
            <div
              className="relative mx-auto my-8 w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0a0d12] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] max-h-[calc(100vh-4rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="section-kicker">Award gallery</p>
                  <p className="mt-2 text-2xl font-medium text-white">{activeAwardImage.title}</p>
                  {activeAwardImage.note ? (
                    <p className="mt-2 text-sm text-white/58">{activeAwardImage.note}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveAwardIndex(
                        activeAwardIndex === null
                          ? 0
                          : (activeAwardIndex - 1 + awardGalleryImages.length) % awardGalleryImages.length,
                      )
                    }
                    className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ArrowLeft size={14} />
                      Prev
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveAwardIndex(
                        activeAwardIndex === null
                          ? 0
                          : (activeAwardIndex + 1) % awardGalleryImages.length,
                      )
                    }
                    className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <span className="inline-flex items-center gap-2">
                      Next
                      <ArrowRight size={14} />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAwardIndex(null)}
                    className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/30">
                <Image
                src={activeAwardImage.file}
                alt={activeAwardImage.title}
                width={1800}
                height={1400}
                className="h-auto max-h-[78vh] w-full object-contain"
                sizes="90vw"
                  priority
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {awardGalleryImages.map((image, index) => (
                  <button
                    key={`${image.title}-${image.file}`}
                    type="button"
                    onClick={() => setActiveAwardIndex(index)}
                    className={`relative overflow-hidden rounded-[1rem] border p-2 text-left transition ${
                      index === activeAwardIndex
                        ? "border-white/40 bg-white/[0.06]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[0.8rem]">
                      <Image
                        src={image.file}
                        alt={image.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12vw"
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/82">{image.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
    </main>
  );
}
