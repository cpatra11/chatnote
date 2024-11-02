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
  !openAIVersion ||
  !embeddingApiKey ||
  !embeddingEndpoint
) {
  throw new Error(
    "Please set all required environment variables: AZURE_OPENAI_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT_NAME, OPENAI_API_VERSION, EMBEDDING_API_KEY, EMBEDDING_ENDPOINT.",
  );
}

// Default AzureOpenAI client
const defaultClient = new AzureOpenAI({
  endpoint: openAIVersion,
  apiVersion: embeddingOpenAIVersion,
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
