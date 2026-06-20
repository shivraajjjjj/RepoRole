# Current Task

Goal:
add unit test to the /roles endpoint to ensure that the authentication and rate limiting logic is working as expected.

Requirements:
- Write unit tests for the /roles endpoint to cover the following scenarios:
  - Successful authentication with OAuth for seekers .
  - Successful authentication with email for recruiters.
  - check that rate limiting is applied for unauthenticated requests.

Constraints:
- Existing API must not break.
- Keep Babel AST parser.
- No secutrity vulnerabilities.
- OAuth and email authentication should coexist without conflicts only for recruiters.
- student authentication should remain unchanged (OAuth only).
- test shouldn't be changing the existing codebase, only adding new test files and test cases.
Out of Scope:
- Role scoring
- UI changes
- File parsing
