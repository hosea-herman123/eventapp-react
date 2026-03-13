import React, { useEffect, useState } from "react";
import slide1 from "../assets/event.jpg";
import slide2 from "../assets/event2.jpg";
import slide3 from "../assets/event1.jpg";
import image1 from "../assets/party1.jpg";
import image2 from "../assets/party2.jpg";
import image3 from "../assets/party3.jpg";
import "font-awesome/css/font-awesome.min.css";

const slides = [
  {
    img: slide1,
    title: "Annual Soul Festival",
    subtitle: "Join us for vibes, live music, and great relaxation.",
    ctaText: "Learn More",
    ctaLink: "/events/coffee-fest",
  },
  {
    img: slide2,
    title: "Fun and Chills",
    subtitle: "A thrilling experience for you and your friends.",
    ctaText: "Get Tickets",
    ctaLink: "/events/snow-run",
  },
  {
    img: slide3,
    title: "Mountain Retreat",
    subtitle: "Relax, recharge, and network with friends.",
    ctaText: "Book Now",
    ctaLink: "/events/mountain-retreat",
  },
];

const Event = () => {
  const [index, setIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearTimeout(timer);
  }, [index]);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <section className="min-h-screen bg-[#1a1a2e] font-['Orbitron','Roboto',sans-serif] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#162447] border-r border-[#007BFF] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-20 md:sticky md:top-0`}
      >
        <div className="p-6">
          <h2 className="text-xl text-[#E0E0FF] font-bold mb-6">Explore Sections</h2>
          <nav className="flex flex-col space-y-4">
            {["hero", "stats", "slideshow", "event-types", "spotlight", "features"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-left py-2 px-4 rounded-lg text-[#E0E0FF] hover:bg-[#007BFF] hover:text-[#FFFFFF] transition-colors duration-200"
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace("-", " ")}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-4 text-[#007BFF] fixed top-4 left-4 z-30"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Hero Section */}
        <div id="hero" className="relative w-full h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/80 to-[#162447]/80" />
          <div className="relative text-center px-4">
            <h1 className="text-5xl font-extrabold text-[#E0E0FF] drop-shadow-[2px_2px_4px_rgba(0,123,255,0.7)] leading-tight">
              Ignite Your <span className="text-[#FF2E63]">Epic</span> Moments
            </h1>
            <p className="font-bold text-xl text-[#00B7EB] mt-4 max-w-2xl mx-auto">
              Curate unforgettable occasions with ease
            </p>
            <div className="mt-8">
              <a
                href="/events"
                className="inline-block bg-[#007BFF] hover:bg-[#3399FF] text-[#E0E0FF] px-6 py-3 rounded-lg text-lg font-medium shadow-[0_0_8px_rgba(0,123,255,0.5)] transition-transform hover:scale-105"
              >
                Discover Moments
              </a>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div id="stats" className="flex flex-wrap gap-4 justify-center pt-8 border-t border-[#00FF85] max-w-6xl mx-auto">
          {[
            { icon: "fa-calendar-check-o", value: "50K+", text: "Moments Crafted" },
            { icon: "fa-user-o", value: "2M+", text: "Experiences Shared" },
            { icon: "fa-line-chart", value: "98%", text: "Joy Delivered" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center bg-[#162447] border border-[#00FF85]/50 p-6 rounded-lg shadow-[0_0_8px_rgba(0,255,133,0.5)] w-64 transition-transform duration-300 hover:scale-105 hover:-rotate-2"
            >
              <div className="flex items-center justify-center space-x-2 text-[#007BFF]">
                <i className={`fa ${stat.icon} fa-2x text-[#00FF85] transform hover:scale-110 transition-transform`} aria-hidden="true"></i>
                <span className="text-4xl font-bold">{stat.value}</span>
              </div>
              <p className="text-lg text-[#E0E0FF] mt-2">{stat.text}</p>
            </div>
          ))}
        </div>

        {/* Slideshow Section */}
        <div id="slideshow" className="max-w-6xl mx-auto mt-20">
          <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#FF2E63]/20 border border-[#00FF85] mb-6 animate-pulse mx-auto">
            <span className="text-sm font-medium text-[#E0E0FF]">
              ✨ Unforgettable Moments Await
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#E0E0FF] drop-shadow-[2px_2px_4px_rgba(0,123,255,0.7)] text-center">
            Epic Experiences Await
          </h1>
          <p className="text-xl font-bold text-[#00B7EB] text-center mb-8">
            Dive into extraordinary occasions
          </p>
          <div className="relative w-full h-[500px] overflow-hidden rounded-3xl">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`transition-opacity duration-700 absolute inset-0 flex items-center ${
                  i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
                aria-hidden={i === index ? "false" : "true"}
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  style={{ backgroundAttachment: "fixed" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="max-w-3xl bg-gradient-to-r from-[#162447]/80 to-transparent p-8 rounded-lg">
                    <h2 className="text-4xl font-bold text-[#E0E0FF] mb-4 drop-shadow">{slide.title}</h2>
                    <p className="text-lg text-[#00B7EB] mb-6">{slide.subtitle}</p>
                    {slide.ctaText && (
                      <a
                        href={slide.ctaLink}
                        className="inline-block bg-[#FF2E63] hover:bg-[#FF577F] text-[#E0E0FF] px-6 py-3 rounded-lg text-base shadow-[0_0_8px_rgba(255,46,99,0.5)] transition-transform hover:scale-105"
                      >
                        {slide.ctaText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i === index ? "bg-[#00FF85]" : "bg-[#00B7EB]/50"
                  }`}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Event Types Section */}
        <div id="event-types" className="max-w-6xl mx-auto mt-20 text-center">
          <h1 className="text-4xl text-[#E0E0FF] drop-shadow-[2px_2px_4px_rgba(0,123,255,0.7)] font-extrabold">
            Ideal for Every Occasion
          </h1>
          <p className="text-xl text-[#00B7EB] mb-8 font-bold">
            Discover occasions designed for you
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: "fa-volume-up", title: "Concerts" },
              { icon: "fa-users", title: "Weddings" },
              { icon: "fa-calendar", title: "Corporate Events" },
              { icon: "fa-music", title: "Festivals" },
            ].map((type, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-[#162447] text-[#E0E0FF] rounded-2xl p-8 border border-[#00FF85]/50 shadow-[0_0_8px_rgba(0,255,133,0.5)] transition-transform hover:scale-105"
              >
                <i className={`fa ${type.icon} text-4xl mb-4 text-[#00FF85] transform hover:scale-110 transition-transform`} aria-hidden="true"></i>
                <h2 className="text-xl font-extrabold">{type.title}</h2>
              </div>
            ))}
          </div>
          <a href="/events">
            <button className="mt-12 bg-[#007BFF] hover:bg-[#3399FF] text-[#E0E0FF] px-6 py-3 rounded-lg text-lg font-bold shadow-[0_0_8px_rgba(0,123,255,0.5)] transition-transform hover:scale-105">
              Explore Now
            </button>
          </a>
        </div>

        {/* Images Grid Section */}
        <div id="spotlight" className="max-w-6xl mx-auto mt-20">
          <h1 className="text-4xl font-extrabold text-[#E0E0FF] drop-shadow-[2px_2px_4px_rgba(0,123,255,0.7)] text-center">
            Moment Spotlight
          </h1>
          <p className="text-xl font-bold text-[#00B7EB] text-center mb-8">
            Experience the thrill of our featured occasions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: image1, alt: "Party scene with people dancing and colorful lights" },
              { img: image2, alt: "Crowd enjoying a lively party with DJ and vibrant atmosphere" },
              { img: image3, alt: "People celebrating at an outdoor event with festive decorations" },
            ].map((image, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden shadow-lg border border-[#00FF85]/50 transition-transform duration-300 hover:scale-105"
              >
                <img className="w-full h-64 object-cover" src={image.img} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-6xl mx-auto mt-20 text-center">
          <div className="inline-flex items-center px-3 py-2 rounded-full bg-[#FF2E63]/20 border border-[#00FF85] mb-6 animate-pulse">
            <span className="text-sm font-medium text-[#E0E0FF]">
              ✨ Dynamic Tools
            </span>
          </div>
          <h2 className="text-4xl text-[#E0E0FF] drop-shadow-[2px_2px_4px_rgba(0,123,255,0.7)] font-extrabold">
            Essential Tools for All Users
          </h2>
          <p className="text-xl text-[#00B7EB] mt-2 mb-8">
            For organizers, planners, or attendees, Eventrick delivers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "fa-user-o",
                title: "Attendee Control",
                desc: "Full oversight with attendee tracking and event management.",
              },
              {
                icon: "fa-calendar-check-o",
                title: "Occasion Mastery",
                desc: "Plan, edit, and manage occasions with real-time insights.",
              },
              {
                icon: "fa-user-circle",
                title: "Seamless Journey",
                desc: "Effortless discovery, secure bookings, and personalized access.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-xl bg-[#162447] border border-[#00FF85]/50 shadow-[0_0_8px_rgba(0,255,133,0.5)] transition-transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-[#007BFF] rounded-full flex items-center justify-center mb-3">
                  <i className={`fa ${feature.icon} text-lg text-[#00FF85]`} aria-hidden="true"></i>
                </div>
                <h3 className="text-lg font-semibold text-[#E0E0FF] mb-2">{feature.title}</h3>
                <p className="text-[#00B7EB] text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Event;