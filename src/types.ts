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
  /** Extra context from the meeting note (from Granola) */
  detail?: string
  /** Date of the note/meeting (YYYY-MM-DD or YYYY-MM) for sorting and display */
  date?: string
}

export interface Decision {
  id: string
  text: string
  meetingId: string
  meetingTitle?: string
  date?: string
  /** Extra context shown when user expands the decision */
  detail?: string
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
