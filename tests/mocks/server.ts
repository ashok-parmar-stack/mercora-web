import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.get('*/api/businesses', () => {
    return HttpResponse.json({
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 1 },
    });
  }),
  http.get('*/api/businesses/facets', () => {
    return HttpResponse.json({
      totalBusinesses: 0,
      locations: [],
      cities: [],
      categories: [],
      businessCategories: [],
    });
  }),
];

export const server = setupServer(...handlers);
