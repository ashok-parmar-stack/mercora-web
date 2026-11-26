import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '@/features/auth/schemas/auth.schema';
import { businessFilterSchema, enquirySchema } from '@/features/businesses/schemas/business.schema';

describe('Frontend Zod Schemas (Unit)', () => {
  it('FE-AUTH-002: validates loginSchema email & password rules', () => {
    expect(loginSchema.safeParse({ email: 'bad', password: '123' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'user@mercora.com', password: 'secret12' }).success).toBe(true);
  });

  it('FE-AUTH-005: validates registerSchema minimum lengths and optional phone', () => {
    expect(
      registerSchema.safeParse({ name: 'A', email: 'a@b.com', password: 'short' }).success,
    ).toBe(false);

    expect(
      registerSchema.safeParse({
        name: 'Asha Patel',
        email: 'asha@mercora.com',
        password: 'StrongPassword1',
        phone: '9876543210',
      }).success,
    ).toBe(true);
  });

  it('FE-DIR-001: applies defaults and bounds on businessFilterSchema', () => {
    const parsed = businessFilterSchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(12);
    expect(parsed.sortBy).toBe('relevance');

    expect(businessFilterSchema.safeParse({ limit: 500 }).success).toBe(false);
  });

  it('FE-ENQ-001: validates enquirySchema required fields and minimum requirement length', () => {
    expect(
      enquirySchema.safeParse({
        businessId: 'biz-1',
        businessName: 'Apex Steel',
        name: 'Buyer',
        phone: '9876543210',
        requirement: 'Too short',
      }).success,
    ).toBe(false);

    expect(
      enquirySchema.safeParse({
        businessId: 'biz-1',
        businessName: 'Apex Steel',
        name: 'Buyer Name',
        phone: '9876543210',
        email: '',
        requirement: 'Need 500 units delivered to Surat',
      }).success,
    ).toBe(true);
  });
});
