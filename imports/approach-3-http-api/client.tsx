import * as React from "react";

import { useEffect, useState } from "react";
import { Company, CompanyQuery } from "/imports/common/data/types";
import { ResultTable } from "/imports/common/ui-widgets/ResultsTable";
import { SearchInput } from "/imports/common/ui-widgets/SearchInput";
import { Alert, Button } from "antd";

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

// Utility method to call the API
function callMethod(name: string, query?: Record<string, any>) {
  const { protocol, hostname, port } = window.location;
  const path = `${protocol}//${hostname}:${port}/d3/${name}`;
  const pieces: string[] = [];
  if (query) {
    Object.keys(query).forEach((key) => {
      const value = query[key];
      if (value != null) {
        pieces.push(key + "=" + encodeURIComponent(value));
      }
    });
  }
  const url = pieces.length ? path + "?" + pieces.join("&") : path;
  return fetch(url);
}

/**
 * Implement the data access API using HTTP call to the API
 */
const api: DataAPI = {
  loadData: (query) =>
    new Promise<Company[]>((resolve, reject) => {
      callMethod("get-companies", query).then((result) => {
        if (result.status === 200) {
          result.json().then(resolve);
        } else {
          reject(result.status);
        }
      }, reject);
    }),

  setCertified: (id: string, value: boolean) =>
    callMethod("set-certified", { id, value }),

  // Hide a company
  hide: (id) => callMethod("hide-company", { id }),

  // Show all hidden companies
  showAllHidden: () => callMethod("show-all-companies"),
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
