import { Formik, Form, Field } from "formik";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const login = async (otpcode: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(otpcode),
    }
  );

  return response.json();
};
const LoginForm = ({ onNext }: { onNext: () => void }) => {
  const { mutate } = useMutation({
    mutationFn: login,
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

export default LoginForm;
