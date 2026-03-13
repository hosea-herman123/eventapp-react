import React from "react";

const Footer = () => {
    return (
        <footer className="bg-[#1a1a2e] text-[#ffffff] py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold">Eventify Moments</h2>
                        <p className="text-lg font-extrabold">
                            Uniting people through<br /> epic occasions.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h2 className="text-xl text-center">Join Us:</h2>
                        <div className="flex flex-col items-center mt-4 font-extrabold">
                            <a href="#" className="text-lg mx-2 hover:text-[#f0f0f0] hover:underline">
                                Instagram
                            </a>
                            <a href="#" className="text-lg mx-2 hover:text-[#f0f0f0] hover:underline">
                                TikTok
                            </a>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <p className="text-xl text-center mb-4">
                            Contact Us:<br />
                            <a href="mailto:info@eventify.com" className="font-extrabold hover:text-[#f0f0f0] hover:underline">
                                info@eventify.com
                            </a>
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h2 className="text-xl">Stay in the Loop</h2>
                        <p className="font-extrabold">Get updates on upcoming occasions:</p>
                        <div className="flex flex-col md:flex-row items-center mt-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full md:w-64 p-2 border border-[#00ff85] rounded mb-2 md:mb-0 bg-[#162447] text-[#ffffff] placeholder-[#ffffff]"
                            />
                            <button type="submit" className="bg-[#ff2e63] hover:bg-[#ff577f] text-[#ffffff] px-4 py-2 rounded">
                                Join Now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-[#00ff85] mt-6 pt-4">
                    <p className="text-sm text-center">
                        <a href="#" className="hover:text-[#f0f0f0] hover:underline">Privacy Policy</a>
                    </p>
                </div>
                <p className="text-center mt-2">
                    &copy; {new Date().getFullYear()} Eventify Moments. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;