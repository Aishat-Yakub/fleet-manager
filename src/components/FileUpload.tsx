'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Upload, FileText, X } from 'lucide-react';
import { saveInspectionFileRecord } from '@/services/inspectionService';

interface FileUploadProps {
  onFileUpload: (fileUrl: string) => void;
  vehicleId: string;
  ownerId: string;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  className?: string;
}

export default function FileUpload({
  onFileUpload,
  vehicleId,
  ownerId,
  acceptedFileTypes = 'image/*,application/pdf',
  maxFileSize = 10,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);

  const handleFileUpload = async (file: File) => {
    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const supabase = createClientComponentClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `inspections/${fileName}`;

      // Upload to inspection_files bucket
      const { error } = await supabase.storage
        .from('inspection_files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('inspection_files')
        .getPublicUrl(filePath);

      // Save file record to database
      try {
        await saveInspectionFileRecord(vehicleId, ownerId, publicUrl);
        console.log('File record saved successfully');
      } catch (dbError) {
        console.error('Failed to save file record to database:', dbError);
        // Don't throw here - the file is still uploaded, just the record isn't saved
        setUploadError('File uploaded but failed to save record to database');
      }

      setUploadedFile({
        name: file.name,
        url: publicUrl
      });

      // Notify parent component
      onFileUpload(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'File upload failed';
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Inspection File
        </CardTitle>
        <CardDescription>
          Upload images or PDFs for vehicle inspection (Max {maxFileSize}MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <div className="space-y-4">
            <input
              id="file-upload"
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {uploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Uploading...</span>
              </div>
            )}
            
            {uploadError && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md">
                {uploadError}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {uploadedFile.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-green-700 text-sm">
              File uploaded successfully!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}