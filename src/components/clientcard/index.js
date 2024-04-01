import React from "react";

const ClientCard = ({ title, desc, imgUrl, onClick = () => {} }) => {
  return (
    <div className="card mb-3" role="button" onClick={onClick}>
      <img src={imgUrl} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{desc}</p>
      </div>
    </div>
  );
};

export default ClientCard;
