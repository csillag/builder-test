import { Company } from '/imports/common/data/types';

// Helper function for sorting the companies
export const compareCompany = (a: Company, b: Company) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
