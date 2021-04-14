import React from 'react';
import LocationMap from './locationMap';

export default class ViewLocation extends React.Component {
  render() {
    return (
     <div className="location-page">
        <div className="trip-list-item center">
          <i onClick={() => this.props.toggleView()} className="fas fa-arrow-left back-arrow"></i>
          <h2>{this.props.location.name.split(',')[0]} </h2>
        </div>
        <LocationMap location={this.props.location} />
        <div>
          <div className="trip-list-item center">
            Points of Interest
            <i className="fas fa-arrow-right list-arrow locations"></i>
          </div>
          <div className="trip-list-item center">
            Restaurants
            <i className="fas fa-arrow-right list-arrow locations"></i>
          </div>
        </div>
      </div>
    );
  }
}
