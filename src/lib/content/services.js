/**
 * Plivix services — canonical content source.
 * This is read by both the runtime API route and the Supabase seed script.
 */
export const services = [
  {
    slug: "erp-systems",
    title: "ERP Systems",
    title_bn: "ERP সিস্টেম",
    tagline: "One system for stock, sales, accounts and people.",
    tagline_bn: "স্টক, সেলস, হিসাব ও মানুষ — এক সিস্টেমে।",
    category: "Business systems",
    description:
      "Custom ERP built around how your company works. We map your process, replace spreadsheets and disconnected tools, and roll out module by module so your team keeps working while we change the system underneath.",
    description_bn:
      "আপনার কোম্পানির কাজের ধরন অনুযায়ী কাস্টম ERP। আমরা প্রক্রিয়া বুঝে স্প্রেডশিট ও বিচ্ছিন্ন টুল সরিয়ে একটি একটি মডিউল চালু করি, যাতে নিচে সিস্টেম বদলালেও আপনার টিম কাজ চালিয়ে যেতে পারে।",
    features: [
      "Inventory, sales, purchasing, accounting",
      "HR, payroll and attendance",
      "Multi-branch, multi-warehouse, multi-currency",
      "Bangla and English screens and invoices",
      "Role permissions and audit trail",
      "Data migration and staff training",
    ],
    tech_stack: ["Next.js", "Node.js", "Postgres", "Docker", "Redis"],
    icon_name: "layers",
    order_index: 1,
    published: true,
  },
  {
    slug: "business-software",
    title: "CRM, HR & POS",
    title_bn: "CRM, HR ও POS",
    tagline: "Focused tools when you do not need a full ERP.",
    tagline_bn: "পুরো ERP না লাগলে প্রয়োজনমতো আলাদা টুল।",
    category: "Business systems",
    description:
      "A customer database, a payroll system or a point-of-sale that fits one department. Each can stand alone and later plug into a larger ERP without a rebuild.",
    description_bn:
      "একটি বিভাগের উপযোগী কাস্টমার ডেটাবেস, পেরোল বা পয়েন্ট-অফ-সেল। প্রতিটি আলাদাভাবে চলে এবং পরে নতুন করে না বানিয়েই বড় ERP-র সাথে যুক্ত করা যায়।",
    features: [
      "Customer and lead tracking",
      "Payroll, leave and payslips",
      "Retail and restaurant POS",
      "Dashboards and scheduled reports",
      "WhatsApp and SMS notifications",
    ],
    tech_stack: ["React", "Node.js", "Postgres", "React Native"],
    icon_name: "briefcase",
    order_index: 2,
    published: true,
  },
  {
    slug: "full-stack-web",
    title: "Full-Stack Web",
    tagline: "Production web platforms that ship and scale.",
    category: "Engineering",
    description:
      "End-to-end web product engineering — from React/Next.js front-ends to typed APIs, databases and observability. We ship design-led, performant, accessible platforms that your team can extend.",
    features: [
      "Next.js 15 App Router + React 19",
      "TypeScript end-to-end",
      "Typed APIs (tRPC / REST / GraphQL)",
      "Postgres + Prisma / Supabase",
      "CI/CD, previews, observability",
      "Lighthouse ≥ 95, WCAG 2.2 AA",
    ],
    tech_stack: ["Next.js", "React", "TypeScript", "Postgres", "Supabase", "Vercel"],
    icon_name: "code",
    order_index: 3,
    published: true,
  },
  {
    slug: "application-development",
    title: "Application Development",
    tagline: "Native-feel mobile and cross-platform apps.",
    category: "Engineering",
    description:
      "Cross-platform mobile apps with React Native and native modules where it counts. Native iOS/Android integrations, offline-first data sync, and App Store / Play Store delivery handled end to end.",
    features: [
      "React Native + Expo",
      "Native modules (Swift / Kotlin)",
      "Offline-first sync",
      "Push, auth, payments",
      "Store submission & release pipelines",
    ],
    tech_stack: ["React Native", "Expo", "Swift", "Kotlin", "Firebase"],
    icon_name: "smartphone",
    order_index: 4,
    published: true,
  },
  {
    slug: "ai-automation",
    title: "AI Automation",
    tagline: "Agentic workflows embedded into your product.",
    category: "Intelligence",
    description:
      "We design, build and operate AI workflows that replace repetitive knowledge work — support triage, content pipelines, sales ops, internal copilots — with evals, guardrails and cost controls from day one.",
    features: [
      "LLM orchestration (LangGraph, AI SDK)",
      "Tool-calling agents with guardrails",
      "RAG + vector retrieval",
      "Evals, tracing, cost controls",
      "Zapier / n8n / custom pipelines",
    ],
    tech_stack: ["OpenAI", "Anthropic", "LangGraph", "Vercel AI SDK", "Pinecone"],
    icon_name: "sparkles",
    order_index: 5,
    published: true,
  },
  {
    slug: "machine-learning",
    title: "Machine Learning",
    tagline: "Custom models, trained and served.",
    category: "Intelligence",
    description:
      "From classical ML to deep learning: forecasting, recommendation, classification, computer vision. We handle the full lifecycle — data pipelines, training, evaluation, deployment and monitoring.",
    features: [
      "PyTorch / scikit-learn / XGBoost",
      "Forecasting + recommendation + CV",
      "Feature stores & pipelines",
      "Model serving (FastAPI, Triton)",
      "Drift monitoring & retraining",
    ],
    tech_stack: ["PyTorch", "scikit-learn", "FastAPI", "Docker", "MLflow"],
    icon_name: "cpu",
    order_index: 6,
    published: true,
  },
  {
    slug: "data-science",
    title: "Data Science",
    tagline: "Turn data into decisions.",
    category: "Intelligence",
    description:
      "Analytics engineering, experimentation, and decision-ready dashboards. We unify messy sources into a trusted semantic layer and surface the metrics that actually move the business.",
    features: [
      "ELT pipelines (dbt, Airbyte)",
      "Warehouse + semantic layer",
      "A/B testing & causal inference",
      "Dashboards (Metabase / Looker)",
      "Data quality SLOs",
    ],
    tech_stack: ["Python", "dbt", "BigQuery", "Postgres", "Metabase"],
    icon_name: "bar-chart",
    order_index: 7,
    published: true,
  },
];
