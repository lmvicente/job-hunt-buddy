// read operations because no use server .. 
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";


export async function getJobApplicationsForUser() {
  const { userId } = await auth();
    if(!userId) {
        return [];
    }
    const data = await db.select().from(applications).where(eq(applications.userId, userId));
    return data;
}