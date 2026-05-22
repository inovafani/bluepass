export type OperatorButtonAction = "accept" | "decline" | "counter";

const operatorButtonActions = new Set<OperatorButtonAction>([
  "accept",
  "decline",
  "counter",
]);

export function parseOperatorButtonPayload(payload: string): {
  action: OperatorButtonAction;
  bookingId: string;
} {
  const trimmed = payload.trim();

  if (!trimmed) {
    throw new Error("Invalid operator button payload: payload is empty.");
  }

  const separatorIndex = trimmed.indexOf(":");
  if (separatorIndex < 0) {
    throw new Error("Invalid operator button payload: expected action:bookingId.");
  }

  const action = trimmed.slice(0, separatorIndex).trim();
  const bookingId = trimmed.slice(separatorIndex + 1).trim();

  if (!operatorButtonActions.has(action as OperatorButtonAction)) {
    throw new Error(`Invalid operator button payload action: ${action}.`);
  }

  if (!bookingId) {
    throw new Error("Invalid operator button payload: bookingId is required.");
  }

  return {
    action: action as OperatorButtonAction,
    bookingId,
  };
}
