const KEY = 'poop-dodge:nickname'

export function getSavedNickname(): string {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveNickname(nickname: string): void {
  try {
    localStorage.setItem(KEY, nickname)
  } catch {
    // ignore
  }
}
