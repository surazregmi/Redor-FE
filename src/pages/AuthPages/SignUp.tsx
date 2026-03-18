import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Redor Sign up"
        description="This is signup page of Redor"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
