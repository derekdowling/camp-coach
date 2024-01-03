import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getEventFillAroundEvents, getEventFillForDateRange } from ".";
import { addDays, addWeeks, isFriday, isSunday, nextFriday } from "date-fns";
import { PlannedEvent } from "..";

function mockEvent(overrides?: Partial<PlannedEvent>): PlannedEvent {
  return {
    id: "test-123",
    name: "test-event",
    arrive: new Date(),
    depart: addDays(new Date(), 1),
    book: new Date(),
    ...overrides,
  };
}

describe("suggestions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getEventFillForDateRange", () => {
    it("fills in events at 1 week density for a date range", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 1,
      });
      expect(result).toHaveLength(4);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });

    it("fills in events at 1 week density with minDate padding", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 1,
        requireFillGapFromMinDate: true,
      });
      expect(result).toHaveLength(3);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });

    it("fills in events at 1 week density with maxDate padding", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 1,
        requireFillGapFromMaxDate: true,
      });
      expect(result).toHaveLength(3);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });

    it("fills in events at 1 week density with min + max padding", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 1,
        requireFillGapFromMaxDate: true,
        requireFillGapFromMinDate: true,
      });
      expect(result).toHaveLength(2);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });

    it("fills at 2 week density for the date range", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 2,
      });
      expect(result).toHaveLength(2);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });

    it("fills in events at 2 week density with minDate padding", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 2,
        requireFillGapFromMinDate: true,
      });
      expect(result).toHaveLength(1);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });

    it("fills at 3 week density for the date range", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 3,
      });
      expect(result).toHaveLength(2);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });

    it("fills at 4 week density for the date range", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 4,
      });
      expect(result).toHaveLength(1);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });

    it("fills at 5 week density for the date range", () => {
      const result = getEventFillForDateRange({
        minDate: new Date(),
        maxDate: addWeeks(new Date(), 4),
        minFillGapWeeks: 5,
      });
      console.log(result);
      expect(result).toHaveLength(0);

      for (const event of result) {
        expect(isFriday(event.arrive)).toBeTruthy();
        expect(isSunday(event.depart)).toBeTruthy();
      }
    });
  });

  describe("getEventFillAroundEvents", () => {
    it("generates fill when there are no existing events", () => {
      const minDate = new Date();
      const maxDate = addWeeks(new Date(), 4);

      const result = getEventFillAroundEvents({
        initialEvents: [],
        minDate,
        maxDate,
        minFillGapWeeks: 1,
      });

      expect(result).toHaveLength(4);
    });

    it("doesn't fill if there is no room", () => {
      const minDate = nextFriday(new Date());
      const maxDate = addWeeks(new Date(), 4);

      const result = getEventFillAroundEvents({
        initialEvents: [
          mockEvent({
            arrive: addWeeks(minDate, 1),
            depart: addWeeks(minDate, 1),
          }),
        ],
        minDate,
        maxDate,
        minFillGapWeeks: 2,
      });
      expect(result).toHaveLength(1);
    });

    it("fills if there is room", () => {
      const minDate = nextFriday(new Date());
      const maxDate = addWeeks(new Date(), 6);

      const result = getEventFillAroundEvents({
        initialEvents: [
          mockEvent({
            arrive: addWeeks(minDate, 1),
            depart: addWeeks(minDate, 1),
          }),
        ],
        minDate,
        maxDate,
        minFillGapWeeks: 2,
      });
      expect(result).toHaveLength(3);
    });
  });
});
