/**
 * Post-tool nudge - appends a short action cue after file reads/writes.
 * Keeps reminder focused right after file operations.
 */

const POST_FILE_TOOL_NUDGE =
  '\n\n---\nFile op complete. If this needs a specialist, delegate now; if you claim one, launch it this turn.';

interface ToolExecuteAfterInput {
  tool: string;
  sessionID?: string;
  callID?: string;
}

interface ToolExecuteAfterOutput {
  output?: unknown;
}

interface PostFileToolNudgeOptions {
  shouldInject?: (sessionID: string) => boolean;
}

const FILE_TOOLS = new Set(['Read', 'read', 'Write', 'write']);

export function createPostFileToolNudgeHook(
  options: PostFileToolNudgeOptions = {},
) {
  function appendReminder(output: ToolExecuteAfterOutput): void {
    if (typeof output.output !== 'string') {
      return;
    }

    if (output.output.includes(POST_FILE_TOOL_NUDGE)) {
      return;
    }

    output.output = [
      output.output,
      '',
      '<internal_reminder>',
      POST_FILE_TOOL_NUDGE,
      '</internal_reminder>',
    ].join('\n');
  }

  return {
    'tool.execute.after': async (
      input: ToolExecuteAfterInput,
      output: ToolExecuteAfterOutput,
    ): Promise<void> => {
      if (!FILE_TOOLS.has(input.tool) || !input.sessionID) {
        return;
      }

      if (options.shouldInject && !options.shouldInject(input.sessionID)) {
        return;
      }

      appendReminder(output);
    },
  };
}
