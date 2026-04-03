import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormData } from "@/validations/auth.schema";
import { toast } from "@/components/toast/useToast";
import { signIn } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/utils/apiError";

export default function SignIn() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await signIn(data);
      setAuth(response);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Sign in failed. Please try again."),
      );
    }
  };

  const handleGoogleLogin = () => {
    toast.warning("This feature is coming soon.");
  };

  return (
    <>
      <PageMeta
        title="Redor Sign in"
        description="This is Signin page of Redor"
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
