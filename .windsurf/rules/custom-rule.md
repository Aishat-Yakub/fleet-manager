---
trigger: manual
---

# =========================
# Workspace Rules - [Project Name]
# =========================

# --- Tech Stack Context ---
1. Backend: NestJS (TypeScript), Golang microservices.
2. Frontend: Next.js (TypeScript, Tailwind CSS, GSAP for animations).
3. AI Layer: LangChain + Hugging Face for NLP and reasoning agents.
4. Blockchain: Solidity smart contracts using OpenZeppelin.
5. Database: PostgreSQL (via Prisma for Node.js, GORM for Go).
6. Infrastructure: Docker, Docker Compose, Nginx reverse proxy.
7. CI/CD: GitHub Actions for build, test, deploy.

# --- Backend Guidelines ---
8. Use strict TypeScript settings (`"strict": true`) in tsconfig.json.
9. All NestJS modules must be isolated and reusable.
10. Implement DTO validation using `class-validator` and `class-transformer`.
11. Use repository pattern with Prisma for database access.
12. Log errors with structured logging (pino for Node.js, logrus for Go).
13. All APIs must return JSON using consistent response format:
    {
      "success": boolean,
      "data": any,
      "message": string
    }

# --- Frontend Guidelines ---
14. All React components must be functional and use hooks.
15. Use TailwindCSS for styling, avoid inline styles.
16. Use GSAP's ScrollTrigger and animation timelines for smooth effects.
17. Components must be responsive and pass Lighthouse accessibility tests.

# --- AI Agent Guidelines ---
18. AI orchestration logic must be modular (separate memory, tools, and chain config).
19. Validate all AI outputs before processing (avoid hallucination risks).
20. Store conversation history in a secure, queryable format (PostgreSQL or vector DB).
21. Agents should fail gracefully and log reasoning for debugging.

# --- Blockchain Guidelines ---
22. Use Hardhat for smart contract deployment/testing.
23. All contracts must be audited with Slither before deployment.
24. Avoid inline assembly unless strictly necessary.
25. Interact with blockchain using Ethers.js.

# --- Testing Rules ---
26. Unit tests for every service/module.
27. Integration tests for key workflows (e.g., AI agent flow, user registration, payment).
28. Maintain >85% coverage.
29. Use mocks for external APIs during tests.

# --- Security Rules ---
30. Sanitize and validate all user input.
31. Use HTTPS everywhere.
32. Rate-limit sensitive endpoints (auth, payments).
33. Use JWT for authentication, refresh token for session renewal.
34. Encrypt sensitive data at rest and in transit.

# --- File & Directory Rules ---
35. Do not modify `/config/production.env` in workspace.
36. Keep `/docs/` updated with API and architectural changes.
37. Do not commit files larger than 10MB.

# --- Workflow Rules ---
38. All new features start from `feature/*` branches.
39. Merge to `main` only through PR with at least one review.
40. Commit messages follow the Conventional Commits format.

# --- Cascade AI Instructions ---
41. Always respect workspace stack (NestJS, Next.js, Golang, Solidity).
42. When generating code, include comments explaining architectural choices.
43. Suggest optimizations but do not refactor core logic without explicit request.
44. Always generate code with security, scalability, and maintainability in mind.
