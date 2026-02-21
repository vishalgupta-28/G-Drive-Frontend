import { Folder as FolderIcon, MoreVertical } from "lucide-react"

interface FolderCardProps {
    name: string
}

export function FolderCard({ name }: FolderCardProps) {
    return (
        <button className="group flex items-center justify-between w-[260px] h-[52px] px-4 py-3 bg-[#F0F4F9] dark:bg-[#282a2c] hover:bg-[#e9eef6] dark:hover:bg-[#333333] transition-colors rounded-[12px] border-none text-left">
            <div className="flex items-center gap-4">
                <FolderIcon className="h-5 w-5 fill-[#444746] stroke-[#444746] dark:fill-[#c4c7c5] dark:stroke-[#c4c7c5]" />
                <span className="text-[14px] font-medium text-[#1f1f1f] dark:text-[#e3e3e3] truncate max-w-[150px]">
                    {name}
                </span>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                <MoreVertical className="h-5 w-5 text-[#444746] dark:text-[#c4c7c5]" />
            </div>
        </button>
    )
}
