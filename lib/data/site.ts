export interface SocialLink {
  name: string;
  url: string;
  icon: "github" | "linkedin" | "mail" | "twitter" | "external";
}

export const siteData = {
  name: "Julian Wiley",
  nickname: "Julian",
  greeting: "Hi, my name is",
  tagline: "AI/ML Engineer & Data Platform Builder",
  description:
    "Portfolio and technical blog of Julian Wiley — AI/ML engineer and data engineer building enterprise pipelines, MLOps platforms, and quantitative trading systems.",
  copyright: "© 2026 Julian Wiley. All rights reserved.",
  disclaimer:
    "This portal is built with Next.js, Ant Design, and Pro Components. Content is authored by Julian Wiley.",
  avatar: "/images/author/julian.svg",
  resumeUrl: "/files/jwiley_resume.pdf",
  email: "julian@julianwiley.com",
  github: "julianwileymac",
  linkedin: "julian-wiley",
  // Typing carousel lines on the landing page
  summary: [
    "I am an AI/ML Engineer",
    "I design enterprise data and MLOps platforms",
    "I build quantitative research and trading systems",
    "I work with Python, Spark, and AWS",
    "I build observability and incident automation tooling",
    "I enjoy shipping practical AI solutions",
  ],
  social: [
    {
      name: "Email",
      url: "mailto:julian@julianwiley.com",
      icon: "mail",
    },
    {
      name: "GitHub",
      url: "https://github.com/julianwileymac",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/julian-wiley/",
      icon: "linkedin",
    },
  ] as SocialLink[],
} as const;
