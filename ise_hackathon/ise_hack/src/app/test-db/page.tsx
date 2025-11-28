// app/test-db/page.tsx
import { supabase } from '@/lib/supabase';

export default async function TestDB() {
  let status = 'Loading...';
  let data = null;
  let error = null;

  try {
    // Test 1: Check tables exist
    const { data: logs, error: logError } = await supabase
      .from('posture_logs')
      .select('count')
      .limit(1);

    // Test 2: Check settings table
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('count')
      .limit(1);

    if (logError || settingsError) {
      error = logError || settingsError;
    } else {
      status = '✅ Connected!';
      data = {
        posture_logs: logs?.count || 0,
        settings: settings?.count || 0
      };
    }
  } catch (err) {
    error = err as Error;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase DB Test</h1>
      
      <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
        <div>
          <strong>Status:</strong> 
          <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
            status === '✅ Connected!' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        </div>
        
        {data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>Posture Logs: <span className="font-bold">{data.posture_logs}</span></div>
            <div>Settings: <span className="font-bold">{data.settings}</span></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border rounded">
        <p>Visit: <code>/test-db</code></p>
      </div>
    </div>
  );
}
