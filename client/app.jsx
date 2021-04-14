import React from 'react';
import Home from './pages/home';
import Create from './pages/create';
import AppContext from '../server/app-context';
import Itinerary from './pages/itinerary';
import LocationPage from './pages/locationPage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreating: false,
      view: 'itinerary',
      locationView: {},
      currentTripName: '',
      currentLocations: []
    };
    this.renderPage = this.renderPage.bind(this);
    this.toggleCreate = this.toggleCreate.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  toggleCreate(trip) {
    if (trip) {
      const { tripName, locations } = trip;
      this.setState({
        currentTripName: tripName,
        currentLocations: locations
      });
    }
    if (this.state.isCreating) {
      this.setState({
        isCreating: null
      });
    } else {
      this.setState({
        isCreating: true
      });
    }
  }

  toggleView(location) {
    if (this.state.view === 'itinerary') {
      this.setState({
        view: 'location',
        locationView: location
      });
    } else if (this.state.view === 'location') {
      this.setState({ view: 'itinerary' });
    }
  }

  renderPage() {
    const trip = {
      name: this.state.currentTripName,
      locations: this.state.currentLocations
    };
    if (this.state.isCreating === false) {
      return <Home />;
    } if (this.state.isCreating) {
      return <Create toggleCreate={this.toggleCreate} />;
    } if (this.state.isCreating === null && this.state.view === 'itinerary') {
      return <Itinerary trip={trip} view={this.state.view} toggleView={this.toggleView} />;
    } if (this.state.isCreating === null && this.state.view === 'location') {
      return <LocationPage locationView={this.state.locationView} view={this.state.view} toggleView={this.toggleView} />;
    }
  }

  render() {
    const { isCreating } = this.state;
    const { toggleCreate } = this;
    const contextValue = { isCreating, toggleCreate };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          { this.renderPage() }
        </>
      </AppContext.Provider>
    );
  }
}
