import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Suspense>
        <SignIn />
      </Suspense>
    </div>
  );
}
