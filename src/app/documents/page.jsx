'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';


const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default function UploadPDF() {

  const [pdfFiles, setPdfFiles] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);


  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
  
    const validFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        setUploadError(`"${file.name}" is not a PDF file.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError(`"${file.name}" exceeds 10MB size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadError(null);


    setTimeout(() => {
      const newFiles = validFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: (file.size / (1024 * 1024)).toFixed(2), // Size in MB
        uploadedAt: new Date().toISOString(),
      }));

      setPdfFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1000); 
  };

  
  const formatFileSize = (sizeInMB) => {
    return `${sizeInMB} MB`;
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
     
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload PDF</h2>
          
  
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only (Max 10MB each)</p>
              </div>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
                disabled={isUploading}
              />
            </label>
          </div>

          {isUploading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Uploading...</span>
            </div>
          )}

       
          {uploadError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {uploadError}
            </div>
          )}
        </div>

   
        {pdfFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Documents</h2>
            
      
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfFiles.map((file, index) => (
                <Link
                  key={index}
                  href={`/view-pdf?url=${encodeURIComponent(file.url)}`}
                  className="p-3 border rounded-lg flex items-center hover:shadow-md transition-all"
                >
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <DocumentIcon />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 truncate">{file.name}</h3>
                    <p className="text-gray-500 text-xs">
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}