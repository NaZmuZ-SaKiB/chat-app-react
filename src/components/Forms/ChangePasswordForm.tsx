import { changePasswordSchema } from "@/lib/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useChangePasswordMutation } from "@/lib/queries/auth.query";
import { toast } from "sonner";

type TFormType = z.infer<typeof changePasswordSchema>;

const defaultValues: TFormType = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordForm = () => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TFormType>({
    defaultValues,
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutateAsync: changePassword } = useChangePasswordMutation();

  const handleSubmit: SubmitHandler<TFormType> = async (data) => {
    setError(null);

    try {
      const result = await changePassword(data);
      if (result.success) {
        toast.success("Password changed");
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-md w-full">
      <h1 className="text-xl font-medium text-center mb-5">Change Password</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 w-full"
        >
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="flex-1 basis-60">
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="current password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex-1 basis-60">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex-1 basis-60">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting
              ? "Changing Password..."
              : "Change Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
