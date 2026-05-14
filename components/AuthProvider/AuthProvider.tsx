"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession, getMe } from "../../lib/api/clientApi";

const PRIVATE_ROUTES = ["/profile", "/notes"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    const verify = async () => {
      try {
        const session = await checkSession();
        if (session) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (isPrivate) router.push("/sign-in");
        }
      } catch {
        clearIsAuthenticated();
        if (isPrivate) router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [pathname]);

  if (loading) return <p>Loading...</p>;
  if (isPrivate && !isAuthenticated) return null;
  return <>{children}</>;
}