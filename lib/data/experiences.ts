export interface Position {
  designation: string;
  start: string;
  end?: string;
  responsibilities: string[];
}

export interface Experience {
  company: {
    name: string;
    url?: string;
    location: string;
    overview: string;
  };
  positions: Position[];
}

export const experiences: Experience[] = [
  {
    company: {
      name: "KKR",
      url: "https://www.kkr.com",
      location: "Boston, MA",
      overview:
        "Global investment firm focused on private markets, strategic capital, and enterprise data operations.",
    },
    positions: [
      {
        designation: "Data Engineer",
        start: "Dec 2023",
        responsibilities: [
          "Supported reinsurance data pipelines spanning 40+ data providers, 1,600+ feeds, and over $5B in modeled cashflows.",
          "Proposed, designed, and maintained four internal tools that reduced data validation and incident-resolution time by roughly 50%.",
          "Built a live internal data catalog and centralized monitoring framework for warehouse resources and pipeline health.",
          "Implemented an abstract syntax tree (AST) SQL lineage parser with LLM fallback and LLM-as-a-judge validation.",
          "Mentored junior team members and supported rollout and onboarding of AI tooling for core infrastructure teams.",
        ],
      },
    ],
  },
  {
    company: {
      name: "AlgoSeek LLC",
      url: "https://algoseek.com",
      location: "New York, NY",
      overview:
        "Financial data provider delivering proprietary datasets and workflows for quantitative and machine learning research.",
    },
    positions: [
      {
        designation: "Quant and Machine Learning Engineer",
        start: "Feb 2022",
        end: "Dec 2023",
        responsibilities: [
          "Authored an example repository of Jupyter notebooks demonstrating data preparation, model training, and strategy backtesting on proprietary data.",
          "Built data I/O pipelines, preprocessing workflows, and MLflow model-tracking examples with IaC-controlled EMR training in AWS.",
          "Added mixed-period custom indicators, trained 3+ models, and backtested 10+ strategies using PySpark and Backtrader.",
          "Produced practical onboarding examples for setting up AWS-based MLOps workflows for quant finance use cases.",
        ],
      },
    ],
  },
  {
    company: {
      name: "ML4Trading (Stefan Jansen)",
      url: "https://ml4trading.io",
      location: "New York, NY",
      overview:
        "Machine learning research and tooling for systematic trading workflows and educational quant engineering.",
    },
    positions: [
      {
        designation: "Quant Research Intern",
        start: "May 2022",
        end: "Jan 2023",
        responsibilities: [
          "Assisted with research and implementation of machine learning models for Machine Learning for Trading.",
          "Built ML-framework plugins for backtesting libraries that used strategy performance as a training loss/cost signal.",
          "Developed gradient-boosted, time-series, and LSTM models for intraday and daily return and volatility forecasting.",
        ],
      },
    ],
  },
  {
    company: {
      name: "AlgoTech Capital Management",
      location: "Boston, MA",
      overview:
        "Built no-code technologies for algorithmic trading, model development, and automated portfolio management.",
    },
    positions: [
      {
        designation: "Lead Data Engineer",
        start: "Apr 2021",
        end: "Dec 2023",
        responsibilities: [
          "Led development of an intraday MLOps platform in Python using Amazon SageMaker, Glue, Kinesis, and EMR.",
          "Built data pipelines to exfiltrate 6+ TB, convert SAS datasets to Parquet, and load cloud-native data lake storage.",
          "Engineered model-training and strategy-development features in Python and Spark.",
          "Implemented stream processing, broker-order execution, and strategy lifecycle management services.",
          "Built 15 models, 20+ strategies, and 3 portfolio-management algorithms for production live and paper trading environments.",
        ],
      },
    ],
  },
];
