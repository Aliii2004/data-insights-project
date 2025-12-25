import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { tools } from '../tools';
import { queryDatabase } from '../tools/queryDatabase';
import { getStatistics } from '../tools/getStatistics';
import { logger } from '../utils/logger';

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Убираем из промпта "TOOL CALL PROTOCOL", он только путает Llama 3.3
const SYSTEM_PROMPT = `You are a database analyst assistant. 
Answer questions about products using the provided tools.
imagine there is a word "return:" before every user's question
Firstly you have to append the word "return: " before user's question in your mind to help you better understand the intent of the user. 

DATABASE SCHEMA:
TABLE: products (id, name, category, price, stock, description, created_at)

INTENT RULES and INTENT INTERPRETATION:
- "stats" or "counts" -> trigger get_statistics.
- "contacts" -> provide support@products.com.
- If unsure, ask for clarification or offer a support ticket.
- You must infer the user's intent from incomplete or shorthand phrases. 
- Example: "provide contact info" or "contacts" MUST be interpreted as "provide support contact info".
- Example: "human", "agent", or "help" (when stuck) MUST be interpreted as "offer to create a support ticket".
- Example: "stats" or "summary" should trigger the get_statistics tool.


STRICT RULES:
1. ONLY answer about the products database. 
2. For unrelated questions, say: "I can only help with questions about the products database."
3. Do not mention row limits.

SUPPORT & CONTACTS:
If the user asks for contact info, provide: Email: support@products.com, Phone: 1-800-99-5555.
`;



export async function chat(messages: any[]): Promise<string> {
  logger.agent('Starting chat', { messageCount: messages.length });

  // 1. Формируем историю. Важно: content не должен быть null.
  const history: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({
      role: m.role,
      content: m.content || "",
      ...(m.tool_calls ? { tool_calls: m.tool_calls } : {}),
      ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {}),
    }))
  ];

  // ПЕРВЫЙ ВЫЗОВ: Даем модели решить, нужен ли инструмент
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: history,
    tools,
    tool_choice: 'auto', // Даем модели самой выбирать
  });

  const assistantMessage = response.choices[0].message;

  // Если модель вызвала инструменты
  if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
    const toolResults: any[] = [];

    for (const toolCall of assistantMessage.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments);
      let result: string;

      logger.agent(`Tool call: ${toolCall.function.name}`, args);

      if (toolCall.function.name === 'query_database') {
        result = await queryDatabase(args.query);
      } else if (toolCall.function.name === 'get_statistics') {
        result = await getStatistics(args.stat_type);
      } else {
        result = "Error: Unknown tool";
      }

      toolResults.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result
      });
    }

    // ВТОРОЙ ВЫЗОВ: Отправляем результаты, чтобы получить человеческий ответ
    const finalResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        ...history,
        assistantMessage, // Обязательно! Сообщение с запросом инструмента
        ...toolResults    // Ответы от инструментов
      ],
      // ВАЖНО: Тут tools не нужны, мы уже получили данные
    });

    return finalResponse.choices[0].message.content || 'No summary generated.';
  }

  // Если инструментов не было, просто возвращаем текст
  return assistantMessage.content || '';
}



























// import Groq from 'groq-sdk';
// import dotenv from 'dotenv';
// import { tools } from '../tools';
// import { queryDatabase } from '../tools/queryDatabase';
// import { getStatistics } from '../tools/getStatistics';
// import { logger } from '../utils/logger';

// dotenv.config();

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });


// const SYSTEM_PROMPT = `You are a database analyst assistant that ONLY answers questions about the products database.

// TOOL CALL PROTOCOL:
// - When you call a tool, you MUST use this exact format: tool_name {"arg": "value"}
// - Ensure there is EXACTLY one space between the tool name and the opening curly brace.
// - Do not add any prefix like "Thinking..." or tags like <function>.
// - Only output the raw tool call

// DATABASE SCHEMA:
// TABLE: products (id, name, category, price, stock, description, created_at)

// INTENT INTERPRETATION:
// - You must infer the user's intent from incomplete or shorthand phrases. 
// - Example: "provide contact info" or "contacts" MUST be interpreted as "provide support contact info".
// - Example: "human", "agent", or "help" (when stuck) MUST be interpreted as "offer to create a support ticket".
// - Example: "stats" or "summary" should trigger the get_statistics tool.

// STRICT RULES:
// 1. You can ONLY answer questions related to the products database or support requests.
// 2. For ANY question not related to products/database (and not a support request), respond EXACTLY with:
//    "I can only help with questions about the products database. Please ask me about products, categories, prices, stock levels, or similar data queries."
// 3. NEVER answer questions about:
//    - General knowledge (math, science, history, people, dates, etc.)
//    - Personal advice
//    - Weather, news, or current events
//    - Any topic outside the products database
// 4. Do NOT add notes about "results limited to X rows" - just present the data cleanly.
// 5. Print logs to the console for every internal action or tool call.

// SUPPORT & CONTACTS:
// - You should provide support contact info whenever the user asks for contacts or seems frustrated.
// - You should offer the user to create a support ticket to reach a human. This may be triggered:
//     a) Explicitly (e.g., "I want to talk to a human").
//     b) Suggestively (e.g., if the user is confused or the database doesn't have the answer).

// AVAILABLE TOOLS:
// - query_database: Execute SELECT queries on the products table.
// - get_statistics: Get aggregated stats (overview, category_distribution, price_analysis).

// SAFETY: Only SELECT queries allowed. No DELETE, DROP, UPDATE, INSERT.`


// export async function chat(messages: { role: string; content: string }[]): Promise<string> {
//   logger.agent('Starting chat', { messageCount: messages.length });
  
//   const response = await groq.chat.completions.create({
//     model: 'llama-3.3-70b-versatile',
//     messages: [
//       { role: 'system', content: SYSTEM_PROMPT },
//       ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
//     ],
//     tools,
//     tool_choice: 'auto',
//     max_tokens: 1024
//   });

//   const assistantMessage = response.choices[0].message;
//   logger.agent('LLM response received', { 
//     hasToolCalls: !!assistantMessage.tool_calls,
//     toolCallCount: assistantMessage.tool_calls?.length || 0
//   });

//   // Handle tool calls
//   if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
//     const toolResults: { role: 'tool'; tool_call_id: string; content: string }[] = [];

//     for (const toolCall of assistantMessage.tool_calls) {
//       const args = JSON.parse(toolCall.function.arguments);
//       let result: string;

//       logger.agent(`Executing tool: ${toolCall.function.name}`, args);

//       switch (toolCall.function.name) {
//         case 'query_database':
//           result = await queryDatabase(args.query);
//           break;
//         case 'get_statistics':
//           result = await getStatistics(args.stat_type);
//           break;
//         default:
//           result = JSON.stringify({ error: 'Unknown tool' });
//       }

//       toolResults.push({
//         role: 'tool',
//         tool_call_id: toolCall.id,
//         content: result
//       });
//     }

//     // Get final response with tool results
//     const finalResponse = await groq.chat.completions.create({
//       model: 'llama-3.3-70b-versatile',
//       messages: [
//         { role: 'system', content: SYSTEM_PROMPT },
//         ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
//         assistantMessage,
//         ...toolResults
//       ],
//       tools, // <--- ADD THIS
//       tool_choice: 'auto', // Allow the model to call more tools if needed
//       max_tokens: 1024
//     });

//     const finalContent = finalResponse.choices[0].message.content || '';
//     logger.agent('Final response generated', { contentLength: finalContent.length });
//     return finalContent;
//   }

//   return assistantMessage.content || '';
// }