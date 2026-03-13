import React from "react";

function Contact (){
    return(
        <section id="contact" className="py-24 min-h-screen flex items-center justify-center bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="font-serif text-6xl mb-6 text-center text-blue-600">Visit Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center items-center">
                    <form 
                        className="bg-white p-8 rounded-lg shadow-lg reveal mx-auto w-full max-w-lg"
                    >
                        <h3 className="font-serif text-3xl mb-6 text-blue-600">Send us a message</h3>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-lg font-medium text-blue-600 mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Your name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-lg font-medium text-blue-600 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Your Email"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="message" className="block text-lg font-medium text-blue-600 mb-2">
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                    <div 
                        className="reveal bg-white p-8 rounded-lg shadow-lg flex flex-col mx-auto w-full max-w-lg"
                    >
                        <h3 className="font-serif text-4xl mb-6 text-blue-600">Our office Location</h3>
                        <div className="bg-coffee-light/20 h-64 mb-6 rounded-lg overflow-hidden flex items-center justify-center">
                            <div className="text-blue-600 text-lg">Interactive Map Coming Soon</div>
                        </div>
                        <div className="space-y-4 text-blue-600 flex-grow text-lg">
                            <p className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 mt-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span>123 Event Street, Bean City, BC 12345</span>
                            </p>
                            <p className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <span>(+254) 7123-456-78</span>
                            </p>
                            <p className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <span>info@eventify.com</span>
                            </p>
                            <div>
                                <h4 className="font-medium mb-2 mt-6 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-blue-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Opening Hours:
                                </h4>
                                <p className="ml-8">Mon-Fri: 7am - 8pm</p>
                                <p className="ml-8">Sat-Sun: 8am - 6pm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
    }
export default Contact