"use client"
import { FileCard, FileType } from "@/components/dashboard/grid/file-card"
import { FolderCard } from "@/components/dashboard/grid/folder-card"
import { useFolderStore } from "@/store/folderStore"
import { useFileStore } from "@/store/fileStore"
import { useUploadStore } from "@/store/uploadStore"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

function mapDbTypeToFileType(dbType: string): FileType {
    switch (dbType) {
        case 'pdf': return 'pdf';
        case 'txt': case 'doc': return 'text';
        case 'jpg': case 'png': case 'webp': return 'image';
        case 'mp4': case 'mp3': return 'video';
        default: return 'unknown';
    }
}

export default function DashboardPage() {
    const { folders, fetchFolders, isLoading, error } = useFolderStore()
    const { files, fetchFiles, isLoading: filesLoading, error: filesError, moveToTrash, searchQuery } = useFileStore()
    const currentFolderId = useFolderStore(s => s.currentFolderId)
    const uploads = useUploadStore(s => s.uploads)

    useEffect(() => {
        fetchFolders(currentFolderId)
        fetchFiles(currentFolderId)
    }, [fetchFolders, fetchFiles, currentFolderId])

    // Re-fetch files when all uploads complete
    const allCompleted = uploads.length > 0 && uploads.every(u => u.status === 'completed');
    useEffect(() => {
        if (allCompleted) {
            fetchFiles(currentFolderId)
        }
    }, [allCompleted, fetchFiles, currentFolderId])

    return (
        <div className="flex-1 p-6 h-full bg-[#FFFFFF] dark:bg-black/70 rounded-lg overflow-y-auto">
            {!searchQuery && (isLoading || error || folders.length > 0) && (
                <div className="mb-8 relative min-h-[100px]">
                    <h2 className="text-[14px] font-medium text-foreground mb-4">Folders</h2>

                    {isLoading ? (
                        <div className="flex items-center justify-center w-full h-[60px]">
                            <Loader2 className="h-6 w-6 animate-spin text-[#0b57d0] dark:text-[#a8c7fa]" />
                        </div>
                    ) : error ? (
                        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                            Failed to load folders: {error}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            {folders.map((folder) => (
                                <FolderCard key={folder.id} name={folder.name} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-[14px] font-medium text-foreground mb-4">Files</h2>
                {filesLoading ? (
                    <div className="flex items-center justify-center w-full h-[60px]">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0b57d0] dark:text-[#a8c7fa]" />
                    </div>
                ) : filesError ? (
                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                        Failed to load files: {filesError}
                    </div>
                ) : files.length === 0 ? (
                    <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6]">No files uploaded yet.</p>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {files.map((file) => (
                            <FileCard
                                key={file.id}
                                id={file.id}
                                name={file.name}
                                type={mapDbTypeToFileType(file.type)}
                                previewUrl={file.thumbnail_url || undefined}
                                onDelete={moveToTrash}
                                file={file}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

