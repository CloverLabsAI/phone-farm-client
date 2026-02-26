export interface ClientOptions {
    baseUrl: string;
    apiKey: string;
}
export interface CreateSlotOptions {
    cluster_id?: string;
    owner?: string;
}
export interface CreateSlotResult {
    slot_id: string;
}
export interface DeleteSlotResult {
    deleted: boolean;
}
export interface CreateSessionResult {
    session_id: string;
    url: string;
}
export interface ReleaseSessionResult {
    slot_id: string;
    session_id: string | null;
    status: string;
}
