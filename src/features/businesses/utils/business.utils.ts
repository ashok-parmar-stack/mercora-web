import { Business } from '../types/business.types';

export function formatAddress(city: string, state: string, pincode?: string): string {
  if (pincode) return `${city}, ${state} – ${pincode}`;
  return `${city}, ${state}`;
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function exportBusinessesToCSV(businesses: Business[]): void {
  const headers = [
    'Business Name',
    'Category',
    'Business Type',
    'Location',
    'Products Count',
    'Verification',
    'Established Year',
    'Phone',
    'Email',
    'Website',
  ];

  const rows = businesses.map((b) => [
    `"${b.name}"`,
    `"${b.category}"`,
    `"${b.businessType}"`,
    `"${b.city}, ${b.state}"`,
    b.products?.length || 0,
    b.isVerified ? 'Verified' : 'Unverified',
    b.establishedYear,
    `"${b.phone}"`,
    `"${b.email}"`,
    `"${b.website}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `b2b_businesses_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
