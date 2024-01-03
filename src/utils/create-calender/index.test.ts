import { describe, expect, it, vi } from "vitest";
import { createICALContentStr } from ".";
import { createUuid } from "../uuid";

// Mock so we have a stable UUID for snapshot testing
vi.mock("../uuid", async () => {
  let calls = 0;
  return {
    createUuid: () => {
      calls++;
      return `mocked-uuid-${calls}`;
    },
  };
});

describe("calendar generation", () => {
  it("outputs the expected base calendar", () => {
    const emptyCal = createICALContentStr("test-cal", []);
    expect(emptyCal).toMatchInlineSnapshot(`
      "BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//Camp Coach//Camp Plan//EN
      NAME:test-cal
      X-WR-CALNAME:test-cal
      END:VCALENDAR"
    `);
  });

  it("outputs the expected calendar with an event", () => {
    const calWithEvent = createICALContentStr("test-cal", [
      {
        arrive: new Date("2022-2-2"),
        depart: new Date("2022-2-2"),
        book: new Date("2022-2-2"),
        name: "test-event",
        id: createUuid(),
      },
    ]);
    expect(calWithEvent).toMatchInlineSnapshot(`
      "BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//Camp Coach//Camp Plan//EN
      NAME:test-cal
      X-WR-CALNAME:test-cal
      BEGIN:VEVENT
      CREATED:20240101T122520
      DTSTAMP:20240101T122520
      UID:mocked-uuid-1
      SUMMARY:Book campsite(s) for test-event
      DESCRIPTION:\\n    Trip Name: test-event\\n    Trip Start: Wednesday\\, Februa
       ry 2\\, 2022\\n    Trip End: Wednesday\\, February 2\\, 2022\\n    
      DTSTART:20220202T000000
      DTEND:20220202T000000
      BEGIN:VALARM
      UID:mocked-uuid-2
      TRIGGER:-PT15M
      ACTION:DISPLAY
      DESCRIPTION:Remindermocked-uuid-2
      END:VALARM
      BEGIN:VALARM
      UID:mocked-uuid-3
      TRIGGER:-P1D
      ACTION:DISPLAY
      DESCRIPTION:Remindermocked-uuid-3
      END:VALARM
      END:VEVENT
      END:VCALENDAR"
    `);
  });
});
