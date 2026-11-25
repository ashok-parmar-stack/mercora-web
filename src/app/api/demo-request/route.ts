import { NextResponse } from "next/server";
import axios from "axios";
import { getInternalBackendUrl } from "@/app/actions/action-helpers";

export interface DemoRequestBody {
  fullName: string;
  email: string;
  company: string;
  countryCode?: string;
  phoneNumber?: string;
  interest?: string;
}

export async function POST(req: Request) {
  try {
    const body: DemoRequestBody = await req.json();

    const { fullName, email, company, countryCode = "+91", phoneNumber = "", interest = "Full Enterprise B2B Suite" } = body;

    // Server-side validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Full name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid work email address (e.g. name@company.com)." },
        { status: 400 }
      );
    }

    if (!company || typeof company !== "string" || company.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Organization or trading firm name is required." },
        { status: 400 }
      );
    }

    if (phoneNumber && phoneNumber.trim()) {
      const cleanPhone = phoneNumber.replace(/[\s\-()]/g, "");
      if (!/^\d{6,15}$/.test(cleanPhone)) {
        return NextResponse.json(
          { success: false, message: "Telephone number must be between 6 and 15 digits." },
          { status: 400 }
        );
      }
    }

    const leadRecord = {
      businessId: "mercora-platform-demo",
      businessName: "Mercora Platform Demo",
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: `${countryCode} ${phoneNumber.trim()}`.trim(),
      company: company.trim(),
      message: `Interested in: ${interest}`,
      source: "LANDING_PAGE_MODAL",
    };

    // Persist demo request through NestJS database-backed enquiry endpoint
    const backendUrl = getInternalBackendUrl();
    const apiRes = await axios.post(
      `${backendUrl}/api/businesses/enquiries`,
      leadRecord,
      { headers: { "Content-Type": "application/json" }, validateStatus: () => true },
    );

    if (apiRes.status >= 400 || !apiRes.data?.success) {
      throw new Error(apiRes.data?.message || "Failed to persist demo walkthrough request.");
    }

    const leadId = apiRes.data.id || `LEAD-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        message: "Demo walkthrough request registered successfully.",
        leadId,
        data: {
          leadId,
          status: "NEW",
          createdAt: apiRes.data.receivedAt || new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Mercora] Demo Request Ingestion Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error processing demo request." },
      { status: 500 }
    );
  }
}
