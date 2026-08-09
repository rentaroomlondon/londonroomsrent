import AdminLogin from "./components/AdminLogin";

// 🔒 BLOCK INDEXING
export const metadata = {
  title: "Admin Login",

  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdminLogin />;
}