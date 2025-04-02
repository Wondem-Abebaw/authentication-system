const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const requestOTP = async (user_name: string) => {
  const response = await fetch(`${API_URL}/otp/request/dashops`, {
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
  });

  if (!response.ok) throw new Error("Failed to request OTP");
  return response.json(); // Returns { accessToken, otpSent }
};

export const verifyOTP = async (otpcode: string, token: string) => {
  const response = await fetch(`${API_URL}/otp/confirm/dashops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      otpfor: "login",
      sourceapp: "dashportal",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ otpcode }),
  });

  if (!response.ok) throw new Error("Invalid OTP");
  return response.json();
};

export const login = async (pin: string, token: string) => {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      sourceapp: "dashportal",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password: pin }),
  });

  if (!response.ok) throw new Error("Invalid credentials");
  return response.json();
};
