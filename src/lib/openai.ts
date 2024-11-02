import { AzureOpenAI } from "openai";

// Get environment variables
const azureOpenAIKey = process.env.AZURE_OPENAI_KEY as string;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const azureOpenAIDeployment = process.env
  .AZURE_OPENAI_DEPLOYMENT_NAME as string;
const openAIVersion = process.env.OPENAI_API_VERSION as string;
const embeddingOpenAIVersion = process.env.EMBEDDING_VERSION as string;
const embeddingApiKey = process.env.EMBEDDING_API_KEY as string; // Separate API key for embeddings
const embeddingEndpoint = process.env.EMBEDDING_ENDPOINT as string; // Separate endpoint for embeddings
const embeddingOpenAIDeployment = process.env
  .EMBEDDING_DEPLOYMENT_NAME as string;

// Check env variables
if (
  !azureOpenAIKey ||
  !azureOpenAIEndpoint ||
  !azureOpenAIDeployment ||
  !embeddingApiKey ||
  !embeddingEndpoint
) {
  throw new Error(
    "Please set all required environment variables: AZURE_OPENAI_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME, OPENAI_API_VERSION, EMBEDDING_API_KEY, EMBEDDING_ENDPOINT.",
  );
}

// Default AzureOpenAI client
const defaultClient = new AzureOpenAI({
  endpoint: azureOpenAIEndpoint,
  apiVersion: openAIVersion,
  apiKey: azureOpenAIKey,
  deployment: azureOpenAIDeployment,
});

// Embedding-specific AzureOpenAI client
const embeddingClient = new AzureOpenAI({
  endpoint: embeddingEndpoint,
  apiVersion: embeddingOpenAIVersion,
  apiKey: embeddingApiKey,
  deployment: embeddingOpenAIDeployment,
});

export const getEmbedding = async (text: string) => {
  const response = await embeddingClient.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = response.data[0]?.embedding;

  if (!embedding) {
    throw new Error("Error generating embedding");
  }

  console.log(`Embedding: ${embedding}`);
  return embedding;
};

// Export the default client for non-embedding-related API calls
export default defaultClient;

// const options: AssistantCreateParams = {
//   model: azureOpenAIDeployment, // Deployment name seen in Azure AI Studio
//   name: "Math Tutor",
//   instructions:
//     "You are a personal math tutor. Write and run JavaScript code to answer math questions.",
//   tools: [{ type: "code_interpreter" } as AssistantTool],
// };
// const role = "user";
// const message = "I need to solve the equation `3x + 11 = 14`. Can you help me?";

// // Create an assistant
// const assistantResponse: Assistant =
//   await assistantsClient.beta.assistants.create(options);
// console.log(`Assistant created: ${JSON.stringify(assistantResponse)}`);

// // Create a thread
// const assistantThread: Thread = await assistantsClient.beta.threads.create({});
// console.log(`Thread created: ${JSON.stringify(assistantThread)}`);

// // Add a user question to the thread
// const threadResponse: Message =
//   await assistantsClient.beta.threads.messages.create(assistantThread.id, {
//     role,
//     content: message,
//   });
// console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

// // Run the thread and poll it until it is in a terminal state
// const runResponse: Run = await assistantsClient.beta.threads.runs.createAndPoll(
//   assistantThread.id,
//   {
//     assistant_id: assistantResponse.id,
//   },
//   { pollIntervalMs: 500 },
// );
// console.log(`Run created:  ${JSON.stringify(runResponse)}`);

// // Get the messages
// const runMessages: MessagesPage =
//   await assistantsClient.beta.threads.messages.list(assistantThread.id);
// for await (const runMessageDatum of runMessages) {
//   for (const item of runMessageDatum.content) {
//     // types are: "image_file" or "text"
//     if (item.type === "text") {
//       console.log(`Message content: ${JSON.stringify(item.text?.value)}`);
//     }
//   }
// }
