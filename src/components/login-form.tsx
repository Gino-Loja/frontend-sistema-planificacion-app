import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { REMOTE } from "@/config";

const formSchema = z.object({
  email: z.string().email({ message: "Introduce un email válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { login , status} = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Nuevo estado para el mensaje de error.

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      setErrorMessage(null); // Resetea el mensaje de error antes de intentar el inicio de sesión.
      await login(values.email, values.password).then((e) => {
        navigate("/dashboard-admin");
        
      });
    } catch (error) {
      setErrorMessage("Credenciales incorrectas. Por favor, inténtalo de nuevo."); // Actualiza el mensaje de error.
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/remove-fondo-uefo.png"
            alt="Logo UEFO"
            className="mx-auto w-32 h-32 mb-4 object-cover"
          />
          <h1 className="text-2xl font-semibold mb-2">
            Sistema de Gestión de Planificaciones
          </h1>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-6 border-2 p-3 rounded-lg shadow-sm"
          >
            <div className="mx-auto max-w-sm">
              {errorMessage && (
                <div className="text-red-500 text-sm text-center mb-4">
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel className="w-28">Correo:</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="email"
                            placeholder="Correo"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormLabel>Contraseña:</FormLabel>
                          <FormControl>
                            <Input
                              className="pr-10"
                              required
                              type={showPassword ? "text" : "password"}
                              placeholder="Contraseña"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/3 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Recordarme
                  </Label>
                </div>

                <div className="text-center">
                  <a
                    href={`${REMOTE}/auth/email-recovery-form`}
                    className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button className="justify-self-center" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Ingresar"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-primary text-white">
          UNIDAD EDUCATIVA FRANCISCO DE ORELLANA
        </div>
      </div>
    </div>
  );
}
