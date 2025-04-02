"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { useMutation } from "@tanstack/react-query";
import { requestOTP, verifyOTP } from "@/services/authService";
import * as Yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { loginUser } from "@/action/auth-action";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

const getValidationSchema = (step: "request" | "verify" | "login") => {
  switch (step) {
    case "request":
      return Yup.object({
        user_name: Yup.string().required("User name  is required"),
      });
    case "verify":
      return Yup.object({
        otpcode: Yup.string()
          .length(6, "OTP must be 6 digits")
          .required("OTP is required"),
      });
    case "login":
      return Yup.object({
        password: Yup.string()
          //   .matches(/^\d{4,20}$/, "PIN must be 4-20 digits")
          .required("PIN is required"),
      });
    default:
      return Yup.object();
  }
};
const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [step, setStep] = useState<"request" | "verify" | "login">("login");
  const [accesstoken, setAccessToken] = useState<string | null>(null);
  const [expiresOn, setExpiresOn] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isOtpDisabled, setIsOtpDisabled] = useState(false);

  useEffect(() => {
    if (!expiresOn) return;

    setIsOtpDisabled(true);

    const interval = setInterval(() => {
      const now = new Date();
      const expirationTime = new Date(expiresOn);
      const diff = expirationTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        setIsOtpDisabled(false);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresOn]);
  // OTP Request
  const requestOTPMutation = useMutation({
    mutationFn: requestOTP,
    onSuccess: (data) => {
      setAccessToken(data.accesstoken);
      setStep("verify");
      setExpiresOn(new Date(data.expireson));
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

  // const handleLogin = async (values: {
  //   user_name: string;
  //   password: string;
  // }) => {
  //   console.log("values", values);
  //   console.log("accesstoken", accesstoken);
  //   const result = await signIn("credentials", {
  //     redirect: false, // Avoid auto-redirect on failure
  //     user_name: values.user_name,
  //     password: values.password,
  //     accesstoken: accesstoken,
  //   });

  //   if (result?.error) {
  //     alert("Invalid login: " + result.error);
  //   } else {
  //     router.push("/");
  //   }
  // };
  const handleLogin = async (values: {
    user_name: string;
    password: string;
  }) => {
    startTransition(async () => {
      try {
        const response = await loginUser({
          password: values.password,
          accesstoken: accesstoken,
        });

        if (!!response?.error) {
          toast("Successfull", {
            description: "Successfully loged in",
          });
        } else {
          router.push("/");
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  return (
    <Formik
      initialValues={{ user_name: "", otpcode: "", password: "" }}
      validationSchema={getValidationSchema(step)}
      onSubmit={(values) => {
        if (step === "verify") verifyOTPMutation.mutate(values.otpcode);
        else handleLogin(values);
      }}
    >
      {({ values, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-5 flex flex-col items-center">
          {/* Step 1 & 2: user_name Number Input */}
          {step !== "login" && (
            <div className="relative w-full flex-col space-y-4">
              {" "}
              <div className="relative w-full">
                <Label htmlFor="user_name">User Name</Label>
                <div className="flex gap-2 w-full">
                  <Input
                    className="w-full h-13 "
                    name="user_name"
                    placeholder="Enter user name "
                    value={values.user_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <Button
                      type="button"
                      className={`h-10 px-3 rounded-md ${
                        isOtpDisabled ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      disabled={isOtpDisabled || requestOTPMutation.isPending}
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
                  <InputOTP
                    className="w-full flex justify-between"
                    maxLength={6}
                    value={values.otpcode}
                    onChange={(val) =>
                      handleChange({ target: { name: "otpcode", value: val } })
                    }
                  >
                    <InputOTPGroup className="w-full flex justify-between gap-4">
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-14 rounded-md border text-blue-800 border-blue-900"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {timeLeft && timeLeft !== "00:00" && (
                    <p className="text-gray-600 text-sm mt-2">
                      OTP will expire in{" "}
                      <span className="font-semibold">{timeLeft}</span>
                    </p>
                  )}
                  <ErrorMessage
                    name="otpcode"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </>
              )}
              <Button
                type="submit"
                className="w-full h-13 rounded-md "
                disabled={!isValid || step === "request"}
              >
                {verifyOTPMutation.isPending ? "Verifying..." : "Next"}
              </Button>
            </div>
          )}

          {/* Step 3: Login */}
          {step === "login" && (
            <div className="relative w-full">
              <Label htmlFor="password">Enter PIN</Label>
              <Field
                className="w-full h-13"
                type="password"
                name="password"
                placeholder="*******"
                as={Input}
              />
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm"
              />
              <Button
                type="submit"
                className="w-full h-13 rounded-md mt-4"
                disabled={!isValid || isPending}
              >
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
