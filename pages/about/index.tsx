import { Calendar, MapPin } from "lucide-react"

export default function AboutPage() {
    const currentYear = new Date().getFullYear()
    const fisrtPositionYear = 2018
    const yearsOfExperience = currentYear - fisrtPositionYear
    const experiences = [
        {
            id: 1,
            company: "iHerb",
            role: "Senior Software Development Engineer",
            duration: "Jan 2025 - Present",
            location: "Los Angeles Metropolitan Area",
            description: "",
            image: "/about/iherb_logo.jpeg?height=80&width=80",
            skills: [".NET", "SQL", "MongoDB", "Redis", "Kubernetes", "Docker"],
        },
        {
            id: 2,
            company: "Meta",
            role: "Software Engineer",
            duration: "Jan 2024 - Oct 2024",
            location: "Los Angeles Metropolitan Area",
            description: "",
            image: "/about/meta_logo.jpeg?height=80&width=80",
            skills: ["React Native", "React", "Kotlin", "TypeScript", "GraphQL"],
        },
        {
            id: 3,
            company: "Amazon",
            role: "Software Development Engineer",
            duration: "Nov 2020 - Apr 2023",
            location: "Los Angeles Metropolitan Area",
            description: "",
            image: "/about/amazon_logo.jpeg?height=80&width=80",
            skills: ["Kotlin", "Ktor", "React", "Python", "AWS"],
        },
        {
            id: 4,
            company: "iHerb",
            role: "Software Development Engineer",
            duration: "Jan 2019 - Oct 2020",
            location: "Los Angeles Metropolitan Area",
            description: "",
            image: "/about/iherb_logo.jpeg?height=80&width=80",
            skills: [".NET", "SQL", "MongoDB", "Redis", "Kubernetes", "Docker"],
        },
        {
            id: 5,
            company: "University of Southern California",
            role: "Research Assistant",
            duration: "Jun 2017 - Aug 2017",
            location: "Los Angeles Metropolitan Area",
            description: "",
            image: "/about/usc_logo.jpeg?height=80&width=80",
            skills: [".NET", "Python", "NLP", "PowerBI"],
        },
        {
            id: 6,
            company: "Hyundai Mobis",
            role: "Software Developer Internship",
            duration: "Jan 2016 - Nov 2016",
            location: "Montgomery, AL",
            description: "",
            image: "/about/mobis_logo.jpg?height=80&width=80",
            skills: [".NET", "Windows Forms", "SQL"],
        },
        {
            id: 7,
            company: "Republic of Korea Army",
            role: "Squad Leader",
            duration: "Feb 2012 - Nov 2013",
            location: "Gyeonggi, South Korea",
            description: "",
            image: "/about/rok_logo.jpeg?height=80&width=80",
            skills: [],
        },
    ]

    const education = [
        {
            id: 1,
            institution: "Georgia Institute of Technology",
            degree: "Master's degree, Computer Science",
            duration: "2019 - 2023",
            description: "Specialization in Computing Systems",
            image: "/about/gt_logo.jpeg?height=80&width=80",
        },
        {
            id: 2,
            institution: "Dongguk University",
            degree: "Bachelor's degree, Computer Science and Engineering",
            duration: "2011 - 2018",
            description: "",
            image: "/about/dgu_logo.jpeg?height=80&width=80",
        },
    ]

    const skills = [
        ".NET",
        "Kotlin",
        "Java",
        "JavaScript",
        "TypeScript",
        "React",
        "React Native",
        "Angular",
        "Next.js",
        "Node.js",
        "Python",
        "AWS",
        "Docker",
        "SQL",
        "MongoDB",
        "Redis",
        "Git",
        "Tailwind CSS",
        "GraphQL",
        "REST APIs",
        "Agile",
        "CI/CD",
        "Testing",
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-32 h-32 mx-auto md:mx-0 relative">
                                <img
                                    src="/about/profile.jpg?height=200&width=200"
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold mb-2 text-gray-900">Jason Kim</h1>
                                <p className="text-xl text-gray-600 mb-4">Senior Software Engineer</p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        Los Angeles Metropolitan Area
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">About</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Full-stack Software Engineer with over {yearsOfExperience} years of experience delivering high-quality,
                            customer-centric products. Skilled in designing, planning, developing, and testing software solutions
                            across the full Software Development Life Cycle (SDLC), with a consistent focus on excellence,
                            scalability, and user experience.
                        </p>
                    </div>
                </div>

                {/* Experience Section */}
                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6 text-gray-900">Experience</h2>
                        <div className="space-y-6">
                            {experiences.map((exp, index) => (
                                <div key={exp.id}>
                                    <div className="flex gap-4">
                                        <img
                                            src={exp.image}
                                            alt={exp.company}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-900">{exp.role}</h3>
                                            <p className="text-gray-600 font-medium">{exp.company}</p>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {exp.duration}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {exp.location}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-gray-600">{exp.description}</p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {exp.skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {index < experiences.length - 1 && <hr className="mt-6 border-gray-200" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Education Section */}
                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6 text-gray-900">Education</h2>
                        <div className="space-y-6">
                            {education.map((edu, index) => (
                                <div key={edu.id}>
                                    <div className="flex gap-4">
                                        <img
                                            src={edu.image}
                                            alt={edu.institution}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-900">{edu.degree}</h3>
                                            <p className="text-gray-600 font-medium">{edu.institution}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {edu.duration}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-gray-600">{edu.description}</p>
                                        </div>
                                    </div>
                                    {index < education.length - 1 && <hr className="mt-6 border-gray-200" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6 text-gray-900">Skills & Technologies</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
