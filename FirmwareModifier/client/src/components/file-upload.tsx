import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onRemoveFile: () => void;
}

export function FileUpload({ onFileUpload, uploadedFile, onRemoveFile }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.bin', '.hex', '.fw'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Upload className="text-primary text-lg" />
        <h2 className="text-lg font-semibold text-gray-900">1. Upload do Firmware Original</h2>
      </div>
      
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="text-gray-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 font-medium">
                {isDragActive 
                  ? "Solte o arquivo aqui..." 
                  : "Arraste o arquivo aqui ou clique para selecionar"
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">Suporte: .bin, .hex, .fw (máx. 50MB)</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              Selecionar Arquivo
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FileCheck className="text-blue-500" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">{uploadedFile.name}</p>
              <p className="text-sm text-blue-600">{formatFileSize(uploadedFile.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveFile}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
