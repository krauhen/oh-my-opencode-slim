/**
 * Post-tool nudge - appends a short action cue after file reads/writes.
 * Keeps reminder focused right after file operations.
 */

const NUDGE =
  '\n\n---\nFile op complete. If this needs a specialist, delegate now; if you claim one, launch it this turn.';

interface ToolExecuteAfterInput {
  tool: string;
  sessionID?: string;
  callID?: string;
}

interface ToolExecuteAfterOutput {
  title: string;
  output: string;
  metadata: Record<string, unknown>;
}

export function createPostFileToolNudgeHook() {
  return {
    'tool.execute.after': async (
      input: ToolExecuteAfterInput,
      output: ToolExecuteAfterOutput,
    ): Promise<void> => {
      // Only nudge for Read/Write tools
      if (
        input.tool !== 'Read' &&
        input.tool !== 'read' &&
        input.tool !== 'Write' &&
        input.tool !== 'write'
      ) {
        return;
      }

      // Append the nudge
      output.output = output.output + NUDGE;
    },
  };
}
