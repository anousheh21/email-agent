import type { gmail_v1 } from "googleapis";

export async function listLabels(gmail: gmail_v1.Gmail) {
  const result = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = result.data.labels;

  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }

  console.log('Labels:');

  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}