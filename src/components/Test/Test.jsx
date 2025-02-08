import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./Test.scss";

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setIndex((prevIndex) => (prevIndex + 1) % images.length),
      3000
    );
    return () => resetTimeout();
  }, [index, images.length]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
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
          initial={{ opacity: 0, scale: 1.2, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.2, x: -100 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
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
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
