import * as fs from 'fs';
import Chance from 'chance';
import { ALL_SPECIALITIES, Company } from '/imports/common/data/types';
import { Meteor } from 'meteor/meteor';
import { getRandomLogoURL } from '/imports/common/data/random-logo-generator';

const chance = new Chance();

const DESIRED_SPECIALITIES_PER_COMPANY = 3;

const COMPANY_FILE_NAME = 'companies.json';

const WANTED_COMPANIES = 900; // Don't make this more than 940, since the random generator can't make up more unique random names...

/**
 * Get a random-generated list of specialities
 */
const getRandomSpecialities = (): string[] =>
    ALL_SPECIALITIES.filter(() =>
        chance.bool({
            likelihood: (100 * DESIRED_SPECIALITIES_PER_COMPANY) / ALL_SPECIALITIES.length,
        })
    );

/**
 * Generate a bunch of random companies
 */
function generateCompanies(number: number) {
    const results: Company[] = [];
    let newName = '';
    for (let i = 0; i < number; i++) {
        while (!newName || results.some((r) => r.name === newName)) {
            newName = chance.company();
        }
        results.push({
            _id: chance.guid(),
            name: newName,
            logo: getRandomLogoURL(),
            city: chance.city(),
            specialities: getRandomSpecialities(),
            certified: false,
            hidden: false,
        });
    }
    return results;
}

/**
 * Make sure that we have the file with the test data
 */
function ensureCompanyDataJson() {
    if (!fs.existsSync(COMPANY_FILE_NAME)) {
        console.log('Re-generating company data JSON file...');
        const companies = generateCompanies(WANTED_COMPANIES);
        fs.writeFileSync(COMPANY_FILE_NAME, JSON.stringify(companies, null, '  '));
    }
}

// When launching the app, make sure we have this data
Meteor.startup(() => ensureCompanyDataJson());

/**
 * Load the test data from the JSON file
 */
export function loadCompanyTestData(): Company[] {
    return JSON.parse(fs.readFileSync(COMPANY_FILE_NAME).toString()) as any;
}
