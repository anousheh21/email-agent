import type { gmail_v1 } from "googleapis";
import { vi } from "vitest";

function encodeBody(value: string) {
  return {
    size: Buffer.byteLength(value),
    data: Buffer.from(value).toString("base64url"),
  };
}

function headers(
  from: string,
  to: string,
  subject: string,
  date: string,
  messageId: string,
  contentType: string,
) {
  return [
    { name: "From", value: from },
    { name: "To", value: to },
    { name: "Subject", value: subject },
    { name: "Date", value: date },
    { name: "Message-ID", value: messageId },
    { name: "MIME-Version", value: "1.0" },
    { name: "Content-Type", value: contentType },
  ];
}

export const mockLabels = [
  { id: "INBOX", name: "INBOX", type: "system" },
  { id: "UNREAD", name: "UNREAD", type: "system" },
  { id: "SENT", name: "SENT", type: "system" },
  { id: "DRAFT", name: "DRAFT", type: "system" },
  { id: "SPAM", name: "SPAM", type: "system" },
  { id: "TRASH", name: "TRASH", type: "system" },
  { id: "IMPORTANT", name: "IMPORTANT", type: "system" },
  { id: "STARRED", name: "STARRED", type: "system" },
  { id: "Label_1", name: "Work", type: "user" },
  { id: "Label_2", name: "Receipts", type: "user" },
] satisfies gmail_v1.Schema$Label[];

export const mockMessages = [
  {
    id: "msg-001",
    threadId: "thread-001",
    labelIds: ["INBOX", "UNREAD"],
    snippet: "Hi Alex, are we still meeting at 10 tomorrow?",
    historyId: "1001",
    internalDate: "1787731200000",
    sizeEstimate: 512,
    payload: {
      partId: "",
      mimeType: "text/plain",
      filename: "",
      headers: headers(
        "Jamie Chen <jamie@example.com>",
        "Alex Morgan <alex@example.com>",
        "Tomorrow's meeting",
        "Wed, 26 Aug 2026 09:00:00 +0100",
        "<msg-001@example.com>",
        'text/plain; charset="UTF-8"',
      ),
      body: encodeBody("Hi Alex, are we still meeting at 10 tomorrow?\n\nJamie"),
    },
  },
  {
    id: "msg-002",
    threadId: "thread-002",
    labelIds: ["INBOX", "IMPORTANT"],
    snippet: "Your weekly project summary is ready.",
    historyId: "1002",
    internalDate: "1787644800000",
    sizeEstimate: 768,
    payload: {
      partId: "",
      mimeType: "text/html",
      filename: "",
      headers: headers(
        "Project Updates <updates@example.com>",
        "alex@example.com",
        "Weekly project summary",
        "Tue, 25 Aug 2026 09:00:00 +0100",
        "<msg-002@example.com>",
        'text/html; charset="UTF-8"',
      ),
      body: encodeBody("<p>Your weekly <strong>project summary</strong> is ready.</p>"),
    },
  },
  {
    id: "msg-003",
    threadId: "thread-003",
    labelIds: ["INBOX", "Label_1"],
    snippet: "Please review the launch plan before Friday.",
    historyId: "1003",
    internalDate: "1787558400000",
    sizeEstimate: 1024,
    payload: {
      partId: "",
      mimeType: "multipart/alternative",
      filename: "",
      headers: headers(
        "Priya Shah <priya@example.com>",
        "alex@example.com",
        "Launch plan review",
        "Mon, 24 Aug 2026 09:00:00 +0100",
        "<msg-003@example.com>",
        'multipart/alternative; boundary="alternative-003"',
      ),
      body: { size: 0 },
      parts: [
        {
          partId: "0",
          mimeType: "text/plain",
          filename: "",
          headers: [{ name: "Content-Type", value: 'text/plain; charset="UTF-8"' }],
          body: encodeBody("Please review the launch plan before Friday."),
        },
        {
          partId: "1",
          mimeType: "text/html",
          filename: "",
          headers: [{ name: "Content-Type", value: 'text/html; charset="UTF-8"' }],
          body: encodeBody("<p>Please review the <strong>launch plan</strong> before Friday.</p>"),
        },
      ],
    },
  },
  {
    id: "msg-004",
    threadId: "thread-004",
    labelIds: ["INBOX", "Label_2"],
    snippet: "Your receipt is attached.",
    historyId: "1004",
    internalDate: "1787472000000",
    sizeEstimate: 24576,
    payload: {
      partId: "",
      mimeType: "multipart/mixed",
      filename: "",
      headers: headers(
        "Example Store <receipts@example.com>",
        "alex@example.com",
        "Receipt #4821",
        "Sun, 23 Aug 2026 09:00:00 +0100",
        "<msg-004@example.com>",
        'multipart/mixed; boundary="mixed-004"',
      ),
      body: { size: 0 },
      parts: [
        {
          partId: "0",
          mimeType: "text/plain",
          filename: "",
          headers: [{ name: "Content-Type", value: 'text/plain; charset="UTF-8"' }],
          body: encodeBody("Thanks for your order. Your receipt is attached."),
        },
        {
          partId: "1",
          mimeType: "application/pdf",
          filename: "receipt-4821.pdf",
          headers: [
            { name: "Content-Type", value: 'application/pdf; name="receipt-4821.pdf"' },
            { name: "Content-Disposition", value: 'attachment; filename="receipt-4821.pdf"' },
          ],
          body: { attachmentId: "attachment-004", size: 23148 },
        },
      ],
    },
  },
  {
    id: "msg-005",
    threadId: "thread-005",
    labelIds: ["INBOX", "UNREAD", "STARRED"],
    snippet: "Five things worth reading this weekend.",
    historyId: "1005",
    internalDate: "1787385600000",
    sizeEstimate: 640,
    payload: {
      partId: "",
      mimeType: "text/plain",
      filename: "",
      headers: headers(
        "The Weekend List <newsletter@example.com>",
        "alex@example.com",
        "Five weekend reads",
        "Sat, 22 Aug 2026 09:00:00 +0100",
        "<msg-005@example.com>",
        'text/plain; charset="UTF-8"',
      ),
      body: encodeBody("Five things worth reading this weekend."),
    },
  },
  {
    id: "msg-006",
    threadId: "thread-006",
    labelIds: ["SENT"],
    snippet: "Thanks for sending the proposal. I will review it today.",
    historyId: "1006",
    internalDate: "1787299200000",
    sizeEstimate: 576,
    payload: {
      partId: "",
      mimeType: "text/plain",
      filename: "",
      headers: headers(
        "Alex Morgan <alex@example.com>",
        "Jordan Lee <jordan@example.com>",
        "Re: Proposal",
        "Fri, 21 Aug 2026 09:00:00 +0100",
        "<msg-006@example.com>",
        'text/plain; charset="UTF-8"',
      ),
      body: encodeBody("Thanks for sending the proposal. I will review it today."),
    },
  },
  {
    id: "msg-007",
    threadId: "thread-007",
    labelIds: ["DRAFT"],
    snippet: "Here are my notes from the planning session.",
    historyId: "1007",
    internalDate: "1787212800000",
    sizeEstimate: 480,
    payload: {
      partId: "",
      mimeType: "text/plain",
      filename: "",
      headers: headers(
        "Alex Morgan <alex@example.com>",
        "Team <team@example.com>",
        "Planning notes",
        "Thu, 20 Aug 2026 09:00:00 +0100",
        "<msg-007@example.com>",
        'text/plain; charset="UTF-8"',
      ),
      body: encodeBody("Here are my notes from the planning session."),
    },
  },
  {
    id: "msg-008",
    threadId: "thread-008",
    labelIds: ["INBOX"],
    snippet: "Would Tuesday afternoon work for the interview?",
    historyId: "1008",
    internalDate: "1787126400000",
    sizeEstimate: 530,
    payload: {
      partId: "",
      mimeType: "text/plain",
      filename: "",
      headers: headers(
        "Taylor Brooks <taylor@example.com>",
        "alex@example.com",
        "Interview schedule",
        "Wed, 19 Aug 2026 09:00:00 +0100",
        "<msg-008@example.com>",
        'text/plain; charset="UTF-8"',
      ),
      body: encodeBody("Would Tuesday afternoon work for the interview?"),
    },
  },
  {
    id: "msg-009",
    threadId: "thread-008",
    labelIds: ["SENT"],
    snippet: "Tuesday at 2pm works well for me.",
    historyId: "1009",
    internalDate: "1787130000000",
    sizeEstimate: 520,
    payload: {
      partId: "",
      mimeType: "text/plain",
      filename: "",
      headers: [
        ...headers(
          "Alex Morgan <alex@example.com>",
          "Taylor Brooks <taylor@example.com>",
          "Re: Interview schedule",
          "Wed, 19 Aug 2026 10:00:00 +0100",
          "<msg-009@example.com>",
          'text/plain; charset="UTF-8"',
        ),
        { name: "In-Reply-To", value: "<msg-008@example.com>" },
        { name: "References", value: "<msg-008@example.com>" },
      ],
      body: encodeBody("Tuesday at 2pm works well for me."),
    },
  },
  {
    id: "msg-010",
    threadId: "thread-010",
    labelIds: ["SPAM", "UNREAD"],
    snippet: "You have been selected for an exclusive prize.",
    historyId: "1010",
    internalDate: "1787040000000",
    sizeEstimate: 700,
    payload: {
      partId: "",
      mimeType: "text/html",
      filename: "",
      headers: headers(
        "Prize Centre <winner@example.net>",
        "alex@example.com",
        "Exclusive prize notification",
        "Tue, 18 Aug 2026 09:00:00 +0100",
        "<msg-010@example.net>",
        'text/html; charset="UTF-8"',
      ),
      body: encodeBody("<p>You have been selected for an exclusive prize.</p>"),
    },
  },
] satisfies gmail_v1.Schema$Message[];

export function createMockGmail(): gmail_v1.Gmail {
  const labelsList = vi.fn().mockImplementation(async () => ({
    data: { labels: structuredClone(mockLabels) },
  }));
  const messagesList = vi.fn().mockImplementation(async () => ({
    data: {
      messages: mockMessages.map(({ id, threadId }) => ({ id, threadId })),
      resultSizeEstimate: mockMessages.length,
    },
  }));
  const messagesGet = vi.fn().mockImplementation(async ({ id }: { id: string }) => {
    const message = mockMessages.find((candidate) => candidate.id === id);

    if (!message) {
      throw new Error(`Mock Gmail message not found: ${id}`);
    }

    return { data: structuredClone(message) };
  });

  return {
    users: {
      labels: { list: labelsList },
      messages: { list: messagesList, get: messagesGet },
    },
  } as unknown as gmail_v1.Gmail;
}
