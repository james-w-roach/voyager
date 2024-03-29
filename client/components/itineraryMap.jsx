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
      zoom: 10,
      activeItinerary: null,
      activeLocation: null
    };
    this.mapContainer = React.createRef();
    this.map = React.createRef();
  }

  componentDidUpdate() {

    if (!this.map.current) return;

    if (this.props.activeLocation && this.props.activeLocation === this.state.activeLocation) return;

    if (!this.props.activeLocation && this.state.activeLocation) {
      this.setState({ activeLocation: null });
    } else if (this.props.activeItinerary.tripId === this.state.activeItinerary.tripId && !this.props.activeLocation) return;

    if (this.props.activeLocation) {
      this.setState({ activeLocation: this.props.activeLocation });
    }

    if (this.props.activeItinerary) {
      this.setState({ activeItinerary: this.props.activeItinerary });
    }

    const { zoom } = this.state;

    if (this.props.activeLocation && this.props.activeLocation.lng && this.props.activeLocation.lat) {
      const lng = this.props.activeLocation
        ? this.props.activeLocation.lng
        : '';
      const lat = this.props.activeLocation
        ? this.props.activeLocation.lat
        : '';

      this.map.current.flyTo({ center: [lng, lat], zoom, speed: 1 });

      const marker = new mapboxgl.Marker({ color: '#0e58a8' })
        .setLngLat([lng, lat])
        .addTo(this.map.current);

      this.map.current.flyTo({ center: [lng, lat], zoom, speed: 1 });
    } else if (this.props.activeItinerary.locations.length === 1) {

      while (this.map.current._markers.length) {
        this.map.current._markers[0].remove();
      }

      const lng = this.props.activeItinerary
        ? this.props.activeItinerary.locations[0].lng
        : '';
      const lat = this.props.activeItinerary
        ? this.props.activeItinerary.locations[0].lat
        : '';

      const marker = new mapboxgl.Marker({ color: '#0e58a8' })
        .setLngLat([lng, lat])
        .addTo(this.map.current);

      this.map.current.flyTo({ center: [lng, lat], zoom, speed: 1 });
    } else if (this.props.activeItinerary.locations.length) {

      while (this.map.current._markers.length) {
        this.map.current._markers[0].remove();
      }

      const lngLats = this.props.activeItinerary.locations.map(location => {
        const marker = new mapboxgl.Marker({ color: '#0e58a8' })
          .setLngLat([location.lng, location.lat])
          .addTo(this.map.current);
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

      const bounds = [[lngMin - 2, latMin - 2], [lngMax + 2, latMax + 2]];

      this.map.current.fitBounds(bounds, { speed: 1 });
    }
  }

  componentDidMount() {

    if (this.map.current) return;

    const { zoom } = this.state;

    if (this.props.activeLocation && this.props.activeLocation.lng && this.props.activeLocation.lat) {
      const lng = this.props.activeLocation
        ? this.props.activeLocation.lng
        : '';
      const lat = this.props.activeLocation
        ? this.props.activeLocation.lat
        : '';
      this.map.current = new mapboxgl.Map({
        container: this.mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom
      });
      const marker = new mapboxgl.Marker({ color: '#0e58a8' })
        .setLngLat([lng, lat])
        .addTo(this.map.current);
    } else if (this.props.activeItinerary.locations.length === 1) {
      const lng = this.props.activeItinerary
        ? this.props.activeItinerary.locations[0].lng
        : '';
      const lat = this.props.activeItinerary
        ? this.props.activeItinerary.locations[0].lat
        : '';
      this.map.current = new mapboxgl.Map({
        container: this.mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom
      });
      const marker = new mapboxgl.Marker({ color: '#0e58a8' })
        .setLngLat([lng, lat])
        .addTo(this.map.current);
    } else if (this.props.activeItinerary.locations.length) {
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

      const bounds = [[lngMin - 2, latMin - 2], [lngMax + 2, latMax + 2]];

      this.map.current = new mapboxgl.Map({
        container: this.mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        bounds
      });

      this.props.activeItinerary.locations.map(location => {
        const marker = new mapboxgl.Marker({ color: '#0e58a8' })
          .setLngLat([location.lng, location.lat])
          .addTo(this.map.current);
      });

    } else {
      this.map.current = new mapboxgl.Map({
        container: this.mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [1, 2]
      });
    }
    this.setState({ activeItinerary: this.props.activeItinerary });
  }

  componentWillUnmount() {
    this.map.current.remove();
  }

  render() {
    return <div ref={this.mapContainer} className="location-map" style={{ height: '100%' }} />;
  }
}
