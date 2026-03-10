import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.ts";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// TODO: Figure out the API (if any) or Git commands needed to be accessed
const API = "";
const USER_AGENT = "";

// Create a server instance
const server = new McpServer({
    name: "git-standup-generation",
    version: "1.0.0",
});