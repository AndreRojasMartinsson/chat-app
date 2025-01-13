import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

const reminders = [
  "Please be respectful to others in the chat room.",
  "No spamming or flooding the chat with messages.",
  "Keep the chat on-topic and relevant to the discussion.",
  "Avoid sharing personal information in the chat.",
  "Use appropriate language; no profanity or offensive terms.",
  "Report any inappropriate behavior to the moderators.",
  "Please refrain from advertising or self-promotion.",
  "Stay kind and supportive; we're here to help each other.",
  "Do not share any illegal content or links.",
  "Avoid posting the same message multiple times.",
  "Engage in constructive conversations; avoid arguments.",
  "Respect everyone's opinions, even if you disagree.",
  "Keep messages concise and easy to understand.",
  "Do not harass or bully others in the chat.",
  "Avoid posting irrelevant or off-topic content.",
  "Follow the community guidelines at all times.",
  "Help maintain a positive and welcoming environment.",
  "No impersonating other users or moderators.",
  "Avoid using excessive emojis or capital letters.",
  "Respect the moderators and their decisions.",
  "Do not share links to unverified or malicious sites.",
  "Be mindful of cultural and language differences.",
  "Stay patient; responses might take a little time.",
  "If you need help, don't hesitate to ask!",
  "Thank you for being a part of our community!",
];

export const get = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.query("messages").order("desc").paginate(args.paginationOpts);
  },
});

export const createMessage = mutation({
  args: { message: v.string(), username: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      text: args.message,
      username: args.username,
    });

    return id;
  },
});

export const sendExpiringMessage = mutation({
  args: { message: v.string(), username: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      text: args.message,
      username: args.username,
    });

    await ctx.scheduler.runAfter(5_000, internal.messages.destruct, { messageId: id });
  },
});

export const destruct = internalMutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { text: "*** SELF DESTRUCTED ***" });
  },
});

function RandomNumberRange(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

export const sendConsoleReminder = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("messages", {
      username: "<CONSOLE>",
      text: reminders[RandomNumberRange(reminders.length - 1)],
    });
  },
});
