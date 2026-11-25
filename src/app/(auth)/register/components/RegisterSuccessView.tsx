import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/common";

interface RegisterSuccessViewProps {
  email: string;
}

export function RegisterSuccessView({ email }: RegisterSuccessViewProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]">
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block mb-1">Activation link sent!</strong>
          We sent a verification link to <strong className="text-[#2B1220]">{email}</strong>.
          Please check your inbox to activate your account.
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        asChild
        className="w-full h-11 sm:h-[46px] text-sm font-bold rounded-xl"
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        <Link href="/login">Return to Sign In</Link>
      </Button>
    </div>
  );
}
