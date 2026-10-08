import { beforeEach, describe, expect, it, vi } from "vitest";
import { CourseStatus, UserRole } from "~/db/schema";

const mocks = vi.hoisted(() => ({
  getCurrentUserId: vi.fn(),
  getUserById: vi.fn(),
  getCourseById: vi.fn(),
  isUserEnrolled: vi.fn(),
  findPurchase: vi.fn(),
  resolveCountry: vi.fn(),
  getAnalyticsDashboard: vi.fn(),
}));

vi.mock("~/lib/session", () => ({
  getCurrentUserId: mocks.getCurrentUserId,
}));
vi.mock("~/services/userService", () => ({
  getUserById: mocks.getUserById,
}));
vi.mock("~/services/courseService", () => ({
  getCourseById: mocks.getCourseById,
}));
vi.mock("~/services/enrollmentService", () => ({
  isUserEnrolled: mocks.isUserEnrolled,
}));
vi.mock("~/services/purchaseService", () => ({
  findPurchase: mocks.findPurchase,
}));
vi.mock("~/lib/country.server", () => ({
  resolveCountry: mocks.resolveCountry,
}));
vi.mock("~/services/analyticsService", () => ({
  getAnalyticsDashboard: mocks.getAnalyticsDashboard,
}));

import { loader } from "./instructor.analytics.export";

function request(search = "") {
  return new Request(`http://localhost/instructor/analytics/export${search}`);
}

function load(search = "") {
  return loader({ request: request(search), params: {}, context: {} } as never);
}

function dashboard() {
  return {
    courses: [
      {
        title: "Private Cohort",
        status: CourseStatus.Published,
        instructorName: "Test Instructor",
        grossSales: 12345,
        transactions: 2,
        enrollments: 4,
        completionRate: null,
        ratingAverage: null,
        ratingCount: 4,
        firstAttemptAverage: null,
        firstAttemptMedian: null,
        quizAttemptRate: null,
      },
    ],
  };
}

describe("analytics CSV export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUserId.mockResolvedValue(7);
    mocks.getUserById.mockReturnValue({
      id: 7,
      name: "Test Instructor",
      role: UserRole.Instructor,
    });
    mocks.getAnalyticsDashboard.mockReturnValue(dashboard());
  });

  it("exports aggregate metrics with explicit definitions and suppressed outcomes", async () => {
    const response = await load("?range=30d&status=published");
    const csv = await response.text();

    expect(response.headers.get("Content-Type")).toBe(
      "text/csv; charset=utf-8"
    );
    expect(csv).toBe(
      '"Course","Status","Instructor","Gross sales USD (not earnings)","Transactions","New enrollments (learners)","Cohort completion rate","Current rating average","Current rating count","First-attempt quiz average","First-attempt quiz median","Quiz attempt rate"\n' +
        '"Private Cohort","published","Test Instructor","123.45","2","4","","","4","","",""'
    );
    expect(csv).not.toMatch(/student|answer|attempt id/i);
  });

  it("rejects a student who calls the export URL directly", async () => {
    mocks.getUserById.mockReturnValue({
      id: 7,
      name: "Test Student",
      role: UserRole.Student,
    });

    await expect(load()).rejects.toMatchObject({ init: { status: 403 } });
    expect(mocks.getAnalyticsDashboard).not.toHaveBeenCalled();
  });

  it("rejects an instructor exporting another instructor's course directly", async () => {
    mocks.getCourseById.mockReturnValue({ id: 99, instructorId: 42 });
    mocks.isUserEnrolled.mockReturnValue(false);

    await expect(load("?course=99")).rejects.toMatchObject({
      init: { status: 403 },
    });
    expect(mocks.getAnalyticsDashboard).not.toHaveBeenCalled();
  });

  it("exports the selected instructor scope for an administrator", async () => {
    mocks.getCurrentUserId.mockResolvedValue(1);
    mocks.getUserById.mockReturnValue({
      id: 1,
      name: "Admin",
      role: UserRole.Admin,
    });

    await load("?instructor=42&status=archived&range=90d");

    expect(mocks.getAnalyticsDashboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewerId: 1,
        viewerRole: UserRole.Admin,
        instructorId: 42,
        status: CourseStatus.Archived,
      })
    );
  });

  it("ignores an instructor scope supplied by an instructor", async () => {
    await load("?instructor=42&status=all");

    expect(mocks.getAnalyticsDashboard).toHaveBeenCalledWith(
      expect.objectContaining({
        viewerId: 7,
        viewerRole: UserRole.Instructor,
        instructorId: null,
        status: "all",
      })
    );
  });
});
