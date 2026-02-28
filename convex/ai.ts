"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const generateResponse = internalAction({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.runQuery(internal.aiHelpers.getDoc, {
      documentId: args.documentId,
    });
    if (!doc) return;

    const knowledge = await ctx.runQuery(internal.aiHelpers.getKnowledge, {
      documentId: args.documentId,
    });

    const chatHistory = await ctx.runQuery(internal.aiHelpers.getChatHistory, {
      documentId: args.documentId,
    });

    const systemPrompt = buildSystemPrompt(
      doc.title,
      doc.content,
      knowledge,
      chatHistory
    );

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...chatHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      await ctx.runMutation(internal.aiHelpers.saveAssistantMessage, {
        documentId: args.documentId,
        userId: args.userId,
        content:
          "I'm sorry, I encountered an error generating a response. Please check that your OpenAI API key is configured correctly.",
      });
      return;
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    await ctx.runMutation(internal.aiHelpers.saveAssistantMessage, {
      documentId: args.documentId,
      userId: args.userId,
      content: assistantMessage,
    });
  },
});

function buildSystemPrompt(
  title: string,
  content: string,
  knowledge: Array<{ title: string; content: string }>,
  _chatHistory: Array<{ role: string; content: string }>
): string {
  let prompt = `You are an AI writing assistant for a document titled "${title}". Help the user write, edit, and refine their document. Provide clear, well-structured prose. When the user asks you to write or edit text, provide the text directly without extra commentary unless they ask for explanation.\n\n`;

  if (knowledge.length > 0) {
    prompt += "The user has provided the following reference materials:\n\n";
    for (const item of knowledge) {
      prompt += `--- ${item.title} ---\n${item.content}\n\n`;
    }
    prompt +=
      "Reference these materials when relevant to the user's requests.\n\n";
  }

  if (content) {
    prompt += `The current document content is:\n\n${content}\n\n`;
  } else {
    prompt += "The document is currently empty.\n\n";
  }

  return prompt;
}
