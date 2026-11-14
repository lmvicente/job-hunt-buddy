"use client"
import { updateApplication } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Application } from "@/lib/db/schema"
import { useState, useActionState } from "react"

type Props = {application: Application}
type FormState = { success?: boolean; error?: string } | null

export default function EditApplicationDialog({application}: Props  ) {
  const [open, setOpen] = useState(false)

   const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData) => {
      const result = await updateApplication(application.id, formData)
      if (result.success) setOpen(false)
      return result as FormState
    },
    null
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm">Edit</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit application</DialogTitle>
          <DialogDescription>
            Update the details of this application. You can also update the status later.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="companyName">Company</FieldLabel>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Acme Corp"
                defaultValue={application.companyName ?? ""}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="jobTitle">Job title</FieldLabel>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="Software Engineer"
                defaultValue={application.jobTitle ?? ""}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="appliedAt">Date applied</FieldLabel>
              <Input
                id="appliedAt"
                name="appliedAt"
                type="date"
                defaultValue={application.appliedAt?.toISOString().split('T')[0] ?? ""}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="jobUrl">Job posting URL</FieldLabel>
              <Input
                id="jobUrl"
                name="jobUrl"
                type="url"
                placeholder="https://..."
                defaultValue={application.jobUrl ?? ""}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="resumeUrl">Resume URL</FieldLabel>
              <Input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                placeholder="https://..."
                defaultValue={application.resumeUrl ?? ""}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Recruiter name, referral, anything useful..."
                rows={3}
                defaultValue={application.notes ?? ""}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
