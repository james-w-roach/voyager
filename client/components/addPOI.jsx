import React from 'react';
import logo from '../../server/public/powered-by-foursquare-blue.png';
import fsLogo from '../../server/public/FS_logo.png';

const clientId = process.env.FS_CLIENT_ID;
const clientSecret = process.env.FS_CLIENT_SECRET;

export default class AddPOI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      searchResult: null
    };
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const input = event.target.value;
    this.setState({
      searchInput: input
    });
  }

  search() {
    event.preventDefault();
    const { lat, lng } = this.props.location;
    const ll = `${lat},${lng}`;
    const query = this.state.searchInput;
    fetch(`https://api.foursquare.com/v2/venues/search?client_id=${clientId}&client_secret=${clientSecret}&ll=${ll}&query=${query}&limit=25&v=20210417`)
      .then(res => res.json())
      .then(result => this.setState({ searchResult: result.response.venues }));
  }

  render() {
    let results;
    if (!this.state.searchResult) {
      results = <li className="trip-list-item">Search for places to add</li>;
    } else {
      results = this.state.searchResult.map(result => {
        return (
          <li className="trip-list-item" key={result.id}>
            <div className="add-poi-text">
              <h3>{result.name}</h3> <br />
              <h4>{`${result.location.address}, ${result.location.formattedAddress[1]}, ${result.location.cc}`}</h4>
            </div>
            <button onClick={() => this.props.handleAdd(result)} className="add-poi button">+</button>
            <a href={`http://foursquare.com/v/${result.id}`} rel="noreferrer" target="_blank"><img className="fs-logo" src={fsLogo}></img></a>
          </li>
        );
      });
    }
    return (
      <>
        <div className="location-page">
          <form className="poi-form" onSubmit={this.search}>
            <input className="trip-list-item search" required="required" type="text" name="trip-name" placeholder="Search for a place:" onChange={this.handleChange} />
            <input type="submit" className="poi-search" value="Go" />
          </form>
          <img className="foursquare-logo add-page" src={logo} />
          <ul className="results">{results}</ul>
          <button className="button add"
            onClick={() => {
              this.props.sendPutRequest();
            }}>Save</button>
        </div>
      </>
    );
  }
}