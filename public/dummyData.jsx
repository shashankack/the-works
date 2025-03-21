import yoga from "../src/assets/yoga.webp";
import portrait1 from "../src/assets/images/bishal.jpg";
import { sub } from "framer-motion/client";

export const dummyClasses = [
  // {id, image, title, subTitle, description, subDescrioption, redirect},
  {
    id: 1,
    title: "Yoga for Beginners",
    subTitle: "Subtitle",
    description: "Description",
    subDescription: "Sub Description",
    image: yoga,
    redirect:
      "https://shashankdev.dayschedule.com/wick3d-jiu-jutsu-womens-collection",
  },
  {
    id: 2,
    title: "Kickboxing Basics",
    subTitle: "Subtitle",
    description: "Description",
    subDescription: "Sub Description",
    image: yoga,
    redirect: "/classes",
  },
  {
    id: 3,
    title: "Strength Training 101",
    subTitle: "Subtitle",
    description: "Description",
    subDescription: "Sub Description",
    image: yoga,
    redirect: "/classes",
  },
  {
    id: 4,
    title: "Yoga for Beginners",
    subTitle: "Subtitle",
    description: "Description",
    subDescription: "Sub Description",
    image: yoga,
    redirect: "/classes",
  },
  {
    id: 5,
    title: "Kickboxing Basics",
    subTitle: "Subtitle",
    description: "Description",
    subDescription: "Sub Description",
    image: yoga,
    redirect: "/classes",
  },
  {
    id: 6,
    title: "Strength Training 101",

    image: yoga,
    redirect: "/classes",
  },
];

export const dummyEvents = [
  {
    id: 1,
    title: "Mindfulness Workshop",
    image: "https://via.placeholder.com/300",
    redirect: "/events",
  },
  {
    id: 2,
    title: "Community Boxing Night",
    image: "https://via.placeholder.com/300",
    redirect: "/events",
  },
  {
    id: 3,
    title: "Healthy Eating Seminar",
    image: "https://via.placeholder.com/300",
    redirect: "/events",
  },
];

export const trainers = [
  {
    id: 1,
    name: "Bishal",
    role: "Muay Thai Coach",
    text: "Muay Thai coach from north east participated in national championship trained under Ifma president trained national and international fighters",
    image: portrait1,
  },
  {
    id: 2,
    name: "James Carter",
    role: "Software Engineer at DevCorp",
    text: "An exceptional experience with seamless integration. It’s rare to find something so well-crafted!",
    image: portrait1,
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "Marketing Lead at BrightIdeas",
    text: "A game-changer for our team. The ease of use and thoughtful design make it an absolute must-have.",
    image: portrait1,
  },
];
