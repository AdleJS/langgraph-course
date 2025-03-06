import { StateGraph, Annotation } from "@langchain/langgraph";
import { config } from "dotenv";


config();


const StateAnnotation = Annotation.Root({
    graphState: Annotation<string>,
});

function firstNode(state: typeof StateAnnotation.State) {
    console.log("---Node 1---");
    return { graphState: state["graphState"] + " I am" };
}

function secondNode(state: typeof StateAnnotation.State) {
    console.log("---Node 2---");
    return { graphState: state["graphState"] + " happy!" };
}

function thirdNode(state: typeof StateAnnotation.State) {
    console.log("---Node 3---");
    return { graphState: state["graphState"] + " sad!" };
}

function decideMood(state: typeof StateAnnotation.State) {
    console.log("---Decision---");

    if (state["graphState"].includes("happy")) {
        return "secondNode";
    } else {
        return "thirdNode";
    }
}

const workflow = new StateGraph(StateAnnotation)
    .addNode("firstNode", firstNode)
    .addNode("secondNode", secondNode)
    .addNode("thirdNode", thirdNode)
    .addEdge("__start__", "firstNode")
    .addConditionalEdges("firstNode", decideMood)
    .addEdge("secondNode", "__end__")
    .addEdge("thirdNode", "__end__")
    .compile();

const result = await workflow.invoke({ graphState: "Hello, this is Adilet" });
console.log(result);