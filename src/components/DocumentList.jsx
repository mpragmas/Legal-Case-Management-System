import { useRef } from "react";
import { useApp } from "../context/AppContext";
import { FileText, Upload, Calendar } from "lucide-react";

export function DocumentList({ documents, caseId, showUpload = false }) {
  const { uploadDocument, getLawyerById, getClientById, cases } = useApp();
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !caseId) return;
    await uploadDocument(caseId, file.name, `${(file.size / 1024).toFixed(0)} KB`, file);
    e.target.value = "";
  };

  return (
    <div>
      {showUpload && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            id="upload-document"
            onClick={() => fileInputRef.current?.click()}
            className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors active:scale-[0.98] cursor-pointer shadow-sm shadow-primary-600/20"
          >
            <Upload size={16} />
            Upload Document
          </button>
        </>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-12 text-surface-400">
          <FileText size={40} className="mx-auto mb-3 text-surface-300" />
          <p className="text-sm">No documents yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const uploader =
              getLawyerById(doc.uploadedBy) || getClientById(doc.uploadedBy);
            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-surface-200 hover:border-primary-200 transition-colors group"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-surface-400">
                    <span className="font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                      {cases.find((c) => c.id === doc.caseId)?.title || "Unknown Case"}
                    </span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>Uploaded by: {uploader?.name || "Unknown"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-surface-400 shrink-0">
                  <Calendar size={12} />
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
