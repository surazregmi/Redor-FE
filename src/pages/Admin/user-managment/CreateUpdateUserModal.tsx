import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import {
  updateUserSchema,
  type UpdateUserFormData,
} from "@/validations/user.schema";
import { Modal } from "@/components/ui/modal";
import { AdminUser } from "@/types/user.types";

interface UserModalProps {
  user: AdminUser | undefined;
  onClose: () => void;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
}

function CreateUpdateUserModal({ user, onClose, onSubmit }: UserModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      isActive: user?.isActive || true,
    },
  });
  return (
    <Modal isOpen onClose={onClose} className="max-w-md p-6 sm:p-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
        Edit User
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="First name"
              error={!!errors.firstName}
              hint={errors.firstName?.message}
              {...register("firstName")}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Last name"
              error={!!errors.lastName}
              hint={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            error={!!errors.email}
            hint={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                label="Active"
                defaultChecked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateUpdateUserModal;
