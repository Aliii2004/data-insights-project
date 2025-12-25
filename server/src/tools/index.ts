export const tools = [
  {
    type: "function" as const,
    function: {
      name: "query_database",
      description: "Execute a SELECT query on the products database. Only SELECT queries are allowed. Use this to retrieve specific data based on user questions.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "A valid SQL SELECT query. Example: SELECT name, price FROM products WHERE category = 'Electronics' LIMIT 10"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_statistics",
      description: "Get aggregated statistics about the products database including counts, averages, and distributions. Use this when users ask about overall metrics or summaries.",
      parameters: {
        type: "object",
        properties: {
          stat_type: {
            type: "string",
            enum: ["overview", "category_distribution", "price_analysis"],
            description: "Type of statistics to retrieve"
          }
        },
        required: ["stat_type"]
      }
    }
  }
];