"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  Download,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import uploadToCloudinary from "@/app/utils/uploadToCloudinary";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DocumentSection = ({ userId }) => {
  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Document Types
  const docTypes = [
    { key: "idDocument", label: "ID / Passport" },
    { key: "jobReference", label: "Job Reference" },
    { key: "bankStatement", label: "Bank Statement" },
    { key: "nextOfKin", label: "Next of Kin" },
    { key: "landlordReference", label: "Landlord Reference" },
    { key: "niNumber", label: "NI Number" },
  ];

  // ✅ Fetch user documents
  const fetchDocs = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`);
      const data = await res.json();
      setDocuments(data.user.documents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // ✅ Handle Upload Click
  const handleUploadClick = (type) => {
    setSelectedType(type);
    fileInputRef.current.click();
  };

  // ✅ Handle File Select
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedType) return;

    try {
      setLoading(true);

      // 🔥 Upload to Cloudinary
      const uploaded = await uploadToCloudinary(file);

      // 🔥 Save in DB
      await fetch(`${API_URL}/users/upload-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          type: selectedType,
          fileUrl: uploaded.url,
        }),
      });

      await fetchDocs();

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  if (!documents) return <p>Loading...</p>;

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6">
        Documents & Verification
      </h3>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-4">
        {docTypes.map((docType) => {
          const doc = documents[docType.key];

          return (
            <div
              key={docType.key}
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <FileText size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {docType.label}
                  </p>

                  {/* STATUS */}
                  <div className="text-xs mt-1">
                    {doc.status === "approved" && (
                      <span className="text-green-500 font-semibold">
                        ✔ Approved
                      </span>
                    )}

                    {doc.status === "pending" && (
                      <span className="text-orange-500 font-semibold">
                        ⏳ Pending
                      </span>
                    )}

                    {doc.status === "rejected" && (
                      <span className="text-red-500 font-semibold">
                        ❌ Rejected (Re-upload required)
                      </span>
                    )}

                    {doc.status === "not_uploaded" && (
                      <span className="text-gray-400">
                        Not uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* ICON */}
                {doc.status === "approved" && (
                  <CheckCircle2 size={18} className="text-green-500" />
                )}
                {doc.status === "pending" && (
                  <Clock size={18} className="text-orange-400" />
                )}
                {doc.status === "rejected" && (
                  <XCircle size={18} className="text-red-500" />
                )}

                {/* DOWNLOAD */}
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-orange-600"
                  >
                    <Download size={18} />
                  </a>
                )}

                {/* UPLOAD BUTTON */}
                {(doc.status === "not_uploaded" ||
                  doc.status === "rejected") && (
                  <button
                    onClick={() => handleUploadClick(docType.key)}
                    className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DocumentSection;