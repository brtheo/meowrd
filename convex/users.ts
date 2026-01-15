import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: { 
    provider: v.string(),
    providerId: v.optional(v.string()),
    username: v.string(),
    avatar: v.string(),
    lastLoggedInAt: v.number()
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("users", args);
  }
});