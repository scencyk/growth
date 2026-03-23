#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PostHogAgentToolkit } from "@posthog/agent-toolkit";
import { z } from "zod";

const apiKey = process.env.POSTHOG_API_KEY;
const baseUrl = process.env.POSTHOG_BASE_URL || "https://us.posthog.com";

if (!apiKey) {
  console.error("POSTHOG_API_KEY is required");
  process.exit(1);
}

const server = new McpServer({
  name: "PostHog",
  version: "1.0.0",
});

// Get tools from the toolkit
const { getToolsFromContext } = await import("@posthog/agent-toolkit");

// Build a minimal context
const context = {
  apiToken: apiKey,
  baseApiUrl: baseUrl,
  state: {},
};

const tools = getToolsFromContext(context);

// Register each tool with the MCP server
for (const tool of tools) {
  const shape = tool.schema?.shape || {};
  server.tool(
    tool.name,
    tool.description || tool.title || tool.name,
    shape,
    async (params) => {
      try {
        const result = await tool.handler(context, params);
        return {
          content: [
            {
              type: "text",
              text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}

// Connect via stdio
const transport = new StdioServerTransport();
await server.connect(transport);
