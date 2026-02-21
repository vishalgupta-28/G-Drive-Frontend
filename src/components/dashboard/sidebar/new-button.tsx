"use client"

import * as React from "react"
import { Plus, FolderPlus, FileUp } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFolderStore } from "@/store/folderStore"
import { toast } from "sonner"
import axios from "axios"
import { postRequest } from "@/server/methods"
import { ENDPOINTS } from "@/server/endpoint"
import { useUploadStore } from "@/store/uploadStore"
export function NewButton() {
    const { currentFolderId } = useFolderStore()
    const { addUpload, updateProgress, updateStatus } = useUploadStore()
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const files = Array.from(e.target.files);
        // Reset so same file can be clicked again
        if (fileInputRef.current) fileInputRef.current.value = '';

        for (const file of files) {
            const tempUIId = Math.random().toString(36).substring(7);

            addUpload({
                id: tempUIId,
                name: file.name,
                progress: 0,
                status: 'uploading',
                type: file.type
            });

            try {
                // 1. Get presigned URL
                const fileType = file.type || 'application/octet-stream';
                const presignRes: any = await postRequest(ENDPOINTS.uploads.presign, {
                    file_name: file.name,
                    file_type: fileType,
                    file_size: file.size
                });

                const { presign_url, upload_id } = presignRes;

                // 2. Upload directly to S3 with raw axios (no interceptor)
                await axios.put(presign_url, file, {
                    headers: { 'Content-Type': fileType },
                    onUploadProgress: (progressEvent: any) => {
                        const total = progressEvent.total || file.size;
                        const percent = Math.round((progressEvent.loaded * 100) / total);
                        updateProgress(tempUIId, percent);
                    }
                });

                // 3. Mark complete in backend
                await postRequest(ENDPOINTS.uploads.complete, {
                    upload_id,
                    file_name: file.name,
                    file_type: fileType,
                    folder_id: currentFolderId
                });

                // 4. Update UI
                updateStatus(tempUIId, 'completed');
            } catch (err) {
                console.error("Upload failed for file:", file.name, err);
                updateStatus(tempUIId, 'error');
            }
        }
    }

    return (
        <>
            <div className="px-1 pb-4 pt-1">
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 bg-white dark:bg-[#333333] hover:bg-[#F9FAFD] dark:hover:bg-[#3d3d3d] text-[#1f1f1f] dark:text-[#e3e3e3] px-[18px] py-[16px] rounded-[1rem] transition-all w-[130px] shadow-sm border border-neutral-200 dark:border-none outline-none">
                            <Plus className="h-[24px] w-[24px] stroke-[1.5]" />
                            <span className="text-[14px] font-medium pr-1">New</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[200px] rounded-[8px] p-0 py-[6px] bg-white dark:bg-[#282a2c] border border-[#d2d2d2] dark:border-[#444746] shadow-md text-[#1f1f1f] dark:text-[#c4c7c5] ml-4 mt-2" align="start">
                        <DropdownMenuItem
                            onClick={() => fileInputRef.current?.click()}
                            className="h-[36px] px-[14px] cursor-pointer focus:bg-[#f0f4f9] dark:focus:bg-[#333333] border-none outline-none rounded-none"
                        >
                            <div className="flex items-center w-full">
                                <FileUp className="mr-3 h-[18px] w-[18px] text-[#444746] dark:text-[#c4c7c5] stroke-[1.5]" />
                                <span className="text-[13px] flex-1 text-[#1f1f1f] dark:text-[#e3e3e3]">File upload</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}
