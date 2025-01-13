"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Star, Info, AlertTriangle, ShieldCheck, X } from "lucide-react";
import Image from "next/image";

const CharacterImage = ({ pose, images, className }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      width={600}
      height={600}
      src={images[pose]}
      alt={`Anime character ${pose} pose`}
      className={`transition-opacity duration-300 ${
        isLoading ? "opacity-0" : "opacity-100"
      } ${className}`}
      onLoad={() => setIsLoading(false)}
    />
  );
};

export const WelcomeModalTrigger = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors ${className}`}
      aria-label="Open welcome modal"
    >
      {children || "Open Welcome Guide"}
    </button>
  );
};

export const WelcomeModal = ({ onClose }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [characterPose, setCharacterPose] = useState("wave");
  const CURRENT_VERSION = "1.0.0";

  const characterImages = useMemo(
    () => ({
      wave: "https://github.com/Ozsumit/fiiles.images/blob/main/gene_20241216_195549.png?raw=true",
      point:
        "https://github.com/Ozsumit/fiiles.images/blob/main/gene_20241216_173825.png?raw=true",
      think:
        "https://github.com/Ozsumit/fiiles.images/blob/main/gene_20241216_200354.png?raw=true",
      celebrate:
        "https://github.com/Ozsumit/fiiles.images/blob/main/gene_20241216_201017.png?raw=true",
      idle1:
        "https://github.com/Ozsumit/fiiles.images/blob/main/gene_20241216_195549.png?raw=true",
      idle2:
        "https://github.com/Ozsumit/fiiles.images/blob/main/gene_20241216_173825.png?raw=true",
    }),
    []
  );

  const sections = useMemo(
    () => [
      {
        icon: <Star className="text-yellow-500 w-6 h-6" />,
        title: "Welcome to CresentMoon Anime!",
        items: [
          "Your ultimate anime companion",
          "Personalized anime recommendations",
          "Discover trending anime easily",
        ],
        characterDialog:
          "Konnichiwa! I'm your guide to CresentMoon Anime! Let's explore together~!",
        characterPose: "wave",
      },
      {
        icon: <Info className="text-blue-500 w-6 h-6" />,
        title: "Discover Amazing Features",
        items: [
          "Create and manage your anime watchlist",
          "Rate and review your favorite anime",
          "Connect with fellow anime enthusiasts",
        ],
        characterDialog:
          "Sugoi! Check out these cool features! There's so much to explore!",
        characterPose: "point",
      },
      {
        icon: <AlertTriangle className="text-orange-500 w-6 h-6" />,
        title: "Stay Up-to-Date",
        items: [
          "Get notified about new anime episodes",
          "Receive alerts for upcoming anime releases",
          "Stay informed about your favorite voice actors",
        ],
        characterDialog:
          "Never miss a new episode with these handy notifications!",
        characterPose: "think",
      },
      {
        icon: <ShieldCheck className="text-green-500 w-6 h-6" />,
        title: "You're All Set!",
        items: [
          "Start exploring CresentMoon Anime now",
          "Customize your anime profile",
          { text: "Check out our anime FAQ for more info", url: "/faq" },
        ],
        characterDialog:
          "Yatta! You're ready to go! Enjoy your anime journey with CresentMoon!",
        characterPose: "celebrate",
      },
    ],
    []
  );

  const startIdleAnimations = useCallback(() => {
    return setInterval(() => {
      const idlePoses = ["idle1", "idle2"];
      const randomPose =
        idlePoses[Math.floor(Math.random() * idlePoses.length)];
      setCharacterPose(randomPose);
    }, 3000);
  }, []);

  useEffect(() => {
    const idleInterval = startIdleAnimations();

    return () => {
      clearInterval(idleInterval);
    };
  }, [startIdleAnimations]);

  const handleSectionChange = useCallback(
    (index: number) => {
      setCurrentSection(index);
      setCharacterPose(sections[index].characterPose);
    },
    [sections]
  );

  const renderListItem = useCallback((item) => {
    if (typeof item === "object" && item.url) {
      return (
        <li key={item.text} className="flex items-center">
          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
          {item.text}
        </li>
      );
    }
    return (
      <li key={item} className="flex items-center">
        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
        {item}
      </li>
    );
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-gray-800 text-white w-11/12 md:w-3/4 lg:w-4/5 xl:w-2/3 h-3/4 rounded-lg shadow-lg overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-900 p-4">
          <h2 className="text-xl font-bold mb-4 text-indigo-300">
            Anime Guide
          </h2>
          <nav>
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => handleSectionChange(index)}
                className={`w-full text-left p-2 mb-2 rounded ${
                  currentSection === index
                    ? "bg-indigo-900 text-indigo-300"
                    : "hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center">
                  {section.icon}
                  <span className="ml-2">{section.title}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h2 id="modal-title" className="text-2xl font-bold text-indigo-300">
              {sections[currentSection].title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex">
            <div className="w-1/2 pr-4">
              <ul className="list-none space-y-2 text-gray-300">
                {sections[currentSection].items.map(renderListItem)}
              </ul>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center">
              <CharacterImage
                pose={characterPose}
                images={characterImages}
                className="w-140 h-140"
              />
              <p className="mt-4 text-gray-300 text-center">
                {sections[currentSection].characterDialog}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
