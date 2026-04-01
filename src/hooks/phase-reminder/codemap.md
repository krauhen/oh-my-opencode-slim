# src/hooks/phase-reminder/

## Responsibility

Keep orchestrator and user-facing specialist guidance aligned over long turns by appending a phase reminder text part to the latest user message before the next LLM request.

## Design

- `PHASE_REMINDER` constant is composed from `PHASE_REMINDER_TEXT` (`config/constants.ts`).
- `createPhaseReminderHook()` returns a single `experimental.chat.messages.transform` handler.
- Message filtering is role/agent-aware:
  - locates the latest `'user'` role in `output.messages`,
  - only mutates if there is no explicit agent or the agent is in the reminder allowlist,
  - no-op for internal control messages containing `SLIM_INTERNAL_INITIATOR_MARKER`.
- Mutation target is the message parts array; reminder text is appended as a separate text part to avoid leaking into UI/history.
- Uses `SLIM_INTERNAL_INITIATOR_MARKER` from `../../utils` to avoid feedback loops.

## Flow

1. On transform, scan backward through `messages` for last `info.role === 'user'`.
2. If agent is not in the reminder allowlist, return.
3. Locate first part where `type === 'text'`.
4. If marker exists, return.
5. Append `PHASE_REMINDER` as a separate text part.

## Integration

- Registered through `src/hooks/index.ts` and plugin-level hook wiring in `src/index.ts`.
- Consumes `experimental.chat.messages.transform` and mutates the outgoing `messages` payload only.
- Does not depend on stateful services; no network or client APIs are required.
