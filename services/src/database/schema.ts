import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const accountRole = pgEnum("account_role", ["FREELANCER", "CLIENT"]);

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  auth_id: text("auth_id").notNull(),
  email: text("email").notNull(),
  role: accountRole().default("CLIENT").notNull(),
  identityVerified: boolean("identity_verified").default(false),
  paymentMethodVerified: boolean("payment_method_verified").default(false),
  isOnBoardingComplete: boolean("is_onboarding_complete").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const clientMetadata = pgTable("client_metadata", {
  id: uuid("id").defaultRandom().primaryKey(),
  auth_id: text("auth_id").unique(),
  role: text("role").notNull(),
  companyName: text("company_name").notNull(),
  companyWebsite: text("company_website").notNull(),
  companySize: text("company_size").notNull(),
  industry: text("industry").notNull(),
  companyDescription: text("company_description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});
