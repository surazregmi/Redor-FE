import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormData } from "@/validations/auth.schema";
import { toast } from "@/components/toast/useToast";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur", // Validates on blur - best performance
    reValidateMode: "onChange", // Re-validates on change after blur
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    console.log("Valid Data:", data);

    // simulate API
    // await new Promise((res) => setTimeout(res, 1000));
  };

  const handleGoogleLogin = () => {
    toast.warning("This feature is comming soon.");
  };

  return (
    <>
      <PageMeta
        title="Redor Sign in"
        description="This is Signin  page of Redor"
      />
      <AuthLayout>
        <SignInForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          onGoogleLogin={handleGoogleLogin}
          isSubmitting={isSubmitting}
        />
      </AuthLayout>
    </>
  );
}
