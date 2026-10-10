// Shared labels for the participation form, the public walls and the admin panel.

export const PARTICIPANT_TYPES = {
  student: 'طالبة',
  teacher: 'معلمة',
  parent: 'وليّ أمر',
  staff: 'منسوبة المدرسة',
} as const

export const CATEGORIES = {
  kind_word: 'كلمة طيبة',
  encouragement: 'رسالة تشجيع',
  gratitude: 'رسالة امتنان وشكر',
  activity_idea: 'فكرة نشاط',
  suggestion: 'اقتراح',
} as const

export const STATUSES = {
  pending: 'بانتظار المراجعة',
  approved: 'منشورة',
  rejected: 'غير منشورة',
} as const

export type ParticipantType = keyof typeof PARTICIPANT_TYPES
export type Category = keyof typeof CATEGORIES
export type Status = keyof typeof STATUSES

// Categories that may appear publicly after approval. Activity ideas and
// suggestions are only ever visible to the administrator.
export const WALL_CATEGORIES: Category[] = ['kind_word', 'encouragement']
export const GRATITUDE_CATEGORIES: Category[] = ['gratitude']

export const MESSAGE_MAX = 600
export const NAME_MAX = 40
