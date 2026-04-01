/// <reference types="bun-types" />

import { describe, expect, test } from 'bun:test';
import { generateLiteConfig, MODEL_MAPPINGS } from './providers';

describe('providers', () => {
  test('MODEL_MAPPINGS includes supported providers', () => {
    const keys = Object.keys(MODEL_MAPPINGS);
    expect(keys.sort()).toEqual([
      'copilot',
      'kimi',
      'mgb',
      'openai',
      'opencode-go',
      'zai-plan',
    ]);
  });

  test('generateLiteConfig defaults to mgb and includes generated presets', () => {
    const config = generateLiteConfig({
      hasTmux: false,
      installCustomSkills: false,
      reset: false,
    });

    expect(config.$schema).toBe(
      'https://unpkg.com/oh-my-opencode-slim@latest/oh-my-opencode-slim.schema.json',
    );
    expect(config.preset).toBe('mgb');
    expect(config.disabled_agents).toBeUndefined();
    expect((config.presets as any)['opencode-go']).toBeDefined();
    expect((config.presets as any)['opencode-go'].observer.model).toBe(
      'opencode-go/kimi-k2.6',
    );
    const agents = (config.presets as any).mgb;
    expect(agents).toBeDefined();
    expect(agents.orchestrator.model).toBe('mgb/gpt-5.5');
    expect(agents.orchestrator.variant).toBeUndefined();
    expect(agents.fixer.model).toBe('mgb/gpt-5.5');
    expect(agents.fixer.variant).toBe('low');
    expect(agents['ticket-planner'].model).toBe('mgb/gpt-5.5');
    expect(agents['ticket-planner'].variant).toBe('low');
  });

  test('generateLiteConfig uses correct MGB models', () => {
    const config = generateLiteConfig({
      hasTmux: false,
      installCustomSkills: false,
      reset: false,
    });

    const agents = (config.presets as any).mgb;
    expect(agents.orchestrator.model).toBe(
      MODEL_MAPPINGS.mgb.orchestrator.model,
    );
    expect(agents.oracle.model).toBe('mgb/gpt-5.5');
    expect(agents.oracle.variant).toBe('high');
    expect(agents.librarian.model).toBe('mgb/gpt-5.5');
    expect(agents.librarian.variant).toBe('low');
    expect(agents.explorer.model).toBe('mgb/gpt-5.5');
    expect(agents.explorer.variant).toBe('low');
    expect(agents.designer.model).toBe('mgb/gpt-5.5');
    expect(agents.designer.variant).toBe('medium');
  });

  test('generateLiteConfig can set opencode-go as active preset', () => {
    const config = generateLiteConfig({
      hasTmux: false,
      installCustomSkills: false,
      preset: 'opencode-go',
      reset: false,
    });

    expect(config.preset).toBe('opencode-go');
    expect(config.disabled_agents).toEqual([]);
    expect((config.presets as any).mgb).toBeDefined();
    const agents = (config.presets as any)['opencode-go'];
    expect(agents).toBeDefined();
    expect(agents.orchestrator.model).toBe('opencode-go/glm-5.1');
    expect(agents.oracle.model).toBe('opencode-go/deepseek-v4-pro');
    expect(agents.oracle.variant).toBe('max');
    expect(agents.council.model).toBe('opencode-go/deepseek-v4-pro');
    expect(agents.council.variant).toBe('high');
    expect(agents.librarian.model).toBe('opencode-go/minimax-m2.7');
    expect(agents.explorer.model).toBe('opencode-go/minimax-m2.7');
    expect(agents.designer.model).toBe('opencode-go/kimi-k2.6');
    expect(agents.fixer.model).toBe('opencode-go/deepseek-v4-flash');
    expect(agents.fixer.variant).toBe('high');
    expect(agents.observer.model).toBe('opencode-go/kimi-k2.6');
    expect(agents['ticket-planner'].model).toBe('opencode-go/minimax-m2.7');
  });

  test('generateLiteConfig rejects unsupported preset', () => {
    expect(() =>
      generateLiteConfig({
        hasTmux: false,
        installCustomSkills: false,
        preset: 'not-real',
        reset: false,
      }),
    ).toThrow('Unsupported preset "not-real"');
  });

  test('generateLiteConfig rejects non-generated model mappings as active presets', () => {
    expect(() =>
      generateLiteConfig({
        hasTmux: false,
        installCustomSkills: false,
        preset: 'kimi',
        reset: false,
      }),
    ).toThrow('Unsupported preset "kimi"');
  });

  test('generateLiteConfig rejects inherited property names as presets', () => {
    expect(() =>
      generateLiteConfig({
        hasTmux: false,
        installCustomSkills: false,
        preset: 'toString',
        reset: false,
      }),
    ).toThrow('Unsupported preset "toString"');
  });

  test('generateLiteConfig enables tmux when requested', () => {
    const config = generateLiteConfig({
      hasTmux: true,
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
      installCustomSkills: false,
      reset: false,
    });

    const agents = (config.presets as any).mgb;
    // Orchestrator should always have '*'
    expect(agents.orchestrator.skills).toEqual(['*']);

    // Oracle should have bundled simplify
    expect(agents.oracle.skills).toContain('simplify');

    // Orchestrator should implicitly cover bundled codemap via '*'
    expect(agents.orchestrator.skills).toContain('*');

    // Explorer should have search and code navigation skills
    expect(agents.explorer.skills).toContain('agent-browser');
    expect(agents.explorer.skills).toContain('browser-use');
    expect(agents.explorer.skills).toContain('search');
    expect(agents.explorer.skills).toContain('codebase-search');

    // Designer should have browser + design-focused skills
    expect(agents.designer.skills).toContain('agent-browser');
    expect(agents.designer.skills).toContain('web-design-guidelines');
    expect(agents.designer.skills).toContain('frontend-design');
    expect(agents.designer.skills).toContain('ui-ux-pro-max');
    expect(agents.designer.skills).toContain('polish');
    expect(agents.designer.skills).toContain('responsive-design');

    // Fixer should have implementation and workflow skills
    expect(agents.fixer.skills).toContain('copilot-coding-agent');
    expect(agents.fixer.skills).toContain('task-planning');
    expect(agents.fixer.skills).toContain('code-refactoring');
    expect(agents.fixer.skills).toContain('deployment-automation');
    expect(agents.fixer.skills).toContain('git-workflow');

    // Ticket planner should have planning/documentation/search skills
    expect(agents['ticket-planner'].skills).toContain('search');
    expect(agents['ticket-planner'].skills).toContain('codebase-search');
    expect(agents['ticket-planner'].skills).toContain('api-documentation');
    expect(agents['ticket-planner'].skills).toContain('technical-writing');
    expect(agents['ticket-planner'].skills).toContain('task-planning');
  });

  test('generateLiteConfig includes mcps field', () => {
    const config = generateLiteConfig({
      hasTmux: false,
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
      installCustomSkills: false,
      reset: false,
    });

    const agents = (config.presets as any).mgb;
    expect(agents.orchestrator.mcps).toEqual(['*', '!context7']);
    expect(agents.librarian.mcps).toContain('websearch');
    expect(agents.librarian.mcps).toContain('context7');
    expect(agents.librarian.mcps).toContain('grep_app');
    expect(agents.designer.mcps).toEqual([]);
  });
});
