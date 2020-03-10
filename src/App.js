import React from "react";
import "./App.css";
import { getImage, getAllCountries } from "./api/imagesApi";
import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: { urls: { raw: {} } }, expire: "", countries: [] };
  }

  async componentDidMount() {
    const imageObject = await this.getImage();
    const countries = await this.getAllCountries();

    this.setState({ ...imageObject, countries });
  }

  async getImage() {
    let image = localStorage.getItem("background");
    let imageObject = {};

    if (image !== null) {
      imageObject = JSON.parse(image);

      if (imageObject.expiry > Date.now()) {
        return imageObject;
      }
    }

    image = await getImage().then(image => {
      return { image };
    });
    imageObject = {
      ...image,
      expiry: Date.now() + process.env.REACT_APP_TTL
    };
    localStorage.setItem("background", JSON.stringify(imageObject));

    return imageObject;
  }

  async getAllCountries() {
    let countries = localStorage.getItem("countries");
    let countriesObject = {};

    if (countries !== null) {
      countriesObject = JSON.parse(countries);
    } else {
      countriesObject = await getAllCountries().then(countries => {
        return countries.map(country => {
          return {
            key: country.alpha2Code,
            value: country.alpha2Code,
            flag: country.alpha2Code.toLowerCase(),
            text: country.name
          };
        });
      });
      localStorage.setItem("countries", JSON.stringify(countriesObject));
    }
    this.setState({ countries: countriesObject });

    return countriesObject;
  }

  test(e, data) {
    window.location.href = `https://news.teodorsavin.com/country/${data.value}`;
  }

  render() {
    const appStyle = {
      color: "white",
      backgroundImage: "url(" + this.state.image.urls.raw + ")",
      backgroundSize: "cover"
    };

    console.log(this.state.countries);

    return (
      <div className="App" style={appStyle}>
        <header className="App-header">
          <Dropdown
            placeholder="Select Country"
            search
            selection
            options={this.state.countries}
            onChange={this.test}
          />
        </header>
      </div>
    );
  }
}

export default App;
