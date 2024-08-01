import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/AuthContextProvider";
import { useSignInMutation } from "@/lib/queries/auth.query";
import { signInSchema } from "@/lib/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import Cookie from "js-cookie";

type TFormType = z.infer<typeof signInSchema>;

const defaultValues: TFormType = {
  email: "",
  password: "",
};

const SignInPage = () => {
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
    resolver: zodResolver(signInSchema),
  });

  const { mutateAsync: signInFn } = useSignInMutation();

  const handleSubmit: SubmitHandler<TFormType> = async (data) => {
    setError(null);
    try {
      const result = await signInFn(data);

      if (result.success) {
        Cookie.set("jwt", result.data?.token, { path: "/", expires: 365 });
        setAuthUser(result.data?.user);
        localStorage.setItem("auth-user", JSON.stringify(result.data?.user));
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred");
    }
  };
  return (
    <div className="grid place-items-center w-full min-h-[100svh] py-2 max-xs:bg-slate-100">
      <div className="max-w-sm w-full bg-slate-100 rounded-lg px-4 py-10">
        <h1 className="text-2xl font-medium text-center mb-10">Sign In</h1>
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
              name="email"
              render={({ field }) => (
                <FormItem>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <p className="mt-5">
          Don't have an account?{" "}
          <Link to={"/sign-up"} className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
