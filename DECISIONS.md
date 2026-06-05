# Decision Log
This document captures the key decisions made during the development of the project. It serves as a reference for the rationale behind design choices and implementation strategies.

## Decision 1: Update Scanning Logic
### DATE: 2024-06-01
### DECISION: 
Instead of scanning only menifest files for all repositories, we will scan AST files of mern stack or js projects and scan menifest files for other types of projects. This will help us to get more accurate signals for mern stack or js projects and improve the scoring logic.

## Decision 2: Filter Files by Type
### DATE: 2024-06-04
### DECISION:
instead of scanning all files of the repository, we will filter files by type and collect important sample files from directories of important types. This will help us to focus on the most relevant files and improve the efficiency of the scanning process.

### REASONING:
- Scanning all files of the repository can be time-consuming and may not yield relevant signals.
- By filtering files by type, we can focus on the most important files and improve the accuracy of the signals.
- This approach will also help us to manage the GitHub API rate limits more effectively.