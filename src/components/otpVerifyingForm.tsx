import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const verifyOTP = async (otpcode: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/otp/confirm/dashops`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otpcode }),
    }
  );
  return response.json();
};

const OTPVerifyForm = ({ onNext }: { onNext: () => void }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: onNext,
  });

  return (
    <Formik
      initialValues={{ otpcode: "" }}
      validationSchema={Yup.object({
        otpcode: Yup.string()
          .matches(/^\d{4,6}$/, "OTP must be 4-6 digits")
          .required("OTP is required"),
      })}
      onSubmit={(values) => mutate(values.otpcode)}
    >
      {({ values, handleChange, handleBlur, errors, touched, isValid }) => (
        <Form>
          <Input
            name="otpcode"
            placeholder="Enter OTP"
            value={values.otpcode}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.otpcode && touched.otpcode && (
            <div className="text-red-500 text-sm mt-1">{errors.otpcode}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 py-5"
            disabled={ isPending}
          >
            {isPending ? "Verifying..." : "Next"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default OTPVerifyForm;
