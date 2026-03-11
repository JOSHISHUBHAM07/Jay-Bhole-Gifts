import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0F0F12] flex items-center justify-center p-4 pt-24">
      <SignUp routing="hash" />
    </div>
  );
}
