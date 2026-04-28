export interface Accomplishment {
  name: string;
  timeline: string;
  organization: { name: string; url?: string };
  overview: string;
  certificateURL?: string;
}

export const accomplishments: Accomplishment[] = [
  {
    name: "AWS Certified Solutions Architect — Professional",
    timeline: "Oct 2024",
    organization: {
      name: "Amazon Web Services",
      url: "https://aws.amazon.com/certification/",
    },
    overview:
      "Passed the AWS Certified Solutions Architect — Professional exam with emphasis on advanced cloud architecture and enterprise-scale AWS design patterns.",
  },
  {
    name: "AWS Certified Machine Learning — Specialty",
    timeline: "Aug 2023",
    organization: {
      name: "Amazon Web Services",
      url: "https://aws.amazon.com/certification/",
    },
    overview:
      "Passed the AWS Certified Machine Learning — Specialty exam covering production ML workloads, feature engineering, model deployment, and monitoring on AWS.",
  },
  {
    name: "Deep Learning Specialization",
    timeline: "Feb 2020",
    organization: {
      name: "DeepLearning.AI",
      url: "https://www.deeplearning.ai",
    },
    overview:
      "Completed a five-course deep learning specialization focused on neural network architecture, optimization, and practical model-building workflows.",
  },
];
