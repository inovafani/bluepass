import type { ActorPayload } from "@/lib/services/booking/orchestrator";

export type OperatorAction = "accept" | "decline" | "counter";

export type OperatorDispatchInput = {
  bookingId: string;
  action: OperatorAction;
  payload: ActorPayload;
};

export async function dispatchOperatorAction(_input: OperatorDispatchInput): Promise<void> {
  void _input;

  throw new Error("Not implemented yet");
}
