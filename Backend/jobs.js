const jobs = [
   {
  id: 1,
  title: "Backend JavaScript Developer (Entry-Level)",

  primaryLanguages: ["JavaScript", "TypeScript"],

  runtime: ["Node.js"],

  coreFrameworks: ["Express", "NestJS", "Fastify"],

  optionalFrameworks: ["Koa", "Hapi", "AdonisJS", "Hono"],

  structureSignals: [
    "controllers/",
    "services/",
    "routes/",
    "models/",
    "middlewares/",
  ],

  databases: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],

  infraSignals: [
    "Dockerfile",
    ".github/workflows",
    "tests/",
    "__tests__/"
  ]
},
{
  id: 2,
  title: "Full Stack JavaScript Developer (Entry-Level)",

  // Programming languages only
  primaryLanguages: ["JavaScript", "TypeScript"],

  // Markup / styling (secondary signals)
  secondaryLanguages: ["HTML", "CSS"],

  runtime: ["Node.js"],

  // Backend frameworks
  backendFrameworks: ["Express", "NestJS", "Fastify"],

  // Frontend frameworks
  frontendFrameworks: ["React", "Vue", "Angular"],

  // Meta / optional frameworks
  optionalFrameworks: ["Next.js", "Nuxt.js", "SvelteKit"],

  // Combined structure signals (backend + frontend)
  structureSignals: [
    // Backend
    "controllers/",
    "services/",
    "routes/",
    "models/",
    "middlewares/",
    "config/",

    // Frontend
    "components/",
    "pages/",
    "hooks/",
    "styles/",
    "assets/"
  ],

  databases: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],

  infraSignals: [
    "Dockerfile",
    ".github/workflows",
    "tests/",
    "__tests__/"
  ]
},
{
  id: 3,
  title: "Backend Java Developer (Entry-Level)",

  primaryLanguages: ["Java"],

  runtime: ["JVM"],

  coreFrameworks: ["Spring Boot", "Micronaut", "Quarkus"],

  optionalFrameworks: ["Jakarta EE", "Vert.x"],

  structureSignals: [
    "controller/",
    "controllers/",
    "service/",
    "services/",
    "repository/",
    "repositories/",
    "config/",
    "security/",
    "filter/",
    "filters/"
  ],

  buildSignals: [
    "pom.xml",
    "build.gradle",
    "build.gradle.kts"
  ],

  databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],

  infraSignals: [
    "Dockerfile",
    ".github/workflows",
    "src/test/java"
  ]
},
{
  id: 4,
  title: "Full Stack Java Developer (Entry-Level)",

  primaryLanguages: ["Java"],
  secondaryLanguages: ["JavaScript", "TypeScript", "HTML", "CSS"],

  runtime: ["JVM"],

  backendFrameworks: ["Spring Boot", "Micronaut", "Quarkus"],
  frontendFrameworks: ["React", "Angular", "Vue"],

  structureSignals: [
    // Backend
    "controller/",
    "controllers/",
    "service/",
    "services/",
    "repository/",
    "repositories/",
    "config/",
    "security/",

    // Frontend
    "components/",
    "pages/",
    "src/app/",
    "styles/",
    "assets/"
  ],

  buildSignals: [
    "pom.xml",
    "build.gradle",
    "build.gradle.kts"
  ],

  databases: ["PostgreSQL", "MySQL", "MongoDB"],

  infraSignals: [
    "Dockerfile",
    ".github/workflows",
    "src/test/java"
  ]
},
{
  id: 5,
  title: "Backend Python Developer (Entry-Level)",

  primaryLanguages: ["Python"],

  backendFrameworks: ["Django", "Flask", "FastAPI"],

  optionalFrameworks: ["Sanic", "Bottle"],

  structureSignals: [
    "views/",
    "routers/",
    "api/",
    "services/",
    "models/",
    "schemas/",
    "config/"
  ],

  dependencySignals: [
    "requirements.txt",
    "pyproject.toml",
    "Pipfile"
  ],

  databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],

  infraSignals: [
    "Dockerfile",
    ".github/workflows",
    "tests/"
  ]
},
{
  id: 6,
  title: "Frontend React Developer (Entry-Level)",

  primaryLanguages: ["JavaScript", "TypeScript"],
  secondaryLanguages: ["HTML", "CSS"],

  frontendFrameworks: ["React"],

  optionalFrameworks: ["Next.js", "Vite"],

  structureSignals: [
    "components/",
    "pages/",
    "hooks/",
    "contexts/",
    "styles/",
    "assets/"
  ],

  toolingSignals: [
    "package.json",
    "vite.config.js",
    "webpack.config.js"
  ],

  infraSignals: [
    ".github/workflows",
    "tests/",
    "__tests__/"
  ]
},
{
  id: 7,
  title: "Machine Learning Engineer / Intern",

  primaryLanguages: ["Python"],

  secondaryLanguages: ["R"],

  mlFrameworks: [
    "scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Keras",
    "XGBoost"
  ],

  dataProcessingTools: [
    "Pandas",
    "NumPy",
    "Dask",
    "Apache Spark"
  ],

  dependencySignals: [
    "requirements.txt",
    "environment.yml",
    "pyproject.toml"
  ],

  structureSignals: [
    "notebooks/",
    "data/",
    "datasets/",
    "models/",
    "scripts/",
    "configs/"
  ],

  infraSignals: [
    "Dockerfile",
    ".github/workflows",
    "tests/"
  ]
},
{
  id: 8,
  title: "Software Engineer Intern",

  primaryLanguages: [
    "JavaScript",
    "Python",
    "Java",
    "TypeScript"
  ],

  generalFrameworks: [
    "Express",
    "Spring Boot",
    "React",
    "Django",
    "Flask"
  ],

  structureSignals: [
    "src/",
    "lib/",
    "app/",
    "packages/"
  ],

  infraSignals: [
    "Dockerfile",
    ".github/workflows",
    "tests/"
  ]
},

]

module.exports = jobs;