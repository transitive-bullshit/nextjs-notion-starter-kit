export interface FetchedReport {
  name: string
  date: string
  content: string
}

export interface Entity {
  name: string
  type: 'tool' | 'model' | 'company' | 'framework' | 'concept' | 'other'
  significance: string
  isBreaking: boolean
}

export interface ExtractedData {
  entities: Entity[]
  report: FetchedReport
}

export interface ScoredEntity extends Entity {
  score: number
  reason: string
}

export interface DigestPost {
  title: string
  slug: string
  description: string
  content: string
  tags: string[]
  date: string
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface LLMModel {
  id: string
  object: string
}

export interface LLMModelsResponse {
  data: LLMModel[]
}

export interface DigestConfig {
  llmBaseUrl: string
  llmApiKey: string
  llmModel: string
  notionApiKey: string
  notionDatabaseId: string
  systemPrompt: string
  noveltyThreshold: number
  author: string
}
