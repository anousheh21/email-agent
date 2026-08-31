import type { gmail_v1 } from 'googleapis';
import type { GaxiosResponse } from 'gaxios';


export async function getMessagesIds(gmail: gmail_v1.Gmail) {
  // TODO: can you edit this function so that the ids get are more custom? Like get more messages, get a particular number of messages, etc.

  const result = await gmail.users.messages.list({
    userId: 'me',
  });

  const messages = result.data.messages;

  if(!messages || messages.length === 0) {
    console.log('No messages found');
    return;
  }

  return messages;
}

export async function getMessage(gmail: gmail_v1.Gmail, id: string | null | undefined) {
  if(id === null || id === undefined) {
    console.log("Error: no related messages found");
    return;
  }

  const result = await gmail.users.messages.get({
    userId: 'me',
    id: id,
  });

  return result;
}

// Get all messages with attribute
export async function getMessagesWithAttributes(gmail: gmail_v1.Gmail, messages: gmail_v1.Schema$Message[] | undefined, labelId?: string) {
  // TODO: this function currently gets messages based on label only. If you want to add more attributes that you can get messages based on, add to this function!

  if (messages === undefined) {
    console.log("No messages present");
    return;
  }

  const messageArray = await Promise.all(
    messages.map((message) => getMessage(gmail, message.id))
  )

  let filteredByLabel: (GaxiosResponse<gmail_v1.Schema$Message> | undefined)[] = [];

  if(labelId) {
    filteredByLabel = messageArray.filter((message) => {
      return message?.data.labelIds?.includes(labelId);
    })
  } else {
    console.log("no label id provided");
  }

  if (filteredByLabel.length > 0) {
    for (const message of filteredByLabel) {
      console.log(`${message?.data.snippet} has labels ${message?.data.labelIds}`);
    }

    return filteredByLabel;
  } else {
    console.log("No messages match this label");
  }
}