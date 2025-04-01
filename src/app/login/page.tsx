"use client";
import OTPRquestForm from "@/components/otpRequestForm";
import OTPVerifyForm from "@/components/otpVerifyForm";
import { useState } from "react";

const LoginPage = () => {
  const [step, setStep] = useState(1); // To track steps (OTP, PIN)

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Welcome to Dashen Bank Dashboard!</h1>
      {step === 1 && <OTPRquestForm onNext={handleNext} />}
      {step === 2 && (
        <OTPVerifyForm onNext={() => alert("Proceed to Dashboard")} />
      )}
    </div>
  );
};

export default LoginPage;
