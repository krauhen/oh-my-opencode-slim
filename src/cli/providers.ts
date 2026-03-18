import { DEFAULT_AGENT_MCPS } from '../config/agent-mcps';
import { CUSTOM_SKILLS } from './custom-skills';
import { RECOMMENDED_SKILLS } from './skills';
import type { InstallConfig } from './types';

const SCHEMA_URL =
  'https://unpkg.com/oh-my-opencode-slim@latest/oh-my-opencode-slim.schema.json';

export const GENERATED_PRESETS = ['mgb', 'opencode-go'] as const;

// Model mappings by provider/preset.
export const MODEL_MAPPINGS = {
  mgb: {
    orchestrator: { model: 'mgb/gpt-5.5' },
    oracle: { model: 'mgb/gpt-5.5', variant: 'high' },
    council: { model: 'mgb/gpt-5.5', variant: 'high' },
    librarian: { model: 'mgb/gpt-5.5', variant: 'low' },
    explorer: { model: 'mgb/gpt-5.5', variant: 'low' },
    designer: { model: 'mgb/gpt-5.5', variant: 'medium' },
    fixer: { model: 'mgb/gpt-5.5', variant: 'low' },
    observer: { model: 'mgb/gpt-5.5' },
    tester: { model: 'mgb/gpt-5.5', variant: 'high' },
    'council-master': { model: 'mgb/gpt-5.5' },
  },
  openai: {
    orchestrator: { model: 'openai/gpt-5.5' },
    oracle: { model: 'openai/gpt-5.5', variant: 'high' },
    librarian: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    explorer: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    designer: { model: 'openai/gpt-5.4-mini', variant: 'medium' },
    fixer: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    tester: { model: 'openai/gpt-5.4-mini', variant: 'high' },
  },
  kimi: {
    orchestrator: { model: 'kimi-for-coding/k2p5' },
    oracle: { model: 'kimi-for-coding/k2p5', variant: 'high' },
    librarian: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    explorer: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    designer: { model: 'kimi-for-coding/k2p5', variant: 'medium' },
    fixer: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    tester: { model: 'kimi-for-coding/k2p5', variant: 'high' },
  },
  copilot: {
    orchestrator: { model: 'github-copilot/claude-opus-4.6' },
    oracle: { model: 'github-copilot/claude-opus-4.6', variant: 'high' },
    librarian: { model: 'github-copilot/grok-code-fast-1', variant: 'low' },
    explorer: { model: 'github-copilot/grok-code-fast-1', variant: 'low' },
    designer: {
      model: 'github-copilot/gemini-3.1-pro-preview',
      variant: 'medium',
    },
    fixer: { model: 'github-copilot/claude-sonnet-4.6', variant: 'low' },
    tester: { model: 'github-copilot/claude-sonnet-4.6', variant: 'high' },
  },
  'zai-plan': {
    orchestrator: { model: 'zai-coding-plan/glm-5' },
    oracle: { model: 'zai-coding-plan/glm-5', variant: 'high' },
    librarian: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    explorer: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    designer: { model: 'zai-coding-plan/glm-5', variant: 'medium' },
    fixer: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    tester: { model: 'zai-coding-plan/glm-5', variant: 'high' },
  },
  'opencode-go': {
    orchestrator: { model: 'opencode-go/glm-5.1' },
    oracle: { model: 'opencode-go/deepseek-v4-pro', variant: 'max' },
    council: { model: 'opencode-go/deepseek-v4-pro', variant: 'high' },
    librarian: { model: 'opencode-go/minimax-m2.7' },
    explorer: { model: 'opencode-go/minimax-m2.7' },
    designer: { model: 'opencode-go/kimi-k2.6', variant: 'medium' },
    fixer: { model: 'opencode-go/deepseek-v4-flash', variant: 'high' },
    observer: { model: 'opencode-go/kimi-k2.6' },
  },
} as const;

export type PresetName = keyof typeof MODEL_MAPPINGS;
export type GeneratedPresetName = (typeof GENERATED_PRESETS)[number];

export function isPresetName(value: string): value is PresetName {
  return Object.hasOwn(MODEL_MAPPINGS, value);
}

export function getPresetNames(): PresetName[] {
  return Object.keys(MODEL_MAPPINGS) as PresetName[];
}

export function isGeneratedPresetName(
  value: string,
): value is GeneratedPresetName {
  return GENERATED_PRESETS.includes(value as GeneratedPresetName);
}

export function getGeneratedPresetNames(): GeneratedPresetName[] {
  return [...GENERATED_PRESETS];
}

export function generateLiteConfig(
  installConfig: InstallConfig,
): Record<string, unknown> {
  const preset = installConfig.preset ?? 'mgb';
  if (!isGeneratedPresetName(preset)) {
    throw new Error(
      `Unsupported preset "${preset}". Available generated presets: ${getGeneratedPresetNames().join(', ')}`,
    );
  }

  const config: Record<string, unknown> = {
    $schema: SCHEMA_URL,
    preset,
    presets: {},
  };

  if (preset === 'opencode-go') {
    config.disabled_agents = [];
  }

  const createAgentConfig = (
    agentName: string,
    modelInfo: { model: string; variant?: string },
  ) => {
    const isOrchestrator = agentName === 'orchestrator';

    const skills = isOrchestrator
      ? ['*']
      : Array.from(
          new Set([
            ...CUSTOM_SKILLS.filter(
              (s) =>
                s.allowedAgents.includes('*') ||
                s.allowedAgents.includes(agentName),
            ).map((s) => s.name),
            ...RECOMMENDED_SKILLS.filter(
              (s) =>
                s.allowedAgents.includes('*') ||
                s.allowedAgents.includes(agentName),
            ).map((s) => s.name),
          ]),
        );

    return {
      model: modelInfo.model,
      variant: modelInfo.variant,
      skills,
      mcps:
        DEFAULT_AGENT_MCPS[agentName as keyof typeof DEFAULT_AGENT_MCPS] ?? [],
    };
  };

  const buildPreset = (mappingName: PresetName) => {
    const mapping = MODEL_MAPPINGS[mappingName];
    return Object.fromEntries(
      Object.entries(mapping).map(([agentName, modelInfo]) => [
        agentName,
        createAgentConfig(agentName, modelInfo),
      ]),
    );
  };

  const presets = config.presets as Record<string, unknown>;
  for (const presetName of GENERATED_PRESETS) {
    presets[presetName] = buildPreset(presetName);
  }

  if (installConfig.hasTmux) {
    config.tmux = {
      enabled: true,
      layout: 'main-vertical',
      main_pane_size: 60,
    };
  }

  return config;
}
