import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./About.scss";

const About = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(aboutRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
  }, []);

  return (
    <div className="about-container" ref={aboutRef}>
      <div className="hero">
        <h1>Welcome to The Works</h1>
        <p>A space for movement, creativity, and connection.</p>
      </div>

      <section className="story">
        <h2>Our Story</h2>
        <p>
          The foundation of <strong>The Works</strong> is deeply rooted in the legacy of <strong>The Nilgiris 1905</strong>.
          Over four generations, we have evolved into a space that fosters movement, self-expression, and collaboration.
        </p>
        <Link to="/heritage" className="cta-button">Read More</Link>
      </section>

      <section className="explore">
        <h2>A Space for All</h2>
        <p>Our vision is simple: Move, Create, and Grow.</p>
        <Link to="/offerings" className="cta-button">Explore Our Offerings</Link>
      </section>

      <section className="founder">
        <h2>Meet the Founder</h2>
        <p>
          <strong>Raghuram</strong>, a lifelong martial artist, envisioned The Works as more than a gym—a dynamic
          space where movement and creativity intersect.
        </p>
        <Link to="/founder" className="cta-button">Learn More</Link>
      </section>
    </div>
  );
};

export default About;
