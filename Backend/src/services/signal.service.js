import { createRequire } from "module";

const require = createRequire(import.meta.url);
const traverse = require("@babel/traverse").default

const CALL_DETECTORS = [
  createDetector("database-operation", "Database Operation", "crud operations", [
    "find", "findOne", "insert", "update", "delete", "save", "remove"
  ], isDatabaseCall),
  createDetector("authentication", "authentication", "jwt authentication", [
    "sign", "verify"
  ]),
  createDetector("password-handling", "password handling", "bcrypt hashing", [
    "hash", "compare"
  ]),
  createDetector("file-handling", "file handling", "fs module usage", [
    "readFile", "writeFile", "appendFile"
  ]),
  createDetector("middleware", "middleware", "express middleware usage", [
    "use"
  ]),
  createDetector("api-routing", "API Routing", "express routing", [
    "get", "post", "put", "delete"
  ], isExpressRouterCall),
  createDetector("data-validation", "data validation", "validation library usage", [
    "zod", "joi", "yup", "validationResult"
  ]),
  createDetector("react-framework", "react framework", "react API usage", [
    "createElement", "cloneElement", "createRef"
  ]),
  createDetector("react-hooks", "react hooks", "react hook usage", [
    "useState", "useEffect", "useContext", "useReducer", "useCallback", "useMemo"
  ]),
  createDetector("state-management", "state management", "redux or mobx usage", [
    "createStore", "combineReducers", "applyMiddleware", "connect", "useSelector", "useDispatch"
  ]),
  createDetector("testing", "testing", "test framework usage", [
    "describe", "it", "test", "expect"
  ]),
  createDetector("environment-variables", "environment variables", "dotenv usage", [
    "config"
  ])
];

const IMPORT_DETECTORS = [
  createDetector("react-import", "react framework", "react import",["react"]),
  createDetector("frontend-routing-import", "frontend routing", "react-router import",[
    "react-router", "react-router-dom"
  ]),
  createDetector("state-management-import", "state management", "redux or mobx import",[
    "redux", "react-redux", "mobx", "mobx-react"
  ]),
  createDetector("testing-import", "testing", "test framework import",[
    "jest", "mocha", "chai"
  ]),
  createDetector("validation-import", "data validation", "validation library import",[
    "zod", "joi", "yup", "express-validator"
  ]),
  createDetector("dotenv-import", "environment variables", "dotenv import",[
    "dotenv"
  ])
];

const JSX_DETECTORS = [
  createDetector("frontend-routing-component", "frontend routing", "react-router component usage",[
    "BrowserRouter", "Route", "Routes", "Switch", "Link", "NavLink"
  ]),
  createDetector("state-management-component", "state management", "state provider usage",[
    "Provider"
  ])
];

const NODE_DETECTORS = {
  TryStatement: [
    createDetector("error-handling", "error handling", "try-catch blocks",["try"])
  ],
  AwaitExpression: [
    createDetector("asynchronous-await", "asynchronous operations", "await usage",["await"])
  ],
  Function: [
    createDetector("asynchronous-function", "asynchronous operations", "async function usage",["async"])
  ]
};

const STRUCTURE_DETECTORS = [
  createStructureDetector("language-js", "language", "file extension",".js", path => path.endsWith(".js")),
  createStructureDetector("language-jsx", "language", "file extension",".jsx", path => path.endsWith(".jsx")),
  createStructureDetector("language-ts", "language", "file extension", ".ts", path => path.endsWith(".ts")),
  createStructureDetector("language-tsx", "language", "file extension", ".tsx", path => path.endsWith(".tsx")),
  createStructureDetector("controller", "controller", "controller file", "controller", path => hasPathPart(path, "controller")),
  createStructureDetector("service", "service", "service file", "service", path => hasPathPart(path, "service")),
  createStructureDetector("component", "component", "component file", "component", path => hasPathPart(path, "component")),
  createStructureDetector("github-actions", "CI/CD", "CI/CD configuration",".github/workflows", path => path.includes(".github/workflows/")),
  createStructureDetector("jenkins", "CI/CD", "CI/CD configuration","jenkins", path => path.includes("jenkins")),
  createStructureDetector("dockerfile", "dockerization", "docker configuration","Dockerfile", path => path.endsWith("dockerfile")),
  createStructureDetector("docker-compose", "dockerization", "docker configuration","docker-compose.yml", path => path.endsWith("docker-compose.yml"))
];

export function extractSignals(files, context) {
  const entries = toArray(files);

  if (entries.some(entry => entry?.ast)) {
    return extractCodeSignals(entries, context);
  }

  return extractManifestSignals(entries, context);
}

function extractCodeSignals(parsedFiles, treeStructure = []) {
  const signalMap = new Map();

  for (const entry of parsedFiles) {
    if (!entry?.ast || !entry?.path) continue;

    traverse(entry.ast, {
      CallExpression(path) {
        recordMatches(signalMap, CALL_DETECTORS, getCallOperation(path.node), entry.path, path.node);
      },
      ImportDeclaration(path) {
        recordMatches(signalMap, IMPORT_DETECTORS, path.node.source.value, entry.path);
      },
      JSXOpeningElement(path) {
        recordMatches(signalMap, JSX_DETECTORS, getJSXName(path.node.name), entry.path);
      },
      TryStatement() {
        recordMatches(signalMap, NODE_DETECTORS.TryStatement, "try", entry.path);
      },
      AwaitExpression() {
        recordMatches(signalMap, NODE_DETECTORS.AwaitExpression, "await", entry.path);
      },
      Function(path) {
        if (path.node.async) {
          recordMatches(signalMap, NODE_DETECTORS.Function, "async", entry.path);
        }
      }
    });
  }

  for (const entry of toArray(treeStructure)) {
    const filePath = typeof entry === "string" ? entry : entry?.path;
    if (!filePath) continue;

    const normalizedPath = filePath.toLowerCase();
    for (const detector of STRUCTURE_DETECTORS) {
      if (detector.matches(normalizedPath)) {
        recordSignal(signalMap, detector, detector.signal, filePath);
      }
    }
  }

  return serializeSignalMap(signalMap);
}

function extractManifestSignals(manifests, projectSignals) {
  if (!projectSignals) return {};

  for (const manifest of manifests) {
    switch (manifest.name) {
      case "package.json":
        projectSignals.buildFiles?.add?.("package.json");
        extractNodeSignals(manifest, projectSignals);
        break;
      case "requirements.txt":
      case "pyproject.toml":
        projectSignals.buildFiles?.add?.(manifest.name);
        extractPythonSignals(manifest, projectSignals);
        break;
      case "pom.xml":
      case "build.gradle":
      case "build.gradle.kts":
        projectSignals.buildFiles?.add?.(manifest.name);
        extractJavaSignals(manifest, projectSignals);
        break;
      case "CMakeLists.txt":
        projectSignals.buildFiles?.add?.("CMakeLists.txt");
        extractCppSignals(manifest, projectSignals);
        break;
      default:
        break;
    }
  }

  return projectSignals;
}

function createDetector(id, category, evidence,operations, matches) {
  return { id, category, evidence,operations: new Set(operations), matches };
}

function createStructureDetector(id, category, evidence,signal, matches) {
  return { id, category, evidence,signal, matches };
}

function recordMatches(signalMap, detectors, operation, filePath, node) {
  if (!operation) return;

  for (const detector of detectors) {
    if (detector.operations.has(operation) && (!detector.matches || detector.matches(node))) {
      recordSignal(signalMap, detector, operation, filePath);
    }
  }
}

function recordSignal(signalMap, detector, signal, filePath) {
  const key = `${detector.id}:${signal}`;
  const data = signalMap.get(key) ?? {
    signal,
    category: detector.category,
    evidence: detector.evidence,
    occurrences: 0,
    filePaths: new Map()
  };

  data.occurrences += 1;
  data.filePaths.set(filePath, (data.filePaths.get(filePath) ?? 0) + 1);
  signalMap.set(key, data);
}

function serializeSignalMap(signalMap) {
  return Object.fromEntries(
    [...signalMap].map(([key, data]) => [
      key,
      {
        ...data,
        filePaths: Object.fromEntries(data.filePaths)
      }
    ])
  );
}

function getCallOperation(node) {
  if (node.callee.type === "Identifier") return node.callee.name;
  if (node.callee.type !== "MemberExpression") return null;
  if (node.callee.property.type === "Identifier") return node.callee.property.name;
  if (node.callee.property.type === "StringLiteral") return node.callee.property.value;
  return null;
}

function isDatabaseCall(node) {
  const receiver = getCallReceiver(node);
  return !isExpressRouterCall(node) && !["api", "axios", "client", "fetch", "http", "https"].includes(receiver);
}

function isExpressRouterCall(node) {
  const receiver = getCallReceiver(node);
  return receiver === "app" || receiver === "router" || receiver?.endsWith("router");
}

function getCallReceiver(node) {
  if (node?.callee?.type !== "MemberExpression") return null;
  if (node.callee.object.type === "Identifier") return node.callee.object.name.toLowerCase();
return null;
}

function getJSXName(node) {
  if (node.type === "JSXIdentifier") return node.name;
  if (node.type === "JSXMemberExpression") return getJSXName(node.property);
  return null;
}

function hasPathPart(path, term) {
  return path.split("/").some(part => part.includes(term));
}

function toArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function decodeManifest(item) {
  return Buffer.from(item.content, "base64").toString("utf-8");
}

function extractNodeSignals(item, projectSignals) {
  const pkg = JSON.parse(decodeManifest(item));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  projectSignals.runtime.add("Node.js");
  if (deps.react) projectSignals.frameworks.add("React");
  if (deps.next) projectSignals.frameworks.add("NextJS");
  if (deps.express) projectSignals.frameworks.add("Express");
  if (deps["@nestjs/core"]) projectSignals.frameworks.add("NestJS");
  if (deps.redux) projectSignals.frameworks.add("Redux");
  if (deps["react-router-dom"] || deps["react-router"]) projectSignals.frameworks.add("React Router");
  if (deps.mongoose) projectSignals.databases.add("MongoDB");
  if (deps.pg) projectSignals.databases.add("PostgreSQL");
  if (deps.mysql2) projectSignals.databases.add("MySQL");
  if (deps.redis) projectSignals.databases.add("Redis");
}

function extractPythonSignals(item, projectSignals) {
  const dependencies = decodeManifest(item)
    .split("\n")
    .map(line => line.replace(/[#;].*$/, "").trim())
    .map(line => line.replace(/^["']|["'],?$/g, ""))
    .map(line => line.split(/[>=<~!]/)[0].trim().toLowerCase())
    .filter(Boolean);

  projectSignals.runtime.add("Python");
  if (dependencies.some(dep => ["tensorflow", "torch", "scikit-learn", "keras", "xgboost", "lightgbm", "catboost", "pytorch", "numpy", "pandas"].includes(dep))) {
    projectSignals.flags.add("ML/AI");
  }
  if (dependencies.includes("django")) projectSignals.frameworks.add("Django");
  if (dependencies.includes("flask")) projectSignals.frameworks.add("Flask");
  if (dependencies.includes("fastapi")) projectSignals.frameworks.add("FastAPI");
  if (dependencies.includes("sanic")) projectSignals.frameworks.add("Sanic");
  if (dependencies.includes("bottle")) projectSignals.frameworks.add("Bottle");
  if (dependencies.includes("sqlalchemy")) projectSignals.databases.add("PostgreSQL");
  if (dependencies.includes("mysql-connector-python")) projectSignals.databases.add("MySQL");
  if (dependencies.includes("pymongo")) projectSignals.databases.add("MongoDB");
  if (dependencies.includes("redis")) projectSignals.databases.add("Redis");
}

function extractJavaSignals(item, projectSignals) {
  const content = decodeManifest(item).toLowerCase();

  projectSignals.runtime.add("JVM");
    if (content.includes("spring-boot")) {
    projectSignals.frameworks.add("Spring Boot");
    projectSignals.flags.add("rest");
  }
  if (content.includes("springframework")) projectSignals.frameworks.add("Spring Framework");
  if (content.includes("hibernate")) {
    projectSignals.frameworks.add("Hibernate");
    projectSignals.flags.add("orm");
  }
  if (content.includes("micronaut")) projectSignals.frameworks.add("Micronaut");
  if (content.includes("quarkus")) projectSignals.frameworks.add("Quarkus");
  if (content.includes("react")) projectSignals.frameworks.add("React");
  if (content.includes("angular")) projectSignals.frameworks.add("Angular");
  if (content.includes("vue")) projectSignals.frameworks.add("Vue");
  if (content.includes("postgresql")) projectSignals.databases.add("PostgreSQL");
  if (content.includes("mysql")) projectSignals.databases.add("MySQL");
  if (content.includes("mongodb")) projectSignals.databases.add("MongoDB");
  if (content.includes("redis")) projectSignals.databases.add("Redis");
}

function extractCppSignals(item, projectSignals) {
  const content = decodeManifest(item);

  projectSignals.runtime.add("C++");
  if (/find_package\s*\(\s*Boost/i.test(content)) projectSignals.frameworks.add("Boost");
  if (/find_package\s*\(\s*(Qt5|Qt)/i.test(content)) projectSignals.frameworks.add("Qt");
  if (/find_package\s*\(\s*Eigen3/i.test(content)) projectSignals.frameworks.add("Eigen");
  if (/find_package\s*\(\s*Boost_asio/i.test(content)) projectSignals.frameworks.add("Boost.Asio");
  if (/find_package\s*\(\s*SQLite3/i.test(content)) projectSignals.databases.add("SQLite");
  if (/find_package\s*\(\s*PostgreSQL/i.test(content)) projectSignals.databases.add("PostgreSQL");
  if (/find_package\s*\(\s*MySQL/i.test(content)) projectSignals.databases.add("MySQL");
  if (/find_package\s*\(\s*MongoDB/i.test(content)) projectSignals.databases.add("MongoDB");
  if (/find_package\s*\(\s*Redis/i.test(content)) projectSignals.databases.add("Redis");
  if (/find_package\s*\(\s*OpenSSL/i.test(content)) projectSignals.frameworks.add("OpenSSL");
  if (/find_package\s*\(\s*ZLIB/i.test(content)) projectSignals.frameworks.add("ZLIB");
}