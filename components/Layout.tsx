import { Inter } from "next/font/google";
import Footer from "./Footer";
import Header from "./Header";

const inter = Inter({ subsets: ["latin"] })

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className={inter.className}>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </div>
    )
}
