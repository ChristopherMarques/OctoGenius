import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <Suspense fallback={<Spinner />}>
                {children}
            </Suspense>
        </div>
    );
};

export default Layout;

