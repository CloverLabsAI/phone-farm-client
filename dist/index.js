class PhoneFarmError extends Error {
    constructor(status, detail) {
        super(`PhoneFarm API error ${status}: ${detail}`);
        this.name = "PhoneFarmError";
        this.status = status;
        this.detail = detail;
    }
}
class NoPhonesAvailableError extends PhoneFarmError {
    constructor(detail = "No phones available") {
        super(409, detail);
        this.name = "NoPhonesAvailableError";
    }
}
class SlotNotFoundError extends PhoneFarmError {
    constructor(detail = "Slot not found") {
        super(404, detail);
        this.name = "SlotNotFoundError";
    }
}
class DeviceBusyError extends PhoneFarmError {
    constructor(detail = "Device is busy") {
        super(409, detail);
        this.name = "DeviceBusyError";
    }
}
class DeviceOfflineError extends PhoneFarmError {
    constructor(detail = "Device is offline") {
        super(409, detail);
        this.name = "DeviceOfflineError";
    }
}
class TunnelNotAvailableError extends PhoneFarmError {
    constructor(detail = "Tunnel not available") {
        super(503, detail);
        this.name = "TunnelNotAvailableError";
    }
}

class PhoneFarmClient {
    constructor(options) {
        this.baseUrl = options.baseUrl.replace(/\/+$/, "");
        this.apiKey = options.apiKey;
    }
    /** Create a persistent slot (auto-assigns a device).
     *
     * Returns the slot ID. Use `createSession` to start an active session.
     */
    async createSlot(options) {
        const res = await this.request("POST", "/api/v1/slots", options);
        return res.slot_id;
    }
    /** Delete a slot and release any active session. */
    async deleteSlot(slotId) {
        await this.request("DELETE", `/api/v1/slots/${slotId}`);
    }
    /** Start an active session for a slot.
     *
     * Locks the device and returns the tunnel URL.
     */
    async createSession(slotId) {
        const res = await this.request("POST", `/api/v1/slots/${slotId}/sessions`);
        return res.url;
    }
    /** Release the active session for a slot. */
    async releaseSession(slotId) {
        return this.request("POST", `/api/v1/slots/${slotId}/sessions/release`);
    }
    async request(method, path, body) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            "X-API-Key": this.apiKey,
            "Content-Type": "application/json",
        };
        const res = await fetch(url, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
            const detail = typeof errorBody.detail === "object"
                ? errorBody.detail.message
                : errorBody.detail || res.statusText;
            const errorCode = typeof errorBody.detail === "object" ? errorBody.detail.code : undefined;
            switch (res.status) {
                case 404:
                    throw new SlotNotFoundError(detail);
                case 409:
                    if (errorCode === "DEVICE_BUSY")
                        throw new DeviceBusyError(detail);
                    if (errorCode === "DEVICE_OFFLINE")
                        throw new DeviceOfflineError(detail);
                    throw new NoPhonesAvailableError(detail);
                case 503:
                    throw new TunnelNotAvailableError(detail);
                default:
                    throw new PhoneFarmError(res.status, detail);
            }
        }
        return res.json();
    }
}

export { DeviceBusyError, DeviceOfflineError, NoPhonesAvailableError, PhoneFarmClient, PhoneFarmError, SlotNotFoundError, TunnelNotAvailableError };
//# sourceMappingURL=index.js.map
