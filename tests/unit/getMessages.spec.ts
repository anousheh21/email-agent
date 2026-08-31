import { expect, test } from "vitest";

import {
  getMessage,
  getMessagesIds,
  getMessagesWithAttributes,
} from "../../src/tools/getMessages.ts";
import { createMockGmail, mockMessages } from "./helpers/mockTestData.ts";

test("getMessageIds returns messageIds correctly", async () => {
  const gmail = createMockGmail();

  const messageIds = await getMessagesIds(gmail);

  expect(messageIds).toEqual(
    mockMessages.map(({ id, threadId }) => ({ id, threadId })),
  );
});

test("getMessage returns correct message based on ID", async () => {
  const gmail = createMockGmail();
  const expectedMessage = mockMessages[0];

  const message = await getMessage(gmail, expectedMessage.id);

  expect(message?.data).toEqual(expectedMessage);
});

test("getMessagesWithAttributes returns all unread messages when 'UNREAD' label is passed as the labelId parameter.", async () => {
  const gmail = createMockGmail();
  const unreadMessages = mockMessages.filter((message) =>
    message.labelIds.includes("UNREAD"),
  );

  const messages = await getMessagesWithAttributes(gmail, mockMessages, "UNREAD");

  expect(messages).toEqual(
    unreadMessages.map((message) => ({ data: message })),
  );
});
