import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { JsonRoutes } from 'meteor/simple:json-routes';
import { Company } from '/imports/common/data/types';
import { loadCompanyTestData } from '/imports/common/data/test-data-generator';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * The company data; extended with the list of specialities expressed as a Set
 */
interface EnhancedCompany extends Company {
    specSet: Set<string>;
}

// We are going to story the data in memory
let companies: EnhancedCompany[] = [];
// A map to access the data efficiently based on company ID
const companiesById: Record<string, Company> = {};

/**
 * A simple function to parse an HTML query string to key-value pairs
 */
export function parseQuery(query: string) {
    const result: Record<string, any> = {};
    (query || '').split('&').forEach((q) => {
        const [key, value] = q.split('=');
        result[key] = decodeURIComponent(value);
    });
    return result;
}

/**
 * A helper function to set up an API path
 */
function defineEndpoint(path: string, code: (params: Record<string, any>) => any) {
    JsonRoutes.add('get', `/d3/${path}`, (req: IncomingMessage, res: ServerResponse) => {
        const url = req.url!;
        const query = url.substring(url.indexOf('?') + 1);
        const params = parseQuery(query);
        // console.log("Executing", path);
        const result = code(params);
        res.end(JSON.stringify(result));
    });
}

Meteor.startup(() => {
    // Upon launching the server, we load the data
    companies = loadCompanyTestData().map((c) => ({
        ...c,
        // We want to convert the list of specialities to a Set, and cache it for future filtering
        // This runs only once, so the speed is not crucial.
        specSet: new Set(c.specialities),
    }));
    companies.forEach((c) => (companiesById[c._id] = c));
    // console.log("Loaded JSON data about", companies.length, "companies.");

    // Set up the API
    defineEndpoint('get-companies', (params) => {
        const { namePattern, requiredSpecialities: rawSpecialities } = params;
        const requiredSpecialities: string[] = rawSpecialities.split(',').filter((s: string) => !!s);
        let results = companies.filter((c) => !c.hidden); // Start with the list of all non-hidden companies
        if (namePattern) {
            // Filter for the name, if we have to
            const pattern = namePattern.toLowerCase();
            results = results.filter((c) => c.name.toLowerCase().indexOf(pattern) !== -1);
        }
        if (requiredSpecialities.length) {
            // Filter for the required specialities, if we have to
            results = results.filter((c) =>
                // Set.has() is faster than Array.includes(), so we are going to use this for the filtering.
                requiredSpecialities.every((spec) => c.specSet.has(spec))
            );
        }
        return results;
    });

    defineEndpoint(
        'set-certified',
        ({ id, value }) =>
            (companiesById[id].certified =
                // depending on the middleware and preprocessing used, we might get
                // the boolean value converted to a string, so we must take care to check the type.
                typeof value === 'boolean' ? value : value === 'true')
    );

    defineEndpoint('hide-company', ({ id }) => (companiesById[id].hidden = true));

    defineEndpoint('show-all-companies', () => companies.forEach((c) => (c.hidden = false)));
});
