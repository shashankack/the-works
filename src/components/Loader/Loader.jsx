import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Loader.css";

const Loader = ({ loadingText, nextComponent: NextComponent }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const nextComponentRef = useRef(null);

  const characters = loadingText.split("");

  useEffect(() => {
    const timeline = gsap.timeline();

    // Falling animation for characters
    timeline.fromTo(
      textRef.current.children,
      {
        opacity: 0,
        y: () => (window.innerWidth > 768 ? "-100vh" : "-120vh"), // Adjust based on screen size
        rotationX: () => Math.random() * 360,
        rotationY: () => Math.random() * 360,
        rotationZ: () => Math.random() * 360,
        x: () => Math.random() * (window.innerWidth > 768 ? 200 : 100) - 50,
        transformPerspective: 1000,
      },
      {
        opacity: 1,
        y: () => (window.innerWidth > 768 ? 200 : 100), // Adjust based on screen size
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        x: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      }
    );

    // Assembling animation for characters
    timeline.to(
      textRef.current.children,
      {
        x: (index) =>
          (characters.length * -0.5 + index) * (window.innerWidth > 768 ? 50 : 10),
        rotationZ: 0,
        scale: 1.2,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      },
      "+=0.5"
    );

    // Slide out animation for the loader container
    timeline.to(
      containerRef.current,
      {
        y: "-100%",
        duration: 1.5,
        ease: "power2.inOut",
      },
      "+=1"
    );

    // Slide in animation for the NextComponent container
    timeline.fromTo(
      nextComponentRef.current,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 1.5, ease: "power2.inOut" },
      "-=1.5"
    );
  }, [characters.length]);

  return (
    <>
      <div ref={containerRef} className="loader-container">
        <div ref={textRef} className="flex">
          {characters.map((char, index) => (
            <span
              key={index}
              className="text-6xl text-white font-bold"
              style={{ display: "inline-block", perspective: "1000px" }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <div ref={nextComponentRef} className="next-component">
        <NextComponent />
      </div>
    </>
  );
};

export default Loader;
