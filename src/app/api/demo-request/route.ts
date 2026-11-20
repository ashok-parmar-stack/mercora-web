import { NextResponse } from "next/server";

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

    const { fullName, email, company, countryCode = "+91", phoneNumber = "", interest = "Full Deal OS Suite" } = body;

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

    // Generate unique enterprise lead tracking ID
    const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const leadRecord = {
      leadId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      phone: `${countryCode} ${phoneNumber.trim()}`.trim(),
      interest,
      source: "LANDING_PAGE_MODAL",
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    // Log the received lead for enterprise CRM ingestion & audit trail
    console.log("[Mercora Deal OS] New Demo Lead Ingested:", leadRecord);

    return NextResponse.json(
      {
        success: true,
        message: "Demo walkthrough request registered successfully.",
        leadId,
        data: leadRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Mercora Deal OS] Demo Request Ingestion Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error processing demo request." },
      { status: 500 }
    );
  }
}
