import React, { Component } from "react";
import "./styles/form.css";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: "",
      address: "",
      comments: "",
      stars: "",
      // key: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    // this.handleKey = this.handleKey.bind(this);
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }


  render() {
    return (
      <div id="form">
        {/* Calls the "handleFormSubmit" method of the App component when the form is submitted */}
        <form onSubmit={this.props.onSubmit}>
          <div className="restaurants">
            <label htmlFor="name">Restaurant name</label>
            <input
              name="name"
              id="name"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Green View Hotels"
            />
          </div>
          <div className="address">
            <label htmlFor="address">Restaurant's address</label>
            <input
              name="address"
              id="address"
              value={this.state.address}
              onChange={this.handleChange}
              placeholder="Samora Avenue"
            />
          </div>
          <div className="comment">
            <label htmlFor="comment">Your comment:</label>
            <textarea
              name="comment"
              placeholder="Very luxurious place"
              id="comment"
              rows="5"
              value={this.state.comment}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="ratings">
            <label htmlFor="stars">Your rating</label> <br/>
            <select
              name="stars"
              id="stars"
              value={this.state.stars}
              onChange={this.handleChange}
            >
              <option value="1">&#9733;</option>
              <option value="2">&#9733; &#9733;</option>
              <option value="3">&#9733; &#9733; &#9733;</option>
              <option value="4">&#9733; &#9733; &#9733; &#9733;</option>
              <option value="5">&#9733; &#9733; &#9733; &#9733; &#9733;</option>
            </select>
          </div>

          <button type="submit">Submit</button>
          <button onClick={this.props.onClick}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default Form;
