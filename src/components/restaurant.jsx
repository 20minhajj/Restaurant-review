import React, { Component } from "react";
import Review from "./review";
import "./styles/restaurant.css";
import PIC from "./styles/logo192.png";

class Restaurants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReviews: false,
      addReview: false,
      imgUrl: PIC,
      reviews: props.restaurant.reviews,
      avgRatings: props.restaurant.avgRatings,
    };
    this.handleMoreInfoClick = this.handleMoreInfoClick.bind(this);
    this.handleAddReviewClick = this.handleAddReviewClick.bind(this);
  }

  componentDidMount() {
    fetch(this.props.restaurant.img.metadataUrl)
      .then((response) => response.json())
      .then((data) => {
        data.status === "OK" &&
          this.setState({ imgUrl: this.props.restaurant.img.url });

      });
  }

  handleAddReviewClick() {
    this.setState(() => {
      return {
        showReviews: false,
      };
    });
    // console.log(this.imgUrl);
  }
  handleMoreInfoClick() {
    // console.log("hii");
    this.setState((prevState) => {
      return {
        showReviews: true,
        addReview: !prevState.addReview,
      };
    });
  }

  render() {
    const reviews = this.state.reviews.map((review) => (
      <Review key={review.time} comment={review.text} rating={review.rating} />
    ));
    return (
      <div className="restaurant">
        <div key={this.getKeys} className="restaurant-display">
          <div className="restaurant-img">
            <img src={this.state.imgUrl} alt="Restaurant's street view" />
          </div>
          <div className="restaurant-info">
            <div>
              <h3>{this.props.restaurant.name}</h3>
              <p>&#9733; {this.state.avgRatings}</p>
            </div>
            <button onClick={this.handleMoreInfoClick}>More info</button>
          </div>
        </div>

        {
          // Show the reviews only if "showReviews" is true i.e if the user clicked on the "More info" button
          this.state.showReviews && (
            <div className="restaurant-reviews">
              <h4>Address:</h4>
              <p>{this.props.restaurant.address}</p>
              <h4>Reviews:</h4>
              {reviews}
              <button className="bg-danger" onClick={this.handleAddReviewClick}>
                Close
              </button>
            </div>
          )
        }
      </div>
    );
  }
}

export default Restaurants;
