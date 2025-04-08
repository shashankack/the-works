import { useEffect, useRef } from "react";

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
  const imageRef = useRef(null);

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

    gsap.fromTo(
      imageRef.current,
      { scale: 1.2 },
      {
        scale: 1,
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
          <h2
            style={{
              color: theme.colors.beige,
              zIndex: 30,
              marginTop: "100px",
            }}
          >
            Contact Us
          </h2>
          <img src={image} ref={imageRef} />
          <div className="overlay" />
        </div>
        <div
          className="cards"
          style={{
            color: theme.colors.beige,
          }}
        >
          <div className="card">
            <IoLocationSharp className="icon" />
            <hr />
            <a href="#">
              Directions <HiOutlineArrowLongRight size={70} />
            </a>
          </div>
          <div className="card">
            <IoLogoInstagram className="icon" />
            <hr />
            <a href="#">
              Follow Us <HiOutlineArrowLongRight size={70} />
            </a>
          </div>
          <div className="card">
            <BiSupport className="icon" />
            <hr />
            <a href="#">
              Support <HiOutlineArrowLongRight size={70} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
