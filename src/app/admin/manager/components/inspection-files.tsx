'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, FileImage, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { InspectionFileRecord, getInspectionFileRecords } from '@/services/inspectionService';

export default function InspectionFiles() {
  const [files, setFiles] = useState<InspectionFileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      console.log('InspectionFiles: Starting to fetch files...');
      setLoading(true);
      setError(null);
      const data = await getInspectionFileRecords();
      console.log('InspectionFiles: Received files data:', data);
      setFiles(data);
    } catch (error) {
      console.error('InspectionFiles: Error fetching inspection files:', error);
      setError(`Failed to load inspection files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const getFileIcon = (fileUrl: string) => {
    if (fileUrl.toLowerCase().includes('.pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <FileImage className="h-5 w-5 text-blue-500" />;
  };

  const getFileNameFromUrl = (fileUrl: string) => {
    const urlParts = fileUrl.split('/');
    return urlParts[urlParts.length - 1] || 'Unknown File';
  };

  const isValidUrl = (fileUrl: string) => {
    return fileUrl && fileUrl.startsWith('http') && fileUrl !== '/';
  };

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center text-sky-950 gap-2">
            <FileImage className="h-5 w-5" />
            <span className="text-lg sm:text-xl">Inspection Files</span>
          </div>
          <Button
            onClick={fetchFiles}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 bg-sky-800 hover:bg-sky-900 text-white w-full sm:w-auto"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-3 border-blue-600"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">Loading inspection files...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg mb-4 sm:mb-6">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && files.length === 0 && (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-full p-4 sm:p-6">
                <FileImage className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No Inspection Files</h3>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              There are no inspection files available at the moment. Check back later or refresh to see new files.
            </p>
          </div>
        )}

        {!loading && !error && files.length > 0 && (
          <div className="space-y-4 rounded-2xl">
            {files.map((file) => (
              <div key={file.id} className="border border-sky-900 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* File Info Section */}
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                      {getFileIcon(file.file_url)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words pr-2">
                        {getFileNameFromUrl(file.file_url)}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500 mt-2">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-sky-700">Vehicle:</span>
                          <span className="truncate max-w-[100px] sm:max-w-none">{file.vehicle_id}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-sky-700">Owner:</span>
                          <span className="truncate max-w-[100px] sm:max-w-none">{file.owner_id}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-sky-700">Date:</span>
                          <span>{new Date(file.created_at || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons Section */}
                  <div className="flex-shrink-0">
                    {isValidUrl(file.file_url) && (
                      <Button
                        onClick={() => window.open(file.file_url, '_blank')}
                        variant="outline"
                        size="sm"
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white space-x-1 sm:space-x-2 w-full sm:w-auto justify-center min-h-[36px] sm:min-h-[32px] px-3 sm:px-4 touch-manipulation"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">View File</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
