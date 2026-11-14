import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Suspense>
        <SignUp />
      </Suspense>
    </div>
  );
}
