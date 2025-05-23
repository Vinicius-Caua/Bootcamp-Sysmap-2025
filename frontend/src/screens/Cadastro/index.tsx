import singUp from "@/api/routes/Autenticacao/postAuthRegisterRoute";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import loginImage from "@/assets/login-image.png";
import { useForm } from "react-hook-form";
import Logo from "@/assets/complete-logo.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { registerResolver, RegisterSchema } from "@/zodSchemas/registerSchema";
import { toast } from "sonner";

// Function to format CPF input
const formatCpf = (cpf: string) => {
  return cpf
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

function SingUp() {
  const [showPassword, setShowPassword] = useState(false); // state to show or hide the password
  const navigate = useNavigate();

  // useForm hook to handle form validation and submission
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: registerResolver,
  });

  const onSubmit = async (data: RegisterSchema) => {
    singUp(data)
      .then(() => {
        toast.success("Usuário criado com sucesso. Direcionando para login..."); // show success message
        setTimeout(() => {
          navigate("/login");
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
              Crie sua conta!
            </h1>

            <span className="font-sans">
              Cadastre-se para encontrar parceiros de treino e começar a se
              exercitar ao ar livre. Vamos juntos! 💪
            </span>
          </div>
        </div>
        <form className="space-y-6 mb-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="text" className="font-sans">
                Nome completo
                <span className="text-danger font-bold">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Ex.: João Silva"
                {...register("name")}
              />
              {/* Show zod error */}
              {errors.name && (
                <p className="text-danger text-sm">{errors.name?.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="text" className="font-sans">
                CPF
                <span className="text-danger font-bold">*</span>
              </Label>
              <Input
                type="text"
                placeholder="123.456.789-01"
                maxLength={14} // Limit input to 14 characters (11 digits + 3 dots + 1 dash)
                {...register("cpf")}
                onChange={(e) => {
                  const formattedCpf = formatCpf(e.target.value); // Format the CPF
                  setValue("cpf", formattedCpf, { shouldValidate: true }); // Set the formatted value in the form state
                }}
              />
              {/* Show zod error */}
              {errors.cpf && (
                <p className="text-danger text-sm">{errors.cpf?.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-sans">
                E-mail
                <span className="text-danger font-bold">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Ex.: joao@email.com"
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
                />
                {/* Show zod error */}
                {errors.password && (
                  <p className="text-danger text-sm">
                    {errors.password?.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // switches the state
                  className="absolute top-4 right-5 flex items-center text-gray-500"
                >
                  {/* this button will show or hide the password */}
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <Button className="w-full py-3">Cadastrar</Button>
        </form>
        <div className="flex justify-center">
          <Link to={"/login"} className="font-sans text-sm font-normal">
            Já tem uma conta?{" "}
            <span className="font-bold text-sm">Faça login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SingUp;
