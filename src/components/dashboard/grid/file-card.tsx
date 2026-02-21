"use client"

import {
    MoreVertical, Move, Download, Pencil, Copy,
    ListChecks, AudioLines, UserPlus, Folder, Info, Trash2, ChevronRight
} from "lucide-react"
import { motion, Variants } from "framer-motion"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useFileStore, FileItem } from "@/store/fileStore"
import { useState } from "react"
import { ShareModal } from "../share-modal"

export type FileType = "pdf" | "text" | "image" | "video" | "unknown"

export interface FileCardProps {
    id: string
    name: string
    type: FileType
    previewUrl?: string
    isTrash?: boolean
    onDelete?: (id: string) => void
    onRestore?: (id: string) => void
    file: FileItem // Full original FileItem for the preview store
}

function getFileIcon(type: FileType) {
    switch (type) {
        case "pdf":
            return (
                <div className="flex items-center justify-center w-5 h-5 bg-[#e94335] rounded-[4px]">
                    <span className="text-white text-[8px] font-bold">PDF</span>
                </div>
            )
        case "text":
            return (
                <div className="flex items-center justify-center w-5 h-5 bg-[#4285f4] rounded-[4px] flex-col gap-[2px]">
                    <div className="w-3 h-[2px] bg-white rounded-full" />
                    <div className="w-3 h-[2px] bg-white rounded-full" />
                    <div className="w-2 h-[2px] bg-white rounded-full self-start ml-1" />
                </div>
            )
        default:
            return (
                <div className="flex items-center justify-center w-5 h-5 bg-[#8ab4f8] rounded-[4px]">
                    <div className="w-2 h-2 bg-white rounded-sm" />
                </div>
            )
    }
}

// Framer Motion staggered entrance variant
const itemVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    visible: (custom: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: custom * 0.03, duration: 0.2, ease: "easeOut" }
    })
}

export function FileCard({ id, name, type, previewUrl, isTrash, onDelete, onRestore, file }: FileCardProps) {
    const { openPreview, downloadFile } = useFileStore()
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    return (
        <>
            <div
                onClick={() => {
                    if (!isTrash) {
                        openPreview(file)
                    }
                }}
                className="group flex flex-col w-[260px] h-[260px] bg-[#F0F4F9] dark:bg-[#1e1f20] hover:bg-[#e9eef6] dark:hover:bg-[#333333] transition-colors rounded-[16px] border border-transparent overflow-hidden relative cursor-pointer"
            >

                {/* Header section */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2 h-[48px]">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {getFileIcon(type)}
                        <span className="text-[14px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3] truncate max-w-[160px]">
                            {name}
                        </span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="h-8 w-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all shrink-0" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-5 w-5 text-[#444746] dark:text-[#c4c7c5]" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent onClick={(e) => e.stopPropagation()} className="w-[260px] rounded-[12px] p-0 py-2 bg-white dark:bg-[#282a2c] border-none shadow-lg text-[#1f1f1f] dark:text-[#c4c7c5]" side="right" align="start" sideOffset={8}>

                            <DropdownMenuItem asChild className="h-[34px] px-3 rounded-none cursor-pointer focus:bg-[#f0f4f9] dark:focus:bg-[#333333] border-none outline-none">
                                <motion.div custom={0} initial="hidden" animate="visible" variants={itemVariants}>
                                    <Move className="mr-[14px] h-[16px] w-[16px] text-[#444746] dark:text-[#c4c7c5]" />
                                    <span className="text-[13px] flex-1">Open with</span>
                                    <ChevronRight className="h-[16px] w-[16px] text-[#444746] dark:text-[#c4c7c5]" />
                                </motion.div>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-[#c4c7c5] dark:bg-[#444746] opacity-30 my-[4px]" />

                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    downloadFile(file);
                                }}
                                className="h-[34px] px-3 rounded-none cursor-pointer focus:bg-[#f0f4f9] dark:focus:bg-[#333333]"
                            >
                                <motion.div custom={1} initial="hidden" animate="visible" variants={itemVariants} className="flex items-center w-full">
                                    <Download className="mr-[14px] h-[16px] w-[16px] text-[#444746] dark:text-[#c4c7c5]" />
                                    <span className="text-[13px] flex-1">Download</span>
                                </motion.div>
                            </DropdownMenuItem>

                            {!isTrash ? (
                                <>
                                    <DropdownMenuItem asChild className="h-[34px] px-3 rounded-none pointer-events-none opacity-50">
                                        <motion.div custom={2} initial="hidden" animate="visible" variants={itemVariants} className="flex items-center w-full">
                                            <Pencil className="mr-[14px] h-[16px] w-[16px] text-[#444746] dark:text-[#c4c7c5]" />
                                            <span className="text-[13px] flex-1">Rename</span>
                                            <span className="text-[11px] text-[#444746] dark:text-[#c4c7c5] font-medium tracking-wide">⌥⌘E</span>
                                        </motion.div>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-[#c4c7c5] dark:bg-[#444746] opacity-30 my-[4px]" />

                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsShareModalOpen(true);
                                        }}
                                        className="h-[34px] px-3 rounded-none cursor-pointer focus:bg-[#f0f4f9] dark:focus:bg-[#333333]"
                                    >
                                        <motion.div custom={3} initial="hidden" animate="visible" variants={itemVariants} className="flex items-center w-full">
                                            <UserPlus className="mr-[14px] h-[16px] w-[16px] text-[#444746] dark:text-[#c4c7c5]" />
                                            <span className="text-[13px] flex-1">Share</span>
                                            <ChevronRight className="h-[16px] w-[16px] text-[#444746] dark:text-[#c4c7c5]" />
                                        </motion.div>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-[#c4c7c5] dark:bg-[#444746] opacity-30 my-[4px]" />

                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onDelete) onDelete(id);
                                        }}
                                        className="h-[34px] px-3 rounded-none cursor-pointer focus:bg-[#f0f4f9] dark:focus:bg-[#333333]"
                                    >
                                        <motion.div custom={6} initial="hidden" animate="visible" variants={itemVariants} className="flex items-center w-full">
                                            <Trash2 className="mr-[14px] h-[16px] w-[16px] text-[#444746] dark:text-[#c4c7c5]" />
                                            <span className="text-[13px] flex-1">Move to trash</span>
                                            <span className="text-[11px] text-[#444746] dark:text-[#c4c7c5] font-medium pr-1 tracking-wide">Delete</span>
                                        </motion.div>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onRestore) onRestore(id);
                                        }}
                                        className="h-[34px] px-3 rounded-none cursor-pointer focus:bg-[#f0f4f9] dark:focus:bg-[#333333]"
                                    >
                                        <motion.div custom={2} initial="hidden" animate="visible" variants={itemVariants} className="flex items-center w-full">
                                            <Info className="mr-[14px] h-[16px] w-[16px] text-[#444746] dark:text-[#c4c7c5]" />
                                            <span className="text-[13px] flex-1">Restore</span>
                                        </motion.div>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-[#c4c7c5] dark:bg-[#444746] opacity-30 my-[4px]" />

                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onDelete) onDelete(id);
                                        }}
                                        className="text-red-600 dark:text-red-400 h-[34px] px-3 rounded-none cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20"
                                    >
                                        <motion.div custom={3} initial="hidden" animate="visible" variants={itemVariants} className="flex items-center w-full">
                                            <Trash2 className="mr-[14px] h-[16px] w-[16px]" />
                                            <span className="text-[13px] flex-1">Delete forever</span>
                                        </motion.div>
                                    </DropdownMenuItem>
                                </>
                            )}

                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                {/* Internal Preview Box */}
                <div className="flex-1 mx-4 mb-4 rounded-[8px] bg-white dark:bg-white overflow-hidden shadow-sm flex items-center justify-center relative">
                    {previewUrl ? (
                        <img src={previewUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-white dark:bg-white" />
                    )}
                </div>

            </div>

            <ShareModal
                file={file}
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />
        </>
    )
}
