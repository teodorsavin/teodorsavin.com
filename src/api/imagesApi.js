import { handleResponse, handleError, jsonToQueryString } from "./apiUtils";

export function getImage() {
  const queryParam = jsonToQueryString({ query: "programming" });

  const headers = new Headers();
  headers.append("Content-Type", "text/json");
  headers.append("Accept-Version", "v1");
  headers.append(
    "Authorization",
    "Client-ID " + process.env.REACT_APP_ACCESS_KEY
  );

  const url = process.env.REACT_APP_API_URL + "photos/random" + queryParam;
  const requestUrl = new Request(url);

  return fetch(requestUrl, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function getAllCountries() {
  const url = process.env.REACT_APP_COUNTRIES_API_URL;
  const requestUrl = new Request(url);

  return fetch(requestUrl)
    .then(handleResponse)
    .catch(handleError);
}
