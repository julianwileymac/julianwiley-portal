export interface SoftSkill {
  name: string;
  percentage: number;
  color: string;
}

export const aboutData = {
  designation: "AI/ML Engineer",
  company: {
    name: "KKR",
    url: "https://www.kkr.com",
  },
  summary:
    "I am an AI/ML engineer and data engineer focused on enterprise data platforms, MLOps systems, and quantitative research workflows. I build and scale production data pipelines, observability tooling, and model development platforms on AWS using Python, Spark, and modern ML infrastructure. My work spans financial data engineering, strategy research enablement, and practical AI integration for internal developer productivity.",
  badges: [
    { name: "Leadership", percentage: 85, color: "#2563eb" },
    { name: "Team Work", percentage: 90, color: "#facc15" },
    { name: "Hard Working", percentage: 90, color: "#fb923c" },
    { name: "Communication", percentage: 85, color: "#10b981" },
    { name: "Curiosity", percentage: 95, color: "#7c3aed" },
    { name: "Problem Solving", percentage: 90, color: "#a16207" },
  ] as SoftSkill[],
} as const;
