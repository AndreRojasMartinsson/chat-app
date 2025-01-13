import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("console messages", { minutes: 3 }, internal.messages.sendConsoleReminder);

export default crons;
