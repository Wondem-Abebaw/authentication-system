import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const login = async (otpcode: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otpcode }),
    }
  );
  return response.json();
};

const LoginForm = () => {
  const { mutate, isPending } = useMutation({ mutationFn: login });

  return (
    <Formik
      initialValues={{ otpcode: "" }}
      validationSchema={Yup.object({
        otpcode: Yup.string()
          .matches(/^\d{4,6}$/, "PIN must be 4-6 digits")
          .required("PIN is required"),
      })}
      onSubmit={(values) => mutate(values.otpcode)}
    >
      {({ values, handleChange, handleBlur, errors, touched, isValid }) => (
        <Form>
          <Input
            name="otpcode"
            placeholder="Enter PIN"
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
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
