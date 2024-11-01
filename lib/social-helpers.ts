export function getLinkedInURLFromInput(userOrCompany: string): string {
  if (userOrCompany.startsWith('company/')) {
    return `https://www.linkedin.com/${userOrCompany}`
  }

  return `https://www.linkedin.com/in/${userOrCompany}`
}
