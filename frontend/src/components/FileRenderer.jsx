import React, { useState, useEffect } from 'react';
import { decryptFile } from '../utils/crypto';

const BACKEND_URL = "http://127.0.0.1:8000";

export default function FileRenderer({ fileUrl, fileName, fileType, iv, isEncrypted, roomKey }) {
  const [decryptedUrl, setDecryptedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let objectUrl = null;

    const processFile = async () => {
      if (!fileUrl) return;

      if (isEncrypted && iv && roomKey) {
        setLoading(true);
        try {
          const response = await fetch(`${BACKEND_URL}${fileUrl}`);
          const encryptedBuffer = await response.arrayBuffer();
          const decryptedBuffer = await decryptFile(encryptedBuffer, iv, roomKey);

          if (decryptedBuffer) {
            const blob = new Blob([decryptedBuffer], { type: fileType });
            objectUrl = URL.createObjectURL(blob);
            setDecryptedUrl(objectUrl);
          }
        } catch (err) {
          console.error("Error decrypting file:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setDecryptedUrl(`${BACKEND_URL}${fileUrl}`);
      }
    };

    processFile();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileUrl, iv, isEncrypted, roomKey, fileType]);

  if (loading) return <div className="text-xs italic text-teal-300">Decrypting file...</div>;
  if (!decryptedUrl) return null;

  const isImage = fileType && fileType.startsWith('image/');

  return (
    <div className="mt-2 border border-teal-700/30 rounded-lg overflow-hidden bg-black/20">
      {isImage ? (
        <img 
          src={decryptedUrl} 
          alt={fileName} 
          className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(decryptedUrl, '_blank')}
        />
      ) : (
        <div className="p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xl">📄</span>
            <span className="text-xs truncate font-medium">{fileName || "Document"}</span>
          </div>
          <a 
            href={decryptedUrl} 
            download={fileName}
            className="bg-teal-600 hover:bg-teal-500 text-white text-[10px] px-3 py-1 rounded-full font-bold transition-colors"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}
