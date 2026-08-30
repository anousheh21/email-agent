import { afterEach, expect, test, vi } from "vitest";

import { listLabels } from "../../src/tools/getLabels.ts";
import { createMockGmail, mockLabels } from "./helpers/mockTestData.ts";

afterEach(() => {
  vi.restoreAllMocks();
});

test("test labels are listed correctly", async () => {
  const gmail = createMockGmail();
  const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

  await listLabels(gmail);

  expect(gmail.users.labels.list).toHaveBeenCalledWith({ userId: "me" });
  expect(consoleLog.mock.calls).toEqual([
    ["Labels:"],
    ...mockLabels.map((label) => [`- ${label.name}`]),
  ]);
});
