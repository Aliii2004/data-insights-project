'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  avgPrice: number;
  totalStock: number;
  priceRange: { min: number; max: number };
}

interface Distribution {
  category: string;
  count: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [distribution, setDistribution] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // Для исправления ошибки гидратации

  useEffect(() => {
    setMounted(true); // Сообщаем компоненту, что он в браузере
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setDistribution(data.distribution || []); // Защита от пустых данных
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="bg-gray-800 rounded-lg p-6 animate-pulse text-white text-center">Loading Dashboard Data...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Database Overview</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded p-3">
          <p className="text-gray-400 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-white">{stats?.totalProducts ?? 0}</p>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <p className="text-gray-400 text-sm">Categories</p>
          <p className="text-2xl font-bold text-white">{stats?.totalCategories ?? 0}</p>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <p className="text-gray-400 text-sm">Avg Price</p>
          <p className="text-2xl font-bold text-white">${stats?.avgPrice ?? 0}</p>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <p className="text-gray-400 text-sm">Total Stock</p>
          <p className="text-2xl font-bold text-white">{stats?.totalStock ?? 0}</p>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-2 text-white">Category Distribution</h3>
      
      {/* Контейнер с фиксированной высотой */}
      <div className="h-64 w-full min-w-[300px]">
        {mounted && distribution.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution.slice(0, 5)}>
              <XAxis 
                dataKey="category" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                interval={0}
              />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 italic">
            {mounted ? "No data available for chart" : "Preparing chart..."}
          </div>
        )}
      </div>
    </div>
  );
}


// 'use client';

// import { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// interface Stats {
//   totalProducts: number;
//   totalCategories: number;
//   avgPrice: number;
//   totalStock: number;
//   priceRange: { min: number; max: number };
// }

// interface Distribution {
//   category: string;
//   count: number;
// }

// export default function Dashboard() {
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [distribution, setDistribution] = useState<Distribution[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`)
//       .then(res => res.json())
//       .then(data => {
//         setStats(data.stats);
//         setDistribution(data.distribution);
//         setLoading(false);
//       })
//       .catch(console.error);
//   }, []);

//   if (loading) {
//     return <div className="bg-gray-800 rounded-lg p-6 animate-pulse">Loading...</div>;
//   }

//   return (
//     <div className="bg-gray-800 rounded-lg p-6">
//       <h2 className="text-xl font-semibold mb-4">Database Overview</h2>
      
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="bg-gray-700 rounded p-3">
//           <p className="text-gray-400 text-sm">Total Products</p>
//           <p className="text-2xl font-bold">{stats?.totalProducts}</p>
//         </div>
//         <div className="bg-gray-700 rounded p-3">
//           <p className="text-gray-400 text-sm">Categories</p>
//           <p className="text-2xl font-bold">{stats?.totalCategories}</p>
//         </div>
//         <div className="bg-gray-700 rounded p-3">
//           <p className="text-gray-400 text-sm">Avg Price</p>
//           <p className="text-2xl font-bold">${stats?.avgPrice}</p>
//         </div>
//         <div className="bg-gray-700 rounded p-3">
//           <p className="text-gray-400 text-sm">Total Stock</p>
//           <p className="text-2xl font-bold">{stats?.totalStock}</p>
//         </div>
//       </div>

//       <h3 className="text-lg font-medium mb-2">Category Distribution</h3>
//       <div className="h-48">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={distribution.slice(0, 5)}>
//             <XAxis dataKey="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
//             <YAxis tick={{ fill: '#9CA3AF' }} />
//             <Tooltip />
//             <Bar dataKey="count" fill="#3B82F6" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }