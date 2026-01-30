// "use client";

// import callApi from "@/lib/callApi";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface LoginFormProps {
//   username: string;
//   password: string;
// }

// export default function LoginForm({username, password}: LoginFormProps) {

//   const router = useRouter();

//   const [form, setForm] = useState({
//     usuario: "",
//     password: "",
//   });

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await callApi.post("/auth/login", {username, password});
//   };

//   // 👉 Redirige solo cuando token cambie
//   useEffect(() => {
//     if (token) {
//       router.push("/dashboard");
//     }
//   }, [token, router]);

//   return (
//     <form onSubmit={onSubmit} className="flex flex-col gap-4">
//       <input
//         type="text"
//         placeholder="Usuario"
//         value={form.usuario}
//         onChange={(e) => setForm({ ...form, usuario: e.target.value })}
//         className="border p-2 rounded text-black"
//       />

//       <input
//         type="password"
//         placeholder="Contraseña"
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//         className="border p-2 rounded text-black" 
//       />

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//       >
//         {isLoading ? "Ingresando..." : "Entrar"}
//       </button>
//     </form>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import callApi from "@/lib/callApi";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, User, LockIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { Messages } from "@/lib/messages";
import { ResponseApi } from "@/types/response";
import { setTimeout } from "timers";
import GlobalModal from "../global/globalModal";
import { LoginResponse } from "@/types/loginResponse";
import { useSpinner } from "@/context/SpinnerContext";

const formSchema = z.object({
  username: z
    .string()
    .nonempty(Messages.get("MSG-004"))
    .min(4, Messages.get("MSG-006"))
    .max(50, Messages.get("MSG-007"))
    .regex(/^\S*$/, Messages.get("MSG-007")),
  password: z
    .string()
    .nonempty(Messages.get("MSG-004"))
    .min(4, Messages.get("MSG-006"))
    .max(50, Messages.get("MSG-007"))
    .regex(/^\S*$/, Messages.get("MSG-007")),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {

  const rememberMeCookie = Cookies.get("rememberMe") === "true";
  const savedLoginUsername = rememberMeCookie
    ? Cookies.get("loginUsername") || ""
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      username: savedLoginUsername,
      password: "",
      rememberMe: rememberMeCookie,
    },
  });

  // const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authenticationType, setAuthenticationType] = useState<string>("");
  const [idUser, setIdUser] = useState<number>();
  const { showSpinner, hideSpinner, isLoading } = useSpinner();
  // Modal State
  const [showActiveSessionModal, setShowActiveSessionModal] = useState(false);
  const [activeSessionMessage, setActiveSessionMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    // setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    login(data.username, data.password, data.rememberMe || false);
  };

  const onConfirmSessions = async () => {
    setShowActiveSessionModal(false);
    showSpinner();
    try {
      const response: ResponseApi = await callApi.post("/api/admin/force-logout", {
        id_user: idUser,
      });

      if (response.status) {
        login(username, password, Boolean(Cookies.get("rememberMe")));
      } else {
        const errorMessage = response.data?.message || response.message || "Error al cerrar sesión activa";
        console.log("Force-logout fallido:", response.message);
        setSubmitError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      hideSpinner();
      const errorMessage = error instanceof Error ? error.message : "No se pudo conectar con el servidor";
      console.error("Error en el login:", error);
      setSubmitError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // setIsLoading(false);
      hideSpinner()
    }
  }

  const login = async (username: string, password: string, rememberMe: boolean) => {
    try {
      showSpinner();
      setUsername(username);
      setPassword(password);
      const response: LoginResponse = await callApi.post("/api/admin/login", {
        username: username,
        password: password,
      });

      if (response.status) {
        if (response.hasActiveSession) {
          setIdUser(response.id_user);
          // setIsLoading(false);
          setActiveSessionMessage(response.message);
          setShowActiveSessionModal(true);
          return;
        }
        // setTimeout(() => {
        //   router.push(`/dashboard/clients`);
        // }, 100000);
        setSubmitSuccess(true);
        console.log("Login exitoso:", true);

        // Set session cookies
        const cookieOptions = {
          expires: 1,
          secure: true,
          sameSite: 'strict' as const
        };

        // Set auth cookies
        Cookies.set("token", response.data.token, { expires: 1 });
        // Cookies.set("username", response.data.user.nombre, cookieOptions);
        // Cookies.set("email", response.data.user.mail, cookieOptions);
        Cookies.set("idProfile", response.data.id_profile, cookieOptions);
        Cookies.set("idUser", response.data.id_user, cookieOptions);

        // Handle remember me
        if (rememberMe) {
          Cookies.set("rememberMe", "true", { ...cookieOptions, expires: 30 });
          Cookies.set("loginUsername", username, { ...cookieOptions, expires: 30 });
        } else {
          Cookies.remove("rememberMe");
          Cookies.remove("loginUsername");
        }

        router.push(`/dashboard/clients`);

      } else {
        reset({ password: "" });
        // Handle login failure
        const errorMessage = response.data?.message || response.message || "Credenciales inválidas";
        console.log("Login fallido:", response.message);
        setSubmitError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      hideSpinner();
      const errorMessage = error instanceof Error ? error.message : "No se pudo conectar con el servidor";
      console.error("Error en el login:", error);
      setSubmitError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

    } finally {
      hideSpinner()
    }
  };

  return (
    <div className="w-full">
      <GlobalModal
        open={showActiveSessionModal}
        onClose={() => setShowActiveSessionModal(false)}
        title="Atención"
        message={activeSessionMessage}
        onConfirm={() => onConfirmSessions()}
        confirmText="Aceptar"
        showCancelButton={true}
        onCancel={() => setShowActiveSessionModal(false)}
      />
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            id="username"
            placeholder="Usuario"
            className="w-full border p-2 rounded text-black"
            maxLength={50}
            {...register("username")}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Contraseña"
              className="w-full border p-2 rounded text-black pr-10"
              maxLength={50}
              autoComplete="current-password"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
              Recordarme
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex justify-center items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ingresando...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>
    </div>
  );
}

