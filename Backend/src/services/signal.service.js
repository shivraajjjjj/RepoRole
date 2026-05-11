// Mutates the provided projectSignals Set collections based on a manifest file
export function extractSignals(manifests, projectSignals) {
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
      extractJavaSignals(manifest.content, projectSignals);
      break;
    case "CMakeLists.txt":
      projectSignals.buildFiles?.add?.("CMakeLists.txt");
      extractCppSignals(manifest.content, projectSignals);
      break;
    default:
      break;
  }
}
}

const extractNodeSignals = (item, projectSignals) => {
  const pkg = JSON.parse(Buffer.from(item.content, "base64").toString("utf-8"));
  projectSignals.runtime.add("Node.js");

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };

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
};

const extractPythonSignals = (item, projectSignals) => {
  const content = Buffer.from(item.content, "base64").toString("utf-8");

  projectSignals.runtime.add("Python");
  // Extract package names from dependency strings (handles both requirements.txt and pyproject.toml)
  const dependencies = content.split("\n")
    .map(line => line.replace(/[#;].*$/, "").trim()) // Remove comments
    .map(line => line.replace(/^["']|["'],?$/g, "")) // Remove quotes and trailing commas
    .map(line => line.split(/[>=<~!]/)[0].trim().toLowerCase()) // Extract package name before version specifier
    .filter(line => line.length > 0);


  const mlLibs = ["tensorflow", "torch", "scikit-learn", "keras", "xgboost", "lightgbm", "catboost", "pytorch","numpy","pandas"];

  if (dependencies.some(dep => mlLibs.includes(dep))) {
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

const extractJavaSignals = (item, projectSignals) => {
  const content = Buffer.from(item.content, "base64").toString("utf-8");

  projectSignals.runtime.add("JVM");

 
  if (content.includes("spring-boot")){
    projectSignals.frameworks.add("Spring Boot");
    projectSignals.flags.add("rest");
  }
  if (content.includes("springframework")){
    projectSignals.frameworks.add("Spring Framework");
  }

  if (content.includes("hibernate")){
    projectSignals.frameworks.add("Hibernate");
    projectSignals.flags.add("orm");
  }
  
  // Other Java frameworks
  if (content.includes("micronaut")){
    projectSignals.frameworks.add("Micronaut");
  }
  if (content.includes("quarkus")){
    projectSignals.frameworks.add("Quarkus");
  }
  if (content.includes("react")){
    projectSignals.frameworks.add("React");
  }
  if (content.includes("angular")) {
    projectSignals.frameworks.add("Angular");
  }
  if (content.includes("vue")) {
    projectSignals.frameworks.add("Vue");
  }

  // Database detection
  if (content.includes("postgresql")) {
    projectSignals.databases.add("PostgreSQL");
  }
  if (content.includes("mysql")) {
    projectSignals.databases.add("MySQL");
  }
  if (content.includes("mongodb")) {
    projectSignals.databases.add("MongoDB");
  }
  if (content.includes("redis")) {
    projectSignals.databases.add("Redis");
  }
  
}

const extractCppSignals = (item, projectSignals) => {
  const content = Buffer.from(item.content, "base64").toString("utf-8");
  projectSignals.runtime.add("C++");

  // More robust detection: allow optional whitespace and case-insensitive
  if (/find_package\s*\(\s*Boost/i.test(content)) {
    projectSignals.frameworks.add("Boost");
  }
  if (/find_package\s*\(\s*Qt5|find_package\s*\(\s*Qt/i.test(content)) {
    projectSignals.frameworks.add("Qt");
  }
  if (/find_package\s*\(\s*Eigen3/i.test(content)) {
    projectSignals.frameworks.add("Eigen");
  }

  if (/find_package\s*\(\s*Boost_asio/i.test(content)) {
    projectSignals.frameworks.add("Boost.Asio");
  }

  if (/find_package\s*\(\s*SQLite3/i.test(content)) {
    projectSignals.databases.add("SQLite");
  }
  if (/find_package\s*\(\s*PostgreSQL/i.test(content)) {
    projectSignals.databases.add("PostgreSQL");
  }
  if (/find_package\s*\(\s*MySQL/i.test(content)) {
    projectSignals.databases.add("MySQL");
  }
  if (/find_package\s*\(\s*MongoDB/i.test(content)) {
    projectSignals.databases.add("MongoDB");
  }
  if (/find_package\s*\(\s*Redis/i.test(content)) {
    projectSignals.databases.add("Redis");
  }

  // Detect common native libraries used by C++ projects
  if (/find_package\s*\(\s*OpenSSL/i.test(content) || /find_package\s*\(\s*openssl/i.test(content)) {
    projectSignals.frameworks.add("OpenSSL");
  }
  if (/find_package\s*\(\s*ZLIB/i.test(content)) {
    projectSignals.frameworks.add("ZLIB");
  }

}
