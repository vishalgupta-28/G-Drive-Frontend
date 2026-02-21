"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { FileItem } from "@/store/fileStore"
import { motion } from "framer-motion"
import { Download, AlertCircle, FileIcon, AudioLines } from "lucide-react"

export default function SharedFilePage() {
    const params = useParams()
    const token = params.token as string

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [fileData, setFileData] = useState<{ file: FileItem, download_url: string, preview_url: string } | null>(null)

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
                    className="bg-white dark:bg-[#1e1f20] p-8 rounded-2xl shadow-sm text-center max-w-md w-full mx-4"
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

    const { file, download_url, preview_url } = fileData

    // Helpers to render the file inline based on type
    const isImage = file.type?.includes("jpg") || file.type?.includes("png") || file.type?.includes("webp") || file.type?.includes("svg") || file.type?.includes("image")
    const isVideo = file.type?.includes("mp4") || file.type?.includes("video")
    const isAudio = file.type?.includes("mp3") || file.type?.includes("audio")
    const isPdfOrText = file.type?.includes("pdf") || file.type?.includes("text")

    return (

        <main className="h-screen flex w-full p-0 sm:p-4 md:p-6 lg:p-8 bg-[#f0f4f9] dark:bg-[#131314]">
            <div className="w-full h-full bg-black/5 dark:bg-black/40 sm:bg-white sm:dark:bg-[#1e1f20] sm:rounded-2xl sm:shadow-sm overflow-hidden flex items-center justify-center relative">
                {isImage ? (
                    <div className="w-full h-full p-2 sm:p-4 flex items-center justify-center">
                        <img src={preview_url} alt={file.name} className="max-w-full max-h-full object-contain" />
                    </div>
                ) : isVideo ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                        <video src={preview_url} controls className="w-full h-full object-contain outline-none" />
                    </div>
                ) : isAudio ? (
                    <div className="w-full h-full bg-black/5 dark:bg-black/40 flex flex-col items-center justify-center">
                        <AudioLines className="w-24 h-24 text-blue-500 mb-8" />
                        <audio src={preview_url} controls className="w-full max-w-md outline-none" />
                    </div>
                ) : isPdfOrText ? (
                    <iframe src={preview_url} className="w-full h-full border-none bg-white" title={file.name} />
                ) : (
                    <div className="text-center p-6 bg-white dark:bg-[#1e1f20] rounded-xl shadow-sm sm:shadow-none sm:bg-transparent sm:p-0">
                        <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-500 font-medium whitespace-pre-wrap break-words max-w-[250px] mx-auto">No preview available for {file.name}</p>
                        <a href={download_url} download className="text-blue-600 hover:underline text-sm mt-4 inline-block px-6 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full font-medium transition-colors">Download file directly</a>
                    </div>
                )}
            </div>
        </main>
    )
}
