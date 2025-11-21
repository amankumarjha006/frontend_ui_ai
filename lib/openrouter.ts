import { Message } from '@/types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function generateCode(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const systemPrompt = `You are an expert frontend developer. Generate complete, working HTML code with embedded CSS and JavaScript based on the user's request.

Rules:
- Return ONLY the HTML code, no explanations or markdown code blocks
- Include all CSS in a <style> tag in the head
- Include all JavaScript in a <script> tag before closing body
- Make the design modern, beautiful, and visually appealing
- Use a nice color scheme and proper spacing
- The code must be self-contained and work in an iframe
- Do not use external dependencies unless absolutely necessary
- Always start with <!DOCTYPE html>
- Make it responsive when possible`;

  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'AI Code Generator'
    },
    body: JSON.stringify({
      model: 'kwaipilot/kat-coder-pro:free',
      messages,
      max_tokens: 4000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to generate code');
  }

  const data = await response.json();
  let code = data.choices?.[0]?.message?.content || '';

  // Clean up markdown code blocks if present
  code = code.replace(/```html\n?/gi, '').replace(/```\n?/g, '').trim();

  // Ensure proper HTML structure
  if (!code.toLowerCase().startsWith('<!doctype html>')) {
    code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
</head>
<body>
${code}
</body>
</html>`;
  }

  return code;
}