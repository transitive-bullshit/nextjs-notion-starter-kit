export const formatDate = (
  input: string | number
) => new Date(input).toLocaleDateString('zh', { year: 'numeric', month: 'short', day: 'numeric' })