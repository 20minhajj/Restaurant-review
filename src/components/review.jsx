import React from 'react';
import './styles/review.css';

function Review(props) {
    // Display the number of stars based on the rating
    let nbStars = "";
    for(let i = 1; i <= props.rating; i++){
        nbStars = nbStars + '\u2605 '
    }

    return (
        <div className="review">
            <p>{nbStars}</p>
            <p>{props.comment}</p>
            <hr />
        </div>
    )
}

export default Review