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
// Which agents each agent type can spawn via background_task tool.
// councillor and council-master are internal — only CouncilManager spawns them.
export const ORCHESTRATABLE_AGENTS = [
  'explorer',
  'librarian',
  'oracle',
  'designer',
  'fixer',
  'ticket-planner',
  'tester',
  'council',
] as const;

export const SUBAGENT_DELEGATION_RULES: Record<AgentName, readonly string[]> = {
  orchestrator: ORCHESTRATABLE_AGENTS,
  fixer: [],
  designer: [],
  explorer: [],
  librarian: [],
  oracle: [],
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
  oracle: 'openai/gpt-5.4',
  librarian: 'openai/gpt-5.4-mini',
  explorer: 'openai/gpt-5.4-mini',
  designer: 'openai/gpt-5.4-mini',
  fixer: 'openai/gpt-5.4-mini',
  'ticket-planner': 'openai/gpt-5.4-mini',
  tester: 'openai/gpt-5.4-mini',
  council: 'openai/gpt-5.4-mini',
  councillor: 'openai/gpt-5.4-mini',
  'council-master': 'openai/gpt-5.4-mini',
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
export const PHASE_REMINDER_TEXT = `Fresh-session rule: treat each invocation as a fresh child session; rely only on current prompt/tool context unless resumed with task_id.
Handoff rule: delegation handoffs must be explicit and complete (Goal, Scope(paths), Constraints, Deliverable, Done-when) with exact paths/decisions.`;

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
