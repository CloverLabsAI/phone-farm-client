# @phonefarms/client

TypeScript SDK for the Echos Automation phone farm API. No runtime dependencies — uses built-in `fetch` (Node 18+).

## Install

```bash
npm install @phonefarms/client
```

## Quick Start

```ts
import { PhoneFarmClient } from "@phonefarms/client";

const client = new PhoneFarmClient({
  baseUrl: "https://farm.echos.social",
  apiKey: "your-api-key",
});

// 1. Create a slot (auto-assigns an available device)
const slotId = await client.createSlot();

// 2. Start a session (locks the device, returns tunnel URL)
const tunnelUrl = await client.createSession(slotId);

// 3. Use the device via tunnelUrl ...

// 4. Release the session when done (unlocks the device)
await client.releaseSession(slotId);

// 5. Delete the slot when no longer needed
await client.deleteSlot(slotId);
```

## API

### `new PhoneFarmClient(options)`

| Option    | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `baseUrl` | `string` | Farm server URL                   |
| `apiKey`  | `string` | API key for authentication        |

### `client.createSlot(options?): Promise<string>`

Auto-assigns an available online device and creates a persistent slot. Returns the slot ID.

**Options:**

| Option       | Type     | Description                              |
| ------------ | -------- | ---------------------------------------- |
| `cluster_id` | `string` | Optional. Restrict to a specific cluster |
| `owner`      | `string` | Optional. Slot owner label (default: `"api"`) |

**Throws:** `NoPhonesAvailableError` if no online devices have capacity.

### `client.deleteSlot(slotId): Promise<void>`

Deletes a slot. Automatically releases any active session on it first.

**Throws:** `SlotNotFoundError` if the slot does not exist.

### `client.createSession(slotId): Promise<string>`

Starts an active session for a slot, locking the assigned device. Returns the tunnel URL for device access. Only one active session is allowed per device at a time.

**Throws:**
- `SlotNotFoundError` — slot does not exist
- `DeviceOfflineError` — assigned device is offline
- `DeviceBusyError` — device already has an active session
- `TunnelNotAvailableError` — device has no tunnel URL configured

### `client.releaseSession(slotId): Promise<ReleaseSessionResult>`

Releases the active session for a slot, unlocking the device. Idempotent — returns successfully even if no active session exists.

**Returns:**

```ts
{
  slot_id: string;
  session_id: string | null;
  status: "released";
}
```

## Error Handling

All errors extend `PhoneFarmError`, which exposes `status` and `detail` properties:

```ts
import {
  NoPhonesAvailableError,
  SlotNotFoundError,
  DeviceBusyError,
  DeviceOfflineError,
  TunnelNotAvailableError,
} from "@phonefarms/client";

try {
  const url = await client.createSession(slotId);
} catch (err) {
  if (err instanceof DeviceBusyError) {
    // retry later
  } else if (err instanceof DeviceOfflineError) {
    // device went offline
  }
}
```

| Error class                | HTTP Status | When                                    |
| -------------------------- | ----------- | --------------------------------------- |
| `NoPhonesAvailableError`   | 409         | No online devices with available slots  |
| `SlotNotFoundError`        | 404         | Slot ID does not exist                  |
| `DeviceBusyError`          | 409         | Device already has an active session    |
| `DeviceOfflineError`       | 409         | Assigned device is offline              |
| `TunnelNotAvailableError`  | 503         | Device has no tunnel URL                |
| `PhoneFarmError`           | any         | Base class for all other API errors     |
