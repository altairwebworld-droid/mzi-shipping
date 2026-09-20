// Reserved architecture only. These routes are intentionally not published.
// Add authenticated rendering and server authorization before enabling them.
export const customerRoutes = {
  login: '/customer/login/',
  dashboard: '/customer/',
  shipment: '/customer/shipments/:shipmentId/',
  documents: '/customer/documents/'
};
// Enquiries and tracking currently use public/api.js. Replace its adapters
// with Supabase-backed endpoints, private document storage and per-user access.
