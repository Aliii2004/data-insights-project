'use client';

import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Chat from '../components/Chat';
import SampleQueries from '../components/SampleQueries';
import SupportTicket from '../components/SupportTicket';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Data Insights Agent</h1>
          <p className="text-gray-400">Chat with your database using AI</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Dashboard />
            <SampleQueries />
          </div>
          <div className="lg:col-span-2">
            <Chat />
          </div>
        </div>
      </div>
      
      <SupportTicket />
    </main>
  );
}