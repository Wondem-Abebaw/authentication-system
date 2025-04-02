"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const requestOTP = async (phone: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API delay
  return { success: true };
};

const verifyOTP = async ({
  phone,
  otpcode,
}: {
  phone: string;
  otpcode: string;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
};

const login = async ({ pin }: { pin: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
};

// 🔹 Step-Based Validation Schema
const getValidationSchema = (step: "request" | "verify" | "login") => {
  switch (step) {
    case "request":
      return Yup.object({
        phone: Yup.string()
          .matches(/^\+251[0-9]{9}$/, "Invalid  phone number")
          .required("Phone number is required"),
      });
    case "verify":
      return Yup.object({
        phone: Yup.string().required(),
        otpcode: Yup.string()
          .length(6, "OTP must be 6 digits")
          .required("OTP is required"),
      });
    case "login":
      return Yup.object({
        pin: Yup.string()
          .matches(/^\d{4,6}$/, "PIN must be 4-6 digits")
          .required("PIN is required"),
      });
    default:
      return Yup.object();
  }
};

const AuthForm = () => {
  const [step, setStep] = useState<"request" | "verify" | "login">("request");

  const requestOTPMutation = useMutation({
    mutationFn: requestOTP,
    onSuccess: () => setStep("verify"),
  });

  const verifyOTPMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => setStep("login"),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => alert("Login Successful!"),
  });

  return (
    <Formik
      initialValues={{ phone: "", otpcode: "", pin: "" }}
      validationSchema={getValidationSchema(step)}
      onSubmit={(values) => {
        if (step === "request") requestOTPMutation.mutate(values.phone);
        else if (step === "verify") verifyOTPMutation.mutate(values);
        else loginMutation.mutate(values);
      }}
    >
      {({ values, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-5 flex flex-col items-center">
          {/* Step 1 & 2: Phone Number Input with "Get OTP" Button Inside */}
          {step !== "login" && (
            <div className="relative w-full">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                name="phone"
                placeholder="Enter phone number"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <Button
                  type="submit"
                  className="h-9 px-3 rounded-md"
                  disabled={!isValid || requestOTPMutation.isPending}
                >
                  {requestOTPMutation.isPending ? "Sending..." : "Get OTP"}
                </Button>
              </Input>
              <ErrorMessage
                name="phone"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
          )}

          {step === "request" && (
            <Button
              type="button"
              disabled
              className="w-full bg-gray-300 text-gray-600 rounded-md"
            >
              Next
            </Button>
          )}

          {/* Step 2: OTP Verification */}
          {step === "verify" && (
            <>
              <Label>Enter OTP</Label>
              <InputOTP
                maxLength={6}
                value={values.otpcode}
                onChange={(val) =>
                  handleChange({ target: { name: "otpcode", value: val } })
                }
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <ErrorMessage
                name="otpcode"
                component="p"
                className="text-red-500 text-sm"
              />
              <Button
                type="submit"
                className="w-full bg-blue-800 text-white rounded-md"
                disabled={!isValid}
              >
                {verifyOTPMutation.isPending ? "Verifying..." : "Next"}
              </Button>
            </>
          )}

          {/* Step 3: Login  */}
          {step === "login" && (
            <>
              <Label htmlFor="pin">Enter PIN</Label>
              <Field type="password" name="pin" placeholder="****" as={Input} />
              <ErrorMessage
                name="pin"
                component="p"
                className="text-red-500 text-sm"
              />
              <Button
                type="submit"
                className="w-full bg-blue-900 text-white rounded-md"
                disabled={!isValid}
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
