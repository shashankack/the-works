import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ImageSlider = ({ images, direction = "random" }) => {
  const sliderRef = useRef(null);
  const currentIndexRef = useRef(0);
  const imageRefs = useRef([]);
  const timeoutRef = useRef(null); // Prevent overlapping timeouts

  useEffect(() => {
    if (!images || images.length === 0) return;

    let availableDirections = [];
    if (direction === "vertical") {
      availableDirections = ["top", "bottom"];
    } else if (direction === "horizontal") {
      availableDirections = ["left", "right"];
    } else {
      availableDirections = ["top", "bottom", "left", "right"];
    }

    const animateSlide = () => {
      const currentIndex = currentIndexRef.current;
      const nextIndex = (currentIndex + 1) % images.length;
      currentIndexRef.current = nextIndex;

      const selectedDirection =
        availableDirections[
          Math.floor(Math.random() * availableDirections.length)
        ];

      let fromProps = {};
      let toProps = {
        opacity: 1,
        x: "0%",
        y: "0%",
        duration: 1,
        ease: "power2.in",
      };

      if (selectedDirection === "top") {
        fromProps = { y: "-100%", opacity: 1 };
        gsap.to(imageRefs.current[currentIndex], {
          y: "100%",
          opacity: 1,
          duration: 1,
          ease: "power2.in",
        });
      } else if (selectedDirection === "bottom") {
        fromProps = { y: "100%", opacity: 1 };
        gsap.to(imageRefs.current[currentIndex], {
          y: "-100%",
          opacity: 1,
          duration: 1,
          ease: "power2.in",
        });
      } else if (selectedDirection === "left") {
        fromProps = { x: "-100%", opacity: 1 };
        gsap.to(imageRefs.current[currentIndex], {
          x: "100%",
          opacity: 1,
          duration: 1,
          ease: "power2.in",
        });
      } else if (selectedDirection === "right") {
        fromProps = { x: "100%", opacity: 1 };
        gsap.to(imageRefs.current[currentIndex], {
          x: "-100%",
          opacity: 1,
          duration: 1,
          ease: "power2.in",
        });
      }

      gsap.fromTo(imageRefs.current[nextIndex], fromProps, toProps);

      // Generate a stable delay per cycle (between 2s - 4s)
      const randomDelay = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;

      // Clear previous timeout to prevent overlapping animations
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => animateSlide(), randomDelay);
    };

    animateSlide(); // Start the animation cycle

    return () => clearTimeout(timeoutRef.current); // Cleanup on unmount
  }, [images, direction]);

  return (
    <div
      className="slider-section"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        ref={sliderRef}
        className="slider-container"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            ref={(el) => (imageRefs.current[index] = el)}
            src={img}
            alt={`Slide ${index}`}
            className="slide-image"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
