import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@mui/material/styles";
import "./AboutSection.scss";

import founderImg from "../../assets/raghu_founder.jpg";

gsap.registerPlugin(ScrollTrigger);

const data = [
  {
    id: 1,
    title: "Meet our Founder",
    text: `Raghuram is a lifelong martial artist with a deep passion for kickboxing and Muay Thai. What began as a personal pursuit evolved into a vision to build a space where movement meets self-expression. Inspired by his family's legacy with The Nilgiris 1905, he founded The Works as a home for both physical training and creative exploration. His approach blends discipline with community, creating an environment where individuals can grow stronger inside and out. At the core of his mission is empowerment through practice, connection, and purpose.`,
    image: founderImg,
  },
  {
    id: 2,
    title: "Our Legacy & Vision",
    text: `Rooted in the rich heritage of The Nilgiris 1905, The Works was born from a desire to honor the values passed down through generations—resilience, quality, and community. What began as a family legacy has grown into a vibrant space that bridges the past with the future. Our vision is to create a home for creative and conscious communities—a space where people can move, connect, and grow together. By blending tradition with innovation, The Works represents an ongoing commitment to give back and build something that lives beyond any one person or era.`,
    image: founderImg,
  },
  {
    id: 3,
    title: "Our Space",
    text: `The Works is more than just a gym—it’s a multi-purpose sanctuary designed to nurture movement, creativity, and connection. Built to break down boundaries between disciplines, our space invites people from all walks of life to explore, express, and evolve. From martial arts to art workshops, every corner is thoughtfully created to inspire personal growth and collective energy. Whether you're here to train, create, or simply be, our space is a reflection of the community that brings it to life.`,
    image: founderImg,
  },
  {
    id: 4,
    title: "Stay Fit With Us",
    text: `At The Works, fitness is more than a routine—it’s a way of life grounded in discipline, strength, and self-awareness. Rooted in martial arts, our personalized kickboxing and Muay Thai programs are designed to help you move with intention and push past your limits. Every session is crafted to challenge your body while calming your mind, creating space for confidence and clarity to grow. Whether you're a beginner or seasoned athlete, our coaches meet you where you are and guide you toward where you want to be.`,
    image: founderImg,
  },
  {
    id: 5,
    title: "What to Expect",
    text: `Every session at The Works is designed to help you build from the ground up—physically, mentally, and emotionally. You’ll learn the fundamentals of kickboxing and Muay Thai, understand body mechanics, and train with intention through high-intensity, personalized workouts. More than just technique, you’ll develop confidence, discipline, and patience that extend far beyond the gym. Our experienced coaches are here to support your journey, challenge your limits, and help you unlock your full potential.`,
    image: founderImg,
  },
];

const AboutSection = () => {
  const theme = useTheme();
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const cardTitleRefs = useRef({});
  const paraRef = useRef(null);

  const [activeContent, setActiveContent] = useState(data[0]);
  const [clickedCardId, setClickedCardId] = useState(null);
  const [lastTitle, setLastTitle] = useState(null);

  const handleCardClick = (item) => {
    if (item.title === activeContent.title) return;

    const oldTitle = activeContent.title;
    const clickedId = item.id;
    const clickedTitleRef = cardTitleRefs.current[clickedId];

    // Animate the card title out
    gsap.to(clickedTitleRef, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(imageRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power1.in",
          onComplete: () => {
            // Now update content
            setActiveContent(item);
            setLastTitle(oldTitle);
            setClickedCardId(clickedId);

            // Animate title in
            gsap.fromTo(
              titleRef.current,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                clearProps: "transform,opacity",
              }
            );

            // Animate image scale back in
            gsap.fromTo(
              imageRef.current,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.3,
                ease: "power1.out",
                clearProps: "transform,opacity",
              }
            );

            // Animate updated card title in
            gsap.fromTo(
              clickedTitleRef,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                clearProps: "transform,opacity",
              }
            );

            // Animate paragraph
            gsap.fromTo(
              paraRef.current,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.4,
                ease: "power2.inOut",
                clearProps: "transform,opacity",
              }
            );
          },
        });
      },
    });
  };

  return (
    <section
      className="about-section"
      style={{ backgroundColor: theme.colors.orange }}
    >
      <div className="founder-container">
        <div className="image-container" ref={imageRef}>
          <img src={activeContent.image} alt="" />
        </div>
        <div className="text-container" ref={contentRef}>
          <h2 ref={titleRef}>{activeContent.title}</h2>
          <p ref={paraRef} style={{ whiteSpace: "pre-line" }}>
            {activeContent.text}
          </p>

          <div className="cards-section">
            {data
              .filter((card) => card.title !== activeContent.title)
              .map((card) => (
                <div
                  key={card.id}
                  className="card"
                  onClick={() => handleCardClick(card)}
                >
                  <span ref={(el) => (cardTitleRefs.current[card.id] = el)}>
                    {card.id === clickedCardId ? lastTitle : card.title}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
