import mapboxgl from 'mapbox-gl';
import React from 'react';
import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker';

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = process.env.MAPBOX_API_KEY;

export default class ItineraryMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: '',
      lat: '',
      zoom: 10
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { zoom } = this.state;

    if (this.props.activeItinerary.locations.length === 1) {
      const lng = this.props.activeItinerary
        ? this.props.activeItinerary.locations[0].lng
        : '';
      const lat = this.props.activeItinerary
        ? this.props.activeItinerary.locations[0].lat
        : '';
      const map = new mapboxgl.Map({
        container: this.mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });
    } else {
      const lngLats = this.props.activeItinerary.locations.map(location => {
        return { lng: location.lng, lat: location.lat };
      });

      let lngMin = lngLats[0].lng;
      let lngMax = lngLats[0].lng;
      let latMin = lngLats[0].lat;;
      let latMax = lngLats[0].lat;;

      for (let i = 1; i < lngLats.length; i++) {
        if (lngLats[i].lng < lngMin) {
          lngMin = lngLats[i].lng;
        }
        if (lngLats[i].lng > lngMax) {
          lngMax = lngLats[i].lng;
        }
        if (lngLats[i].lat < latMin) {
          latMin = lngLats[i].lat;
        }
        if (lngLats[i].lat > latMax) {
          latMax = lngLats[i].lat;
        }
      }

      const bounds = [[lngMin - 1, latMin - 1], [lngMax + 1, latMax + 1]];

      const map = new mapboxgl.Map({
        container: this.mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        bounds
      });
    }

    /* map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    }); */
  }

  render() {
    return <div ref={this.mapContainer} className="location-map" style={{ height: '100%' }} />;
  }
}
