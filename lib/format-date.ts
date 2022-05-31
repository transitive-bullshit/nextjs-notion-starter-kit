export const formatDate = (
  input: string | number
) => new Date(input).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })