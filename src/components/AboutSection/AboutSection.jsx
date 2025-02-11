import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./AboutSection.scss";

import founderImg from "../../assets/raghu_founder.jpg";
import { redirect } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const textRef = useRef(null);
  const contentRef = useRef(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const cards = [
    {
      id: 1,
      title: "Our Story",
      content:
        "The Works is deeply rooted in the legacy of The Nilgiris 1905. Over the last 70 years, four generations have shaped this space into a community hub.",
      image: founderImg,
      redirect: "/about",
    },
    {
      id: 2,
      title: "A Space for All",
      content:
        "Move, Create, and Grow with us. We provide a safe space for fitness, creativity, and self-improvement.",
      image: founderImg,
      redirect: "/about",
    },
    {
      id: 3,
      title: "Meet the Founder",
      content:
        "Raghuram, a dedicated martial artist, envisioned The Works as more than a gym—a dynamic space where movement and creativity thrive.",
      image: founderImg,
      redirect: "/about",
    },
    {
      id: 4,
      title: "Our Heritage",
      content:
        "The Nilgiris 1905 legacy is built on perseverance, quality, and community. These values shape The Works today.",
      image: founderImg,
      redirect: "/about",
    },
    {
      id: 5,
      title: "Our Offerings",
      content:
        "We offer kickboxing, jiujitsu, and artistic workshops, bringing people together in a shared space of creativity and fitness.",
      image: founderImg,
      redirect: "/about",
    },
  ];

  // Set first card as default on mount
  useEffect(() => {
    setSelectedCard(cards[0]);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  const handleCardClick = (id) => {
    if (isAnimating || selectedCard?.id === id) return;

    setIsAnimating(true);
    setNextCard(cards.find((card) => card.id === id)); // Set next card immediately

    // Slide out animation (downwards)
    gsap.to(contentRef.current, {
      y: "100%",
      opacity: 0,
      duration: 0.2, // Faster transition out
      ease: "power3.in",
      onComplete: () => {
        setSelectedCard(cards.find((card) => card.id === id)); // Change state instantly
        gsap.fromTo(
          contentRef.current,
          { y: "-100%", opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3, // Faster transition in
            ease: "power3.out",
            onComplete: () => setIsAnimating(false),
          }
        );
      },
    });
  };

  return (
    <section className="about-section">
      <h2>
        Welcome to The Works
        <p>A legacy of movement, creativity, and connection.</p>
      </h2>

      <div className="about-container" ref={textRef}>
        <div className="cards">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${selectedCard?.id === card.id ? "active" : ""}`}
              onClick={() => handleCardClick(card.id)}
            >
              {card.title}
            </div>
          ))}
        </div>

        <div className="content-preview" ref={contentRef}>
          <div className="content-inner">
            {selectedCard && (
              <>
                <img src={selectedCard.image} alt={selectedCard.title} />
                  <h3>{selectedCard.title}</h3>
                  <p>{selectedCard.content}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
