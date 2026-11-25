import { NextRequest, NextResponse } from "next/server";

export interface PincodeRecord {
  id: string;
  pincode: string;
  postOfficeName: string;
  branchType: string;
  deliveryStatus: "Delivery" | "Non-Delivery";
  district: string;
  state: string;
  division?: string;
  source: string;
  lastSyncedAt: string;
}

// In-memory persistent master registry seeded with prominent trade & industrial PIN codes
let PINCODE_DATABASE: PincodeRecord[] = [
  {
    id: "pin-380001",
    pincode: "380001",
    postOfficeName: "Ahmedabad G.P.O.",
    branchType: "Head Post Office",
    deliveryStatus: "Delivery",
    district: "Ahmedabad",
    state: "Gujarat",
    division: "Ahmedabad City",
    source: "INDIA_POST_OFFICIAL",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "pin-382445",
    pincode: "382445",
    postOfficeName: "Vatva I.E.",
    branchType: "Sub Post Office",
    deliveryStatus: "Delivery",
    district: "Ahmedabad",
    state: "Gujarat",
    division: "Ahmedabad City",
    source: "INDIA_POST_OFFICIAL",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "pin-363642",
    pincode: "363642",
    postOfficeName: "Morbi Ceramic City",
    branchType: "Sub Post Office",
    deliveryStatus: "Delivery",
    district: "Morbi",
    state: "Gujarat",
    division: "Rajkot Division",
    source: "INDIA_POST_OFFICIAL",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "pin-395003",
    pincode: "395003",
    postOfficeName: "Surat Textile Market",
    branchType: "Sub Post Office",
    deliveryStatus: "Delivery",
    district: "Surat",
    state: "Gujarat",
    division: "Surat Division",
    source: "INDIA_POST_OFFICIAL",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "pin-400001",
    pincode: "400001",
    postOfficeName: "Mumbai G.P.O.",
    branchType: "Head Post Office",
    deliveryStatus: "Delivery",
    district: "Mumbai",
    state: "Maharashtra",
    division: "Mumbai City",
    source: "INDIA_POST_OFFICIAL",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "pin-110001",
    pincode: "110001",
    postOfficeName: "New Delhi G.P.O.",
    branchType: "Head Post Office",
    deliveryStatus: "Delivery",
    district: "Central Delhi",
    state: "Delhi",
    division: "New Delhi Central",
    source: "INDIA_POST_OFFICIAL",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "pin-560001",
    pincode: "560001",
    postOfficeName: "Bengaluru G.P.O.",
    branchType: "Head Post Office",
    deliveryStatus: "Delivery",
    district: "Bengaluru",
    state: "Karnataka",
    division: "Bangalore HQ",
    source: "INDIA_POST_OFFICIAL",
    lastSyncedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const state = searchParams.get("state") || "";
  const deliveryStatus = searchParams.get("deliveryStatus") || "";
  const syncPincode = searchParams.get("syncPincode")?.trim() || "";

  // 1. Direct Live Sync Query from India Post API
  if (syncPincode) {
    if (!/^\d{6}$/.test(syncPincode)) {
      return NextResponse.json(
        { success: false, message: "Valid 6-digit postal PIN code required" },
        { status: 400 }
      );
    }

    try {
      const govtRes = await fetch(
        `https://api.postalpincode.in/pincode/${syncPincode}`,
        { next: { revalidate: 3600 } }
      );

      if (!govtRes.ok) {
        throw new Error(`Government Postal API responded with status ${govtRes.status}`);
      }

      const govtData = await govtRes.json();
      const firstEntry = Array.isArray(govtData) ? govtData[0] : null;

      if (!firstEntry || firstEntry.Status !== "Success" || !firstEntry.PostOffice) {
        return NextResponse.json(
          {
            success: false,
            message: firstEntry?.Message || `No post offices found for PIN ${syncPincode}`,
          },
          { status: 404 }
        );
      }

      const syncedOffices: PincodeRecord[] = firstEntry.PostOffice.map(
        (po: any, idx: number) => ({
          id: `pin-${syncPincode}-${idx}-${Date.now()}`,
          pincode: po.Pincode || syncPincode,
          postOfficeName: (po.Name || "").trim(),
          branchType: po.BranchType || "Sub Post Office",
          deliveryStatus: po.DeliveryStatus === "Delivery" ? "Delivery" : "Non-Delivery",
          district: po.District || "",
          state: po.State || "",
          division: po.Division || po.Circle || "",
          source: "INDIA_POST_OFFICIAL",
          lastSyncedAt: new Date().toISOString(),
        })
      );

      // Merge into local database without duplicates
      for (const item of syncedOffices) {
        const existingIdx = PINCODE_DATABASE.findIndex(
          (p) => p.pincode === item.pincode && p.postOfficeName === item.postOfficeName
        );
        if (existingIdx >= 0) {
          PINCODE_DATABASE[existingIdx] = item;
        } else {
          PINCODE_DATABASE.unshift(item);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully synchronized ${syncedOffices.length} post office(s) from India Post official directory.`,
        syncedCount: syncedOffices.length,
        data: syncedOffices,
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          message: err.message || "Failed to reach India Post API",
        },
        { status: 502 }
      );
    }
  }

  // 2. Standard Search and Filtering
  let results = [...PINCODE_DATABASE];

  if (search) {
    results = results.filter(
      (r) =>
        r.pincode.includes(search) ||
        r.postOfficeName.toLowerCase().includes(search) ||
        r.district.toLowerCase().includes(search) ||
        r.state.toLowerCase().includes(search)
    );
  }

  if (state && state !== "ALL") {
    results = results.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  }

  if (deliveryStatus && deliveryStatus !== "ALL") {
    results = results.filter((r) => r.deliveryStatus === deliveryStatus);
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    data: results,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.pincode || !/^\d{6}$/.test(body.pincode)) {
      return NextResponse.json(
        { success: false, message: "Valid 6-digit PIN code is required" },
        { status: 400 }
      );
    }

    const newRecord: PincodeRecord = {
      id: `pin-${body.pincode}-${Date.now()}`,
      pincode: body.pincode.trim(),
      postOfficeName: (body.postOfficeName || "").trim() || "Head Post Office",
      branchType: body.branchType || "Sub Post Office",
      deliveryStatus: body.deliveryStatus === "Non-Delivery" ? "Non-Delivery" : "Delivery",
      district: (body.district || "").trim() || "Ahmedabad",
      state: (body.state || "").trim() || "Gujarat",
      division: body.division || "Regional Hub",
      source: body.source || "MANUAL_ENTRY",
      lastSyncedAt: new Date().toISOString(),
    };

    PINCODE_DATABASE.unshift(newRecord);

    return NextResponse.json({
      success: true,
      message: `PIN Code ${newRecord.pincode} (${newRecord.postOfficeName}) added successfully.`,
      data: newRecord,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to add PIN code" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID is required" },
      { status: 400 }
    );
  }

  PINCODE_DATABASE = PINCODE_DATABASE.filter((p) => p.id !== id);

  return NextResponse.json({
    success: true,
    message: "PIN code entry removed.",
  });
}
