"use client";

import LoginForm from "@/components/auth/loginForm";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-blue-900">
      <div className="flex flex-col sm:flex-row w-full h-full">
        <div className="bg-blue-900 text-white p-8 w-full sm:w-1/2 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold">Welcome to</h1>
        </div>

        <div className="bg-white p-8 w-full sm:w-1/2 flex flex-col justify-center items-center h-full">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-blue-900">Login</h2>
          <p className="text-gray-600 mb-4">Welcome</p>
          <div className="w-full max-w-lg flex flex-col">
            <LoginForm />
            <div className="flex justify-end mt-4">
              <a
                href="#"
                className="text-blue-900 text-md font-medium hover:underline"
              >
                <span>Forget PIN?</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
