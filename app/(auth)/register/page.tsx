import { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";
export const metadata: Metadata = { title: "Реєстрація" };
export default function RegisterPage() {
  return <RegisterForm />;
}
