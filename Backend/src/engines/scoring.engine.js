import { analyzeRepository } from "../services/analyze.service.js";
import { ALL_ROLES } from "../roles/index.js";

const MAX_RESULTS = 3;

/*
 * Score a repository against all role configurations
 * @param {string} repoUrl - GitHub repository URL
 * @returns {Promise<Array>} - Sorted array of role matches with scores
 */
export async function scoreRepository(projectSignals) {

    try {
        if (!projectSignals) {
            throw new Error("Repository data is required for scoring.");
        }
        
        const results = [];
        const allResults = []; // Track all results for debugging

        // Score against each role
        for (const roleConfig of ALL_ROLES) {
            const result = scoreRole(roleConfig, projectSignals);

            const confidence = calculateConfidence({score: result.finalScore, 
                matchedSignals: result.matchedSignals, 
                isToy: projectSignals.metadata.isToy, 
                hasWeakStructure: projectSignals.structure.length < 2
            });
            result.confidence = confidence;
            allResults.push(result);

            if (result.finalScore > 0) {
                results.push(result);
            }
        }
        
        // Sort by score descending and return top matches
        results.sort((a, b) => b.finalScore - a.finalScore);
        if (results.length < 1) {
            return ["No suitable role matches found for this repository."," Thank you for using our service."];
        }
        
        return results.slice(0, MAX_RESULTS);

    } catch (err) {
        throw err;
    }
}

// Score a single role configuration against repository data
function scoreRole(roleConfig, projectSignals) {
    let rawScore = 0;
    const matchedSignals = [];

    // Score each category
    rawScore += scoreLanguages(roleConfig, projectSignals, matchedSignals);
    rawScore += scoreRuntime(roleConfig, projectSignals, matchedSignals);
    rawScore += scoreFrameworks(roleConfig, projectSignals, matchedSignals);
    rawScore += scoreStructure(roleConfig, projectSignals, matchedSignals);
    rawScore += scoreDatabase(roleConfig, projectSignals, matchedSignals);
    rawScore += scoreBuildOrDeps(roleConfig, projectSignals, matchedSignals);
    
    // V2: rawScore += scoreInfra(roleConfig, projectSignals, matchedSignals);

    // Apply penalties
    rawScore -= applyPenalties(roleConfig, projectSignals, matchedSignals);

    // Clamp raw score
    const totalCap = roleConfig.weights.totalCap || roleConfig.weights.TotalCap || 100;
    rawScore = clamp(rawScore, 0, totalCap);

    // Normalize to 0-100 scale
    const finalScore = normalize(rawScore, totalCap);

    return {
        roleId: roleConfig.roleId,
        title: roleConfig.title,
        rawScore:`${rawScore}/${totalCap}`,
        finalScore,
        confidence:0,
        matchedSignals
    };
}

// Generic category scoring function
function scoreCategory(categoryConfig, detectedSignals, matchedSignals, categoryName) {
    let score = 0;

    for (const signal in categoryConfig) {
        if (signal === 'cap') continue;

        if (detectedSignals.includes(signal)) {
            const points = categoryConfig[signal];
            score += points;
            matchedSignals.push({
                category: categoryName,
                signal,
                points
            });
        }
    }

    const cap = categoryConfig.cap || Infinity;
    return Math.min(score, cap);
}

// Score programming languages
function scoreLanguages(roleConfig, projectSignals, matchedSignals) {
    if (!roleConfig.weights.languages) return 0;
    
    return scoreCategory(
        roleConfig.weights.languages,
        projectSignals.languages,
        matchedSignals,
        'languages'
    );
}

//Score runtime environment
function scoreRuntime(roleConfig, projectSignals, matchedSignals) {
    if (!roleConfig.weights.runtime) return 0;

    const runtime = projectSignals.runtime || [];
    return scoreCategory(
        roleConfig.weights.runtime,
        runtime,
        matchedSignals,
        'runtime'
    );
}

//Score frameworks (core + optional)
function scoreFrameworks(roleConfig, projectSignals, matchedSignals) {
    if (!roleConfig.weights.frameworks) return 0;

    let score = 0;
    const frameworks = projectSignals.frameworks || [];

    // Score core frameworks
    if (roleConfig.weights.frameworks.core || roleConfig.weights.frameworks.backend_core || roleConfig.weights.frameworks.frontend_core) {
        const coreConfig = {
            ...(roleConfig.weights.frameworks.core || {}),
            ...(roleConfig.weights.frameworks.backend_core || {}),
            ...(roleConfig.weights.frameworks.frontend_core || {})
        };

        for (const framework in coreConfig) {
            if (frameworks.includes(framework)) {
                const points = coreConfig[framework];
                score += points;
                matchedSignals.push({
                    category: 'frameworks',
                    signal: framework,
                    points
                });
            }
        }
    }

    // Score optional frameworks
    if (roleConfig.weights.frameworks.optional) {
        for (const framework in roleConfig.weights.frameworks.optional) {
            if (frameworks.includes(framework)) {
                const points = roleConfig.weights.frameworks.optional[framework];
                score += points;
                matchedSignals.push({
                    category: 'frameworks',
                    signal: framework,
                    points
                });
            }
        }
    }

    const cap = roleConfig.weights.frameworks.cap || Infinity;
    return Math.min(score, cap);
}

//Score repository structure/folders
function scoreStructure(roleConfig, projectSignals, matchedSignals) {
    if (!roleConfig.weights.structure) return 0;

    let score = 0;
    const folders = projectSignals.structure || [];
    const structureConfig = roleConfig.weights.structure;

    // Handle grouped structure (backend_group, frontend_group)
    const allStructureKeys = {
        ...(structureConfig.backend_group || {}),
        ...(structureConfig.frontend_group || {}),
        ...structureConfig
    };

    for (const key in allStructureKeys) {
        if (key === 'cap' || key === 'backend_group' || key === 'frontend_group') continue;

        if (folders.includes(key)) {
            const points = allStructureKeys[key];
            score += points;
            matchedSignals.push({
                category: 'structure',
                signal: key,
                points
            });
        }
    }

    const cap = structureConfig.cap || Infinity;
    return Math.min(score, cap);
}

// Score database usage
function scoreDatabase(roleConfig, projectSignals, matchedSignals) {
    if (!roleConfig.weights.database) return 0;

    const databases = projectSignals.databases || [];
    const dbCount = databases.length;
    let score = 0;

    if (dbCount >= 1) {
        score = roleConfig.weights.database.any || 0;
        matchedSignals.push({
            category: 'database',
            signal: databases.join(', '),
            points: score
        });
    }

    if (dbCount > 1 && roleConfig.weights.database.multiple) {
        score = roleConfig.weights.database.multiple;
        matchedSignals.push({
            category: 'database',
            signal: 'multiple databases',
            points: score
        });
    }

    const cap = roleConfig.weights.database.cap || Infinity;
    return Math.min(score, cap);
}

// Score build tools or dependencies (role-specific)
function scoreBuildOrDeps(roleConfig, projectSignals, matchedSignals) {
    let score = 0;

    // Check for build tools (Java projects)
    if (roleConfig.weights.build) {
        const buildSignals = [];
        
        // Check for Maven/Gradle in project
        if (projectSignals.projects?.path && 
            (projectSignals.projects.runtime?.includes('Java') || projectSignals.projects.runtime?.includes('JVM'))) {
            
            // Simple heuristic: if we detected Java frameworks, likely has build tool
            if (projectSignals.projects.frameworks?.some(f => 
                f.includes('Spring') || f.includes('Micronaut') || f.includes('Quarkus'))) {
                buildSignals.push('maven_gradle');
            }
        }

        score += scoreCategory(
            roleConfig.weights.build,
            buildSignals,
            matchedSignals,
            'build'
        );
    }

    // Check for dependency files (Python/ML projects)
    if (roleConfig.weights.dependencies) {
        const depSignals = [];
        
        if (projectSignals.metadata?.hasReadme) {
            // Check what manifests were detected
            // This is a simplified heuristic
            if (projectSignals.projects?.runtime?.includes('Python')) {
                depSignals.push('requirements_txt'); // Assume if Python detected
            }
        }

        score += scoreCategory(
            roleConfig.weights.dependencies,
            depSignals,
            matchedSignals,
            'dependencies'
        );
    }

    return score;
}

// Apply penalties (e.g., tutorial detection)

function applyPenalties(roleConfig, projectSignals, matchedSignals) {
    let penalty = 0;

    // V2: Implement tutorial detection
    // if (projectSignals.isTutorial) {
    //     penalty = roleConfig.weights.penalties?.tutorial_max || 0;
    //     matchedSignals.push({
    //         category: 'penalty',
    //         signal: 'tutorial detected',
    //         points: -penalty
    //     });
    // }

    return penalty;
}

// Clamp value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Normalize raw score to 0-100 scale
 */
function normalize(rawScore, maxScore) {
    if (maxScore === 0) return 0;
    return Math.round((rawScore / maxScore) * 100);
}

function getCoverage(matchedSignals) {
  const CATEGORIES = [
    "languages",
    "runtime",
    "frameworks",
    "structure",
    "database",
    "build"
  ];

  const matched = new Set(
    matchedSignals.map(s => s.category)
  );

  const matchedCount = CATEGORIES.filter(c => matched.has(c)).length;

  return matchedCount / CATEGORIES.length; // 0–1
}


    function calculateConfidence({
  score,
  matchedSignals,
  isToy,
  hasWeakStructure = false
}) {
  const coverage = getCoverage(matchedSignals); // 0–1

  // Core confidence from score + coverage
  let confidence =
    (0.65 * (score / 100)) +
    (0.35 * coverage);

  // Soft penalties (not nukes)
  if (isToy) confidence -= 0.1;
  if (hasWeakStructure) confidence -= 0.05;

  confidence = Math.max(0, Math.min(1, confidence));

  return Math.round(confidence * 100);
}


