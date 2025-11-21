export interface GenerateRequest {
  prompt: string;
}

export interface GenerateResponse {
  code: string;
  error?: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}