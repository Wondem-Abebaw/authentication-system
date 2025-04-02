"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { requestOTP, verifyOTP } from "@/services/authService";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
const getValidationSchema = (step: "request" | "verify" | "login") => {
  switch (step) {
    case "request":
      return Yup.object({
        user_name: Yup.string().required("User name  is required"),
      });
    case "verify":
      return Yup.object({
        user_name: Yup.string().required(),
        otpcode: Yup.string()
          .length(6, "OTP must be 6 digits")
          .required("OTP is required"),
      });
    case "login":
      return Yup.object({
        pin: Yup.string()
          //   .matches(/^\d{4,20}$/, "PIN must be 4-20 digits")
          .required("PIN is required"),
      });
    default:
      return Yup.object();
  }
};
const LoginForm = () => {
  const [step, setStep] = useState<"request" | "verify" | "login">("request");
  const [accesstoken, setAccessToken] = useState<string | null>(null);

  // OTP Request
  const requestOTPMutation = useMutation({
    mutationFn: requestOTP,
    onSuccess: (data) => {
      setAccessToken(data.accesstoken);
      setStep("verify");
    },
    onError: (error) => alert(error.message),
  });

  // OTP Verification
  const verifyOTPMutation = useMutation({
    mutationFn: (otpcode: string) => verifyOTP(otpcode, accesstoken!),
    onSuccess: (data) => {
      setAccessToken(data.accesstoken);
      setStep("login");
    },
    onError: (error) => alert(error.message),
  });

  // Login Mutation via NextAuth
  const handleLogin = async (values: { user_name: string; pin: string }) => {
    const result = await signIn("credentials", {
    //   redirect: false,
      user_name: values.user_name,
      pin: values.pin,
      accesstoken: accesstoken,
    });

    if (result?.error) alert("Invalid login");
    // else window.location.href = "/";
  };

  return (
    <Formik
      initialValues={{ user_name: "", otpcode: "", pin: "" }}
      validationSchema={getValidationSchema(step)}
      onSubmit={(values) => {
        if (step === "verify") verifyOTPMutation.mutate(values.otpcode);
        else handleLogin(values);
      }}
    >
      {({ values, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-5 flex flex-col items-center w-full max-w-md">
          {/* Step 1: Request OTP */}
          {step === "request" && (
            <>
              <Label htmlFor="user_name">User Name</Label>
              <Input
                name="user_name"
                placeholder="Enter user name"
                value={values.user_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="user_name"
                component="p"
                className="text-red-500 text-sm"
              />
              <Button
                type="button"
                className="w-full"
                disabled={requestOTPMutation.isPending}
                onClick={() => requestOTPMutation.mutate(values.user_name)}
              >
                {requestOTPMutation.isPending ? "Sending OTP..." : "Get OTP"}
              </Button>
            </>
          )}

          {/* Step 2: Verify OTP */}
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
              <Button type="submit" className="w-full" disabled={!isValid}>
                {verifyOTPMutation.isPending ? "Verifying..." : "Next"}
              </Button>
            </>
          )}

          {/* Step 3: Login */}
          {step === "login" && (
            <>
              <Label htmlFor="pin">Enter PIN</Label>
              <Field type="password" name="pin" placeholder="****" as={Input} />
              <ErrorMessage
                name="pin"
                component="p"
                className="text-red-500 text-sm"
              />
              <Button type="submit" className="w-full" disabled={!isValid}>
                Sign In
              </Button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
