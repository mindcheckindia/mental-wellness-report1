
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type PostgrestSingleResponse } from '@supabase/supabase-js';
import type { IndividualData } from './_lib/types.ts';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or service key is not defined in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define a type for the 'reports' table row to avoid deep type instantiation
// on the 'data' JSONB column. By setting 'data' to 'any', we prevent TypeScript
// from recursively analyzing the complex 'IndividualData' type during the query.
interface ReportRow {
  submissionId: string;
  createdAt: string;
  data: any;
}


export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    return response.status(405).end('Method Not Allowed');
  }

  const { id } = request.query;

  if (!id || typeof id !== 'string') {
    return response.status(400).json({ error: 'Submission ID is required.' });
  }

  try {
    const { data: report, error }: PostgrestSingleResponse<ReportRow> = await supabase
      .from('reports')
      .select('*')
      .eq('submissionId', id)
      .single();

    if (error) {
      // The .single() method returns an error if multiple rows are found.
      // We treat this as "not found" since a unique ID should only ever match one row.
      if (error.code === 'PGRST116') {
        console.error('Multiple reports found for submission ID:', id);
        return response.status(404).json({ error: `Report with Submission ID "${id}" not found.` });
      }
      console.error('Supabase query error:', error);
      return response.status(500).json({ error: 'Database query failed.' });
    }

    if (!report) {
      console.error('No report found for submission ID:', id);
      return response.status(404).json({ error: `Report with Submission ID "${id}" not found.` });
    }
    
    // The report payload is the 'data' property of the returned record.
    const reportPayload = report.data as IndividualData;

    const responseBody = JSON.stringify(reportPayload);

    response.setHeader('Content-Type', 'application/json');
    response.writeHead(200);
    response.end(responseBody);
    return;

  } catch (e: any) {
    console.error('Unexpected error fetching report:', e);
    return response.status(500).json({ error: 'An internal server error occurred.' });
  }
}