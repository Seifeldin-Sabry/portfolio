import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {services} from "@/data/services"
import {ArrowRight, Check} from "lucide-react"

export default function ServicesPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">My Services</h1>

            <div className="max-w-3xl mx-auto mb-12">
                <p className="text-center text-lg">
                    I offer software development services to help your team build better products.
                </p>
            </div>

            {/* Team Collaboration Section */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Working With Teams</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold mb-4">Startup Teams</h3>
                            <p className="mb-6 text-white">
                                I work with startup teams to build new features and help with technical challenges.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-white">Building MVPs and prototypes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-white">Adding new features to existing products</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-white">Helping with technical decisions</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold mb-4">Big Tech</h3>
                            <p className="mb-6 text-white">
                                I've worked with companies like Atlas Copco, adapting to their team structure and
                                processes.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-white">Following company development processes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-white">Working with existing codebases</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-white">Collaborating with other team members</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Services Grid */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Technical Skills</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <Card key={service.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 flex items-center justify-center text-primary mb-4">
                                    <service.icon size={32} />
                                </div>
                                <h2 className="text-xl font-bold mb-3">{service.title}</h2>
                                <p className="mb-4 text-white">{service.description}</p>
                                <ul className="space-y-2 mb-6">
                                    {service.features.slice(0, 3).map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-white">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* How I Work */}
            <div className="max-w-4xl mx-auto mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">How I Work</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-3">Project-Based</h3>
                            <p className="mb-4 text-white">Working on specific projects with clear goals and
                                                           timelines.</p>
                            <div className="flex justify-center">
                                <Button variant="outline" asChild>
                                    <Link href="/contact" className="flex items-center gap-2">
                                        Learn More <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-3">Team Member</h3>
                            <p className="mb-4 text-white">Joining your team for a specific period to help with
                                                           development.</p>
                            <div className="flex justify-center">
                                <Button variant="outline" asChild>
                                    <Link href="/contact" className="flex items-center gap-2">
                                        Learn More <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-3">Technical Help</h3>
                            <p className="mb-4 text-white">Providing advice on technical problems and helping make
                                                           decisions.</p>
                            <div className="flex justify-center">
                                <Button variant="outline" asChild>
                                    <Link href="/contact" className="flex items-center gap-2">
                                        Learn More <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Want to work together?</h2>
                <Button asChild size="lg">
                    <Link href="/contact">Get in Touch</Link>
                </Button>
            </div>
        </div>
    )
}
