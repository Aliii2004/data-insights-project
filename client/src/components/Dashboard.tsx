'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Добавляем небольшой таймаут, чтобы браузер точно успел просчитать размеры окна
    const timer = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.stats) setStats(data.stats);
          if (data.distribution) setDistribution(data.distribution);
          setLoading(false);
        })
        .catch(err => {
          console.error("Dashboard fetch error:", err);
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#1f2937', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
        Загрузка данных дашборда...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '24px', width: '100%', color: 'white', marginBottom: '20px' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Database Overview</h2>
      
      {/* Сетка показателей */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#374151', padding: '12px', borderRadius: '8px' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Total Products</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{stats?.totalProducts?.toLocaleString() ?? 0}</p>
        </div>
        <div style={{ backgroundColor: '#374151', padding: '12px', borderRadius: '8px' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Categories</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{stats?.totalCategories ?? 0}</p>
        </div>
        <div style={{ backgroundColor: '#374151', padding: '12px', borderRadius: '8px' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Avg Price</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>${Number(stats?.avgPrice || 0).toFixed(2)}</p>
        </div>
        <div style={{ backgroundColor: '#374151', padding: '12px', borderRadius: '8px' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Total Stock</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{stats?.totalStock?.toLocaleString() ?? 0}</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '12px' }}>Category Distribution</h3>
      
      {/* Контейнер графика с ЖЕСТКОЙ высотой */}
      <div style={{ height: '300px', width: '100%', minHeight: '300px', backgroundColor: '#111827', borderRadius: '8px', padding: '10px' }}>
        {mounted && distribution && distribution.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%" key={distribution.length}>
            <BarChart data={distribution.slice(0, 6)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="category" 
                tick={{ fill: '#9ca3af', fontSize: 11 }} 
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis 
                tick={{ fill: '#9ca3af', fontSize: 11 }} 
                axisLine={{ stroke: '#374151' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontStyle: 'italic' }}>
            {mounted ? "No chart data available" : "Loading chart..."}
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