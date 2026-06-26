import { useState, useRef, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

export default function DropZone({ onFileContent }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    []
  );

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) readFile(file);
  };

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof onFileContent === 'function') onFileContent(reader.result);
    };
    reader.readAsText(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed
        cursor-pointer transition-all duration-200
        ${dragging
          ? 'border-indigo-500 bg-indigo-500/5'
          : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900/50'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,.csv"
        className="hidden"
        onChange={handleChange}
      />
      {dragging ? (
        <FileText className="w-10 h-10 text-indigo-400" />
      ) : (
        <Upload className="w-10 h-10 text-zinc-500" />
      )}
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-300">
          {dragging ? 'Drop your file here' : 'Upload a resume file'}
        </p>
        <p className="text-xs text-zinc-500 mt-1">Drag & drop or click to browse (.txt, .md, .csv)</p>
      </div>
    </div>
  );
}
