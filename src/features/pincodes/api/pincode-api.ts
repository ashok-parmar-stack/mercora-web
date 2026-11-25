import { apiHttpClient, extractErrorMessage } from "@/lib/http/client";

export interface PincodeRecord {
  id: string;
  pincode: string;
  postOfficeName: string;
  branchType: string;
  deliveryStatus: "Delivery" | "Non-Delivery";
  circle: string;
  region: string;
  division: string;
  district: string;
  state: string;
  country: string;
  source: string;
  createdAt: string;
}

export interface CreatePincodePayload {
  pincode: string;
  postOfficeName: string;
  district: string;
  state: string;
  branchType: string;
  deliveryStatus: "Delivery" | "Non-Delivery";
  source?: string;
}

export interface IndiaPostLookupOffice {
  Name: string;
  District: string;
  State: string;
  BranchType: string;
  DeliveryStatus: string;
}

export async function fetchPincodes(signal?: AbortSignal): Promise<PincodeRecord[]> {
  const res = await apiHttpClient.get("/pincodes", { signal });
  return res.data?.data || [];
}

export async function createPincode(
  payload: CreatePincodePayload
): Promise<{ success: boolean; message?: string; data?: PincodeRecord }> {
  try {
    const res = await apiHttpClient.post("/pincodes", payload);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to save PIN code."));
  }
}

export async function syncIndiaPostPincode(
  pincode: string
): Promise<{ success: boolean; message?: string; data?: PincodeRecord[] }> {
  try {
    const res = await apiHttpClient.get("/pincodes", {
      params: { syncPincode: pincode },
    });
    return res.data;
  } catch (err) {
    throw new Error(
      extractErrorMessage(err, "Failed to sync PIN code from India Post.")
    );
  }
}

export async function deletePincode(id: string): Promise<void> {
  try {
    const res = await apiHttpClient.delete("/pincodes", { params: { id } });
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Delete failed");
    }
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Delete failed"));
  }
}

export async function bulkDeletePincodes(ids: string[]): Promise<void> {
  try {
    const res = await apiHttpClient.delete("/pincodes", {
      params: { ids: ids.join(",") },
    });
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Bulk delete failed");
    }
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Bulk delete failed"));
  }
}

export async function bulkUpdatePincodeDeliveryStatus(
  ids: string[],
  deliveryStatus: "Delivery" | "Non-Delivery"
): Promise<void> {
  try {
    const res = await apiHttpClient.patch("/pincodes", { ids, deliveryStatus });
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Status update failed");
    }
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Status update failed"));
  }
}

export async function lookupIndiaPostExternal(
  pincode: string
): Promise<IndiaPostLookupOffice | null> {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode.trim()}`);
  const data = await res.json();
  const first = Array.isArray(data) ? data[0] : null;

  if (
    first &&
    first.Status === "Success" &&
    Array.isArray(first.PostOffice) &&
    first.PostOffice.length > 0
  ) {
    return first.PostOffice[0];
  }
  throw new Error(
    first?.Message || "No records found on India Post. You can enter details manually."
  );
}
