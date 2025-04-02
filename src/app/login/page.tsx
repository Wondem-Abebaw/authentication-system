"use client";

import LoginForm from "@/components/loginForm";
import OTPRequestForm from "@/components/otpRequestForm";

import OTPVerifyForm from "@/components/otpVerifyingForm";

import Image from "next/image";
import { useState } from "react";

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const handleNext = () => setStep((prev) => prev + 1);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="flex w-full h-full bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="bg-blue-900 text-white p-8 w-1/2 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold">Welcome to</h1>
          {/* <h2 className="text-3xl font-bold">Dashen Super App Dashboard</h2> */}
        </div>
        <div className="p-8 w-1/2 flex flex-col justify-center items-center">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-600 mb-4">
            Welcome
            {/* to Dashen bank dashboard! */}
          </p>
          {
            <div className="w-full max-w-lg">
              {step === 1 && <OTPRequestForm onNext={handleNext} />}
              {step === 2 && <OTPVerifyForm onNext={handleNext} />}
              {step === 3 && <LoginForm />}
            </div>
          }
          <a
            href="#"
            className="text-blue-900 mt-4 text-sm font-medium hover:underline"
          >
            Forget PIN?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
