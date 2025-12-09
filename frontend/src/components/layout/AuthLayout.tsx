import type { ReactNode } from "react";
import { LangButton } from "../ui/LangButton";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const navigate = useNavigate();

  return (
    <main className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark" >
      <div className="relative flex flex-col w-full min-h-screen" >
        
        {/* Language Switch */}
        <div className="absolute z-10 top-6 right-6">
          <LangButton />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute z-10 p-2 rounded-md top-6 left-6 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft />
        </button>

        <div className="flex flex-1 w-full">
          {/* Left Side - Image Section */}
          <div className="relative items-center justify-center hidden w-1/2 lg:flex">
            <img
              className="absolute inset-0 object-cover w-full h-full"
              alt=""
              role="presentation"
              loading="lazy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-TyXWEab_vN8AAOjPjUIeQT0hFAfRJGC8l9PLUt0aHSkxEBDzCjkxYHN58JSNwWjU4GRY-rWEoVgKOb-JE4U55C0eUuT-NuMa891gILHegLEwg8DS3wmM2tm6G8cZ3PZlxG-_UA4oqSACNp-e50ezUHOERi1OifMBZuxVxbC_LKMAU9vq-Pe9DPsHrlJ5R4-NKHkcjM0Hmdju4vQez2Cw_xAlRWh1wBC-RqCnUHVhZA_nc65QbLReFKSSlwurhRyLrgUisQXa6jM"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Right Side - Auth Content */}
          <section className="flex items-center justify-center flex-1">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
