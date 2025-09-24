import { db } from 'src/config/db';
import { users } from 'src/schema';

export const allUser = db.select().from(users);
