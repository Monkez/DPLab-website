export const lines = (value: string) => value.split('\n').map(item => item.trim()).filter(Boolean)
