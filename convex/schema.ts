import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    avatar: v.string(),
    lastLoggedInAt: v.float64(),
    provider: v.string(),
    username: v.string(),
  }),
  tasks: defineTable({
     isCompleted: v.boolean(),
     text: v.string(),
   }),
});
