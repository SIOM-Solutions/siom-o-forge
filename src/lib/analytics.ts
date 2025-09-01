type EventPayload = Record<string, string | number | boolean | undefined>

export function track(event: string, payload: EventPayload = {}) {
  try {
    // Consola dev; sustituible por PostHog/GA4
    // eslint-disable-next-line no-console
    console.log('[track]', event, payload)
  } catch {}
}


