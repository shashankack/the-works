import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Testimonials.scss";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { section } from "framer-motion/client";

const Testimonials = ({ data }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const nextTestimonial = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % data.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + data.length) % data.length);
  };

  return (
    <section className="trainers-section">
      <h2>
        Meet our Trainers <hr />
      </h2>
      <div className="testimonial-container">
        {/* Left: Image with transition */}
        <div className="testimonial-image">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={data[current].id}
              src={data[current].image}
              alt={data[current].name}
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
              key={data[current].id}
              initial={{ opacity: 0, y: direction * 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction * -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="testimonial-name">{data[current].name}</h3>
              <p className="testimonial-role">{data[current].role}</p>
              <p className="testimonial-text">{data[current].text}</p>
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
    </section>
  );
};

export default Testimonials;
