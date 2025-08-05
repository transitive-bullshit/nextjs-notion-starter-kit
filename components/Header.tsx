"use client"

import { Menu, X } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Header() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigation = [
        { name: "Blog", href: "/" },
        { name: "Projects", href: "/projects" },
        { name: "About", href: "/about" },
        { name: "Surfing", href: "/surfing" },
    ]

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        return pathname?.startsWith(href)
    }

    return (
        <>
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-light text-gray-900">
                            surfer-kim.
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center space-x-8 md:flex">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors hover:text-purple-600 ${isActive(item.href) ? "text-purple-600" : "text-gray-700"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-500 transition-colors hover:text-gray-700 md:hidden"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="border-t border-gray-200 py-4 md:hidden">
                            <nav className="flex flex-col space-y-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`rounded-md px-2 py-1 text-base font-medium transition-colors hover:text-purple-600 ${isActive(item.href) ? "bg-purple-50 text-purple-600" : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </>
    )
}