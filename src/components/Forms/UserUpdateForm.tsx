import { useAuthContext } from "@/context/AuthContextProvider";
import { userUpdateSchema } from "@/lib/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { useUserUpdateMutation } from "@/lib/queries/user.query";
import { toast } from "sonner";

type TFormType = z.infer<typeof userUpdateSchema>;

const UserUpdateForm = () => {
  const [error, setError] = useState<string | null>(null);

  const { authUser, setAuthUser } = useAuthContext();

  const defaultValues: TFormType = {
    email: authUser?.email || "",
    name: authUser?.name || "",
    username: authUser?.username || "",
    gender: authUser?.gender || "male",
    image: authUser?.image || "",
  };

  const form = useForm<TFormType>({
    defaultValues,
    resolver: zodResolver(userUpdateSchema),
  });

  const { mutateAsync: updateUser } = useUserUpdateMutation();

  const handleSubmit: SubmitHandler<TFormType> = async (data) => {
    setError(null);

    try {
      const result = await updateUser(data);
      if (result.success) {
        toast.success("Profile updated");
        setAuthUser(result.data);
        localStorage.setItem("auth-user", JSON.stringify(result.data));
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-screen-md w-full">
      <h1 className="text-xl font-medium text-center mb-5">Make Changes</h1>
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

          <div className="w-full flex gap-3 flex-wrap">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1 basis-60">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex-1 basis-60">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex gap-3 flex-wrap">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1 basis-60">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex-1 basis-60">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex-1 basis-60">
                <FormLabel>Profile Image Link</FormLabel>
                <FormDescription>
                  You can add your facebook profile or any image link here.
                </FormDescription>
                <FormControl>
                  <Input placeholder="image" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Updating..." : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserUpdateForm;
