"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Link as LinkIcon, AlertCircle, HelpCircle, Settings, Lock, Globe } from "lucide-react"
import { useFileStore, FileItem } from "@/store/fileStore"

interface ShareModalProps {
    file: FileItem;
    isOpen: boolean;
    onClose: () => void;
}

export function ShareModal({ file, isOpen, onClose }: ShareModalProps) {
    const { generateShareLink, revokeShareLink, checkShareLink } = useFileStore()
    const [shareUrl, setShareUrl] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [isRevoking, setIsRevoking] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            let mounted = true;
            const checkStatus = async () => {
                setIsChecking(true);
                setError(null);
                setShareUrl(null);
                const url = await checkShareLink(file.id);
                if (mounted) {
                    setShareUrl(url);
                    setIsChecking(false);
                }
            };
            checkStatus();
            return () => { mounted = false; };
        } else {
            setShareUrl(null);
            setError(null);
        }
    }, [isOpen, file.id, checkShareLink]);

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
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 text-[14px] text-red-600 bg-red-50 p-3 rounded-[8px] dark:bg-red-900/20 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {isChecking ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b57d0] dark:border-[#a8c7fa]"></div>
                                <p className="text-[13px] text-[#444746] dark:text-[#c4c7c5] mt-4">Checking share status...</p>
                            </div>
                        ) : !shareUrl ? (
                            <div className="flex flex-col items-center justify-center py-6">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 px-6 py-[12px] bg-[#0b57d0] hover:bg-blue-800 text-white text-[15px] font-medium rounded-full transition-colors disabled:opacity-50"
                                >
                                    <LinkIcon className="w-[18px] h-[18px]" />
                                    {isGenerating ? "Generating..." : "Generate link"}
                                </button>
                                <p className="text-[13px] text-[#444746] dark:text-[#c4c7c5] mt-4 text-center">
                                    Only people with the generated link will be able to access this file.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h3 className="text-[16px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3] mb-4">General access</h3>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full shrink-0">
                                            <Globe className="w-6 h-6 text-green-700 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[15px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">Anyone with the link</div>
                                            <div className="text-[14px] text-[#444746] dark:text-[#c4c7c5] mt-[2px]">Anyone on the internet with the link can view</div>
                                            <div className="flex items-center gap-2 mt-4">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={shareUrl}
                                                    className="flex-1 bg-[#f0f4f9] dark:bg-[#1e1f20] p-[10px] rounded-[8px] border border-gray-300 dark:border-gray-600 focus:border-[#0b57d0] dark:focus:border-blue-500 text-[14px] text-[#1f1f1f] dark:text-[#e3e3e3] outline-none select-all"
                                                />
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="flex items-center gap-2 px-4 py-[10px] shrink-0 bg-[#f0f4f9] dark:bg-[#1e1f20] hover:bg-gray-200 dark:hover:bg-gray-700 text-[#1f1f1f] dark:text-[#e3e3e3] text-[14px] font-medium rounded-[8px] transition-colors border border-gray-300 dark:border-gray-600"
                                                >
                                                    {copied ? <Check className="w-[16px] h-[16px]" /> : <Copy className="w-[16px] h-[16px]" />}
                                                    {copied ? "Copied" : "Copy"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Strip */}
                                <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-200 dark:border-gray-800">
                                    <button
                                        onClick={handleRevoke}
                                        disabled={isRevoking}
                                        className="px-5 py-[10px] bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 text-[14px] font-medium rounded-full transition-colors disabled:opacity-50"
                                    >
                                        {isRevoking ? "Revoking..." : "Revoke link"}
                                    </button>

                                    <button
                                        onClick={onClose}
                                        className="px-6 py-[10px] bg-[#0b57d0] hover:bg-blue-800 text-white text-[14px] font-medium rounded-full transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
