"use client"

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function TestSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    console.log('=== SUCCESS PAGE DEBUG ===');
    console.log('Page loaded at:', new Date().toISOString());
    console.log('Full URL:', window.location.href);
    console.log('Session ID:', sessionId);
    console.log('Search params:', searchParams.toString());
    console.log('=== END DEBUG ===');
  }, [sessionId, searchParams]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>🎉 Payment Success Test Page</h1>
      <p>Session ID: {sessionId || 'No session ID found'}</p>
      <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
      <p>Time: {new Date().toLocaleString()}</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/myOrder" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          View My Orders
        </a>
      </div>
    </div>
  );
}

export default TestSuccessPage;