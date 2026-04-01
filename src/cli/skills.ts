import { spawnSync } from 'node:child_process';
import { CUSTOM_SKILLS } from './custom-skills';

/**
 * A recommended skill to install via `npx skills add`.
 */
export interface RecommendedSkill {
  /** Human-readable name for prompts */
  name: string;
  /** GitHub repo URL for `npx skills add` */
  repo: string;
  /** Skill name within the repo (--skill flag) */
  skillName: string;
  /** List of agents that should auto-allow this skill */
  allowedAgents: string[];
  /** Description shown to user during install */
  description: string;
  /** Optional commands to run after the skill is added */
  postInstallCommands?: string[];
}

/**
 * A skill that is managed externally (e.g. user-installed) and needs
 * permission grants but is NOT installed by this plugin's CLI.
 */
export interface PermissionOnlySkill {
  /** Skill name — must match the name OpenCode uses for permission checks */
  name: string;
  /** List of agents that should auto-allow this skill */
  allowedAgents: string[];
  /** Human-readable description (for documentation only) */
  description: string;
}

/**
 * List of recommended skills.
 * Add new skills here to include them in the installation flow.
 */
export const RECOMMENDED_SKILLS: RecommendedSkill[] = [
  {
    name: 'simplify',
    repo: 'https://github.com/brianlovin/claude-config',
    skillName: 'simplify',
    allowedAgents: ['oracle'],
    description: 'YAGNI code simplification expert',
  },
  {
    name: 'agent-browser',
    repo: 'https://github.com/vercel-labs/agent-browser',
    skillName: 'agent-browser',
    allowedAgents: ['designer', 'explorer', 'orchestrator'],
    description: 'High-performance browser automation',
    postInstallCommands: [
      'npm install -g agent-browser',
      'agent-browser install',
    ],
  },
  // Explorer-focused skills
  {
    name: 'browser-use',
    repo: 'https://github.com/browser-use/browser-use',
    skillName: 'browser-use',
    allowedAgents: ['explorer', 'orchestrator'],
    description: 'Headless browser automation and web interaction',
  },
  {
    name: 'search',
    repo: 'https://github.com/tavily-ai/skills',
    skillName: 'search',
    allowedAgents: ['explorer', 'librarian', 'ticket-planner', 'orchestrator'],
    description: 'High-quality web search and retrieval',
  },
  {
    name: 'codebase-search',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'codebase-search',
    allowedAgents: ['explorer', 'fixer', 'ticket-planner', 'orchestrator'],
    description: 'Deep codebase navigation and symbol search',
  },
  // Librarian-focused skills
  {
    name: 'api-documentation',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'api-documentation',
    allowedAgents: ['librarian', 'oracle', 'ticket-planner', 'orchestrator'],
    description: 'Structured API documentation and examples',
  },
  {
    name: 'technical-writing',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'technical-writing',
    allowedAgents: ['librarian', 'oracle', 'ticket-planner', 'orchestrator'],
    description: 'Clear technical explanations and docs',
  },
  {
    name: 'next-best-practices',
    repo: 'https://github.com/vercel-labs/next-skills',
    skillName: 'next-best-practices',
    allowedAgents: ['librarian', 'designer', 'orchestrator'],
    description: 'Next.js App Router and caching best practices',
  },
  {
    name: 'ai-sdk',
    repo: 'https://github.com/vercel/ai',
    skillName: 'ai-sdk',
    allowedAgents: ['librarian', 'fixer', 'orchestrator'],
    description: 'Vercel AI SDK patterns and recipes',
  },
  // Oracle-focused skills
  {
    name: 'code-review',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'code-review',
    allowedAgents: ['oracle', 'fixer', 'orchestrator'],
    description: 'Systematic code review and refactoring guidance',
  },
  {
    name: 'requesting-code-review',
    repo: 'https://github.com/obra/superpowers',
    skillName: 'requesting-code-review',
    allowedAgents: ['oracle', 'orchestrator'],
    description:
      'Standardized prompts for requesting thorough code reviews from subagents',
  },
  {
    name: 'receiving-code-review',
    repo: 'https://github.com/obra/superpowers',
    skillName: 'receiving-code-review',
    allowedAgents: ['oracle', 'fixer', 'orchestrator'],
    description:
      'Best practices for addressing and integrating code review feedback',
  },
  {
    name: 'performance-optimization',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'performance-optimization',
    allowedAgents: ['oracle', 'fixer', 'orchestrator'],
    description: 'Application performance analysis and optimization patterns',
  },
  {
    name: 'subagent-driven-development',
    repo: 'https://github.com/obra/superpowers',
    skillName: 'subagent-driven-development',
    allowedAgents: ['oracle', 'orchestrator'],
    description: 'Workflows for coordinating subagents in complex tasks',
  },
  // Designer-focused skills
  {
    name: 'web-design-guidelines',
    repo: 'https://github.com/vercel-labs/agent-skills',
    skillName: 'web-design-guidelines',
    allowedAgents: ['designer', 'orchestrator'],
    description: 'Opinionated web design and UX guidelines',
  },
  {
    name: 'frontend-design',
    repo: 'https://github.com/anthropics/skills',
    skillName: 'frontend-design',
    allowedAgents: ['designer', 'orchestrator'],
    description: 'High-level frontend UX and visual design patterns',
  },
  {
    name: 'ui-ux-pro-max',
    repo: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
    skillName: 'ui-ux-pro-max',
    allowedAgents: ['designer'],
    description: 'Advanced UI/UX heuristics for product interfaces',
  },
  {
    name: 'polish',
    repo: 'https://github.com/pbakaus/impeccable',
    skillName: 'polish',
    allowedAgents: ['designer'],
    description: 'Last-mile UI polish and refinement',
  },
  {
    name: 'responsive-design',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'responsive-design',
    allowedAgents: ['designer', 'orchestrator'],
    description: 'Responsive layout patterns across devices and viewports',
  },
  // Fixer-focused skills
  {
    name: 'copilot-coding-agent',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'copilot-coding-agent',
    allowedAgents: ['fixer', 'orchestrator'],
    description:
      'Execution-focused coding workflows for implementation subagents',
  },
  {
    name: 'task-planning',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'task-planning',
    allowedAgents: ['fixer', 'ticket-planner', 'orchestrator'],
    description: 'Structured breakdown of coding tasks and substeps',
  },
  {
    name: 'code-refactoring',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'code-refactoring',
    allowedAgents: ['fixer', 'oracle', 'orchestrator'],
    description: 'Refactoring patterns for safer code improvements',
  },
  {
    name: 'deployment-automation',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'deployment-automation',
    allowedAgents: ['fixer', 'orchestrator'],
    description: 'Automating deployment workflows and release steps',
  },
  {
    name: 'git-workflow',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'git-workflow',
    allowedAgents: ['fixer', 'orchestrator'],
    description: 'Git branching, commits, and collaboration patterns',
  },
  // Tester-focused skills
  {
    name: 'test-driven-development',
    repo: 'https://github.com/obra/superpowers',
    skillName: 'test-driven-development',
    allowedAgents: ['tester', 'fixer', 'orchestrator'],
    description: 'TDD workflows for incremental, safe implementation',
  },
  {
    name: 'testing-strategies',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'testing-strategies',
    allowedAgents: ['tester', 'oracle', 'orchestrator'],
    description: 'End-to-end testing strategy design and coverage planning',
  },
  {
    name: 'backend-testing',
    repo: 'https://github.com/supercent-io/skills-template',
    skillName: 'backend-testing',
    allowedAgents: ['tester', 'fixer', 'orchestrator'],
    description: 'API and backend test patterns and regression suites',
  },
  {
    name: 'webapp-testing',
    repo: 'https://github.com/anthropics/skills',
    skillName: 'webapp-testing',
    allowedAgents: ['tester', 'designer', 'orchestrator'],
    description: 'Systematic testing for web applications and flows',
  },
  {
    name: 'playwright-best-practices',
    repo: 'https://github.com/currents-dev/playwright-best-practices-skill',
    skillName: 'playwright-best-practices',
    allowedAgents: ['tester', 'designer', 'orchestrator'],
    description: 'Best practices for writing and maintaining Playwright tests',
  },
];

/**
 * Skills managed externally (not installed by this plugin's CLI).
 * Entries here only affect agent permission grants — nothing is installed.
 */
export const PERMISSION_ONLY_SKILLS: PermissionOnlySkill[] = [];

/**
 * Install a skill using `npx skills add`.
 * @param skill - The skill to install
 * @returns True if installation succeeded, false otherwise
 */
export function installSkill(skill: RecommendedSkill): boolean {
  const args = [
    'skills',
    'add',
    skill.repo,
    '--skill',
    skill.skillName,
    '-a',
    'opencode',
    '-y',
    '--global',
  ];

  try {
    const result = spawnSync('npx', args, { stdio: 'inherit' });
    if (result.status !== 0) {
      return false;
    }

    // Run post-install commands if any
    if (skill.postInstallCommands && skill.postInstallCommands.length > 0) {
      console.log(`Running post-install commands for ${skill.name}...`);
      for (const cmd of skill.postInstallCommands) {
        console.log(`> ${cmd}`);
        const [command, ...cmdArgs] = cmd.split(' ');
        const cmdResult = spawnSync(command, cmdArgs, { stdio: 'inherit' });
        if (cmdResult.status !== 0) {
          console.warn(`Post-install command failed: ${cmd}`);
        }
      }
    }

    return true;
  } catch (error) {
    console.error(`Failed to install skill: ${skill.name}`, error);
    return false;
  }
}

/**
 * Get permission presets for a specific agent based on recommended skills.
 * @param agentName - The name of the agent
 * @param skillList - Optional explicit list of skills to allow (overrides recommendations)
 * @returns Permission rules for the skill permission type
 */
export function getSkillPermissionsForAgent(
  agentName: string,
  skillList?: string[],
): Record<string, 'allow' | 'ask' | 'deny'> {
  // Orchestrator gets all skills by default, others are restricted
  const permissions: Record<string, 'allow' | 'ask' | 'deny'> = {
    '*': agentName === 'orchestrator' ? 'allow' : 'deny',
  };

  // If the user provided an explicit skill list (even empty), honor it
  if (skillList) {
    permissions['*'] = 'deny';
    for (const name of skillList) {
      if (name === '*') {
        permissions['*'] = 'allow';
      } else if (name.startsWith('!')) {
        permissions[name.slice(1)] = 'deny';
      } else {
        permissions[name] = 'allow';
      }
    }
    return permissions;
  }

  // Otherwise, use recommended defaults
  for (const skill of RECOMMENDED_SKILLS) {
    const isAllowed =
      skill.allowedAgents.includes('*') ||
      skill.allowedAgents.includes(agentName);
    if (isAllowed) {
      permissions[skill.skillName] = 'allow';
    }
  }

  // Apply permissions from bundled custom skills
  for (const skill of CUSTOM_SKILLS) {
    const isAllowed =
      skill.allowedAgents.includes('*') ||
      skill.allowedAgents.includes(agentName);
    if (isAllowed) {
      permissions[skill.name] = 'allow';
    }
  }

  // Apply permissions for externally-managed skills (not installed by this plugin)
  for (const skill of PERMISSION_ONLY_SKILLS) {
    const isAllowed =
      skill.allowedAgents.includes('*') ||
      skill.allowedAgents.includes(agentName);
    if (isAllowed) {
      permissions[skill.name] = 'allow';
    }
  }

  return permissions;
}
