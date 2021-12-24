import * as React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { CompanyCollection } from "./common";
import { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Company, CompanyQuery } from "/imports/common/data/types";
import { ResultTable } from "/imports/common/ui-widgets/ResultsTable";
import { SearchInput } from "/imports/common/ui-widgets/SearchInput";
import { Alert, Button } from "antd";

const DOCS =
  "This implementation uses MongoDB Collections, a live DDP connection, and MiniMongo - the default Meteor data stack. " +
  "Looking at the amount of code we have to write, this approach wins hands down, " +
  "since this is a fully automatic, reactive data stack, reaching from the DB up to the client. " +
  "We don't really have to code any of the server APIs, since they are available out of the box from Meteor. " +
  "Please also note that this data is live; if you open the app in multiple browser windows, " +
  "changes from one window instantly propagate to all other ones. (Click on the 'certified' icons to test.)";

// Helper function for sorting the companies
const compareCompany = (a: Company, b: Company) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

/**
 * We will wrap the data access behind this API
 *
 * Please note that none of these methods are asynchronous.
 *
 * This is the magic of Meteor: readying the data is reactive, and it's channeled into the React hooks,
 * so when new data becomes available, it will automatically re-render the UI accordingly.
 *
 * We also don't have to wait for the results of the write operations, since they will be propagated
 * from the DB to the UI automatically.
 */
interface DataAPI {
  // Get / load the data
  getStatus: (query: CompanyQuery) => {
    ready: boolean;
    companies: Company[];
  };

  // Change the certification status of a company
  setCertified: (id: string, value: boolean) => void;

  // Hide a company
  hide: (id: string) => void;

  // Show all hidden companies
  showAllHidden: () => void;
}

/**
 * Implement data access via Mongo Collections (and Meteor Methods)
 */
const api: DataAPI = {
  getStatus: (query) => ({
    ready: Meteor.subscribe("d1-companyList", query).ready(),
    companies: CompanyCollection.find().fetch().sort(compareCompany),
  }),

  setCertified: (id, value) => Meteor.call("d1SetCertified", id, value),

  hide: (id) => Meteor.call("d1HideCompany", id),

  showAllHidden: () => Meteor.call("d1ShowAllCompanies"),
};

/**
 * Demo for the approach based on Mongo Collections, including the data loading
 */
export const CollectionsDemoApp = () => {
  // State variables for filtering input controls
  const [namePattern, setNamePattern] = useState("");
  const [requiredSpecialities, setRequiredSpecialities] = useState<string[]>(
    []
  );

  // Let's build our current query
  const query: CompanyQuery = {
    namePattern,
    requiredSpecialities,
  };

  // Get the list of companies. (This will be reactive).
  const { ready, companies } = useTracker(() => api.getStatus(query));

  // Render the UI
  return (
    <>
      <h2>Collection approach demo</h2>
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
        onSetCertified={api.setCertified}
        onHide={api.hide}
      />
      <hr />
      <Button onClick={api.showAllHidden}>Show all hidden companies</Button>
    </>
  );
};
