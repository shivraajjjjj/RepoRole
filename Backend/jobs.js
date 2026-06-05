const jobs = [
   {
  id: 1,
  title: "Backend JavaScript Developer (Entry-Level)",

  version: 1,

  signals: {
    node_runtime: 20,
    express_framework: 15,
    database_usage: 15,
    authentication: 10,
    api_integration: 10,
    project_structure: 10,
    ci_cd: 5,
    dockerization: 5
  },

  penalties: {
    tutorial_project: -20,
    single_component_app: -10,
    no_project_structure: -10
  },
},
{
  id: 2,
  title: "Full Stack JavaScript Developer (Entry-Level)",

  version: 1,

  signals: {
    // Backend
    node_runtime: 15,
    express_framework: 10,
    database_usage: 10,

    // Frontend
    react_framework: 15,
    component_architecture: 10,
    react_hooks: 10,

    // Full Stack
    api_integration: 10,
    project_structure: 10,

    // Professional Practices
    ci_cd: 5,
    dockerization: 5
  },

  penalties: {
    tutorial_project: -20,
    single_component_app: -10,
    no_project_structure: -10
  },
},
{
  id:3,
  title: "Frontend React Developer (Entry-Level)",

  version: 1,

  signals: {
    // Core Frontend
    react_framework: 15,
    component_architecture: 15,
    react_hooks: 15,

    // Application Structure
    frontend_routing: 10,
    state_management: 10,

    // Engineering Practices
    asynchronous_operations: 5,
    environment_variables: 3,
    testing: 7,

    // Professional Practices
    ci_cd: 3,
    dockerization: 2
  },

  penalties: {
    tutorial_project: -20,
    single_component_app: -10,
    no_project_structure: -10
  },

  minimumConfidence: 0.5
}
]

export default jobs;
