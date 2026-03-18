import type { InstallConfig } from './types';

// Model mappings by provider - only 4 supported providers
export const MODEL_MAPPINGS = {
  openai: {
    orchestrator: { model: 'openai/gpt-5.4' },
    oracle: { model: 'openai/gpt-5.4', variant: 'high' },
    librarian: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    explorer: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    designer: { model: 'openai/gpt-5.4-mini', variant: 'medium' },
    fixer: { model: 'openai/gpt-5.4-mini', variant: 'low' },
  },
  kimi: {
    orchestrator: { model: 'kimi-for-coding/k2p5' },
    oracle: { model: 'kimi-for-coding/k2p5', variant: 'high' },
    librarian: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    explorer: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    designer: { model: 'kimi-for-coding/k2p5', variant: 'medium' },
    fixer: { model: 'kimi-for-coding/k2p5', variant: 'low' },
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
  },
  'zai-plan': {
    orchestrator: { model: 'zai-coding-plan/glm-5' },
    oracle: { model: 'zai-coding-plan/glm-5', variant: 'high' },
    librarian: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    explorer: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    designer: { model: 'zai-coding-plan/glm-5', variant: 'medium' },
    fixer: { model: 'zai-coding-plan/glm-5', variant: 'low' },
  },
} as const;

export function generateLiteConfig(
  installConfig: InstallConfig,
): Record<string, unknown> {
  const config: Record<string, unknown> = {
    preset: 'mgb',
    presets: {
      mgb: {
        orchestrator: {
          model: 'mgb/gpt-5.1',
          skills: ['*'],
          mcps: ['websearch'],
        },
        oracle: {
          model: 'mgb/gpt-5.1',
          variant: 'high',
          skills: [],
          mcps: [],
        },
        librarian: {
          model: 'mgb/gpt-5.3-codex',
          variant: 'low',
          skills: [],
          mcps: ['websearch', 'context7', 'grep_app', 'arxiv', 'raas'],
        },
        explorer: {
          model: 'mgb/gpt-5.3-codex',
          variant: 'low',
          skills: [],
          mcps: [],
        },
        designer: {
          model: 'mgb/gpt-5.3-codex',
          variant: 'medium',
          skills: ['agent-browser'],
          mcps: [],
        },
        fixer: {
          model: 'mgb/gpt-5.3-codex',
          variant: 'low',
          skills: [],
          mcps: [],
        },
      },
    },
  };

  if (installConfig.hasTmux) {
    config.tmux = {
      enabled: true,
      layout: 'main-vertical',
      main_pane_size: 60,
    };
  }

  return config;
}
