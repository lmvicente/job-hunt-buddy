// app/actions.ts
"use server"
//this need use server and it creates endpoints 
//DAL
import { db } from "@/lib/db";
import { applications, Status } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache"

export async function createNewApplication(formData: FormData) {
  const { userId } = await auth();
  if(!userId) return { error: "Undefined" }

  await db.insert(applications).values({
    userId,
    companyName: formData.get("companyName") as string,
    jobTitle: formData.get("jobTitle") as string,
    jobUrl: (formData.get("jobUrl") as string) || null,
    resumeUrl: (formData.get("resumeUrl") as string) || null,
    appliedAt: new Date(formData.get("appliedAt") as string),
    notes: (formData.get("notes") as string) || null,
  });

    revalidatePath("/")
  return { success: true }
}

export async function updateApplication(applicationId: number, formData: FormData) {
  const { userId } = await auth();
  if(!userId) return { error: "Undefined" }

  await db.update(applications).set({
      companyName: formData.get("companyName") as string,
      jobTitle: formData.get("jobTitle") as string,
      jobUrl: (formData.get("jobUrl") as string) || null,
      resumeUrl: (formData.get("resumeUrl") as string) || null,
      notes: (formData.get("notes") as string) || null,
      updatedAt: new Date(),
      }
  ).where(and(
    eq(applications.id, applicationId),
    eq(applications.userId, userId)
  ))
      revalidatePath("/")
  return { success: true }
}

export async function deleteApplication(id: number) {
  const {userId} = await auth();
  if(!userId) return { error: "Undefined" };

  await db.delete(applications).where(and(
    eq(applications.id, id),
    eq(applications.userId, userId)
  ))
  revalidatePath("/")
  return { success: true }
}

export async function updateStatus(id: number, status: Status) {
  const { userId } = await auth()
  if (!userId) return { error: "Unauthorized" }

  await db.update(applications)
    .set({
      status,
      lastActivityAt: new Date(),   // ← your rule: status change bumps activity
      updatedAt: new Date(),
    })
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))

  revalidatePath("/")
  return { success: true }
}