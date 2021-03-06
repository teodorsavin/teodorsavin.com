import React from "react";
import "./App.css";
import { getImage, getAllCountries } from "./api/imagesApi";
import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import PHImage from "./images/placeHolder.jpg";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: { urls: { full: "" }, user: { name: "", links: { html: "" } } },
      expire: 0,
      countries: []
    };
  }

  async componentDidMount() {
    const imageObject = await this.getImage();
    const countries = await this.getAllCountries();
    this.setState({ ...imageObject, countries });
  }

  async getImage() {
    let image = localStorage.getItem("background");
    let imageObject = {};
    let now = new Date().getTime();

    if (image !== null) {
      imageObject = JSON.parse(image);

      if (parseInt(imageObject.expiry) > now) {
        return imageObject;
      } else {
        localStorage.clear();
      }
    }

    image = await getImage().then(image => {
      return { image };
    });

    imageObject = {
      ...image,
      expiry: now + parseInt(process.env.REACT_APP_TTL)
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

  redirect(e, data) {
    window.location.href = `https://news.teodorsavin.com/country/${data.value}`;
  }

  render() {
    let image = PHImage;
    if (this.state.image.urls.full !== "") {
      image = this.state.image.urls.full;
    }

    const appStyle = {
      color: "white",
      backgroundImage: "url(" + image + ")",
      backgroundSize: "cover"
    };

    return (
      <div className="App" style={appStyle}>
        <header className="App-header">
          <Dropdown
            placeholder="Select Country"
            search
            selection
            options={this.state.countries}
            onChange={this.redirect}
          />
        </header>
        <div className="picAuthor">
          <span>
            Picture by:{" "}
            <a
              href={
                this.state.image.user.links.html +
                "?utm_source=TeodorSavinNews&utm_medium=referral"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              @{this.state.image.user.name}
            </a>{" "}
            / Source:{" "}
            <a
              href="https://unsplash.com?utm_source=TeodorSavinNews&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </span>
        </div>
      </div>
    );
  }
}

export default App;
