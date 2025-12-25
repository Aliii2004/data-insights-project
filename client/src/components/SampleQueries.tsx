'use client';

interface SampleQueriesProps {
  onQueryClick?: (query: string) => void;
}

const sampleQueries = [
  "What are the top 5 most expensive products?",
  "How many products are in each category?",
  "Show me products with stock below 20",
  "What's the average price by category?",
  "Find all Electronics under $100"
];

export default function SampleQueries({ onQueryClick }: SampleQueriesProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Sample Queries</h2>
      <div className="space-y-2">
        {sampleQueries.map((query, i) => (
          <button
            key={i}
            onClick={() => onQueryClick?.(query)}
            className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 text-sm transition-colors"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}