import { useEffect } from "react";

import "./ContactSection.scss";
import { useTheme } from "@mui/material";

import { IoLocationSharp, IoLogoInstagram } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

import image from "../../assets/images/carousel-3.jpg";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  useEffect(() => {
    gsap.fromTo(
      ".cards",
      { y: "-40%" },
      {
        y: "0%",
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top+=100 bottom",
          end: "bottom-=100 bottom",
          scrub: true,
        },
      }
    );
  }, []);
  const theme = useTheme();
  return (
    <section
      className="contact-section"
      style={{
        backgroundColor: theme.colors.beige,
      }}
    >
      <div
        className="rectangle"
        style={{ backgroundColor: theme.colors.beige }}
      >
        <div className="image-container">
          <h2 style={{ color: theme.colors.orange }}>Contact Us</h2>
          <img src={image} />
          <div className="overlay" />
          <div
            className="cards"
            style={{
              color: theme.colors.beige,
            }}
          >
            <div className="card">
              <IoLocationSharp />
              <hr />
              <a href="#">
                Directions <HiOutlineArrowLongRight size={70} />
              </a>
            </div>
            <div className="card">
              <IoLogoInstagram />
              <hr />
              <a href="#">
                Follow Us <HiOutlineArrowLongRight size={70} />
              </a>
            </div>
            <div className="card">
              <BiSupport />
              <hr />
              <a href="#">
                Support <HiOutlineArrowLongRight size={70} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
