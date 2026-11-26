import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BusinessStatusBadge } from '@/features/businesses/components/admin/BusinessStatusBadge';
import { BusinessStatsStrip } from '@/features/businesses/components/admin/BusinessStatsStrip';
import { ADMIN_NAV_SECTIONS } from '@/components/layout/sidebar/sidebar-navigation.data';

describe('Admin Business Management Module (Unit)', () => {
  it('renders BusinessStatusBadge for Verified, Premium, Standard, and Unverified tiers', () => {
    const { rerender } = render(<BusinessStatusBadge tier="Verified" isVerified />);
    expect(screen.getByText('Verified')).toBeInTheDocument();

    rerender(<BusinessStatusBadge tier="Premium" isVerified />);
    expect(screen.getByText('Premium')).toBeInTheDocument();

    rerender(<BusinessStatusBadge tier="Standard" isVerified={false} />);
    expect(screen.getByText('Standard')).toBeInTheDocument();

    rerender(<BusinessStatusBadge tier="Unverified" isVerified={false} />);
    expect(screen.getByText('Unverified')).toBeInTheDocument();
  });

  it('renders BusinessStatsStrip KPI cards from backend facets', () => {
    render(
      <BusinessStatsStrip
        totalBusinesses={120}
        verifiedCount={95}
        unverifiedCount={25}
        categoriesCount={14}
      />,
    );

    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('exposes single Businesses link in ADMIN_NAV_SECTIONS without duplicate routes', () => {
    const directorySection = ADMIN_NAV_SECTIONS.find((s) => s.label === 'Directory');
    expect(directorySection).toBeDefined();
    expect(directorySection?.items).toHaveLength(1);
    expect(directorySection?.items[0]).toMatchObject({
      href: '/admin/businesses',
      label: 'Businesses',
    });
  });
});
