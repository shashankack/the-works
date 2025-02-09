import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./Test.scss";

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const timeoutRef = useRef(null);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => resetTimeout();
  }, [index, images.length]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <div className="slider-container">
      {/* Left Arrow */}
      <button className="nav-arrow left-arrow" onClick={handlePrev}>
        <FaArrowLeft size={30} />
      </button>

      <AnimatePresence>
        <motion.div
          key={index}
          className="slide"
          initial={{ opacity: 0, scale: 1.1, x: direction * 200 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.1, x: direction * -200 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <img src={images[index]} alt="slider" className="slide-image" />
        </motion.div>
      </AnimatePresence>

      {/* Right Arrow */}
      <button className="nav-arrow right-arrow" onClick={handleNext}>
        <FaArrowRight size={30} />
      </button>

      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
