import type { ClientOptions, CreateSlotOptions, ReleaseSessionResult } from "./types";
export declare class PhoneFarmClient {
    private readonly baseUrl;
    private readonly apiKey;
    constructor(options: ClientOptions);
    /** Create a persistent slot (auto-assigns a device).
     *
     * Returns the slot ID. Use `createSession` to start an active session.
     */
    createSlot(options?: CreateSlotOptions): Promise<string>;
    /** Delete a slot and release any active session. */
    deleteSlot(slotId: string): Promise<void>;
    /** Start an active session for a slot.
     *
     * Locks the device and returns the tunnel URL.
     */
    createSession(slotId: string): Promise<string>;
    /** Release the active session for a slot. */
    releaseSession(slotId: string): Promise<ReleaseSessionResult>;
    private request;
}
