import React, { Component } from "react";
import Review from "./review";
import "./styles/restaurant.css";

class Restaurants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReviews: false,
      addReview: false,
      imgUrl: "",
      addedReview: "",
      addedRating: "1",
      reviews: props.restaurant.reviews,
      avgRatings: props.restaurant.avgRatings,
    };
    this.handleMoreInfoClick = this.handleMoreInfoClick.bind(this);
    this.handleAddReviewClick = this.handleAddReviewClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    try{
    fetch(this.props.restaurant.img.metadataUrl)
      .then((response) => response.json())
      .then((data) => {
        // console.log("before",this.imgUrl);
        data.status === "OK" &&
          this.setState({ imgUrl: this.props.restaurant.img.url });
          console.log("after",this.imgUrl);
      });
    } catch{
      console.log("error");
    }
      
  }

  handleAddReviewClick() {
    this.setState((prevState) => {
      return {
        showReviews: !prevState.showReviews,
        addReview: false,
      };
    });
  }
  handleMoreInfoClick() {
    // console.log("hii");
    this.setState((prevState) => {
      return {
        addReview: !prevState.addReview,
      };
    });
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    const reviews = this.state.reviews.map((review) => (
      <Review key={review.time} comment={review.text} rating={review.rating} />
    ));
    return (
      <div className="restaurant">
        <div className="restaurant-display">
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
              <button onClick={this.handleAddReviewClick}>Add review</button>
              {/* Show the form to add a review only if "addReview" is true i.e if the user clicked on the "Add review" button */}
              {this.state.addReview && (
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="addedReview">Your review:</label>
                  <textarea
                    name="addedReview"
                    cols="50"
                    rows="5"
                    value={this.state.addedReview}
                    onChange={this.handleChange}
                  ></textarea>
                  <label htmlFor="addedRating">Your rating:</label>
                  <select
                    name="addedRating"
                    value={this.state.addedRating}
                    onChange={this.handleChange}
                  >
                    <option value="1">&#9733;</option>
                    <option value="2">&#9733; &#9733;</option>
                    <option value="3">&#9733; &#9733; &#9733;</option>
                    <option value="4">&#9733; &#9733; &#9733; &#9733;</option>
                    <option value="5">
                      &#9733; &#9733; &#9733; &#9733; &#9733;
                    </option>
                  </select>
                  <button type="submit">Submit</button>
                </form>
              )}
            </div>
          )
        }
      </div>
    );
  }
}

export default Restaurants;
