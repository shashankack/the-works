import { useLocation } from "react-router-dom";
import "./Events.scss";

const Events = () => {
  const location = useLocation();
  const eventData = location.state?.data; // Now receiving a single object

  if (!eventData) {
    return <h2>Event not found</h2>;
  }

  return (
    <div className="events-container">
      <div className="event">
        <div className="image-container">
          <img src={eventData.image} alt={eventData.title} />
        </div>
        <hr />
        <div className="content">{eventData.title}</div>
      </div>
    </div>
  );
};

export default Events;
