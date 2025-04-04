"use server";

import { signIn } from "@/lib/auth";

export const loginUser = async (data: {
  accesstoken: string;
  password: string;
}) => {
  try {
    const response = await signIn("credentials", {
      accesstoken: data.accesstoken,
      password: data.password,
      redirect: false,
    });
    return response;
  } catch (error) {
    throw new Error(error as string);
  }
};
