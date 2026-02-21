"use client"

import { useFileStore } from "@/store/fileStore"
import { X, ExternalLink, Loader2, AudioLines } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FilePreviewModal() {
    const { activePreviewFile, previewUrl, closePreview } = useFileStore()

    if (!activePreviewFile) return null;

    const renderPreviewContent = () => {
        if (!previewUrl) {
            return (
                <div className="flex flex-col items-center justify-center flex-1 h-full text-white">
                    <Loader2 className="h-10 w-10 animate-spin mb-4" />
                    <p className="text-sm">Loading secure preview...</p>
                </div>
            )
        }

        const type = activePreviewFile.type;

        if (type.includes("pdf") || type.includes("text")) {
            return (
                <iframe
                    src={previewUrl}
                    title={activePreviewFile.name}
                    className="w-full h-full bg-white border-0"
                />
            )
        }

        if (type.includes("jpg") || type.includes("png") || type.includes("webp") || type.includes("svg") || type.includes("image")) {
            return (
                <div className="flex items-center justify-center w-full h-full p-8">
                    <img
                        src={previewUrl}
                        alt={activePreviewFile.name}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm"
                    />
                </div>
            )
        }

        if (type.includes("mp4") || type.includes("video")) {
            return (
                <div className="flex items-center justify-center w-full h-full p-8 bg-black">
                    <video
                        src={previewUrl}
                        controls
                        autoPlay
                        className="max-w-full max-h-full outline-none"
                    />
                </div>
            )
        }

        if (type.includes("mp3") || type.includes("audio")) {
            return (
                <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-black/50">
                    <div className="w-32 h-32 mb-8 bg-white/10 rounded-full flex items-center justify-center">
                        <AudioLines className="w-16 h-16 text-white" />
                    </div>
                    <audio
                        src={previewUrl}
                        controls
                        autoPlay
                        className="w-full max-w-md outline-none"
                    />
                </div>
            )
        }

        return (
            <div className="flex flex-col items-center justify-center flex-1 h-full text-white">
                <div className="w-[124px] h-[124px] mb-4 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-[48px]">🗂️</span>
                </div>
                <h3 className="text-[20px] font-medium mb-2">No preview available</h3>
                <p className="text-sm text-white/70 mb-6">This file type cannot be previewed natively.</p>
                <a
                    href={previewUrl}
                    download
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-full text-sm font-medium transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                    Download File Instead
                </a>
            </div>
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
            >
                {/* Header Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="text-white font-medium text-[16px]">
                            {activePreviewFile.name}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {previewUrl && (
                            <a
                                href={previewUrl}
                                download
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center"
                                title="Download"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        )}
                        <button
                            onClick={closePreview}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden relative">
                    {renderPreviewContent()}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
