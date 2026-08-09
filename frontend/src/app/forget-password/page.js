import React, { Suspense } from "react";
import ForgetPassword from "./components/ForgetPassword";

export const metadata = {
  title: "Forgot Password | LONDONROOMSRENT",

  robots: {
    index: false,
    follow: false, // optional (can be true, but better false here)
    nocache: true,
  },

  alternates: {
    canonical: "https://LONDONROOMSRENT.co.uk/forget-password",
  },
};

const page = () => {
  return (
    <div className="font-sans">
      <Suspense fallback={<div>Loading...</div>}>
        <ForgetPassword />
      </Suspense>
    </div>
  );
};

export default page;