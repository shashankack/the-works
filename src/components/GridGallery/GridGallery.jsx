import React from "react";
import "./GridGallery.scss";
import ImageSlider from "./ImageSlider";

const GridGallery = ({
  title,
  subtitle,
  images,
  descriptionTitle,
  descriptionText,
  buttonText,
}) => {
  return (
    <div className="container">
      <div className="subtitle">{subtitle}</div>
      <div className="grid-container">
        <h1 className="title">{title}</h1>
        <div className="grid-item">
          <ImageSlider images={images.one} direction="horizontal" />
        </div>
        <div className="grid-item">
          <ImageSlider images={images.two} direction="vertical" />
        </div>
        <div className="grid-item">
          <ImageSlider images={images.three} direction="horizontal" />
        </div>
        <div className="grid-item">
          <ImageSlider images={images.four} direction="vertical" />
        </div>
      </div>

      <div className="description">
        <h2>{descriptionTitle}</h2>
        <p>{descriptionText}</p>
      </div>

      <button className="register-button">{buttonText}</button>
    </div>
  );
};

export default GridGallery;
