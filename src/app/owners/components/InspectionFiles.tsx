import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, FileIcon, X } from 'lucide-react';
import { useInspectionFiles } from '../hooks/useInspectionFiles';
interface InspectionFilesProps {
  ownerId: string;
}

export const InspectionFiles = ({ ownerId }: InspectionFilesProps) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vehicleId, setVehicleId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    inspectionFiles,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    uploadInspectionFile,
    deleteInspectionFile,
  } = useInspectionFiles(ownerId);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !vehicleId) return;

    try {
      await uploadInspectionFile(selectedFile, vehicleId);
      setSelectedFile(null);
      setVehicleId('');
      setShowUploadForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };



  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Vehicle Inspection Files</CardTitle>
            <CardDescription>
              Upload and manage your vehicle inspection documents
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-1"
          >
            {showUploadForm ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload File
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showUploadForm && (
          <form onSubmit={handleUpload} className="space-y-4 mb-6 p-4 border rounded-lg bg-slate-50">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle ID</Label>
                <Input
                  id="vehicleId"
                  type="text"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  placeholder="Enter vehicle ID"
                  required
                  className="bg-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Inspection File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="cursor-pointer bg-transparent"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    required
                  />
                </div>
                {selectedFile && (
                  <div className="mt-2 text-sm text-sky-700">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                  disabled={isUploading}
                  className="text-sky-950 hover:text-sky-900"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!selectedFile || !vehicleId || isUploading}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-sky-950 mb-4">
            Inspection Files
          </h3>

          {isLoading && !inspectionFiles.length ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : inspectionFiles.length === 0 ? (
            <div className="text-center py-8 text-sky-950">
              No inspection files found.
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-sky-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-sky-950 sm:pl-6">
                      File
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-sky-950">
                      Vehicle
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-sky-950">
                      Uploaded
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-sky-950">
                      Size
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {inspectionFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-sky-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-sky-950 sm:pl-6">
                        <div className="flex items-center">
                          <FileIcon className="h-5 w-5 flex-shrink-0 text-sky-700 mr-2" />
                          <span>{file.file_url ? file.file_url.split('/').pop() : 'File'}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-sky-900">
                        {file.vehicle_id ? `Vehicle #${file.vehicle_id}` : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-sky-900">
                        {file.created_at ? new Date(file.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-sky-900">
                        {/* Size is not available from backend, so show N/A or blank */}
                        N/A
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a 
                          href={file.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sky-700 hover:text-sky-900 mr-4 font-medium hover:underline"
                        >
                          View
                        </a>
                        <button
                          className="text-red-600 hover:text-red-800 font-medium hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
