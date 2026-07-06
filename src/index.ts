import ChatOpenAI from "./ChatOpenAI.js";
import MCPClient from "./MCPClient.js";


/* async function main(){
    const llm = new ChatOpenAI("gpt-4o-mini");
    const {content, toolCalls} = await llm.chat('hello');

    console.log(content);
    console.log(toolCalls);
}

main() */

async function main(){
    const fetchMCP = new MCPClient('fetch', 'uvx', ['mcp-server-fetch']);
    await fetchMCP.init();

    const tools = fetchMCP.getTools();
    console.log(tools);

    await fetchMCP.close();
}

main();