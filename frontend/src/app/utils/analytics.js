'use client';

import { sendGAEvent } from '@next/third-parties/google';

/**
 * Safe GA4 event tracker – never sends PII
 */
export function trackEvent(eventName, params = {}) {
  const cleanParams = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = value;
    }
  });

  sendGAEvent('event', eventName, cleanParams);
}

// Convenience helpers
export const analytics = {
  // ✅ UPDATED – uses readable name
  whatsappClick: (propertyName, source = 'unknown') =>
    trackEvent('whatsapp_click', {
      property_name: propertyName,
      source,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),

  // ✅ UPDATED – uses readable name
  emailClick: (propertyName) =>
    trackEvent('email_click', {
      property_name: propertyName,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),

  // ✅ UPDATED – uses readable name
  propertyShare: (propertyName, method = 'copy_link') =>
    trackEvent('property_share', {
      property_name: propertyName,
      method,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),

  propertyView: (data = {}) =>
    trackEvent('property_view', {
      ...data,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),

  viewingRequest: (propertyName, listingRef) =>
    trackEvent('viewing_request', {
      property_name: propertyName,
      listing_ref: listingRef,
      form_name: 'viewing_request',
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),

  contactFormSubmit: () =>
    trackEvent('contact_form_submit', {
      form_name: 'contact',
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),

  registrationSubmit: (method = 'email') =>
    trackEvent('registration_submit', {
      form_name: 'registration',
      method,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),

  roomSearch: (data = {}) =>
    trackEvent('room_search', {
      ...data,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),

  bookViewingClick: (propertyId) =>
    trackEvent('book_viewing_click', {
      property_id: propertyId,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }),
};