import { useLocation } from "react-router-dom";
import "./Classes.scss";

const Classes = () => {
  const location = useLocation();
  const classData = location.state?.data; // Now receiving a single object

  if (!classData) {
    return <h2>Class not found</h2>;
  }

  return (
    <div className="class-container">
      <div className="inner-container">
        <div className="image-container">
          <img src={classData.image} alt={classData.title} />
        </div>

        <div className="content">
          <h1>{classData.title}</h1>
          <p>{classData.description}</p>
          <h3>{classData.subTitle}</h3>
          <p>{classData.subDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default Classes;
