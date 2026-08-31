import type { gmail_v1 } from 'googleapis';

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
export async function getMessagesWithAttributes(gmail: gmail_v1.Gmail, messages: gmail_v1.Schema$Message[] | undefined) {

  if (messages === undefined) {
    console.log("No messages present");
    return;
  }
  // First just want to get a list of messages, if no attributes are present

  // Gets all message snippets
  messages.forEach( async (message) => {
    const messageData = await getMessage(gmail, message.id);
    const messageSnippet = messageData?.data.snippet;
    console.log(messageSnippet);
  })
}


// Function that takes in a label as a parameter, and lists all emails with that label
// Might get rid of this if getMessagesWithAttributes covers this
export async function getMessagesWithLabel(labelId: string) {

}

// type Label = {
//   id: string,
//   name: string
//   type: string
// }