/**
 * Compute the true minimum starting pass price for an event.
 * Scans all dates and pass tiers.
 */
export function getEventStartingPrice(event) {
  if (!event) return 0;
  
  const prices = [];
  if (Array.isArray(event.dates)) {
    for (const d of event.dates) {
      if (Array.isArray(d.passes)) {
        for (const p of d.passes) {
          const num = Number(p.price);
          if (!isNaN(num) && num > 0) {
            prices.push(num);
          }
        }
      }
    }
  }

  if (prices.length > 0) {
    return Math.min(...prices);
  }

  const fallback = Number(event.price);
  return !isNaN(fallback) && fallback > 0 ? fallback : 799;
}

/**
 * Compute min and max pass price for an event.
 */
export function getEventPriceRange(event) {
  if (!event) return { min: 0, max: 0 };

  const prices = [];
  if (Array.isArray(event.dates)) {
    for (const d of event.dates) {
      if (Array.isArray(d.passes)) {
        for (const p of d.passes) {
          const num = Number(p.price);
          if (!isNaN(num) && num > 0) {
            prices.push(num);
          }
        }
      }
    }
  }

  if (prices.length > 0) {
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  const fallback = Number(event.price) || 799;
  return { min: fallback, max: fallback };
}
