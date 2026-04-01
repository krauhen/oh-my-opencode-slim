/// <reference types="bun-types" />

import { describe, expect, test } from 'bun:test';
import { generateLiteConfig, MODEL_MAPPINGS } from './providers';

describe('providers', () => {
  test('MODEL_MAPPINGS has exactly 4 providers', () => {
    const keys = Object.keys(MODEL_MAPPINGS);
    expect(keys.sort()).toEqual(['copilot', 'kimi', 'openai', 'zai-plan']);
  });

  test('generateLiteConfig always generates mgb preset', () => {
    const config = generateLiteConfig({
      hasTmux: false,
      installSkills: false,
      installCustomSkills: false,
      reset: false,
    });

    expect(config.preset).toBe('mgb');
    const agents = (config.presets as any).mgb;
    expect(agents).toBeDefined();
    expect(agents.orchestrator.model).toBe('mgb/gpt-5.3-codex');
    expect(agents.orchestrator.variant).toBeUndefined();
    expect(agents.fixer.model).toBe('mgb/gpt-5.3-codex');
    expect(agents.fixer.variant).toBe('low');
    expect(agents['ticket-planner'].model).toBe('mgb/gpt-5.3-codex');
    expect(agents['ticket-planner'].variant).toBe('low');
  });

  test('generateLiteConfig uses correct MGB models', () => {
    const config = generateLiteConfig({
      hasTmux: false,
      installSkills: false,
      installCustomSkills: false,
      reset: false,
    });

    const agents = (config.presets as any).mgb;
    expect(agents.orchestrator.model).toBe('mgb/gpt-5.3-codex');
    expect(agents.oracle.model).toBe('mgb/gpt-5.3-codex');
    expect(agents.oracle.variant).toBe('high');
    expect(agents.librarian.model).toBe('mgb/gpt-5.3-codex');
    expect(agents.librarian.variant).toBe('low');
    expect(agents.explorer.model).toBe('mgb/gpt-5.3-codex');
    expect(agents.explorer.variant).toBe('low');
    expect(agents.designer.model).toBe('mgb/gpt-5.3-codex');
    expect(agents.designer.variant).toBe('medium');
  });

  test('generateLiteConfig enables tmux when requested', () => {
    const config = generateLiteConfig({
      hasTmux: true,
      installSkills: false,
      installCustomSkills: false,
      reset: false,
    });

    expect(config.tmux).toBeDefined();
    expect((config.tmux as any).enabled).toBe(true);
    expect((config.tmux as any).layout).toBe('main-vertical');
  });

  test('generateLiteConfig includes default skills', () => {
    const config = generateLiteConfig({
      hasTmux: false,
      installSkills: true,
      installCustomSkills: false,
      reset: false,
    });

    const agents = (config.presets as any).mgb;
    // Orchestrator should always have '*'
    expect(agents.orchestrator.skills).toEqual(['*']);

    // Explorer should have search and code navigation skills
    expect(agents.explorer.skills).toEqual([
      'agent-browser',
      'browser-use',
      'search',
      'codebase-search',
    ]);

    // Designer should have browser + design-focused skills
    expect(agents.designer.skills).toEqual([
      'agent-browser',
      'web-design-guidelines',
      'frontend-design',
      'ui-ux-pro-max',
      'polish',
      'responsive-design',
    ]);

    // Fixer should have implementation and workflow skills
    expect(agents.fixer.skills).toEqual([
      'copilot-coding-agent',
      'task-planning',
      'code-refactoring',
      'deployment-automation',
      'git-workflow',
    ]);

    // Ticket planner should have planning/documentation/search skills
    expect(agents['ticket-planner'].skills).toEqual([
      'search',
      'codebase-search',
      'api-documentation',
      'technical-writing',
      'task-planning',
    ]);
  });

  test('generateLiteConfig includes mcps field', () => {
    const config = generateLiteConfig({
      hasTmux: false,
      installSkills: false,
      installCustomSkills: false,
      reset: false,
    });

    const agents = (config.presets as any).mgb;
    expect(agents.orchestrator.mcps).toBeDefined();
    expect(Array.isArray(agents.orchestrator.mcps)).toBe(true);
    expect(agents.librarian.mcps).toBeDefined();
    expect(Array.isArray(agents.librarian.mcps)).toBe(true);
  });

  test('generateLiteConfig mgb includes correct mcps', () => {
    const config = generateLiteConfig({
      hasTmux: false,
      installSkills: false,
      installCustomSkills: false,
      reset: false,
    });

    const agents = (config.presets as any).mgb;
    expect(agents.orchestrator.mcps).toContain('*');
    expect(agents.librarian.mcps).toContain('websearch');
    expect(agents.librarian.mcps).toContain('context7');
    expect(agents.librarian.mcps).toContain('grep_app');
    expect(agents.librarian.mcps).toContain('arxiv');
    expect(agents.librarian.mcps).toContain('raas');
    expect(agents.designer.mcps).toEqual([]);
  });
});
