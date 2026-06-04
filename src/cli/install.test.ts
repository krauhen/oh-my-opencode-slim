/// <reference types="bun-types" />

import { afterEach, describe, expect, mock, test } from 'bun:test';
import { shouldOverwriteExistingConfig } from './install';

describe('install overwrite handling', () => {
  const originalIsTty = process.stdin.isTTY;

  afterEach(() => {
    Object.defineProperty(process.stdin, 'isTTY', {
      configurable: true,
      value: originalIsTty,
    });
  });

  test('allows reset to overwrite existing config without prompting', async () => {
    const confirm = mock(() => Promise.resolve(false));

    const result = await shouldOverwriteExistingConfig(
      {
        hasTmux: false,
        installCustomSkills: false,
        reset: true,
        tui: false,
      },
      '/tmp/oh-my-opencode-slim.json',
      confirm,
    );

    expect(result).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
  });

  test('skips existing config in non-interactive mode', async () => {
    const confirm = mock(() => Promise.resolve(true));

    const result = await shouldOverwriteExistingConfig(
      {
        hasTmux: false,
        installCustomSkills: false,
        reset: false,
        tui: false,
      },
      '/tmp/oh-my-opencode-slim.json',
      confirm,
    );

    expect(result).toBe(false);
    expect(confirm).not.toHaveBeenCalled();
  });

  test('prompts interactive users before overwriting existing config', async () => {
    const confirm = mock(() => Promise.resolve(false));
    Object.defineProperty(process.stdin, 'isTTY', {
      configurable: true,
      value: true,
    });

    const result = await shouldOverwriteExistingConfig(
      {
        hasTmux: false,
        installCustomSkills: false,
        reset: false,
        tui: true,
      },
      '/tmp/oh-my-opencode-slim.json',
      confirm,
    );

    expect(result).toBe(false);
    expect(confirm).toHaveBeenCalledWith(
      'Configuration already exists at /tmp/oh-my-opencode-slim.json. ' +
        'Overwrite with default settings?',
      false,
    );
  });
});
