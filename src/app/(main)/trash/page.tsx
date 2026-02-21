"use client"
import { FileCard, FileType } from "@/components/dashboard/grid/file-card"
import { useTrashStore } from "@/store/trashStore"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import Image from "next/image"

function mapDbTypeToFileType(dbType: string): FileType {
    switch (dbType) {
        case 'pdf': return 'pdf';
        case 'txt': case 'doc': return 'text';
        case 'jpg': case 'png': case 'webp': return 'image';
        case 'mp4': case 'mp3': return 'video';
        default: return 'unknown';
    }
}

export default function TrashPage() {
    const { trashedFiles, fetchTrash, isLoading, error, restoreFile, permanentDeleteFile } = useTrashStore()

    useEffect(() => {
        fetchTrash()
    }, [fetchTrash])

    return (
        <div className="flex-1 p-6 h-full bg-[#FFFFFF] dark:bg-black/70 rounded-lg overflow-y-auto">
            <h2 className="text-[22px] font-normal text-foreground mb-6">Trash</h2>

            <div className="mb-6">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-[60px]">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0b57d0] dark:text-[#a8c7fa]" />
                    </div>
                ) : error ? (
                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                        Failed to load trash: {error}
                    </div>
                ) : trashedFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[500px] text-center w-full">
                        <Image
                            src="/trash.svg"
                            alt="Trash is empty"
                            width={300}
                            height={300}
                            className="mb-8"
                            priority
                        />
                        <h3 className="text-[22px] font-normal text-[#1f1f1f] dark:text-[#e3e3e3] mb-3">Trash is empty</h3>
                        <p className="text-[14px] text-[#444746] dark:text-[#c4c7c5]">Items moved to the trash will be deleted forever after 30 days</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {trashedFiles.map((file) => (
                            <FileCard
                                isTrash={true}
                                key={file.id}
                                id={file.id}
                                name={file.name}
                                type={mapDbTypeToFileType(file.type)}
                                previewUrl={file.thumbnail_url || undefined}
                                onRestore={restoreFile}
                                onDelete={permanentDeleteFile}
                                file={file}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}