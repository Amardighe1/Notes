import { Capacitor } from "@capacitor/core";

const DEVICE_ID_KEY = "diplomate_device_id";

/**
 * Returns a stable unique device identifier.
 *
 * - On Android (Capacitor native): uses the hardware-level Device.getId()
 *   which returns the Android ID — unique per device + app install.
 * - On Web: generates a UUID once and persists it in localStorage.
 *
 * This ID is stored in the user's profile on signup and verified on every login
 * to ensure one account = one device.
 */
export async function getDeviceId(): Promise<string> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { Device } = await import("@capacitor/device");
      const info = await Device.getId();
      // info.identifier is the Android ID (stable per device)
      return info.identifier;
    } catch {
      // Fallback if plugin fails
      return getOrCreateWebId();
    }
  }

  return getOrCreateWebId();
}

function getOrCreateWebId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
