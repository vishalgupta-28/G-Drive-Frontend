"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Link as LinkIcon, AlertCircle, HelpCircle, Settings, Lock, Globe } from "lucide-react"
import { useFileStore, FileItem } from "@/store/fileStore"

interface ShareModalProps {
    file: FileItem;
    isOpen: boolean;
    onClose: () => void;
}

export function ShareModal({ file, isOpen, onClose }: ShareModalProps) {
    const { generateShareLink, revokeShareLink } = useFileStore()
    const [shareUrl, setShareUrl] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isRevoking, setIsRevoking] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async () => {
        setIsGenerating(true)
        setError(null)
        try {
            const url = await generateShareLink(file.id);
            if (url) {
                setShareUrl(url);
            } else {
                setError("Failed to generate link.");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setIsGenerating(false)
        }
    }

    const handleRevoke = async () => {
        setIsRevoking(true)
        setError(null)
        try {
            await revokeShareLink(file.id);
            setShareUrl(null);
            onClose();
        } catch (err) {
            setError("Failed to revoke link.");
        } finally {
            setIsRevoking(false)
        }
    }

    const copyToClipboard = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-center justify-center">
                {/* Backdrop overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-[560px] bg-white dark:bg-[#282a2c] rounded-xl shadow-2xl p-6 overflow-hidden flex flex-col gap-6"
                >
                    <div className="flex items-start justify-between">
                        <h2 className="text-[22px] font-normal text-[#1f1f1f] dark:text-[#e3e3e3] pr-4 leading-[28px]">Share "{file.name}"</h2>
                        <div className="flex items-center gap-2">
                            <button className="p-[6px] rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#444746] dark:text-[#c4c7c5]">
                                <HelpCircle className="w-6 h-6 stroke-[1.5]" />
                            </button>
                            <button className="p-[6px] rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#444746] dark:text-[#c4c7c5]">
                                <Settings className="w-6 h-6 stroke-[1.5]" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 text-[14px] text-red-600 bg-red-50 p-3 rounded-[8px] dark:bg-red-900/20 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {!shareUrl ? (
                            <div>
                                <h3 className="text-[16px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3] mb-4">General access</h3>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-100 dark:bg-[#333333] rounded-full shrink-0">
                                        <Lock className="w-5 h-5 text-[#444746] dark:text-[#c4c7c5]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[14px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">Restricted</div>
                                                <div className="text-[14px] text-[#444746] dark:text-[#c4c7c5] mt-[2px]">Only people with access can open with the link</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-[16px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3] mb-4">General access</h3>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full shrink-0">
                                        <Globe className="w-5 h-5 text-green-700 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[14px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">Anyone with the link</div>
                                        <div className="text-[14px] text-[#444746] dark:text-[#c4c7c5] mt-[2px]">Anyone on the internet with the link can view</div>
                                        <input
                                            type="text"
                                            readOnly
                                            value={shareUrl}
                                            className="mt-3 w-full bg-[#f0f4f9] dark:bg-[#1e1f20] p-2 rounded text-[13px] text-[#1f1f1f] dark:text-[#e3e3e3] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {!shareUrl ? (
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-5 py-[10px] bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 text-[#0b57d0] dark:text-[#a8c7fa] text-[14px] font-medium rounded-full transition-colors disabled:opacity-50"
                            >
                                <LinkIcon className="w-[18px] h-[18px]" />
                                {isGenerating ? "Generating..." : "Copy link"}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 px-5 py-[10px] bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 text-[#0b57d0] dark:text-[#a8c7fa] text-[14px] font-medium rounded-full transition-colors"
                                >
                                    {copied ? <Check className="w-[18px] h-[18px]" /> : <LinkIcon className="w-[18px] h-[18px]" />}
                                    {copied ? "Link copied" : "Copy link"}
                                </button>
                                <button
                                    onClick={handleRevoke}
                                    disabled={isRevoking}
                                    className="px-4 py-[10px] bg-transparent text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 text-[14px] font-medium rounded-full transition-colors disabled:opacity-50"
                                >
                                    {isRevoking ? "Revoking..." : "Remove access"}
                                </button>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="px-6 py-[10px] bg-[#0b57d0] hover:bg-blue-800 text-white text-[14px] font-medium rounded-full transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
