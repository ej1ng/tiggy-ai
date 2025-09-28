import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { UploadCloudIcon, FileTextIcon } from './Icons';

// Set the worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

interface FileUploadProps {
  onDocumentLoad: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDocumentLoad }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setIsParsing(true);
      setError(null);
      setFileName(file.name);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const pageTexts: string[] = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
            pageTexts.push(pageText);
          }
          
          const fullText = pageTexts.join('\n\n');
          onDocumentLoad(fullText);

        } catch (parseError) {
          console.error('Error parsing PDF:', parseError);
          setError('Failed to parse the PDF file.');
          setFileName(null);
        } finally {
          setIsParsing(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        setFileName(null);
        setIsParsing(false);
      };
    } else {
      setError('Unsupported file type. Please upload a .pdf file.');
      setFileName(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full transition-shadow duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <UploadCloudIcon className="w-6 h-6 mr-3 text-blue-500" />
        Load Your Study Material
      </h2>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isParsing}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer text-blue-600 dark:text-blue-400 font-semibold ${isParsing ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-800 dark:hover:text-blue-300'}`}
        >
          {isParsing ? 'Parsing PDF...' : (fileName ? 'Choose a different file' : 'Choose a .pdf file')}
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Upload your notes to start asking questions.
        </p>
      </div>
       {isParsing && (
         <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Processing document...</span>
        </div>
      )}
      {fileName && !isParsing && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg flex items-center">
          <FileTextIcon className="w-5 h-5 mr-3 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200 truncate">{fileName}</span>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;