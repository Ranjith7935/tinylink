'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Copy, Calendar, MousePointerClick } from 'lucide-react';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code;
  
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (code) {
      fetchLink();
    }
  }, [code]);

  const fetchLink = async () => {
    try {
      const res = await fetch(`/api/links/${code}`);
      
      if (!res.ok) {
        throw new Error('Link not found');
      }
      
      const data = await res.json();
      setLink(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h2>
          <p className="text-gray-600 mb-6">The short link you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/${link.code}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Link Statistics</h1>
              <p className="text-sm text-gray-600 mt-1">Detailed analytics for your short link</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Short URL</h2>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <code className="text-indigo-600 font-mono text-lg flex-1 break-all">
              {shortUrl}
            </code>
            <button
              onClick={() => copyToClipboard(shortUrl)}
              className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors flex-shrink-0"
              title="Copy to clipboard"
            >
              {copied ? '✓' : <Copy size={18} />}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Target URL</h2>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-700 flex-1 break-all">{link.url}</span>
            
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 flex-shrink-0"
              title="Visit URL"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MousePointerClick className="text-blue-600" size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{link.clicks}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Created</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(link.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(link.created_at).toLocaleTimeString()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Last Clicked</h3>
            </div>
            {link.last_clicked ? (
              <>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(link.last_clicked).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(link.last_clicked).toLocaleTimeString()}
                </p>
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-500">Never</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Short Code</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <code className="text-2xl font-mono font-bold text-indigo-600">
              {link.code}
            </code>
          </div>
        </div>
      </main>
    </div>
  );
}