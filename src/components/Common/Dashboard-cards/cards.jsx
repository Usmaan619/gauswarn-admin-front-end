import React from "react";

// import images
// import Team from "../../Assets/Images/home-img/team.svg";
// import Trend from "../../Assets/Images/home-img/trend.svg";
// import Rupee from "../../Assets/Images/home-img/Rupee.svg";
// import Cart from "../../Assets/Images/home-img/shopping-cart.svg";

const DashboardCards = ({ cardData }) => {
  // const cardData = [
  //     { label: 'Total Products', count: '0', imgSrc: Team, cardColor: "bg-light-blue-color", circleColor: "dashboard-blue-color" },
  //     { label: 'Total Sales', count: '0', imgSrc: Trend, cardColor: "bg-light-green-color", circleColor: "dashboard-green-color" },
  //     { label: 'Total Order', count: '0', imgSrc: Cart, cardColor: "bg-light-yellow-color", circleColor: "dashboard-yellow-color" },
  //     { label: 'Total Profit', count: '0', imgSrc: Rupee, cardColor: "bg-light-purple-color", circleColor: "dashboard-purple-color" },
  // ];

  return (
    <>
      <div className="row mt-3 gy-4">
        {cardData.map((card, index) => (
          <div className="col-lg-3 col-md-6" key={index}>
            <div className={`dashboard-card box-shadow ${card.cardColor}`}>
              <div className="row align-items-center justify-content-center">
                <div className="col-lg-2 col-md-2 col-2">
                  <div
                    className={`rounded-circle dashboard-img-circle ${card.circleColor} d-flex align-items-center justify-content-center`}
                  >
                    <img src={card.imgSrc} alt="Loading" />
                  </div>
                </div>
                <div className="col-lg-9 col-md-9 col-9 text-center">
                  <p className="text-gray-color inter-font-family-500 font-14 mb-0 mt-2">
                    {card.label}
                  </p>
                  <p className="inter-font-family-600 font-24">{card.count}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardCards;
