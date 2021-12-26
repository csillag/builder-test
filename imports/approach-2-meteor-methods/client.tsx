import * as React from "react";
import { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Company, CompanyQuery } from "/imports/common/data/types";
import { ResultTable } from "/imports/common/ui-widgets/ResultsTable";
import { SearchInput } from "/imports/common/ui-widgets/SearchInput";
import { Alert, Button } from "antd";
import { compareCompany } from "/imports/common/util";

const DOCS =
  "This implementation uses Meteor Methods for communication. " +
  "This is Meteor's RPC system, which abstracts away many technical details around providing and consuming API endpoints. " +
  "No DB is involved, the data is loaded from a JSON data file, and then the server stores it in memory. " +
  "Unlike the previous Collections-based approach, this data is not live; " +
  "data needs to be refreshed to get the latest changes.";

type MeteorCallback<T = void> = (error?: any, data?: T) => void;

/**
 * We will wrap the data access behind this API
 */
interface DataAPI {
  /**
   * Load the data.
   *
   * After loading finishes, the (optional) callback will be called.
   */
  loadData: (query: CompanyQuery, callback?: MeteorCallback<Company[]>) => void;

  // Change the certification status of a company
  setCertified: (id: string, value: boolean, callback?: MeteorCallback) => void;

  // Hide a company
  hide: (id: string, callback?: MeteorCallback) => void;

  // Show all hidden companies
  showAllHidden: (callback?: MeteorCallback) => void;
}

/**
 * Implement the data access API using Meteor Methods
 */
const api: DataAPI = {
  loadData: (query, callback) =>
    Meteor.call("d2GetCompanyList", query, callback),

  setCertified: (id, value, callback) =>
    Meteor.call("d2SetCertified", id, value, callback),

  hide: (id, callback) => Meteor.call("d2HideCompany", id, callback),

  showAllHidden: (callback) => Meteor.call("d2ShowAllCompanies", callback),
};

/**
 * Demo for the approach based on Meteor Methods, including the data loading
 */
export const MethodsDemoApp = () => {
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
    api.loadData(query, (error?: any, result?: Company[]) => {
      setReady(true);
      if (error) {
        console.log(error);
      } else {
        setCompanies(result!.sort(compareCompany));
      }
    });
  };

  /**
   * React to changes in the filter configuration by reloading the data
   */
  useEffect(reload, [JSON.stringify(query)]);

  // Render the UI
  return (
    <>
      <h2>Meteor Methods approach demo</h2>
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
        onSetCertified={(id, value) => api.setCertified(id, value, reload)}
        onHide={(id) => api.hide(id, reload)}
      />
      <hr />
      <Button onClick={() => api.showAllHidden(reload)}>
        Show all hidden companies
      </Button>
      <Button disabled={!ready} onClick={reload}>
        Reload data
      </Button>
    </>
  );
};
