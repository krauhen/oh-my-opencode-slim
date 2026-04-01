// Agent names
export const AGENT_ALIASES: Record<string, string> = {
  explore: 'explorer',
  'frontend-ui-ux-engineer': 'designer',
};

export const SUBAGENT_NAMES = [
  'explorer',
  'librarian',
  'oracle',
  'designer',
  'fixer',
  'observer',
  'ticket-planner',
  'council',
  'councillor',
  'council-master',
  'tester',
] as const;

export const ORCHESTRATOR_NAME = 'orchestrator' as const;

export const ALL_AGENT_NAMES = [ORCHESTRATOR_NAME, ...SUBAGENT_NAMES] as const;

// Agent name type (for use in DEFAULT_MODELS)
export type AgentName = (typeof ALL_AGENT_NAMES)[number];

// Subagent delegation rules: which agents can spawn which subagents
// orchestrator: can spawn all subagents (full delegation)
// fixer: leaf node — prompt forbids delegation; use grep/glob for lookups
// designer: cannot spawn any subagents (leaf node)
// explorer/librarian/oracle: cannot spawn any subagents (leaf nodes)
// Unknown agent types not listed here default to explorer-only access
// Which agents each agent type can spawn via delegation.
// councillor is internal — only CouncilManager spawns it.
export const ORCHESTRATABLE_AGENTS = [
  'explorer',
  'librarian',
  'oracle',
  'designer',
  'fixer',
  'observer',
  'ticket-planner',
  'tester',
  'council',
] as const;

/** Agents that cannot be disabled even if listed in disabled_agents config. */
export const PROTECTED_AGENTS = new Set(['orchestrator', 'councillor']);

/**
 * Get the list of orchestratable agents, excluding any disabled agents.
 * This is used for delegation validation at runtime.
 */
export function getOrchestratableAgents(
  disabledAgents?: Set<string>,
): string[] {
  return ORCHESTRATABLE_AGENTS.filter((name) => !disabledAgents?.has(name));
}

export const SUBAGENT_DELEGATION_RULES: Record<AgentName, readonly string[]> = {
  orchestrator: ORCHESTRATABLE_AGENTS,
  fixer: [],
  designer: [],
  explorer: [],
  librarian: [],
  oracle: [],
  observer: [],
  'ticket-planner': [],
  council: [],
  councillor: [],
  'council-master': [],
  tester: [],
};

// Default models for each agent
// orchestrator is undefined so its model is fully resolved at runtime via priority fallback
export const DEFAULT_MODELS: Record<AgentName, string | undefined> = {
  orchestrator: undefined,
  oracle: 'mgb/gpt-5.5',
  librarian: 'mgb/gpt-5.5',
  explorer: 'mgb/gpt-5.5',
  designer: 'mgb/gpt-5.5',
  fixer: 'mgb/gpt-5.5',
  observer: 'mgb/gpt-5.5',
  'ticket-planner': 'mgb/gpt-5.5',
  tester: 'mgb/gpt-5.5',
  council: 'mgb/gpt-5.5',
  councillor: 'mgb/gpt-5.5',
  'council-master': 'mgb/gpt-5.5',
};

// Polling configuration
export const POLL_INTERVAL_MS = 500;
export const POLL_INTERVAL_SLOW_MS = 1000;
export const POLL_INTERVAL_BACKGROUND_MS = 2000;

// Timeouts
export const DEFAULT_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
export const MAX_POLL_TIME_MS = 5 * 60 * 1000; // 5 minutes
export const FALLBACK_FAILOVER_TIMEOUT_MS = 15_000;

// Subagent depth limits
export const DEFAULT_MAX_SUBAGENT_DEPTH = 3;

// Workflow reminders
export const PHASE_REMINDER_TEXT = `!IMPORTANT! Recall the workflow rules:
Understand → choose the best parallelized path based on your capabilities and agents delegation rules → recall session reuse rules → execute → verify.
Fresh-session rule: treat each invocation as a fresh child session; rely only on current prompt/tool context unless resumed with task_id.
Handoff rule: delegation handoffs must be explicit and complete (Goal, Scope(paths), Constraints, Deliverable, Done-when) with exact paths/decisions.
If delegating, launch the specialist in the same turn you mention it !END!`;

export const BACKGROUND_TASK_LAUNCH_PREAMBLE = `Execution protocol:
- Treat this as a fresh child session. Do not assume parent chat details unless explicitly included here or resumed with task_id.
- The parent receives only your reduced final artifact, not your full internal transcript.
- Put all critical findings, decisions, and open questions in your final response.
- Use the provided task prompt as source of truth, then verify by reading/searching the repo with available tools.
- Expect and follow a structured handoff skeleton:
  - Goal:
  - Scope(paths):
  - Constraints:
  - Deliverable:
  - Done-when:
- If context is missing, STOP and ask only for the minimum required artifacts as explicit items (exact file paths, exact commands, or specific decisions).
- Do not proceed with assumptions when blocked by missing context.
- Output contract: concise summary, exact file paths touched, key decisions, and open questions.`;

// Tmux pane spawn delay (ms) — gives TmuxSessionManager time to create pane
export const TMUX_SPAWN_DELAY_MS = 500;

// Stagger delay (ms) between parallel councillor launches to avoid tmux collisions
export const COUNCILLOR_STAGGER_MS = 250;

// Polling stability
export const STABLE_POLLS_THRESHOLD = 3;

/** Agents that are disabled by default. Users must explicitly enable them
 *  by removing from disabled_agents and configuring an appropriate model. */
export const DEFAULT_DISABLED_AGENTS: string[] = ['observer'];
