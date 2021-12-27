/**
 * This will be our main DTO for the companies
 */
export interface Company {
    _id: string;
    name: string;
    logo: string;
    specialities: string[];
    city: string;
    certified?: boolean;
    hidden: boolean;
}

/**
 * Query format to send to the server
 */
export interface CompanyQuery {
    namePattern: string;
    requiredSpecialities: string[];
}

/**
 * List of specialities to choose from
 */
export const ALL_SPECIALITIES: string[] = [
    'excavation',
    'plumbing',
    'electrical',
    'concrete',
    'woodwork',
    'artwork',
    'painting',
    'network',
    'security',
    'demolition',
];
