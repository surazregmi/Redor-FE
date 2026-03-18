import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Redor Sign in"
        description="This is Signin  page of Redor"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
