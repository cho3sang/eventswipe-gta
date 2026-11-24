import { GtaEvent } from "../types";

export interface ExternalEventProvider {
  getEvents(): Promise<GtaEvent[]>;
}

export class TicketmasterDiscoveryProvider implements ExternalEventProvider {
  async getEvents(): Promise<GtaEvent[]> {
    // Future integration point:
    // Call Ticketmaster Discovery API, normalize attraction/venue/date fields,
    // and return GtaEvent records ready for moderation or direct display.
    return [];
  }
}

export class TorontoOpenDataProvider implements ExternalEventProvider {
  async getEvents(): Promise<GtaEvent[]> {
    // Future integration point:
    // Pull approved city event datasets from open.toronto.ca and transform
    // civic event records into the app's shared GtaEvent shape.
    return [];
  }
}

export class EventbriteProvider implements ExternalEventProvider {
  async getEvents(): Promise<GtaEvent[]> {
    // Future integration point:
    // Fetch Eventbrite organization/search events, filter to GTA locations,
    // and map ticket price, organizer, and URL metadata into GtaEvent.
    return [];
  }
}

export class ManualInstagramContentProvider implements ExternalEventProvider {
  async getEvents(): Promise<GtaEvent[]> {
    // Future integration point:
    // Consume a manually approved TodoToronto-style feed. Keep scraping out of
    // the client app; run ingestion server-side with consent and review.
    return [];
  }
}
