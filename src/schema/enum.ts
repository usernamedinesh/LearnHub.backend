import { pgEnum } from "drizzle-orm/pg-core";

export const approvedInstructorStatusEnum = pgEnum('approval_status', [
  'pending',
  'approved',
  'rejected',
]);
