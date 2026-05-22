import { describe, expect, it } from "vitest";
import { splitBooking } from "@/lib/services/booking/unit-economics";

describe("splitBooking", () => {
  it("calculates a $200 commission on a $1000 booking", () => {
    const split = splitBooking(1000);

    expect(split.commission).toBe(200);
    expect(split.capApplied).toBe(false);
  });

  it("caps commission at $400 on a $5000 booking", () => {
    const split = splitBooking(5000);

    expect(split.commission).toBe(400);
    expect(split.capApplied).toBe(true);
  });

  it("keeps conservation at 5% of total", () => {
    expect(splitBooking(1000).conservation).toBe(50);
    expect(splitBooking(5000).conservation).toBe(250);
  });

  it("shares 50% of commission with an attributed creator", () => {
    const split = splitBooking(1000, true);

    expect(split.creatorShare).toBe(100);
    expect(split.bluepassNet).toBe(100);
  });

  it("calculates operator net after commission and conservation", () => {
    const split = splitBooking(1000);

    expect(split.operatorNet).toBe(750);
  });

  it("only applies the cap when uncapped commission exceeds $400", () => {
    expect(splitBooking(2000).capApplied).toBe(false);
    expect(splitBooking(2000.01).capApplied).toBe(true);
  });
});
