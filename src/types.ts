export interface Meeting {
  id: string
  title: string
  date: string
  attendees: string[]
  summary?: string
  link?: string
}

export interface ActionItem {
  id: string
  text: string
  meetingId: string
  meetingTitle?: string
  owner?: string
  due?: string
  status?: 'open' | 'done'
  /** Extra context from the meeting transcript or email */
  detail?: string
  /** Date of the note/meeting (YYYY-MM-DD or YYYY-MM) for sorting and display */
  date?: string
  /** Origin of the item. 'meeting' = VPS meeting transcript; 'email' = global-marcom email.
   * Legacy values ('granola'/'outlook') still render for older data. */
  source?: 'meeting' | 'email' | 'granola' | 'outlook' | 'events' | 'content'
}

export interface Decision {
  id: string
  text: string
  meetingId: string
  meetingTitle?: string
  date?: string
  /** Extra context shown when user expands the decision */
  detail?: string
  /** Origin of the decision. 'meeting' = VPS meeting transcript; 'email' = global-marcom email.
   * Legacy values ('granola'/'outlook') still render for older data. */
  source?: 'meeting' | 'email' | 'granola' | 'outlook' | 'events' | 'content'
}

export interface TeamDashboardData {
  lastUpdated: string
  summary: string
  /** Longer version shown when user expands "What's going on" */
  summaryDetail?: string
  meetings: Meeting[]
  actionItems: ActionItem[]
  decisions: Decision[]
}

/** Optional file: action items and decisions extracted from Outlook emails (Zapier + AI). Merged into the dashboard when present. */
export interface OutlookDashboardData {
  actionItems: ActionItem[]
  decisions: Decision[]
}
