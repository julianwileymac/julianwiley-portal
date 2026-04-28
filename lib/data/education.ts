export interface Course {
  name: string;
  achieved?: number;
  outOf?: number;
}

export interface Degree {
  name: string;
  timeframe: string;
  institution: { name: string; url?: string };
  courses?: Course[];
  extracurricularActivities?: string[];
}

export const degrees: Degree[] = [
  {
    name: "B.Sc. in Business Administration",
    timeframe: "2019 — 2022",
    institution: {
      name: "Babson College",
      url: "https://www.babson.edu/",
    },
    courses: [
      { name: "Quantitative Methods for Machine Learning", achieved: 3.75, outOf: 4 },
      { name: "Cryptography", achieved: 3.8, outOf: 4 },
      { name: "Quantitative Analysis of Structural Injustice", achieved: 3.5, outOf: 4 },
      { name: "Business Intelligence and Data Analytics", achieved: 3.75, outOf: 4 },
    ],
    extracurricularActivities: [
      "Technical Lead for Babson's Community of Developers and Entrepreneurs.",
      "Consulted with E-Tower startups to assist development efforts and troubleshoot technical problems.",
      "Served as Lead Developer in small groups working on various academic projects.",
      "Started several startups to gain experience working in small teams across a wide variety of technologies.",
    ],
  },
  {
    name: "Select Graduate Courses",
    timeframe: "2021 — 2022",
    institution: {
      name: "Harvard Extension School",
      url: "https://extension.harvard.edu",
    },
    courses: [
      {
        name: "Cryptography and Identity Access Management in Blockchain and Cloud Applications",
        achieved: 3.5,
        outOf: 4,
      },
      { name: "Deep Learning", achieved: 3.0, outOf: 4 },
      { name: "Dynamic Modeling and Forecasting in Big Data", achieved: 2.0, outOf: 4 },
    ],
  },
  {
    name: "High School Diploma",
    timeframe: "2014 — 2018",
    institution: { name: "Falmouth High School" },
    extracurricularActivities: [
      "Worked on the school's FIRST robotics team (FRC Team 172) for four years on programming, mechanical, and design (leadership) sub-teams.",
      "Mentored students in ZhengZhou, China as part of a FIRST-sponsored program to bring FRC to China.",
      "Attended the FRC World Championship in St. Louis, Missouri.",
    ],
  },
];
