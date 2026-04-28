export type ProjectStatus = "in-progress" | "completed" | "planned";
export type ProjectCategory = "professional" | "personal";

export interface ProjectDeployment {
  name: string;
  url: string;
  namespace?: string;
  /** Marks LAN-only services not exposed via the Cloudflare Tunnel. */
  internal?: boolean;
}

export interface Project {
  slug: string;
  name: string;
  role: string;
  timeline: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  featured?: boolean;
  technologies: string[];
  tags: string[];
  highlights: string[];
  category: ProjectCategory;
  repo?: string;
  /** Slugs of related blog posts, used to render the Related Posts tab. */
  relatedPosts?: string[];
  /** Live deep-links surfaced on /app/projects/[slug] when the user is authenticated. */
  deployments?: ProjectDeployment[];
}

export const projects: Project[] = [
  {
    slug: "rpi5-kubernetes-cluster",
    name: "Raspberry Pi 5 Kubernetes Cluster",
    role: "Platform Engineer (Personal)",
    timeline: "2025 — Current",
    summary:
      "Hybrid 5-node k3s homelab cluster (1 x86 control plane + 4 RPi5 ARM workers) running data, ML, and observability platforms.",
    description:
      "Self-hosted Kubernetes platform for hosting personal projects, ML experiments, and data pipelines. ingress-nginx + MetalLB + cert-manager for networking; Prometheus / Loki / Jaeger / Grafana for observability; MinIO + PostgreSQL + Redis for data; Argo Workflows + Dagster + MLflow for orchestration and ML lifecycle.",
    status: "in-progress",
    featured: true,
    technologies: ["k3s", "Ansible", "Helm", "Kustomize", "MetalLB", "ingress-nginx", "cert-manager"],
    tags: ["personal", "kubernetes", "homelab", "platform"],
    highlights: [
      "Hybrid amd64 + arm64 cluster with arch-aware scheduling for ingress-nginx and ML workloads.",
      "GitHub-tracked Kustomize root with reusable templates/new-project scaffold for adding services.",
      "Bootstrapped via Ansible playbooks and bootstrap shell scripts for repeatable rebuilds.",
    ],
    category: "personal",
    repo: "https://github.com/julianwileymac/rpi_kubernetes",
    relatedPosts: [
      "rpi5-kubernetes-cluster",
      "ansible-cluster-bootstrap",
      "mdns-node-discovery",
      "observability-stack-k8s",
      "rpi-kustomize-service-map-2026",
    ],
    deployments: [
      { name: "Management UI", url: "http://management.local", namespace: "management" },
      { name: "Grafana", url: "http://grafana.local", namespace: "observability", internal: true },
      { name: "MLflow", url: "http://mlflow.local", namespace: "ml-platform", internal: true },
      { name: "MinIO Console", url: "http://minio.local", namespace: "data-services", internal: true },
    ],
  },
  {
    slug: "agentic-assistants",
    name: "Agentic Assistants — Local-First AI Framework",
    role: "Architect & Engineer (Personal)",
    timeline: "2025 — Current",
    summary:
      "Local-first multi-agent framework with CrewAI / LangGraph orchestration, Dagster control plane, and a Next.js + React Flow architecture builder.",
    description:
      "End-to-end framework for designing, training, evaluating, and serving local agentic systems. Includes a 42-topic examples library, a drag-and-drop neural builder, RAG evaluation harness, repo intelligence ingestion, and Dagster-backed pipeline orchestration.",
    status: "in-progress",
    featured: true,
    technologies: ["Python", "Next.js", "React Flow", "CrewAI", "LangGraph", "Dagster", "MLflow", "Poetry"],
    tags: ["personal", "ai", "agents", "rag", "platform"],
    highlights: [
      "Drag-and-drop neural architecture builder with code export and validation warnings.",
      "Dagster integrated as a first-class control plane with GraphQL fallbacks for partial availability.",
      "42-topic examples library with extras-driven install boundaries for modular dependencies.",
    ],
    category: "personal",
    relatedPosts: [
      "building-agentic-assistants",
      "multi-agent-crewai-langgraph",
      "drag-drop-neural-builder-reactflow",
      "architecture-graph-api-code-export",
      "architecture-node-validation-patterns",
      "examples-library-design-system",
      "examples-library-install-extras-strategy",
      "starter-projects-local-first-playbook",
      "repo-intel-hub-ingestion-patterns",
      "rag-eval-playground-practical-loop",
      "poetry-extras-modular-architecture",
      "webui-package-upgrades-next-reactflow",
      "resolving-langflow-mlflow-conflicts",
      "dagster-integration-control-plane",
      "dagster-api-graphql-fallbacks",
      "dagster-webui-develop-jobs-workflow",
    ],
  },
  {
    slug: "cybersec-dashboard",
    name: "Cybersecurity Dashboard",
    role: "Architect & Engineer (Personal)",
    timeline: "2025 — Current",
    summary:
      "AI-driven security operations hub with planner-worker engine, telemetry collectors, correlation analyzers, and live FastAPI ↔ Next.js streaming.",
    description:
      "Local-first SOC-style dashboard combining agentic planning, traffic tokenization, batched ML inference, and real-time event streaming over WebSockets. Deployed alongside the agentic stack on the rpi_kubernetes cluster with full observability.",
    status: "in-progress",
    technologies: ["Python", "FastAPI", "Next.js", "WebSockets", "PyTorch", "LoRA", "QLoRA", "Kubernetes"],
    tags: ["personal", "security", "ai", "ml", "kubernetes"],
    highlights: [
      "Planner-worker agent engine separating high-level reasoning from collector/analyzer execution.",
      "LoRA/QLoRA fine-tuned models for security-specific telemetry classification.",
      "Real-time event bridge from FastAPI engine to a Next.js operator UI over WebSockets.",
    ],
    category: "personal",
    repo: "https://github.com/julianwileymac/cybersec_dashboard",
    relatedPosts: [
      "cybersecurity-ai-agents",
      "cybersec-engine-planner-worker-design",
      "cybersec-collector-layer-practical-guide",
      "cybersec-analyzer-layer-correlation",
      "traffic-tokenization-for-security-ml",
      "batched-inference-cache-patterns",
      "lora-qlora-security-model-tuning",
      "websocket-event-bridge-fastapi-nextjs",
      "cybersec-kubernetes-observability-stack",
    ],
  },
  {
    slug: "agentic-quant-platform",
    name: "Agentic Quant Platform",
    role: "Architect & Engineer (Personal)",
    timeline: "2025 — Current",
    summary:
      "Quantitative research platform combining Dagster pipelines, vector sync (Milvus + ChromaDB), and CDC-aware ingestion on the homelab k3s cluster.",
    description:
      "Personal lab for productionizing quant research workflows: data ingestion via Argo + Dagster, dual-write vector sync, CDC watermark/replay strategies, DataHub + Iceberg metadata bridging, and homelab-grade RAG infrastructure for research notes.",
    status: "in-progress",
    technologies: ["Dagster", "Argo Workflows", "Milvus", "ChromaDB", "DataHub", "Iceberg", "Flink", "k3s"],
    tags: ["personal", "quant", "data-engineering", "mlops"],
    highlights: [
      "Hybrid Dagster ↔ Argo recipe for routing heavy transforms to scheduled cluster compute.",
      "Dual-write vector sync between Milvus (production) and ChromaDB (local dev) for parity.",
      "CDC sync recipe with explicit watermarks, deltas, and replay windows.",
    ],
    category: "personal",
    relatedPosts: [
      "dagster-on-homelab-k3s",
      "argo-events-crd-discovery-lessons",
      "pipeline-recipe-raw-ingest-minio",
      "pipeline-recipe-hybrid-dagster-argo",
      "vector-sync-milvus-chromadb",
      "cdc-sync-watermark-strategy",
      "datahub-iceberg-metadata-bridge",
      "ragflow-on-rpi-kubernetes",
      "kedro-dagster-pipelines",
    ],
  },
  {
    slug: "algovision-platform",
    name: "AlgoVision Platform",
    role: "Lead Data Engineer",
    timeline: "Sep 2021 — Current",
    summary:
      "End-to-end machine learning platform for quantitative strategy research, training, and deployment on AWS.",
    description:
      "Developed an end-to-end system for stock-prediction and strategy-development workflows, including data-lake architecture, large-scale preprocessing, and real-time deployment pathways for model and strategy containers.",
    status: "in-progress",
    featured: true,
    technologies: ["Python", "PySpark", "AWS EMR", "Apache Hive", "AWS"],
    tags: ["professional", "quant", "mlops", "data-engineering", "cloud"],
    highlights: [
      "Created AWS architecture for strategy development with a serverless financial data lake and warehouse.",
      "Cleaned and reformatted 20+ TB of equities prices and 4+ TB of fundamentals and macroeconomic data.",
      "Built deployment architecture for backtested strategies and real-time model/strategy containers.",
    ],
    category: "professional",
  },
  {
    slug: "reinsurance-data-reliability",
    name: "Enterprise Reinsurance Data Reliability Platform",
    role: "Data Engineer",
    timeline: "Dec 2023 — Current",
    summary:
      "Enterprise pipeline reliability and monitoring framework for large-scale reinsurance data operations.",
    description:
      "Built internal data engineering tools to improve reliability and response time for high-volume reinsurance pipelines, including incident automation, operational monitoring, and live metadata visibility.",
    status: "in-progress",
    featured: true,
    technologies: ["Python", "SQL", "Data Warehousing", "Monitoring", "Automation"],
    tags: ["professional", "data-engineering", "platform", "observability"],
    highlights: [
      "Supported 40+ data providers and 1,600+ feeds totaling over $5B in modeled cashflows.",
      "Built four internal tooling projects that reduced data validation and incident-resolution time by ~50%.",
      "Developed a live internal data catalog and centralized resource-monitoring framework.",
    ],
    category: "professional",
  },
  {
    slug: "sql-lineage-llm",
    name: "SQL Lineage Parser with LLM Fallback",
    role: "Data Engineer",
    timeline: "2024 — Current",
    summary:
      "AST-driven SQL lineage extraction system with model-assisted fallback and quality checks.",
    description:
      "Designed and implemented an abstract syntax tree SQL parsing workflow for enterprise query resources, with LLM fallback and LLM-as-a-judge evaluation for edge cases and extraction quality.",
    status: "in-progress",
    technologies: ["Python", "SQL", "Abstract Syntax Trees", "LLMs", "Data Lineage"],
    tags: ["professional", "data-engineering", "llm", "governance"],
    highlights: [
      "Implemented AST-based lineage parsing for enterprise SQL resources.",
      "Added LLM fallback for unsupported patterns and LLM-as-a-judge quality validation.",
      "Improved lineage coverage for internal data warehouse assets.",
    ],
    category: "professional",
  },
  {
    slug: "algoseek-notebook-library",
    name: "AlgoSeek Quant Research Notebook Library",
    role: "Quant and Machine Learning Engineer",
    timeline: "Feb 2022 — Dec 2023",
    summary:
      "Professional notebook library for onboarding and demonstrating ML workflows on proprietary financial data.",
    description:
      "Authored and maintained practical notebooks covering data I/O, preprocessing, feature engineering, model development, and backtesting using AlgoSeek proprietary datasets.",
    status: "completed",
    technologies: ["Python", "Jupyter", "PySpark", "Backtrader", "MLflow"],
    tags: ["professional", "quant", "machine-learning", "education"],
    highlights: [
      "Built onboarding-ready examples for data preparation, model building, and strategy backtesting.",
      "Added mixed-period indicators, trained 3+ models, and evaluated 10+ backtested strategies.",
      "Demonstrated AWS-based MLOps setup for financial data workflows.",
    ],
    category: "professional",
  },
  {
    slug: "intraday-mlops-platform",
    name: "Intraday Trading MLOps Platform",
    role: "Lead Data Engineer",
    timeline: "Apr 2021 — Dec 2023",
    summary:
      "Cloud-native intraday model-development and trading orchestration platform.",
    description:
      "Built a production-oriented MLOps platform for intraday research and trading execution, including cloud data pipelines, feature engineering, model lifecycle workflows, and order/strategy management services.",
    status: "completed",
    technologies: [
      "Python",
      "Spark",
      "Amazon SageMaker",
      "AWS Glue",
      "AWS Kinesis",
      "AWS EMR",
    ],
    tags: ["professional", "quant", "mlops", "streaming", "cloud"],
    highlights: [
      "Developed pipeline tooling to process 6+ TB and convert SAS datasets to Parquet for lake storage.",
      "Built stream-processing and broker-order execution services for strategy management.",
      "Shipped 15 models, 20+ strategies, and 3 portfolio-management algorithms for live/paper trading.",
    ],
    category: "professional",
  },
  {
    slug: "ml4trading-extensions",
    name: "ML4Trading Model Research and Backtesting Extensions",
    role: "Quant Research Intern",
    timeline: "May 2022 — Jan 2023",
    summary:
      "Applied machine-learning research for systematic trading and backtesting framework extensions.",
    description:
      "Contributed model research and engineering support for Machine Learning for Trading by building backtesting integrations and forecasting models for intraday and daily returns and volatility.",
    status: "completed",
    technologies: ["Python", "scikit-learn", "LSTM", "Backtesting", "Time Series"],
    tags: ["professional", "quant", "machine-learning", "research"],
    highlights: [
      "Built backtesting-library plugins that used strategy performance as model cost/loss signals.",
      "Developed gradient-boosted, time-series, and LSTM models for return and volatility forecasting.",
      "Supported ML research efforts tied to the Machine Learning for Trading ecosystem.",
    ],
    category: "professional",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
