import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import {
  CreateUserFormData,
  createUserSchema,
  updateUserSchema,
  UserFormData,
  type UpdateUserFormData,
} from "@/validations/user.schema";
import { Modal } from "@/components/ui/modal";
import { User } from "@/types/user.types";
import Select from "@/components/form/Select";
import { useCallback, useEffect, useState } from "react";
import { listUserRoles } from "@/services/userRolesService";
import { Role, RoleSelectInput } from "@/types/userRoles.types";
import { toast } from "@/components/toast/useToast";

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

function CreateUpdateUserModal({ user, onClose, onSubmit }: UserModalProps) {
  const isEdit = !!user;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      roleId: user?.userTenantRoles[0]?.role?.id ?? 5,
      isActive: user?.isActive || true,
    },
  });

  const [loading, setLoading] = useState(false);

  const [roles, setRoles] = useState<RoleSelectInput[]>([]);

  const convertDataForSelectOptions = (roles: Role[]) => {
    return roles?.map((item) => ({ key: item?.id, value: item?.name }));
  };

  const fetchUserRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listUserRoles();
      let roleValueForSelect = convertDataForSelectOptions(data?.roles);
      setRoles(roleValueForSelect);
    } catch {
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  return (
    <Modal isOpen onClose={onClose} className="max-w-md p-6 sm:p-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
        {user ? "Edit User" : "Add User"}
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
        {!isEdit && (
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              {...register("password")}
              error={!!errors.password}
              hint={errors.password?.message}
            />
          </div>
        )}
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
            name="roleId"
            control={control}
            render={({ field }) => (
              <>
                <Label>User Role</Label>
                <Select
                  options={roles}
                  placeholder="Select Role"
                  defaultValue={field.value?.toString()}
                  onChange={(value) => field.onChange(Number(value))}
                />
              </>
            )}
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
