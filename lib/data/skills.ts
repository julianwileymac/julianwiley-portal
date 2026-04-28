export interface Skill {
  name: string;
  summary: string;
  url?: string;
  // Lucide-style icon name or emoji fallback (no external image dependency)
  icon: string;
}

export const skills: Skill[] = [
  {
    name: "Python",
    icon: "🐍",
    summary:
      "Primary language for back-end services, data pipelines, and ML tooling. Capable of writing scalable, testable, and maintainable programs.",
    url: "https://python.org",
  },
  {
    name: "Finance",
    icon: "📈",
    summary:
      "Knowledge of financial instruments, macro and microeconomics, and how they influence the behavior of capital markets.",
  },
  {
    name: "Cloud Computing",
    icon: "☁️",
    summary:
      "Hands-on with the major clouds — AWS, GCP, and Azure — for data, ML, and platform workloads.",
  },
  {
    name: "AWS",
    icon: "🟧",
    summary:
      "Designing and operating data-intensive AWS solutions. AWS Solutions Architect — Professional and ML — Specialty certified.",
    url: "https://aws.amazon.com/",
  },
  {
    name: "GCP",
    icon: "🟦",
    summary:
      "Experienced designing solutions on Google Cloud Platform; Professional Solutions Architect exam.",
    url: "https://cloud.google.com",
  },
  {
    name: "Kubernetes",
    icon: "⎈",
    summary:
      "Operate a 5-node hybrid k3s homelab cluster (1 x86 control plane + 4 RPi5 ARM workers) running data, ML, and observability platforms.",
    url: "https://kubernetes.io/",
  },
  {
    name: "Docker",
    icon: "🐳",
    summary:
      "Most programs are dockerized. Experienced with multi-stage and multi-arch builds for ARM64 + amd64 environments.",
    url: "https://www.docker.com/",
  },
  {
    name: "Linux",
    icon: "🐧",
    summary:
      "Daily-driver operating system. Comfortable with bash, systemd, networking, and container internals.",
  },
  {
    name: "Git",
    icon: "🌿",
    summary:
      "Experienced with git-based development workflows, primarily on GitHub with hands-on GitLab experience as well.",
    url: "https://git-scm.com/",
  },
  {
    name: "PySpark",
    icon: "✨",
    summary:
      "Authoring distributed data processing jobs and feature engineering pipelines on EMR for large equities and macro datasets.",
  },
  {
    name: "C++",
    icon: "💠",
    summary:
      "Working knowledge of C/C++ for contest programming and performance-sensitive problem solving.",
  },
  {
    name: "Java",
    icon: "☕",
    summary:
      "Working knowledge of Java for desktop tooling and integrations with Java-based libraries (e.g. AWS Kinesis Producer Library).",
  },
];
