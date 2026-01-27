import Image from 'next/image';
import LoginForm from "@/components/auth/LoginForm";
import callApi from "@/lib/callApi";

// const login = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await callApi.post("/auth/login", form);
//   };

interface AuthLayoutProps {
  backgroundImage?: string;
  overlayGradient?: string;
  logoLight?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  // logoDark?: {
  //   src: string;
  //   alt: string;
  //   width: number;
  //   height: number;
  // };
  title?: string;
  children?: React.ReactNode;
}

export default function AuthPage({
  backgroundImage = `/${process.env.NEXT_PUBLIC_API_BASE_URL_ASSETS}/assets/login.jpg`,
  overlayGradient = 'bg-gradient-to-br from-blue-900/80 to-indigo-900/80',
  logoLight = {
    src: `/${process.env.NEXT_PUBLIC_API_BASE_URL_ASSETS}/assets/icon.png`,
    alt: '',
    width: 500,
    height: 500,
  },
  // logoDark = {
  //   src: '/assets/TCS-logo.svg',
  //   alt: '',
  //   width: 200,
  //   height: 200,
  // },
  title = '¡Bienvenido!',
  children = <LoginForm />,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      {/* Left side with background image */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden p-8 text-white md:w-1/2">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
            }}
            aria-hidden="true"
          />
        )}

        <div className={`absolute inset-0 ${overlayGradient}`} aria-hidden="true" />

        <div className="relative z-10 text-center">
          <Image
            src={logoLight.src}
            alt={logoLight.alt}
            width={logoLight.width}
            height={logoLight.height}
            priority
            className="mx-auto"
          />
        </div>
      </div>

      {/* Right side with form */}
      <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="mb-4 mt-6 flex justify-center">
              {/* <Image
                src={logoDark.src}
                alt={logoDark.alt}
                width={logoDark.width}
                height={logoDark.height}
                priority
                className="h-auto"
              /> */}
            </div>
            {title && (
              <h2 className="mt-6 text-3xl font-bold text-gray-800">
                {title}
              </h2>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
