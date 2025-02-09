import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Testimonials.scss";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";

const Testimonials = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!testimonials || testimonials.length === 0) {
    return <p>No testimonials available.</p>;
  }

  const nextTestimonial = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="testimonial-container">
      {/* Left: Image with transition */}
      <div className="testimonial-image">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={testimonials[current].id}
            src={testimonials[current].image}
            alt={testimonials[current].name}
            initial={{ opacity: 0, scale: 0.5, x: direction * -100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: direction * 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* Right: Text Content with transition */}
      <div className="testimonial-content">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={testimonials[current].id}
            initial={{ opacity: 0, y: direction * 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h3 className="testimonial-name">{testimonials[current].name}</h3>
            <p className="testimonial-role">{testimonials[current].role}</p>
            <p className="testimonial-text">{testimonials[current].text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="testimonial-nav">
          <button onClick={prevTestimonial}>
            <RiArrowLeftSLine />
          </button>
          <button onClick={nextTestimonial}>
            <RiArrowRightSLine />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
