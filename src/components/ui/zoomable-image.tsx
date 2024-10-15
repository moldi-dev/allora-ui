import {Dialog, DialogContent, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {DetailedHTMLProps, ImgHTMLAttributes} from 'react'
import {Search} from "lucide-react";

export default function ZoomableImage({
                                          src,
                                          alt,
                                          className,
                                          width,
                                          height
                                      }: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    if (!src) return null
    return (
        <Dialog>
            <DialogTitle/>
            <DialogTrigger asChild>
                <div className={`relative group ${className}`}>
                    <img
                        src={src}
                        alt={alt || ''}
                        sizes="100vw"
                        className={`transition-opacity duration-300 ${className}`}
                        width={width}
                        height={height}
                    />
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:cursor-pointer">
                        <Search className="text-4xl text-primary"/>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="max-w-7xl border-0 bg-transparent p-0">
                <div
                    className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-white outline outline-1 shadow-md">
                    <img src={src} alt={alt || ''} className="h-full w-full object-contain"/>
                </div>
            </DialogContent>
        </Dialog>
    )
}