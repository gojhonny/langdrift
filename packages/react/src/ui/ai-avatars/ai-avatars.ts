const portrait = (background: string, skin: string, hair: string, shirt: string, accent: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${background}"/>
          <stop offset="1" stop-color="${accent}"/>
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="48" fill="url(#bg)"/>
      <circle cx="48" cy="38" r="19" fill="${skin}"/>
      <path d="M27 35c2-14 12-23 23-23 12 0 21 7 23 20-5-4-10-7-17-8-10-2-18 2-29 11Z" fill="${hair}"/>
      <path d="M30 96c2-22 11-32 18-32s16 10 18 32H30Z" fill="${shirt}"/>
      <path d="M37 42c3 2 7 3 11 3s8-1 11-3" fill="none" stroke="#8f5b4c" stroke-linecap="round" stroke-width="2" opacity=".45"/>
      <circle cx="41" cy="37" r="1.5" fill="#2a2525"/>
      <circle cx="55" cy="37" r="1.5" fill="#2a2525"/>
      <path d="M43 51c3 2 7 2 10 0" fill="none" stroke="#8c4b4b" stroke-linecap="round" stroke-width="2"/>
    </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const aiAvatars = {
  ana: portrait('#ffd7b8', '#d79a77', '#2a1b18', '#2457d6', '#f97316'),
  carlos: portrait('#c6d8ff', '#b87858', '#171717', '#27364a', '#4f7ee8'),
  jonny: portrait('#ffe2bf', '#c98967', '#231815', '#111827', '#f97316'),
  lia: portrait('#d8f3e8', '#d8a07c', '#4a2b25', '#136f63', '#f7c59f'),
  marina: portrait('#ead6ff', '#e1a985', '#5a342c', '#7c3aed', '#f0a65a')
} as const

export type AiAvatarKey = keyof typeof aiAvatars
