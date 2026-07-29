import { z } from "zod";

const userFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email(),
  password: z.string().optional(),
  roleId: z.number(),
  isActive: z.boolean(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(64, { message: "Password must not exceed 64 characters." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/\d/, {
    message: "Password must contain at least one number.",
  })
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/']/, {
    message: "Password must contain at least one special character.",
  })
  .refine((value) => !/\s/.test(value), {
    message: "Password must not contain spaces.",
  });

export const createUserSchema = userFormSchema.extend({
  password: passwordSchema,
});

export const updateUserSchema = userFormSchema.omit({
  password: true,
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
