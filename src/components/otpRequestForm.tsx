import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const requestOTP = async (phone: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/otp/request/dashops`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    }
  );
  return response.json();
};

const OTPRequestForm = ({ onNext }: { onNext: () => void }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: requestOTP,
    onSuccess: onNext,
  });

  return (
    <Formik
      initialValues={{ phone: "" }}
      validationSchema={Yup.object({
        phone: Yup.string()
          .matches(/^\d{10,15}$/, "Invalid phone number")
          .required("Phone number is required"),
      })}
      onSubmit={(values) => mutate(values.phone)}
    >
      {({ values, handleChange, handleBlur, errors, touched, isValid }) => (
        <Form>
          <Input
            name="phone"
            placeholder="Enter phone number"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 py-5"
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Get OTP"}
            </Button>
          </Input>
          {errors.phone && touched.phone && (
            <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default OTPRequestForm;
