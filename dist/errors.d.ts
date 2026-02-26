export declare class PhoneFarmError extends Error {
    readonly status: number;
    readonly detail: string;
    constructor(status: number, detail: string);
}
export declare class NoPhonesAvailableError extends PhoneFarmError {
    constructor(detail?: string);
}
export declare class SlotNotFoundError extends PhoneFarmError {
    constructor(detail?: string);
}
export declare class DeviceBusyError extends PhoneFarmError {
    constructor(detail?: string);
}
export declare class DeviceOfflineError extends PhoneFarmError {
    constructor(detail?: string);
}
export declare class TunnelNotAvailableError extends PhoneFarmError {
    constructor(detail?: string);
}
