export interface User {
    uuid: string;
    userName: string;
    created_at: string;
}

export interface Lead {
    id: string;
    created_at: string;
    user_uuid: string;
    lead_id: string;
    lead_name: string;
    contact_information: string;
    source: string;
    interest_level: string;
    status: string;
    salesperson: string;
}

export interface LoginCredentials {
    user_name: string;
    password: string;
}

export interface FilterState {
    lead_id?: string;
    lead_name?: string;
    contact_information?: string;
    source?: string;
    interest_level?: string;
    status?: string;
    salesperson?: string;
} 