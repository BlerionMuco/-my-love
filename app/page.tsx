/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef } from "react";

// Customize your girlfriend's name here!
const GIRLFRIEND_NAME = "Oligerta"; // Leave empty for generic message, or add her name like "Sarah"

interface Confetti {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  color: string;
  shape: string;
}

interface Heart {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
  emoji: string;
}

export default function Home() {
  const [showThanks, setShowThanks] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [hoverCount, setHoverCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [vanishedHearts, setVanishedHearts] = useState<Set<number>>(new Set());
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate background hearts positions once with lazy initialization
  const [backgroundHearts] = useState<Heart[]>(() => {
    const hearts: Heart[] = [];
    const emojis = ["❤️", "💕", "💖", "💗", "💝"];
    for (let i = 0; i < 15; i++) {
      hearts.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 3,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    return hearts;
  });

  // Generate thank you page hearts once
  const [thanksHearts] = useState<Heart[]>(() => {
    const hearts: Heart[] = [];
    const emojis = ["❤️", "💕", "💖", "💗", "💝", "🌹"];
    for (let i = 0; i < 30; i++) {
      hearts.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 2,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    return hearts;
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const cuteMessages = [
    "Wait! Don't say no! 💕",
    "Are you sure? 🥺",
    "Please reconsider! 💖",
    "My heart is breaking! 💔",
    "One more chance? 🙏",
    "You're making me sad! 😢",
    "Pretty please? 🌹",
    "I'll be the best Valentine! ✨",
    "Don't break my heart! 💝",
    "Think about it! 💭",
    "But... but... we'd be so perfect together! 💑",
    "I promise to make you smile every day! 😊",
    "Just give me a chance! 🎯",
    "You know you want to say yes! 😏",
    "Come on, I can see you smiling! 😄",
    "The 'Yes' button is right there! 👉",
    "I'll buy you chocolate! 🍫",
    "We could be the cutest couple! 👫",
    "I've been practicing my Valentine's lines! 🎭",
    "No? More like... YES! 🎪",
    "You're just playing hard to get, right? 😉",
    "I'll write you poems! 📝",
    "Think of all the cute dates we could have! 🎡",
    "Your heart is saying yes, I can tell! ❤️‍🔥",
    "Aww come on, don't make me cry! 😭",
    "This button is getting a workout! 🏃",
    "You're really testing my determination! 💪",
    "Plot twist: There is no No option! 🎬",
    "I'll serenade you! 🎵",
    "Fine, but I'm not giving up! 🚀",
  ];

  const moveNoButton = () => {
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setNoButtonPosition({ x: newX, y: newY });

    // Vanish one heart at a time
    setVanishedHearts((prev) => {
      if (prev.size < backgroundHearts.length) {
        const newSet = new Set(prev);
        newSet.add(prev.size); // Add the next heart index
        return newSet;
      }
      return prev;
    });

    setHoverCount((prev) => prev + 1);

    // Clear previous timeout if it exists
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    // Show notification with cute message
    const message = cuteMessages[Math.min(hoverCount, cuteMessages.length - 1)];
    setNotificationMessage(message);
    setShowNotification(true);

    // Set new timeout and store the reference
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
      notificationTimeoutRef.current = null;
    }, 3500);
  };

  const createConfetti = () => {
    const colors = ["#ff69b4", "#ff1493", "#ff69b4", "#ffc0cb", "#ff85a2"];
    const newConfetti: Confetti[] = [];

    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 2 + Math.random() * 3,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.5 ? "50%" : "0%",
      });
    }

    setConfetti(newConfetti);
    setShowConfetti(true);

    // Hide confetti after animation
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const handleYes = () => {
    createConfetti();
    setTimeout(() => {
      setShowThanks(true);
    }, 500);
  };

  // Calculate button sizes based on hover count
  const yesButtonScale = 1 + hoverCount * 0.1; // Grows 10% per hover
  const noButtonScale = Math.max(0.5, 1 - hoverCount * 0.05); // Shrinks 5% per hover, min 50%

  if (showThanks) {
    const loveReasons = [
      "Your smile lights up my world ✨",
      "You make every day better 🌟",
      "Your laugh is my favorite sound 🎵",
      "You're my best friend and so much more 👫",
      "Every moment with you is magical 🪄",
      "You understand me like no one else 💭",
    ];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Floating hearts background */}
        <div className="absolute inset-0 pointer-events-none">
          {thanksHearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute text-4xl animate-[float_3s_ease-in-out_infinite]"
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                animationDelay: `${heart.animationDelay}s`,
                opacity: 0.6,
              }}
            >
              {heart.emoji}
            </div>
          ))}
        </div>

        {/* Thank you content */}
        <div className="text-center z-10 animate-[fade-in_1s_ease-out] max-w-3xl">
          <div className="text-9xl mb-8 animate-[pulse-heart_1.5s_ease-in-out_infinite]">
            💖
          </div>
          <h1 className="text-7xl font-bold mb-6 text-pink-600">Yay! 🎉</h1>
          <p className="text-4xl mb-6 text-pink-500 font-semibold">
            {GIRLFRIEND_NAME ? `${GIRLFRIEND_NAME}, you` : "You"} made me the
            happiest person alive!
          </p>
          <p className="text-2xl text-pink-400 mb-8">
            I can't wait to celebrate Valentine's Day with you! 🌹
          </p>

          {/* Love reasons */}
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl">
            <h2 className="text-3xl font-bold text-pink-600 mb-6">
              Why I love you: 💕
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {loveReasons.map((reason, index) => (
                <div
                  key={index}
                  className="bg-pink-100/50 rounded-xl p-4 animate-[fade-in_0.5s_ease-out]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <p className="text-lg text-pink-700">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center text-6xl mb-6 animate-[bounce-soft_2s_ease-in-out_infinite]">
            💝 🎁 🌹 💕 ✨ 🎀
          </div>

          <p className="text-xl text-pink-500 italic">
            "You're not just my Valentine, you're my everything" 💫
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundHearts.map((heart) => !vanishedHearts.has(heart.id) && (
          <div
            key={heart.id}
            className="absolute text-4xl animate-[float_3s_ease-in-out_infinite] transition-opacity duration-1000"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              animationDelay: `${heart.animationDelay}s`,
              opacity: vanishedHearts.has(heart.id) ? 0 : 0.4,
            }}
          >
            {heart.emoji}
          </div>
        ))}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confetti.map((conf) => (
            <div
              key={conf.id}
              className="absolute"
              style={{
                left: `${conf.left}%`,
                width: `${conf.size}px`,
                height: `${conf.size}px`,
                backgroundColor: conf.color,
                animation: `confetti-fall ${conf.animationDuration}s linear`,
                borderRadius: conf.shape,
              }}
            />
          ))}
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-[fade-in_0.3s_ease-out]">
          <div className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-full shadow-2xl border-2 border-pink-300">
            <p className="text-xl font-semibold text-pink-600">
              {notificationMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="text-center max-w-2xl relative z-10">
        <div className="mb-8 text-8xl animate-[pulse-heart_2s_ease-in-out_infinite]">
          💝
        </div>

        <h1 className="text-6xl font-bold mb-6 text-pink-600 animate-[bounce-soft_2s_ease-in-out_infinite]">
          {GIRLFRIEND_NAME ? `${GIRLFRIEND_NAME}, will` : "Will"} you be my
          Valentine?
        </h1>

        <p className="text-2xl text-pink-500 mb-12">Please say yes! 🥺</p>

        {/* Show hint after 5 hovers */}
        {hoverCount >= 5 && (
          <p className="text-lg text-pink-400 mb-4 animate-[fade-in_0.5s_ease-out]">
            Psst... notice how the Yes button is getting bigger? 😉
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-6 justify-center items-center relative h-32">
          {/* Yes Button - grows with each hover */}
          <button
            onClick={handleYes}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 active:scale-95 z-20"
            style={{
              fontSize: `${1.5 + hoverCount * 0.1}rem`,
              padding: `${1 + hoverCount * 0.1}rem ${2 + hoverCount * 0.2}rem`,
              transform: `scale(${yesButtonScale})`,
            }}
          >
            Yes! 💕
          </button>

          {/* No Button - shrinks and moves on hover */}
          <button
            onMouseEnter={moveNoButton}
            onTouchStart={moveNoButton}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-full shadow-lg absolute transition-all duration-300"
            style={{
              left: noButtonPosition.x || "auto",
              top: noButtonPosition.y || "auto",
              position: hoverCount > 0 ? "fixed" : "relative",
              transition: "all 0.5s ease-in-out",
              transform: `scale(${noButtonScale})`,
              fontSize: `${1.5 * noButtonScale}rem`,
              padding: `${0.75 * noButtonScale}rem ${1.5 * noButtonScale}rem`,
              zIndex: 30,
            }}
          >
            No 😢
          </button>
        </div>

        {/* Decorative hearts */}
        <div className="mt-12 flex gap-4 justify-center text-4xl opacity-60">
          <span className="animate-[float_3s_ease-in-out_infinite]">💗</span>
          <span className="animate-[float_3s_ease-in-out_infinite] delay-100">
            💖
          </span>
          <span className="animate-[float_3s_ease-in-out_infinite] delay-200">
            💝
          </span>
          <span className="animate-[float_3s_ease-in-out_infinite] delay-300">
            💕
          </span>
        </div>
      </div>
    </div>
  );
}
