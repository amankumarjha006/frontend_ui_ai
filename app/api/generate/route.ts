import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert frontend developer specializing in creating beautiful, modern web interfaces. Generate complete, working HTML code with embedded CSS and JavaScript.

CRITICAL RULES:
1. Return ONLY raw HTML code - no markdown, no code blocks, no explanations, no \`\`\`html tags
2. Start directly with <!DOCTYPE html>
3. Include all CSS in a <style> tag in the <head>
4. Include all JavaScript in a <script> tag before </body>
5. Create modern, beautiful, visually stunning designs
6. Use smooth animations and transitions
7. Make designs fully responsive
8. Use attractive color schemes (gradients, shadows, glassmorphism, etc.)
9. The code must be completely self-contained and work in an iframe
10. Do NOT use any external libraries or CDN links
11. Do NOT include any text before or after the HTML code
12. Ensure proper HTML structure with doctype, html, head, and body tags

Design Guidelines:
- Use modern CSS features (flexbox, grid, custom properties, animations)
- Include hover effects and micro-interactions
- Use professional color palettes
- Add subtle shadows and depth
- Ensure good contrast and readability
- Make interactive elements feel responsive`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Add OPENROUTER_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AI UI Generator'
      },
      body: JSON.stringify({
        model: 'kwaipilot/kat-coder-pro:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Create the following UI component/page: ${prompt}` }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      console.error('OpenRouter API Error:', errorData);
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    let code = data.choices?.[0]?.message?.content || '';

    // Clean up any markdown formatting that might have slipped through
    code = code
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .replace(/^```[\w]*\n/gm, '')
      .replace(/```$/gm, '')
      .trim();

    // If the response doesn't start with DOCTYPE or html, wrap it
    if (!code.toLowerCase().startsWith('<!doctype') && !code.toLowerCase().startsWith('<html')) {
      // Check if it's a partial HTML (like just a component)
      if (code.includes('<') && code.includes('>')) {
        code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated UI</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  </style>
</head>
<body>
${code}
</body>
</html>`;
      } else {
        // If it's not HTML at all, return an error
        return NextResponse.json(
          { error: 'Failed to generate valid HTML code. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ code });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate code' },
      { status: 500 }
    );
  }
}