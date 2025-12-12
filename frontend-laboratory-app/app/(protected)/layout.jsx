'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { useLayoutEffect } from "react";
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

function Protected({children}) {
    const { user, loading } = useAuth();
    const returnUrl = usePathname();

    useLayoutEffect(() => {
        if (!loading && !user){
            redirect(`/user/signin?returnUrl=${returnUrl}`);
        }
    }, [user, loading]);
    return ( <>
    { children }
    </> );
}

export default Protected;