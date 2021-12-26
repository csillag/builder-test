import { CompanyCollection } from "./common";
import { Meteor } from "meteor/meteor";
import { Company, CompanyQuery } from "/imports/common/data/types";
import { loadCompanyTestData } from "/imports/common/data/test-data-generator";
import { Mongo } from "meteor/mongo";

// Upon launching the server, we will import the data set into MongoDB
Meteor.startup(() => {
  // console.log("Importing JSON data to MongoDB");
  CompanyCollection.remove({});
  const companies = loadCompanyTestData();
  companies.forEach((company) => CompanyCollection.insert(company));
});

// Publish the data for the clients
Meteor.publish("d1-companyList", (query: CompanyQuery) => {
  const { namePattern, requiredSpecialities } = query;
  const selector: Mongo.Selector<Company> = { hidden: false };
  // Filter for the name, if we have to
  if (namePattern) {
    selector.name = { $regex: namePattern, $options: "im" };
  }
  // Filter for required specialities, if we have to
  if (requiredSpecialities.length) {
    selector.specialities = {
      $all: requiredSpecialities,
    };
  }
  // Return the results
  return CompanyCollection.find(selector);
});

// Operations the client can perform
// We are prefacing all methods with "d1", to denote that they all belong to "demo 1"
Meteor.methods({
  d1SetCertified: (id: string, value: boolean) =>
    CompanyCollection.update(id, { $set: { certified: value } }),
  d1HideCompany: (id: string) =>
    CompanyCollection.update(id, { $set: { hidden: true } }),
  d1ShowAllCompanies: () =>
    CompanyCollection.update({ hidden: true }, { $set: { hidden: false } }),
});
