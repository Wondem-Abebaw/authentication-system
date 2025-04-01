import { Formik, Form, Field } from "formik";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const verifyOTP = async (otpcode: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/otp/confirm/dashops`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(otpcode),
    }
  );

  return response.json();
};
const OTPVerifyForm = ({ onNext }: { onNext: () => void }) => {
  const { mutate } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      onNext();
    },
  });

  return (
    <Formik
      initialValues={{ otpcode: "" }}
      onSubmit={(values) => mutate(values.otpcode)}
    >
      <Form>
        <Field type="text" name="otpcode" placeholder="Enter PIN" />
        <button type="submit">Next</button>
      </Form>
    </Formik>
  );
};

export default OTPVerifyForm;
