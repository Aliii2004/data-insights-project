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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setDistribution(data.distribution);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="bg-gray-800 rounded-lg p-6 animate-pulse">Loading...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Database Overview</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded p-3">
          <p className="text-gray-400 text-sm">Total Products</p>
          <p className="text-2xl font-bold">{stats?.totalProducts}</p>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <p className="text-gray-400 text-sm">Categories</p>
          <p className="text-2xl font-bold">{stats?.totalCategories}</p>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <p className="text-gray-400 text-sm">Avg Price</p>
          <p className="text-2xl font-bold">${stats?.avgPrice}</p>
        </div>
        <div className="bg-gray-700 rounded p-3">
          <p className="text-gray-400 text-sm">Total Stock</p>
          <p className="text-2xl font-bold">{stats?.totalStock}</p>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-2">Category Distribution</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution.slice(0, 5)}>
            <XAxis dataKey="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}