import ChatOpenAI from "./ChatOpenAI.js";


async function main(){
    const llm = new ChatOpenAI("gpt-4o-mini");
    const {content, toolCalls} = await llm.chat('hello');

    console.log(content);
    console.log(toolCalls);
}

main()