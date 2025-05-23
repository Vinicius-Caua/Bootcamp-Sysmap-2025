import singIn from "@/api/routes/Autenticacao/postAuthSingInRoute";
import { Button } from "@/components/ui/button";
import { loginResolver, LoginSchema } from "@/zodSchemas/loginSchema";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import loginImage from "@/assets/login-image.png";
import Logo from "@/assets/complete-logo.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false); // state to show or hide the password
  const navigate = useNavigate();

  // useForm hook to handle form validation and submission
  // loginResolver is a function that validates the form data using zod schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: loginResolver,
  });

  const onSubmit = async (data: LoginSchema) => {
    singIn(data)
      .then(() => {
        toast.success(
          "Login realizado com sucesso. Direcionando para Página Principal..."
        ); // show success message
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      })
      .catch((error: { message: string }) => {
        toast.error(error.message); // Show the error message from the API
      });
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="m-3 hidden lg:block">
        <img
          src={loginImage}
          alt="pessoas correndo em uma praça"
          className="h-full object-cover"
        />
      </div>

      <div className="max-w-[319px] mx-auto my-auto">
        <div className="space-y-[42px]">
          <img src={Logo} alt="Logo" className=" max-w-[119px]" />

          <div className="mb-6">
            <h1 className="font-bebas text-title text-[32px]">
              Bem-vindo de volta!
            </h1>

            <span className="font-sans">
              Encontre parceiros para treinar ao ar livre. Conecte-se e comece
              agora! 💪
            </span>
          </div>
        </div>
        <form className="space-y-6 mb-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-sans">
                E-mail
                <span className="text-danger font-bold">*</span>
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Ex.: joao@email.com"
                className="font-sans"
                {...register("email")}
              />
              {/* Show zod error */}
              {errors.email && (
                <p className="text-danger text-sm">{errors.email?.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-sans">
                Senha
                <span className="text-danger font-bold">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // shows the password if showPassword state is true
                  placeholder="Ex.: joao123"
                  {...register("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // switches the state
                  className="absolute top-4 right-5 flex items-center text-gray-500"
                >
                  {/* this button will show or hide the password */}
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Show zod error */}
              {errors.password && (
                <p className="text-danger text-sm">
                  {errors.password?.message}
                </p>
              )}
            </div>
          </div>

          <Button className="w-full py-3">Entrar</Button>
        </form>
        <div className="flex justify-center">
          <Link to={"/register"} className="font-sans text-sm font-normal">
            Ainda não tem uma conta?{" "}
            <span className="font-bold text-sm">Cadastre-se</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
