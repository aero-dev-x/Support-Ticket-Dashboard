const AVATAR_COLOR_KEYS = ['primary', 'secondary', 'warning'] as const

export type AvatarColorKey = (typeof AVATAR_COLOR_KEYS)[number]

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getAvatarColorKey(name: string): AvatarColorKey {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLOR_KEYS[hash % AVATAR_COLOR_KEYS.length]
}
