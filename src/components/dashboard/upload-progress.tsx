"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, X, CheckCircle2, FileImage, FileText, Loader2 } from "lucide-react"
import { useUploadStore, UploadItem } from "@/store/uploadStore"
import { cn } from "@/lib/utils"

export function UploadProgress() {
    const {
        uploads,
        isOpen,
        isMinimized,
        setIsOpen,
        toggleMinimized,
        clearCompleted
    } = useUploadStore()

    if (!isOpen) return null;

    const uploadingCount = uploads.filter(u => u.status === 'uploading').length;
    const completedCount = uploads.filter(u => u.status === 'completed').length;

    // Determine header text
    let headerText = "";
    if (uploadingCount > 0) {
        headerText = `Uploading ${uploadingCount} item${uploadingCount > 1 ? 's' : ''}`;
    } else if (completedCount > 0) {
        headerText = `${completedCount} upload${completedCount > 1 ? 's' : ''} complete`;
    } else {
        headerText = "Uploads";
    }

    const handleClose = () => {
        setIsOpen(false);
        clearCompleted();
    }

    return (
        <div className="fixed bottom-6 right-6 w-[360px] bg-white dark:bg-[#282a2c] rounded-t-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-[#e0e0e0] dark:border-[#444746] overflow-hidden z-50 flex flex-col font-sans">
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#282a2c] cursor-pointer"
                onClick={toggleMinimized}
            >
                <span className="text-[15px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
                    {headerText}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        className="p-1.5 hover:bg-[#f3f3f3] dark:hover:bg-[#444746] rounded-full transition-colors text-[#444746] dark:text-[#c4c7c5]"
                        onClick={(e) => { e.stopPropagation(); toggleMinimized(); }}
                    >
                        {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                    <button
                        className="p-1.5 hover:bg-[#f3f3f3] dark:hover:bg-[#444746] rounded-full transition-colors text-[#444746] dark:text-[#c4c7c5]"
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* List */}
            {!isMinimized && (
                <div className="max-h-[320px] overflow-y-auto bg-white dark:bg-[#282a2c] border-t border-[#f0f0f0] dark:border-[#444746]">
                    {uploads.map((upload) => (
                        <UploadRow key={upload.id} upload={upload} />
                    ))}
                </div>
            )}
        </div>
    )
}

function UploadRow({ upload }: { upload: UploadItem }) {
    // A simple filename truncation helper: "very-long-file-name.jpg" -> "very-long...name.jpg"
    const truncateName = (name: string) => {
        if (name.length <= 30) return name;
        const extension = name.split('.').pop();
        const main = name.substring(0, name.lastIndexOf('.'));
        if (!extension || main.length < 15) return name.substring(0, 27) + '...';
        return `${main.substring(0, 15)}...${main.substring(main.length - 8)}.${extension}`;
    }

    return (
        <div className="flex items-center gap-4 px-4 py-3 hover:bg-[#f9fafd] dark:hover:bg-[#333333] transition-colors border-b border-[#f0f0f0] dark:border-[#444746] last:border-b-0">
            {/* Icon indicating file type */}
            <div className="flex bg-[#ea4335] shrink-0 h-8 w-8 items-center justify-center rounded-[4px]">
                {/* For generic image mimicking the red icon from screenshot */}
                <FileImage className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[14px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3] truncate">
                    {truncateName(upload.name)}
                </span>
                {upload.status === 'uploading' && (
                    <div className="flex items-center gap-4 mt-[2px]">
                        <span className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] font-medium">
                            Starting upload...
                        </span>
                        <button className="text-[12px] font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:bg-[#0b57d0]/10 px-1.5 py-0.5 rounded transition-colors">
                            Cancel
                        </button>
                    </div>
                )}
                {upload.status === 'error' && (
                    <span className="text-[12px] text-red-600 dark:text-red-400 mt-1">
                        Upload failed
                    </span>
                )}
            </div>

            {/* Status indicator */}
            <div className="shrink-0 flex items-center justify-center w-6 h-6">
                {upload.status === 'uploading' && (
                    <div className="relative w-5 h-5">
                        {/* SVG ring for progress */}
                        <svg className="w-5 h-5 transform -rotate-90">
                            <circle
                                cx="10"
                                cy="10"
                                r="8"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                className="text-[#e0e0e0] dark:text-[#444746]"
                            />
                            <circle
                                cx="10"
                                cy="10"
                                r="8"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="50.2"
                                strokeDashoffset={50.2 - (upload.progress / 100) * 50.2}
                                className="text-[#0b57d0] dark:text-[#a8c7fa] transition-all duration-300"
                            />
                        </svg>
                    </div>
                )}
                {upload.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-[#34a853] fill-[#34a853]" />
                )}
            </div>
        </div>
    )
}
