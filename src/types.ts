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
}

export interface Decision {
  id: string
  text: string
  meetingId: string
  meetingTitle?: string
  date?: string
}

export interface Topic {
  name: string
  meetingIds: string[]
  summary?: string
}

export interface TeamDashboardData {
  lastUpdated: string
  summary: string
  meetings: Meeting[]
  actionItems: ActionItem[]
  decisions: Decision[]
  topics: Topic[]
}
