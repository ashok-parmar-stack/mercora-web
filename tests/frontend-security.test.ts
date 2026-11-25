import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getUserDisplayRole,
  getUserInitials,
  getUserRoleCode,
  isAdminRole,
  STAFF_ADMIN_ROLES,
} from '../src/lib/auth-helpers';
import {
  ALLOWED_IMAGE_TYPES,
  uploadFileToBucket,
} from '../src/lib/storage';
import { APP_CONFIG } from '../src/config/app.config';
import { APP_MESSAGES, MESSAGES } from '../src/config/messages';
import { ROLES, STAFF_ADMIN_ROLES as CONFIG_STAFF_ROLES } from '../src/config/permissions.config';

describe('Auth Helpers', () => {
  it('resolves role codes across string and object user shapes', () => {
    assert.equal(getUserRoleCode({ role: 'super_admin' }), 'SUPER_ADMIN');
    assert.equal(getUserRoleCode({ role: { code: 'data_manager' } }), 'DATA_MANAGER');
    assert.equal(getUserRoleCode({ role: { name: 'Customer' } }), 'CUSTOMER');
    assert.equal(getUserRoleCode(null), '');
  });

  it('grants admin console access only to staff/admin roles', () => {
    for (const role of STAFF_ADMIN_ROLES) {
      assert.equal(isAdminRole({ role }), true);
    }
    assert.equal(isAdminRole({ role: 'CUSTOMER' }), false);
    assert.equal(isAdminRole({ role: 'VIEWER' }), false);
    assert.equal(isAdminRole(undefined), false);
    assert.equal(getUserDisplayRole({ role: { name: 'Administrator' } }), 'Administrator');
  });

  it('computes safe user initials with fallback', () => {
    assert.equal(getUserInitials('Asha Patel'), 'AP');
    assert.equal(getUserInitials('Mercora'), 'ME');
    assert.equal(getUserInitials(''), 'U');
  });
});

describe('Storage Upload Hardening', () => {
  it('excludes SVG from ALLOWED_IMAGE_TYPES', () => {
    assert.equal(ALLOWED_IMAGE_TYPES.includes('image/svg+xml'), false);
    assert.equal(ALLOWED_IMAGE_TYPES.includes('image/png'), true);
  });

  it('rejects traversal folders, SVG MIME, mismatched extension, and forged magic bytes', async () => {
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    await assert.rejects(
      () => uploadFileToBucket(pngHeader, 'avatar.png', 'image/png', '../../etc'),
      /Invalid upload folder path/,
    );

    await assert.rejects(
      () => uploadFileToBucket(Buffer.from('<svg></svg>'), 'xss.svg', 'image/svg+xml', 'avatars'),
      /Invalid file type/,
    );

    await assert.rejects(
      () => uploadFileToBucket(pngHeader, 'avatar.jpg', 'image/png', 'avatars'),
      /does not match MIME type/,
    );

    await assert.rejects(
      () => uploadFileToBucket(Buffer.from('not-a-png'), 'fake.png', 'image/png', 'avatars'),
      /signature does not match/,
    );
  });
});

describe('Centralized Configuration', () => {
  it('aligns RBAC roles, messages, and shared limits', () => {
    assert.deepEqual([...CONFIG_STAFF_ROLES], [...STAFF_ADMIN_ROLES]);
    assert.equal(ROLES.SUPER_ADMIN, 'SUPER_ADMIN');
    assert.equal(ROLES.CUSTOMER, 'CUSTOMER');
    assert.ok(MESSAGES.common.saveSuccess);
    assert.ok(APP_MESSAGES.confirmations.clearFilters);
    assert.equal(APP_CONFIG.upload.maxFileSizeMB, 5);
  });
});
