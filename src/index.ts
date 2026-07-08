import path from "path";
import ChatOpenAI from "./ChatOpenAI.js";
import MCPClient from "./MCPClient.js";
import Agent from "./Agent.js";


/* async function main(){
    const llm = new ChatOpenAI("gpt-4o-mini");
    const {content, toolCalls} = await llm.chat('hello');

    console.log(content);
    console.log(toolCalls);
}

main() */

/* const outPath = path.join(process.cwd(), 'output'); */

const currentDir = process.cwd();

const fetchMCP = new MCPClient("mcp-server-fetch", "uvx", ['mcp-server-fetch']);
const fileMCP = new MCPClient("mcp-server-file", "npx", ['-y', '@modelcontextprotocol/server-filesystem', currentDir]);

async function main(){
/*     const fetchMCP = new MCPClient('fetch', 'uvx', ['mcp-server-fetch']);
    await fetchMCP.init();

    const tools = fetchMCP.getTools();
    console.log(tools);

    await fetchMCP.close(); */

    const agent = new Agent('openai/gpt-4o-mini', [fetchMCP, fileMCP]);
    await agent.init();

    const response = await agent.invoke(`et information from https://news.ycombinator.com/, and summarise the news to ${currentDir} as a news.md file`);
    console.log(response);

   /*  await agent.close(); */
}

main();