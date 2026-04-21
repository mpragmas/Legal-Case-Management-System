import { useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { FileText, Upload, Calendar, Trash2, Download, ExternalLink, X, AlertTriangle } from "lucide-react";
import { api } from "../services/api";

export function DocumentList({ documents, caseId, showUpload = false }) {
  const { uploadDocument, getLawyerById, getClientById, cases, refreshData, addToast } = useApp();
  const fileInputRef = useRef(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !caseId) return;
    await uploadDocument(caseId, file.name, `${(file.size / 1024).toFixed(0)} KB`, file);
    e.target.value = "";
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return "#";
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    return `http://localhost:5000/${cleanPath}`;
  };

  const handleDownload = async (doc) => {
    try {
      await api.downloadDocument(doc.id, doc.name, doc.filePath);
    } catch {
      addToast("Download failed — file not found on server", "error");
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await api.deleteDocument(id);
      refreshData();
      addToast("Document deleted", "info");
    } catch {
      addToast("Failed to delete document", "error");
    }
    setConfirmDeleteId(null);
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
            const uploader = getLawyerById(doc.uploadedBy) || getClientById(doc.uploadedBy);
            const isConfirmingDelete = confirmDeleteId === doc.id;

            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-surface-200 hover:border-primary-200 transition-colors group"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                  <FileText size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{doc.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-surface-400">
                    <span className="font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                      {cases.find((c) => c.id === doc.caseId)?.title || "Unknown Case"}
                    </span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>By: {uploader?.name || "Unknown"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col items-end gap-1 text-xs text-surface-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                    <span>{doc.size}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={getFileUrl(doc.filePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-surface-400 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all"
                      title="View Document"
                    >
                      <ExternalLink size={16} />
                    </a>

                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-surface-400 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all"
                      title="Download Document"
                    >
                      <Download size={16} />
                    </button>

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                        <AlertTriangle size={13} className="text-red-500 shrink-0" />
                        <span className="text-xs font-semibold text-red-700 whitespace-nowrap">Delete?</span>
                        <button
                          onClick={() => handleDeleteConfirm(doc.id)}
                          className="ml-1 px-2 py-0.5 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-0.5 text-red-400 hover:text-red-600 rounded transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(doc.id)}
                        className="p-2 text-surface-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
