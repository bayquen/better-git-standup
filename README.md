## Better Git Standup >:)
---
> *An MCP server to remember the context of your work with a single LLM prompt!* 

### **"uhh Brandon, who in the flop is this for?"**
- Any technical (or *semi-technical)* folks who want to review their repo commits  
...or snoop into others' work, I won't judge ;)

### "How the flip do I use this?"
1. `git clone` this repo from your git terminal or thru GitHub Desktop. (URL ref: [Better Git Standup](https://github.com/bayquen/better-git-standup))


> ### **If using Cursor:**  
2. Click 'Settings' > 'Tools & MCP'
3. Under "Installed MCP Servers", click 'New MCP Server' to add a custom server. Cursor's `mcp.json` local file in your machine will open.
4. Inside that JSON file, add the MCP server's schema like this (with the ABSOLUTE path to the file, wherever it is in your machine):
```
{
  "mcpServers": {
    "git-standup-generation": {
      "command": "node",
      "args": ["C:/Users/user/Documents/GitHub/better-git-standup/build/index.js"]
    }
  }
}
```
> NOTE: if you have any existing MCP servers configured in `mcp.json`, there's no need to remove them. Just add the "git-standup-generation' server schema within the "mcpServers" list of objects.

- Ask an AI Agent like Cursor, Claude Code, or your preferred choice to generate stand-up messages.
> *The only requirement is having well-written `git commit` messages!*
