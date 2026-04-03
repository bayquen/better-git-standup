import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync } from "child_process";  // For passing & executing shell/git commands synchronously + returning its output

// TODO: Figure out the API (if any) or Git commands needed to be accessed
const API = "";
const USER_AGENT = "";

// Create a server instance
const server = new McpServer({
    name: "git-standup-generation",
    version: "1.0.0",
});

server.registerTool(
    "get_commits",
    {
        title: "Get Git Commits",
        description: "Reads current repo's git commit history with date filters",
        inputSchema: {
            repo_path: z.string().describe("Absolute path to git repo folder"),
            max_commits: z.number().int().optional().describe("Max number of commits to list"),
            time_period: z.enum(["yesterday", "today", "this_week"]),
        },
    },
    async ({ repo_path, max_commits, time_period }: {
        repo_path: string;
        max_commits: number | undefined;
        time_period: "yesterday" | "today" | "this_week";
    }) => {
        let since_date: string = "";
        let until_date: string = "";

        const today = new Date();
        const todayString = today.toISOString().slice(0, 10);

        switch (time_period) {
            case "yesterday":
                // Get yesterday's date
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                since_date = yesterday.toISOString().slice(0, 10);
                until_date = todayString;
                break;
            case "today":
                since_date = todayString;
                // Get tomorrow's date
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                until_date = tomorrow.toISOString().slice(0, 10);
                break;
            case "this_week":
                since_date = todayString;
                
                const startOfWeek = new Date(today);
                // Get start of week's date (that Monday of the week)
                // Calculation: [today's date] - [number from 0 to 6 representing day of the week] + 1 (since Monday = 1 in getDay())
                // e.g. If today is Wednesday the 26th, then: 26 - 3 + 1 = 24 (last Monday's date)
                startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                
                since_date = startOfWeek.toISOString().slice(0, 10);
                until_date = todayString;
                break;
            // Add default case. This tells TypeScript that if we reach this case, we always have valid dates.
            default:
                throw new Error(`Unknown time period: ${time_period}`);
        }

        // Execute git log command with Node's execSync() function
        const output = execSync(
            `git log --since="${since_date}" --until="${until_date}" --format="%H|%s|%ai"`,
            { cwd: repo_path }
        );
        // TODO: Implement git logic
        let formatted_output = output.toString();
        const commits = formatted_output
            .split('\n')
            .filter((line: string) => line.trim())
            .map((line: string) => {
                const [hash, message, date] = line.split('|');
                return { hash, message, date };
            });

        return {
            content: [{ type: "text", text: JSON.stringify(commits) }]
        };
    }
);

server.registerTool(
    "generate_standup_message",
    {
        title: "Generate Standup Message",
        description: "Takes raw commit history from get_commits() tool and formats it into a descriptive, professional standup message (e.g. 'Yesterday I fixed bug X, added feature Y')",
        inputSchema: {
            commits: z
                .array(
                    z.object({
                        hash: z.string(),
                        message: z.string(),
                        author: z.string().optional(),
                        date: z.string()
                    })
                )
                .describe("Array of git commit objects from get_commits tool"),
            time_period: z
                .enum(["today", "yesterday", "this_week"])
                .default("yesterday")
                .describe("What time period the standup covers"),
        },
    },
    async ({ commits, time_period }: {
        commits: Array<{
            hash: string;
            message: string;
            date: string;    // from `git log --format ...`
        }>;
        time_period: "today" | "yesterday" | "this_week";
    }) => {
        // Format commits into standup text; loops thru each commit and displays each as a bullet.
        // E.g: "
        //      Today's Standup:
        //      • Fixed login bug (a1b2c3d4)
        //      • Added dark mode (e5f6g7h8)
        //      "
        const message = `**${time_period.charAt(0).toUpperCase() + time_period.slice(1)}'s Standup:**\n\n` +
            commits.map(c => `• ${c.message} (${c.hash.slice(0, 8)})`).join('\n');
        return { content: [{ type: "text", text: message }] };
    }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Git standup generation MCP server now running on stdio!");