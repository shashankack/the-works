import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./AboutSection.scss";
import { useTheme } from "@mui/material/styles";

import founderImg from "../../assets/raghu_founder.jpg";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const textRef = useRef(null);
  const contentRef = useRef(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const theme = useTheme();

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
    setNextCard(cards.find((card) => card.id === id));

    gsap.to(contentRef.current, {
      y: "100%",
      opacity: 0,
      duration: 0.2,
      ease: "power3.in",
      onComplete: () => {
        setSelectedCard(cards.find((card) => card.id === id));
        gsap.fromTo(
          contentRef.current,
          { y: "-100%", opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            onComplete: () => setIsAnimating(false),
          }
        );
      },
    });
  };

  return (
    <section
      className="about-section"
      style={{ backgroundColor: theme.palette.site.beige }}
    >
      <h2 style={{ color: theme.palette.site.orange }}>
        Welcome to The Works
        <p>A legacy of movement, creativity, and connection.</p>
      </h2>

      <div className="about-container" ref={textRef}>
        <div className="cards">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${selectedCard?.id === card.id ? "active" : ""}`}
              onMouseOver={() => handleCardClick(card.id)}
            >
              <div className="line"></div>
              {card.title}
            </div>
          ))}
        </div>

        <div className="content-preview" ref={contentRef}>
          <div className="content-inner">
            {selectedCard && (
              <>
                <div className="image-container">
                  <img src={selectedCard.image} alt={selectedCard.title} />
                </div>
                <div className="text-container">
                  <h3>{selectedCard.title}</h3>
                  <p>{selectedCard.content}</p>
                  <button
                    onClick={() =>
                      (window.location.href = `${selectedCard.redirect}`)
                    }
                  >
                    Read More
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
