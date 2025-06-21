import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const firmwareModifications = pgTable("firmware_modifications", {
  id: serial("id").primaryKey(),
  originalFileName: text("original_file_name").notNull(),
  serialNumber: text("serial_number").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status", { enum: ["uploading", "processing", "completed", "failed"] }).notNull().default("uploading"),
  progress: integer("progress").notNull().default(0),
  modifiedFileName: text("modified_file_name"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFirmwareModificationSchema = createInsertSchema(firmwareModifications).pick({
  originalFileName: true,
  serialNumber: true,
  fileSize: true,
});

export const updateFirmwareModificationSchema = createInsertSchema(firmwareModifications).pick({
  status: true,
  progress: true,
  modifiedFileName: true,
  errorMessage: true,
  completedAt: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFirmwareModification = z.infer<typeof insertFirmwareModificationSchema>;
export type UpdateFirmwareModification = z.infer<typeof updateFirmwareModificationSchema>;
export type FirmwareModification = typeof firmwareModifications.$inferSelect;
