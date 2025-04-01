import { Formik, Form, Field } from "formik";
import { useMutation } from "@tanstack/react-query";

const requestOTP = async (phone: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/otp/request/dashops`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(phone),
    }
  );

  return response.json();
};

const OTPRquestForm = ({ onNext }: { onNext: () => void }) => {
  const { mutate } = useMutation({
    mutationFn: requestOTP,
    onSuccess: () => {
      onNext();
    },
  });

  return (
    <Formik
      initialValues={{ phone: "" }}
      onSubmit={(values) => mutate(values.phone)}
    >
      <Form>
        <Field type="text" name="phone" placeholder="Phone Number" />
        <button type="submit">Get OTP</button>
      </Form>
    </Formik>
  );
};

export default OTPRquestForm;
