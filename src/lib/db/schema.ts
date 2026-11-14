import { index, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// ---------- Status enum ----------

export const applicationStatus = pgEnum("application_status", [
  "Applied",
  "1st Interview",
  "2nd Interview",
  "3rd Interview",  
  "Offer",
  "Rejected",
  "Withdrawn",
  "Dormant", // auto: 14+ days no activity
  "Ghosted", // auto: 90+ days no activity
]);

// ---------- Applications (the only table you need) ----------

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    companyName: text("company_name").notNull(),
    jobTitle: text("job_title").notNull(),
    jobUrl: text("job_url"),
    resumeUrl: text("resume_url"),
    status: applicationStatus("status").default("Applied").notNull(),
    appliedAt: timestamp("applied_at").notNull(),
    lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("applications_user_id_idx").on(t.userId)],
);

export type Application = typeof applications.$inferSelect; //read
export type NewApplication = typeof applications.$inferInsert; //write
export type Status = (typeof applicationStatus.enumValues)[number]