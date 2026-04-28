export interface ExternalLink {
  name: string;
  url: string;
  description: string;
  category: "social" | "code" | "writing" | "tools";
  icon: string;
}

export const links: ExternalLink[] = [
  {
    name: "GitHub — julianwileymac",
    url: "https://github.com/julianwileymac",
    description: "Personal projects, homelab infrastructure, and open-source experiments.",
    category: "code",
    icon: "github",
  },
  {
    name: "LinkedIn — Julian Wiley",
    url: "https://www.linkedin.com/in/julian-wiley/",
    description: "Professional background, experience, and connection requests.",
    category: "social",
    icon: "linkedin",
  },
  {
    name: "Email",
    url: "mailto:julian@julianwiley.com",
    description: "Best way to reach me for collaboration, opportunities, or questions.",
    category: "social",
    icon: "mail",
  },
  {
    name: "Legacy Blog (Hugo)",
    url: "https://blog.julianwiley.com",
    description: "The original Hugo + Toha blog. Migrating to /blog on this portal.",
    category: "writing",
    icon: "external",
  },
  {
    name: "rpi_kubernetes",
    url: "https://github.com/julianwileymac/rpi_kubernetes",
    description: "Hybrid 5-node k3s homelab cluster manifests, Ansible, and bootstrap scripts.",
    category: "code",
    icon: "github",
  },
  {
    name: "agentic_assistants",
    url: "https://github.com/julianwileymac/agentic_assistants",
    description: "Local-first multi-agent framework with examples, training, and evaluation playgrounds.",
    category: "code",
    icon: "github",
  },
  {
    name: "cybersec_dashboard",
    url: "https://github.com/julianwileymac/cybersec_dashboard",
    description: "AI-driven security operations dashboard with planner-worker engine.",
    category: "code",
    icon: "github",
  },
];
