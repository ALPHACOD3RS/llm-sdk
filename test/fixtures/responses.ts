export const openAiChatCompletion = {
  id: "chatcmpl-test",
  choices: [{ message: { role: "assistant", content: "hello" }, finish_reason: "stop" }],
  usage: { prompt_tokens: 10, completion_tokens: 2 },
};

export const anthropicMessage = {
  id: "msg_test",
  content: [{ type: "text", text: "hello" }],
  usage: { input_tokens: 10, output_tokens: 2 },
  stop_reason: "end_turn",
};

export const openAiToolCall = {
  id: "chatcmpl-test",
  choices: [
    {
      message: {
        role: "assistant",
        content: null,
        tool_calls: [
          {
            id: "call_1",
            type: "function",
            function: { name: "getWeather", arguments: '{"city":"Addis Ababa"}' },
          },
        ],
      },
      finish_reason: "tool_calls",
    },
  ],
  usage: { prompt_tokens: 12, completion_tokens: 5 },
};

export const anthropicToolUse = {
  id: "msg_test",
  content: [
    { type: "text", text: "Let me check." },
    { type: "tool_use", id: "toolu_1", name: "getWeather", input: { city: "Addis Ababa" } },
  ],
  usage: { input_tokens: 12, output_tokens: 5 },
  stop_reason: "tool_use",
};

export const openAiContentFilter = {
  id: "chatcmpl-test",
  choices: [{ message: { role: "assistant", content: null }, finish_reason: "content_filter" }],
  usage: { prompt_tokens: 10, completion_tokens: 0 },
};

export const anthropicRefusal = {
  id: "msg_test",
  content: [{ type: "text", text: "" }],
  usage: { input_tokens: 10, output_tokens: 0 },
  stop_reason: "refusal",
};
