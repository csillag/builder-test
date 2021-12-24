import { Meteor } from "meteor/meteor";
import { Company, CompanyQuery } from "/imports/common/data/types";
import { loadCompanyTestData } from "/imports/common/data/test-data-generator";

// We are going to story the data in memory
let companies: Company[] = [];
// A map to access the data efficiently based on company ID
const companiesById: Record<string, Company> = {};

// Upon launching the server, we load the data
Meteor.startup(() => {
  companies = loadCompanyTestData();
  companies.forEach((c) => (companiesById[c._id] = c));
});

// Operations the client can perform
// We are prefacing all methods with "d2", to denote that they all belong to "demo 2"
Meteor.methods({
  d2GetCompanyList: (query: CompanyQuery) => {
    let results = companies.filter((c) => !c.hidden); // Start with the list of all non-hidden companies
    const { namePattern, requiredSpecialities } = query;
    const pattern = namePattern.toLowerCase();
    if (namePattern) {
      // Filter for the name, if we have to
      results = results.filter(
        (c) => c.name.toLowerCase().indexOf(pattern) !== -1
      );
    }
    if (requiredSpecialities.length) {
      // Filter for the required specialities, if we have to
      results = results.filter((c) =>
        requiredSpecialities.every((speciality) =>
          c.specialities.includes(speciality)
        )
      );
    }
    return results;
  },
  d2SetCertified: (id: string, value: boolean) =>
    (companiesById[id].certified = value),
  d2HideCompany: (id: string) => (companiesById[id].hidden = true),
  d2ShowAllCompanies: () => companies.forEach((c) => (c.hidden = false)),
});
