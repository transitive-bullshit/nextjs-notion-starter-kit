export default function Footer() {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        {
            name: "youtube",
            href: "https://youtube.com/@surfer-kim",
            title: "YouTube",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                        d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"
                        fill="currentColor"
                    />
                </svg>
            ),
        },
        {
            name: "linkedin",
            href: "https://www.linkedin.com/in/surfer-kim",
            title: "LinkedIn",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                        d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z"
                        fill="currentColor"
                    />
                </svg>
            ),
        },
        {
            name: "github",
            href: "https://github.com/surfer-kim",
            title: "GitHub",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            name: "linktree",
            href: "https://linktr.ee/surfer_kim",
            title: "Linktree",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                        d="M13.736 5.853 17.741 1.736l2.325 2.381-4.201 4.005h5.909v3.305h-5.937l4.229 4.108-2.325 2.334-5.741-5.768-5.741 5.769-2.325-2.325 4.229-4.108H2.059V8.121h5.909L3.934 4.117 6.259 1.736l4.005 4.117V0h3.472v5.853ZM10.263 16.159h3.473V24h-3.473z"
                        fill="currentColor"
                    />
                </svg>
            ),
        },
    ]

    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center space-x-6 mb-4">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link.title}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
                <div className="text-gray-600">
                    <p>Copyright {currentYear} Jason Kim</p>
                </div>
            </div>
        </footer>
    )
}
