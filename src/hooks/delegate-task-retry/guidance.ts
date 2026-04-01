import { DELEGATE_TASK_ERROR_PATTERNS, type DetectedError } from './patterns';

function extractAvailableList(output: string): string | null {
  const match = output.match(/Allowed agents:\s*(.+)$/m);
  if (match) return match[1].trim();

  const available = output.match(/Available[^:]*:\s*(.+)$/m);
  if (available) return available[1].trim();

  return null;
}

function firstAvailableAgent(available: string | null): string {
  if (!available) return 'explorer';
  const first = available
    .split(',')
    .map((s) => s.trim())
    .find(Boolean);
  return first || 'explorer';
}

export function buildRetryGuidance(errorInfo: DetectedError): string {
  const pattern = DELEGATE_TASK_ERROR_PATTERNS.find(
    (p) => p.errorType === errorInfo.errorType,
  );

  if (!pattern) {
    return '\n[delegate-task retry] Fix parameters and retry with corrected arguments.';
  }

  const available = extractAvailableList(errorInfo.originalOutput);
  const validAgent = firstAvailableAgent(available);

  const lines = [
    '',
    '[delegate-task retry suggestion]',
    `Error type: ${errorInfo.errorType}`,
    `Why failed: ${pattern.fixHint}`,
  ];

  if (available) {
    lines.push(`Allowed agent(s): ${available}`);
  }

  lines.push(
    '',
    '[correction block]',
    `- allowed_agent: ${validAgent}`,
    `- why_failed: ${errorInfo.errorType}`,
    '- valid_next_call:',
    `  background_task(description="...", prompt="Goal:\n...\n\nScope(paths):\n- exact/path.ts\n\nConstraints:\n- ...\n\nDeliverable:\n...\n\nDone-when:\n- ...", agent="${validAgent}")`,
    '',
    'Reminder: delegated task sessions are fresh sessions; include required context explicitly.',
    'Alternative valid next call:',
    'task(description="...", prompt="Goal:\n...\n\nScope(paths):\n- exact/path.ts\n\nConstraints:\n- ...\n\nDeliverable:\n...\n\nDone-when:\n- ...", category="unspecified-low", run_in_background=false, load_skills=[])',
  );

  return lines.join('\n');
}
