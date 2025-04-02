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

const requestOTP = async (user_name: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/otp/request/dashops`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        otpfor: "login",
        sourceapp: "dashportal",
      },
      body: JSON.stringify({
        user_name: user_name,
        send_option: "email",
      }),
    }
  );
  return response.json();
};

const verifyOTP = async (otpcode: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/otp/confirm/dashops`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        otpfor: "login",
        sourceapp: "dashportal",
        Authorization: `Bearer ${
          localStorage.accessToken ? await localStorage.accessToken : ""
        }`,
      },
      body: JSON.stringify({ otpcode: otpcode }),
    }
  );
  return response.json();
};

const login = async (pin: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        sourceapp: "dashportal",
        Authorization: `Bearer ${
          localStorage.accessToken ? await localStorage.accessToken : ""
        }`,
      },
      body: JSON.stringify({ password: pin }),
    }
  );
  return response.json();
};

// Step-Based Validation Schema
const getValidationSchema = (step: "request" | "verify" | "login") => {
  switch (step) {
    case "request":
      return Yup.object({
        user_name: Yup.string().required("User name number is required"),
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
          .matches(/^\d{4,6}$/, "PIN must be 4-6 digits")
          .required("PIN is required"),
      });
    default:
      return Yup.object();
  }
};

const LoginForm = () => {
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
      initialValues={{ user_name: "", otpcode: "", pin: "" }}
      validationSchema={getValidationSchema(step)}
      onSubmit={(values) => {
        if (step === "verify") verifyOTPMutation.mutate(values.otpcode);
        else loginMutation.mutate(values.pin);
      }}
    >
      {({ values, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-5 flex flex-col items-center">
          {/* Step 1 & 2: user_name Number Input */}
          {step !== "login" && (
            <>
              {" "}
              <div className="relative w-full">
                <Label htmlFor="user_name">User Name</Label>
                <div className="flex gap-2">
                  <Input
                    className=""
                    name="user_name"
                    placeholder="Enter user name "
                    value={values.user_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <Button
                      type="button"
                      className="h-8 px-3 rounded-md "
                      disabled={requestOTPMutation.isPending}
                      onClick={() =>
                        requestOTPMutation.mutate(values.user_name)
                      }
                    >
                      {requestOTPMutation.isPending ? "Sending..." : "Get OTP"}
                    </Button>
                  </Input>
                </div>
                <ErrorMessage
                  name="user_name"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
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
                </>
              )}
              <Button
                type="submit"
                className="w-full  rounded-md"
                disabled={!isValid || step === "request"}
              >
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
              <Button
                type="submit"
                className="w-full rounded-md"
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

export default LoginForm;
