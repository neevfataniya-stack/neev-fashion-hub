import { AnalyticsEvent } from '../types';

const STORAGE_KEY_EVENTS = 'nfh_analytics_events_v1';
const STORAGE_KEY_PURCHASED_ORDERS = 'nfh_processed_order_ids_v1';

// Preloaded realistic baseline figures for a simulated college Google Ads Search Campaign
export const SIMULATED_CAMPAIGN_DATA = {
  campaignName: 'Neev_Search_EverydayFashion_India',
  targetLocations: 'India (Tier 1 & Tier 2 Metros)',
  impressions: 4850,
  clicks: 342,
  cost: 4104, // ₹ in INR (avg CPC ₹12)
  avgCpc: 12.0,
  clickThroughRate: 7.05, // %
  topKeywords: [
    { keyword: 'buy plain t shirts online', clicks: 88, ctr: '8.4%', cost: '₹1,056' },
    { keyword: 'mens casual cotton shirts', clicks: 74, ctr: '7.1%', cost: '₹888' },
    { keyword: 'affordable jeans for women', clicks: 65, ctr: '6.9%', cost: '₹780' },
    { keyword: 'oversized t shirts india', clicks: 59, ctr: '7.8%', cost: '₹708' },
    { keyword: 'formal office shirts men', clicks: 56, ctr: '6.2%', cost: '₹672' },
  ],
};

// Initial sample events to provide realistic educational context if user just opened the app
const SEED_EVENTS: AnalyticsEvent[] = [
  {
    id: 'seed-1',
    eventName: 'view_item_list',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    parameters: { category: 'all', itemCount: 30 },
  },
  {
    id: 'seed-2',
    eventName: 'view_item',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    parameters: { productId: 1, productName: "Men's Plain T-Shirt", price: 299 },
  },
  {
    id: 'seed-3',
    eventName: 'add_to_cart',
    timestamp: new Date(Date.now() - 3600000 * 3.8).toISOString(),
    parameters: { productId: 1, productName: "Men's Plain T-Shirt", price: 299, size: 'L', color: 'Navy', quantity: 2 },
  },
  {
    id: 'seed-4',
    eventName: 'view_item',
    timestamp: new Date(Date.now() - 3600000 * 3.2).toISOString(),
    parameters: { productId: 21, productName: "Men's Slim Fit Jeans", price: 999 },
  },
  {
    id: 'seed-5',
    eventName: 'add_to_cart',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    parameters: { productId: 21, productName: "Men's Slim Fit Jeans", price: 999, size: '32', color: 'Blue', quantity: 1 },
  },
  {
    id: 'seed-6',
    eventName: 'begin_checkout',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    parameters: { value: 1597, itemCount: 3 },
  },
  {
    id: 'seed-7',
    eventName: 'purchase',
    timestamp: new Date(Date.now() - 3600000 * 2.4).toISOString(),
    parameters: { orderId: 'NFH-DEMO-90142', value: 1597, itemCount: 3 },
  },
];

export function getStoredEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(SEED_EVENTS));
      return SEED_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_EVENTS;
  }
}

export function trackEvent(
  eventName: AnalyticsEvent['eventName'],
  parameters: AnalyticsEvent['parameters'] = {}
): AnalyticsEvent | null {
  // Prevent duplicate purchase events if orderId was already tracked
  if (eventName === 'purchase' && parameters.orderId) {
    try {
      const rawProcessed = localStorage.getItem(STORAGE_KEY_PURCHASED_ORDERS);
      const processed: string[] = rawProcessed ? JSON.parse(rawProcessed) : [];
      if (processed.includes(parameters.orderId)) {
        // Duplicate purchase blocked on refresh
        return null;
      }
      processed.push(parameters.orderId);
      localStorage.setItem(STORAGE_KEY_PURCHASED_ORDERS, JSON.stringify(processed));
    } catch {
      // Ignore storage error
    }
  }

  const newEvent: AnalyticsEvent = {
    id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    eventName,
    timestamp: new Date().toISOString(),
    parameters: {
      ...parameters,
      currency: 'INR',
    },
  };

  try {
    const events = getStoredEvents();
    events.unshift(newEvent);
    // Keep last 150 events to avoid unbounded storage
    const trimmed = events.slice(0, 150);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(trimmed));
    // Trigger custom window event so open dashboards can update in real-time
    window.dispatchEvent(new CustomEvent('nfh_analytics_updated'));
  } catch (e) {
    console.warn('Analytics event storage failed:', e);
  }

  // Also simulate window.dataLayer push for GA4 structure readiness
  try {
    if (typeof window !== 'undefined') {
      const win = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      win.dataLayer = win.dataLayer || [];
      win.dataLayer.push({
        event: eventName,
        ecommerce: parameters,
        demoSource: 'Neev Fashion Hub',
      });
    }
  } catch {
    // Ignore dataLayer errors
  }

  return newEvent;
}

export function resetAnalyticsData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_EVENTS);
    localStorage.removeItem(STORAGE_KEY_PURCHASED_ORDERS);
    // Trigger update
    window.dispatchEvent(new CustomEvent('nfh_analytics_updated'));
  } catch (e) {
    console.warn('Failed to reset analytics:', e);
  }
}

export function getAnalyticsMetrics(events: AnalyticsEvent[]) {
  const counts = {
    view_item_list: 0,
    view_item: 0,
    add_to_cart: 0,
    begin_checkout: 0,
    purchase: 0,
  };

  let totalPurchaseRevenue = 0;

  events.forEach((evt) => {
    if (counts[evt.eventName] !== undefined) {
      counts[evt.eventName]++;
    }
    if (evt.eventName === 'purchase' && evt.parameters.value) {
      totalPurchaseRevenue += Number(evt.parameters.value);
    }
  });

  // Calculate funnel conversions
  const viewToCartRate = counts.view_item > 0 
    ? ((counts.add_to_cart / counts.view_item) * 100).toFixed(1) 
    : '0.0';

  const cartToCheckoutRate = counts.add_to_cart > 0 
    ? ((counts.begin_checkout / counts.add_to_cart) * 100).toFixed(1) 
    : '0.0';

  const checkoutToPurchaseRate = counts.begin_checkout > 0 
    ? ((counts.purchase / counts.begin_checkout) * 100).toFixed(1) 
    : '0.0';

  const overallConversionRate = counts.view_item > 0 
    ? ((counts.purchase / counts.view_item) * 100).toFixed(1) 
    : '0.0';

  return {
    counts,
    totalPurchaseRevenue,
    viewToCartRate,
    cartToCheckoutRate,
    checkoutToPurchaseRate,
    overallConversionRate,
  };
}
