import React, { Component } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Forms from "./form";
import Review from "./review";
import Filters from "./filter";
import Restaurant from "./restaurant";
import "./styles/map.css";

// const API_KEYS= "AIzaSyDOcN1jiA7n7uaBd1h1JTTRA1dCQM1W7eU";   harith
// const API_KEYS = `AIzaSyDOcN1jiA7n7uaBd1h1JTTRA1dCQM1W7eU`;
const API_KEYS = "AIzaSyBe_pZIcnKoz9Lxknnj2Fm09yLm6At-7RM";

// Endpoint of the Place Search API
const placesSearchApiEndpoint =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&keyword=restaurant&key=" +
  API_KEYS;
// Endpoint of the Place Details API
const placesDetailsApiEndpoint =
  "https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_address,review,geometry/location&key=" +
  API_KEYS +
  "&place_id=";
// Endpoint of the Street View Static API
const streetViewStaticApiEndpoint =
  "https://maps.googleapis.com/maps/api/streetview?size=600x400&key=" +
  API_KEYS;
// Endpoint of the Street View Static Metadata API
const streetViewStaticApiMetadataEndpoint =
  "https://maps.googleapis.com/maps/api/streetview/metadata?size=120x100&key=" +
  API_KEYS;

const containerStyle = {
  width: "100%",
  height: "90vh",
};

class Maps extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      displayForm: false,
      maxRating: "5",
      minRating: "1",
      map: null,
      infoMarkerClicked: "",
      restaurantsList: [],
      apiData: [],
      addRestaurant: [],
      radius: "1000",
      reviewsMarkerClicked: "",
      bounds: {},
      center: {
        lat: -3.386925,
        lng: 36.682995,
      },
      clickedLocation: {
        lat: 0,
        lng: 0,
      },
    };
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getPositionSuccess,
        this.getPositionError
      );
    } else {
      console.log("Browser does not support geolocation");
    }
  }
  // Successfull location
  getPositionSuccess = (position) => {
    this.setState({
      center: { lat: position.coords.latitude, lng: position.coords.longitude },
    });
  };

  // POsition Error
  getPositionError(err) {
    console.log("Error");
    console.error(`Error codes ${err.code} - ${err.message}`);
  }

  getApiData = (lat, lng, radius) => {
    // Reset state of "isLoading", "apiData" and "restaurantsList" to avoid duplicated components
    this.setState({
      isLoading: true,
      apiData: [],
      restaurantsList: [],
    });
    let apiPlaceSearchUrl =
      placesSearchApiEndpoint +
      "&location=" +
      lat +
      "," +
      lng +
      "&radius=" +
      radius;
    let apiPlacesData = [];
    // Fetch data from Places Search API
    fetch(apiPlaceSearchUrl)
      .then((response) =>
        response.ok
          ? response.json()
          : console.log("Fetch Place Search API data failed")
      )
      .then((data) => {
        for (let result of data.results) {
          let apiPlaceDetailsUrl = placesDetailsApiEndpoint + result.place_id;
          // Fetch data from Places Details API
          fetch(apiPlaceDetailsUrl)
            .then((response) =>
              response.ok
                ? response.json()
                : console.log("Fetch Place Details API data failed")
            )
            .then((data) => {
              // Add restaurant's data to an array and update the "restaurantsList"
              apiPlacesData.push(data);
              this.getRestaurantsList(
                this.state.minRating,
                this.state.maxRating,
                this.state.bounds
              );
            })
            .catch((err) =>
              console.log("Error when fetching Place Details API", err)
            );
        }
      })
      .then(() => {
        // Once all data is fetched, set state of "apiData" and "isLoading"
        if (apiPlacesData != null) {
          this.setState({
            apiData: apiPlacesData,
            isLoading: false,
          });
        }
      })
      .catch((err) => console.log("Error when fetching Place Search API", err));
  };

  handleMapLoad = (map) => {
    let bounds = map.getBounds();
    this.setState({
      map: map,
      bounds: bounds,
    });
  };

  handleIdle = () => {
    const bounds = this.state.map.getBounds();
    const center = this.state.map.getCenter();
    this.setState({ bounds: bounds });
    !this.state.isMarkerClicked &&
      this.getApiData(center.lat(), center.lng(), this.state.radius);
  };

  handleFiltersChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (name === "minRating") {
      this.getRestaurantsList(value, this.state.maxRating, this.state.bounds);
    } else {
      this.getRestaurantsList(this.state.minRating, value, this.state.bounds);
    }
  };

  handleMapClick(e) {
    this.setState((preState) => {
      return {
        displayForm: !preState.displayForm,
        clickedLocation: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      };
    });
  }

  handleMapZoom = () => {
    if (this.state.map != null) {
      let currentZoom = this.state.map.getZoom();
      switch (currentZoom) {
        case 22:
        case 21:
        case 20:
          this.setState({ radius: "250" });
          break;
        case 19:
        case 18:
          this.setState({ radius: "500" });
          break;
        case 17:
        case 16:
          this.setState({ radius: "1000" });
          break;
        case 15:
        case 14:
          this.setState({ radius: "1500" });
          break;
        case 13:
          this.setState({ radius: "2000" });
          break;
        case 12:
          this.setState({ radius: "3000" });
          break;
        case 11:
          this.setState({ radius: "7000" });
          break;
        case 10:
          this.setState({ radius: "20000" });
          break;
        case 9:
          this.setState({ radius: "40000" });
          break;
        case 8:
        case 7:
        case 6:
        case 5:
        case 4:
        case 3:
        case 2:
        case 1:
        case 0:
          this.setState({ radius: "50000" });
          break;
        default:
          this.setState({ radius: "2000" });
      }
    }
  };

  handleFormClick = () => {
    this.setState((prevState) => {
      return {
        displayForm: !prevState.displayForm,
        clickedLocation: {
          lat: 0,
          lng: 0,
        },
      };
    });
  };

  handleFiltersChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (name === "minRating") {
      this.getRestaurantsList(value, this.state.maxRating, this.state.bounds);
    } else {
      this.getRestaurantsList(this.state.minRating, value, this.state.bounds);
    }
  };

  handleMarkerClick = (event) => {
    let infoMarkerClicked = {};
    for (let restaurant of this.state.restaurantsList) {
      if (
        restaurant.location.lat === event.latLng.lat() &&
        restaurant.location.lng === event.latLng.lng()
      )
        infoMarkerClicked = restaurant;
    }
    let reviewsMarkerClicked = infoMarkerClicked.reviews.map((review) => (
      <Review key={review.time} comment={review.text} rating={review.rating} />
    ));
    this.setState({
      isMarkerClicked: true,
      infoMarkerClicked: infoMarkerClicked,
      reviewsMarkerClicked: reviewsMarkerClicked,
    });
  };

  getRestaurantsList = (minRating, maxRating, bounds) => {
    let restaurantsList = [];
    const checkDataset = (arrInput, arrOutput) => {
      for (let restaurant of arrInput) {
        let imgUrl =
          streetViewStaticApiEndpoint +
          "&location=" +
          restaurant.result.geometry.location.lat +
          "," +
          restaurant.result.geometry.location.lng;
        // console.log(imgUrl);

        let imgMetadataUrl =
          streetViewStaticApiMetadataEndpoint +
          "&location=" +
          restaurant.result.geometry.location.lat +
          "," +
          restaurant.result.geometry.location.lng;
        // console.log(imgMetadataUrl);
        let newRestaurant = {
          name: restaurant.result.name,
          address: restaurant.result.formatted_address,
          location: restaurant.result.geometry.location,
          reviews: restaurant.result.reviews,
          avgRatings: restaurant.result.rating,
          img: {
            url: imgUrl,
            metadataUrl: imgMetadataUrl,
          },
        };

        // Add the restaurant object to the array if it's within the map and the filters' values
        bounds.contains(restaurant.result.geometry.location) &&
          restaurant.result.rating >= minRating &&
          restaurant.result.rating <= maxRating &&
          arrOutput.push(newRestaurant);
      }
    };
    checkDataset(this.state.apiData, restaurantsList);
    this.state.addRestaurant.length &&
      checkDataset(this.state.addRestaurant, restaurantsList);
    this.setState({ restaurantsList: restaurantsList });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const [name, address, comment, stars] = event.target;
    let newRestaurant = {
      result: {
        name: name.value,
        formatted_address: address.value,
        rating: parseInt(stars.value), // parseInt() parses the value and returns an integer
        geometry: {
          location: {
            lat: this.state.clickedLocation.lat,
            lng: this.state.clickedLocation.lng,
          },
        },
        reviews: [
          {
            rating: parseInt(stars.value),
            text: comment.value,
          },
        ],
      },
    };
    let updatedRestaurantsByUser = this.state.addRestaurant;
    updatedRestaurantsByUser.push(newRestaurant);
    this.setState((prevState) => {
      return {
        addedRestaurantsByUser: updatedRestaurantsByUser,
        showForm: !prevState.showForm,
      };
    });
    this.getRestaurantsList(
      this.state.minRating,
      this.state.maxRating,
      this.state.bounds
    );
  };

  render() {
    const restaurantsMapMakers = this.state.restaurantsList.map(
      (restaurant) => (
        <Marker
          key={restaurant.address}
          position={{
            lat: restaurant.location.lat,
            lng: restaurant.location.lng,
          }}
          title={restaurant.name}
          onClick={this.handleMarkerClick}
        />
      )
    );

    const restaurants = this.state.restaurantsList.map((restaurant) => (
      <Restaurant
        key={restaurant.address}
        restaurant={restaurant}
        minRating={this.state.minRating}
        maxRating={this.state.maxRating}
        infoMarkerClicked={this.state.infoMarkerClicked}
      />
    ));
    return (
      <div id="app">
        {this.state.displayForm && (
          <div className="form-control">
            <Forms
              onSubmit={this.handleFormSubmit}
              onClick={this.handleFormClick}
            />
          </div>
        )}

        <div className="map-section">
          <LoadScript googleMapsApiKey={API_KEYS}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={this.state.center}
              zoom={17}
              onLoad={this.handleMapLoad}
              onIdle={this.handleIdle}
              onClick={this.handleMapClick}
            >
              {/* Marker */}
              <>
                <Marker
                  position={this.state.center}
                  title="You're here"
                  icon="https://maps.google.com/mapfiles/kml/paddle/grn-stars.png"
                />
              </>
              {restaurantsMapMakers}
              {this.state.isMarkerClicked && (
                <InfoWindow
                  position={this.state.infoMarkerClicked.location}
                  onCloseClick={this.handleInfoWindowCloseClick}
                >
                  <div className="info-window">
                    <h3>{this.state.infoMarkerClicked.name}</h3>
                    <p>&#9733; {this.state.infoMarkerClicked.avgRatings}</p>
                    <hr />
                    {this.state.reviewsMarkerClicked}
                    <p></p>
                  </div>
                </InfoWindow>
              )}
              {/* {restaurantsMapMakers} */}
            </GoogleMap>
          </LoadScript>
        </div>

        <div id="side-panel">
          <Filters
            onChange={this.handleFiltersChange}
            minRating={this.state.minRating}
            maxRating={this.state.maxRating}
          />
          <div id="restaurants-list">{restaurants}</div>
        </div>
      </div>
    );
  }
}

export default Maps;
