"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

interface NewFolderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreate: (name: string) => void
}

export function NewFolderDialog({ open, onOpenChange, onCreate }: NewFolderDialogProps) {
    const [folderName, setFolderName] = React.useState("Untitled folder")
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Auto-select text when dialog opens
    React.useEffect(() => {
        if (open) {
            setFolderName("Untitled folder")
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus()
                    inputRef.current.select()
                }
            }, 50)
        }
    }, [open])

    const handleCreate = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (folderName.trim()) {
            onCreate(folderName.trim())
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] gap-6 p-6 rounded-[16px] border-none shadow-[0px_4px_16px_rgba(0,0,0,0.1)] dark:bg-[#282a2c] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
                        New folder
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleCreate} className="flex flex-col gap-6">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="w-full h-[56px] px-4 text-[16px] text-[#1f1f1f] dark:text-[#e3e3e3] bg-transparent border border-[#747775] dark:border-[#8e918f] rounded-[4px] focus:outline-none focus:border-[#0b57d0] dark:focus:border-[#a8c7fa] focus:border-2 transition-all"
                            placeholder=""
                        />
                    </div>

                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-6 py-2.5 text-[14px] font-medium text-[#0b57d0] dark:text-[#a8c7fa] rounded-full hover:bg-[#0b57d0]/10 dark:hover:bg-[#a8c7fa]/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!folderName.trim()}
                            className="px-6 py-2.5 text-[14px] font-medium text-[#0b57d0] dark:text-[#a8c7fa] rounded-full hover:bg-[#0b57d0]/10 dark:hover:bg-[#a8c7fa]/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            Create
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
