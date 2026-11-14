"use client"
import { createNewApplication } from "@/app/actions"
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
import { useState, useActionState } from "react"

type FormState = { success?: boolean; error?: string } | null

export default function AddApplicationDialog() {
  const [open, setOpen] = useState(false)
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD, UTC

  // `state` is kept for rendering submission errors later. Closing happens
  // right in the action, which is an event — not an effect.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData) => {
      const result = await createNewApplication(formData)
      if (result.success) setOpen(false)
      return result as FormState
    },
    null
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Add application</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add application</DialogTitle>
          <DialogDescription>
            Log a job you&apos;ve applied to. You can update the status later.
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
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="jobTitle">Job title</FieldLabel>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="Software Engineer"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="appliedAt">Date applied</FieldLabel>
              <Input
                id="appliedAt"
                name="appliedAt"
                type="date"
                defaultValue={today}
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
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="resumeUrl">Resume URL</FieldLabel>
              <Input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                placeholder="https://..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Recruiter name, referral, anything useful..."
                rows={3}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}