// Путь: app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Системный промпт — задаем ИИ его роль и характер
    const systemPrompt = {
      role: "system",
      content: `Ты — ИИ-модератор приложения MyVille (Алматы). 
      Твоя цель: помогать жителям города. 
      Пиши кратко, по делу, вежливо. 
      Если человек описывает проблему, скажи ему перейти в раздел "Сообщить" (кнопка в меню).`
    };

    // Используем бесплатный эндпоинт Pollinations AI (без API ключей!)
    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Ключ не нужен, но некоторые провайдеры просят любой текст в заголовке
        "Authorization": "Bearer free-model" 
      },
      body: JSON.stringify({
        model: "openai", // Бесплатная базовая модель под капотом
        messages: [systemPrompt, ...messages],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка сети');
    }

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });

  } catch (error) {
    console.error("Ошибка ИИ:", error);
    return NextResponse.json(
      { text: "Извините, сервер перегружен. Попробуйте еще раз чуть позже." }, 
      { status: 500 }
    );
  }
}