import * as React from "react";

import { useEffect, useState } from "react";
import { Company, CompanyQuery } from "/imports/common/data/types";
import { ResultTable } from "/imports/common/ui-widgets/ResultsTable";
import { SearchInput } from "/imports/common/ui-widgets/SearchInput";
import { Alert, Button } from "antd";
import { API_PATH } from "/imports/approach-3-http-api/common";

const DOCS =
  "This implementation uses plain HTTP API endpoints on top of node.js. " +
  "The client accesses the API via the Fetch API. " +
  "No DB is involved, the data is loaded from a JSON data file, and then the server stores it in memory. " +
  "Conceptually this is the same as the previous method (with Meteor Methods), but with a lot more boilerplate code.";

// Helper function for sorting the companies based on their IDs
const compareCompany = (a: Company, b: Company) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

/**
 * We will wrap the data access behind this API
 */
interface DataAPI {
  // Load the data
  loadData: (query: CompanyQuery) => Promise<Company[]>;

  // Change the certification status of a company
  setCertified: (id: string, value: boolean) => Promise<any>;

  // Hide a company
  hide: (id: string) => Promise<any>;

  // Show all hidden companies
  showAllHidden: () => Promise<any>;
}

const { protocol, hostname, port } = window.location;
const ROOT_URL = `${protocol}//${hostname}:${port}${API_PATH}`;

/**
 * Implement the data access API using HTTP call to the API
 */
const api: DataAPI = {
  loadData: (query) =>
    new Promise<Company[]>((resolve, reject) => {
      const url = `${ROOT_URL}get-companies?namePattern=${
        query.namePattern
      }&requiredSpecialities=${query.requiredSpecialities.join(",")}`;
      // console.log("Fetching url", url);
      fetch(url).then((result) => {
        if (result.status === 200) {
          result.json().then(resolve);
        } else {
          reject(result.status);
        }
      }, reject);
    }),

  setCertified: (id: string, value: boolean) =>
    fetch(`${ROOT_URL}set-certified?id=${id}&value=${value}`),

  // Hide a company
  hide: (id) => fetch(`${ROOT_URL}hide-company?id=${id}`),

  // Show all hidden companies
  showAllHidden: () => fetch(`${ROOT_URL}show-all-companies`),
};

/**
 * Demo for the approach based on HTTP API
 */
export const HttpApiDemoApp = () => {
  // State variables for input controls
  const [namePattern, setNamePattern] = useState("");
  const [requiredSpecialities, setRequiredSpecialities] = useState<string[]>(
    []
  );
  // State variables for our data
  const [ready, setReady] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Let's build our current query
  const query: CompanyQuery = {
    namePattern,
    requiredSpecialities,
  };

  /**
   * Function to Re-load the list of matching companies.
   */
  const reload = () => {
    setReady(false);
    api
      .loadData(query)
      .then((results) => {
        setCompanies(results.sort(compareCompany));
        setReady(true);
      })
      .catch((error) => {
        setReady(true);
        console.log(error);
      });
  };

  /**
   * React to changes in the filter configuration by reloading the data
   */
  useEffect(reload, [JSON.stringify(query)]);

  // Render the UI
  return (
    <>
      <h2>HTTP API approach demo</h2>
      <Alert message={DOCS} closable={true} showIcon={true} />
      {/*  Input controls */}
      <SearchInput
        {...{
          namePattern,
          setNamePattern,
          ready,
          requiredSpecialities,
          setRequiredSpecialities,
        }}
      />
      <hr />
      {/*  Render the results */}
      <ResultTable
        query={query}
        ready={ready}
        data={companies}
        onSetCertified={(id, value) => api.setCertified(id, value).then(reload)}
        onHide={(id) => api.hide(id).then(reload)}
      />
      <hr />
      <Button onClick={() => api.showAllHidden().then(reload)}>
        Show all hidden companies
      </Button>
      <Button disabled={!ready} onClick={reload}>
        Reload data
      </Button>
    </>
  );
};
