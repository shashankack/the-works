import HeroSection from "../components/HeroSection/HeroSection";
import AboutSection from "../components/AboutSection/AboutSection";
import EventsSection from "../components/EventsSection/EventsSection";
import Testimonials from "../components/TrainersSection/Testimonials";

import desktopCarousel1 from "../assets/desktop-carousel-1.jpg";
import desktopCarousel2 from "../assets/desktop-carousel-2.jpg";
import desktopCarousel3 from "../assets/desktop-carousel-3.jpg";
import mobileCarousel1 from "../assets/mobile-carousel-1.jpg";
import mobileCarousel2 from "../assets/mobile-carousel-2.jpg";
import mobileCarousel3 from "../assets/mobile-carousel-3.jpg";
import portrait1 from "../assets/portrait-1.jpg";
import yoga from "../assets/yoga.webp";

const Home = () => {
  const sliderContent = [
    desktopCarousel1,
    desktopCarousel2,
    desktopCarousel3,
    /* mobileCarousel1,
    mobileCarousel2,
    mobileCarousel3, */
  ];

  const dummyClasses = [
    {
      id: 1,
      title: "Yoga for Beginners",
      image: yoga,
      redirect: "/classes/yoga-for-beginners",
    },
    {
      id: 2,
      title: "Kickboxing Basics",
      image: yoga,
      redirect: "/classes/kickboxing-basics",
    },
    {
      id: 3,
      title: "Strength Training 101",
      image: yoga,
      redirect: "/classes/strength-training",
    },
    {
      id: 4,
      title: "Yoga for Beginners",
      image: yoga,
      redirect: "/classes/yoga-for-beginners",
    },
    {
      id: 5,
      title: "Kickboxing Basics",
      image: yoga,
      redirect: "/classes/kickboxing-basics",
    },
    {
      id: 6,
      title: "Strength Training 101",
      image: yoga,
      redirect: "/classes/strength-training",
    },
  ];

  const dummyEvents = [
    {
      id: 1,
      title: "Mindfulness Workshop",
      image: "https://via.placeholder.com/300",
      redirect: "/events/mindfulness-workshop",
    },
    {
      id: 2,
      title: "Community Boxing Night",
      image: "https://via.placeholder.com/300",
      redirect: "/events/boxing-night",
    },
    {
      id: 3,
      title: "Healthy Eating Seminar",
      image: "https://via.placeholder.com/300",
      redirect: "/events/healthy-eating",
    },
  ];

  const dummyTrainers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Product Manager at TechFlow",
      text: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      image: portrait1,
    },
    {
      id: 2,
      name: "James Carter",
      role: "Software Engineer at DevCorp",
      text: "An exceptional experience with seamless integration. It’s rare to find something so well-crafted!",
      image: "https://placehold.co/300",
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Marketing Lead at BrightIdeas",
      text: "A game-changer for our team. The ease of use and thoughtful design make it an absolute must-have.",
      image: "https://placehold.co/300",
    },
  ];

  return (
    <>
      <HeroSection images={sliderContent}/>
      <AboutSection />
      <EventsSection classesData={dummyClasses} eventsData={dummyEvents} />
      <Testimonials data={dummyTrainers} />
    </>
  );
};

export default Home;
