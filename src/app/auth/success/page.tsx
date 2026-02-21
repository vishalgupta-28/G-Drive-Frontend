"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

function AuthSuccessHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Save token in cookie (expires in 7 days to match backend)
            Cookies.set("token", token, { expires: 7, secure: false });

            // Instantly redirect to dashboard
            router.push("/dashboard");
        } else {
            // If someone manually goes to this page without a token, send them back to login
            router.push("/auth");
        }
    }, [router, searchParams]);

    return (
        <div className="flex bg-background min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground animate-pulse">Authenticating...</p>
            </div>
        </div>
    );
}

export default function AuthSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex bg-background min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <AuthSuccessHandler />
        </Suspense>
    );
}
