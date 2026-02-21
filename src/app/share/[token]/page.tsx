"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { FileItem } from "@/store/fileStore"
import { motion } from "framer-motion"
import { Download, AlertCircle, FileIcon } from "lucide-react"

export default function SharedFilePage() {
    const params = useParams()
    const token = params.token as string

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [fileData, setFileData] = useState<{ file: FileItem, download_url: string } | null>(null)

    useEffect(() => {
        async function fetchSharedFile() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/files/shared/${token}`)
                if (!res.ok) {
                    throw new Error("Invalid or expired link")
                }
                const data = await res.json()
                setFileData(data)
            } catch (err) {
                setError("This link is invalid or has expired.")
            } finally {
                setIsLoading(false)
            }
        }

        if (token) fetchSharedFile()
    }, [token])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error || !fileData) {
        return (
            <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-[#1e1f20] p-8 rounded-2xl shadow-sm text-center max-w-md w-full"
                >
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Access Denied</h1>
                    <p className="text-gray-500 dark:text-gray-400">{error}</p>
                </motion.div>
            </div>
        )
    }

    const { file, download_url } = fileData

    // Helpers to render the file inline based on type
    const isImage = file.type?.includes("jpg") || file.type?.includes("png") || file.type?.includes("svg") || file.type?.includes("image")
    const isVideo = file.type?.includes("mp4") || file.type?.includes("video")
    const isPdfOrText = file.type?.includes("pdf") || file.type?.includes("text")

    return (
        <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#131314] flex flex-col">
            {/* Minimal Header */}
            <header className="h-[64px] bg-white dark:bg-[#1e1f20] border-b border-gray-200 dark:border-[#333] px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <FileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{file.name}</h1>
                        <p className="text-[12px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>

                <a
                    href={download_url}
                    download={file.name}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium rounded-full transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download
                </a>
            </header>

            {/* Preview Area */}
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-5xl w-full h-[calc(100vh-128px)] bg-white dark:bg-[#1e1f20] rounded-2xl shadow-sm overflow-hidden flex items-center justify-center relative">
                    {isImage ? (
                        <img src={download_url} alt={file.name} className="max-w-full max-h-full object-contain" />
                    ) : isVideo ? (
                        <video src={download_url} controls className="max-w-full max-h-full outline-none" />
                    ) : isPdfOrText ? (
                        <iframe src={download_url} className="w-full h-full border-none bg-white" title={file.name} />
                    ) : (
                        <div className="text-center">
                            <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                            <p className="text-gray-500 font-medium">No preview available</p>
                            <a href={download_url} download className="text-blue-600 hover:underline text-sm mt-2 inline-block">Download file directly</a>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
