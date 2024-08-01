import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "../../lib/validations/auth.validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpMutation } from "@/lib/queries/auth.query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthContext } from "@/context/AuthContextProvider";
import Cookie from "js-cookie";
import { setCallStatus } from "@/utils/localstorage";

type TFormType = z.infer<typeof signUpSchema>;

const defaultValues: TFormType = {
  email: "",
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
  gender: "male",
};

const SignUpPage = () => {
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { authUser, setAuthUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const form = useForm<TFormType>({
    defaultValues,
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync: signUpFn } = useSignUpMutation();

  const handleSubmit: SubmitHandler<TFormType> = async (data) => {
    setError(null);
    try {
      const result = await signUpFn(data);
      if (result.success) {
        Cookie.set("jwt", result.data?.token, { path: "/", expires: 365 });
        setAuthUser(result.data?.user);
        localStorage.setItem("auth-user", JSON.stringify(result.data?.user));
        setCallStatus("idle");
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred");
    }
  };

  return (
    <div className="grid place-items-center w-full min-h-[100svh] py-2 max-md:bg-slate-100">
      <div className="max-w-screen-md w-full bg-slate-100 rounded-lg px-4 py-10">
        <h1 className="text-2xl font-medium text-center mb-10">Sign Up</h1>
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

            <div className="w-full flex gap-3 flex-wrap">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-1 basis-60">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        type="password"
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="w-full"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <p className="mt-5">
          Already have an account?{" "}
          <Link to={"/sign-in"} className="text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
