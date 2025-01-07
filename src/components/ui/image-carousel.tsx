import {useState} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from "@/components/ui/button"
import ZoomableImage from "@/components/ui/zoomable-image.tsx";
import {ImageResponse} from "@/types/responses.ts";

interface ImageCarouselProps {
    images: ImageResponse[]
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const nextSlide = () => {
        const isLastSlide = currentIndex === images.length - 1
        const newIndex = isLastSlide ? 0 : currentIndex + 1
        setCurrentIndex(newIndex)
    }

    return (
        <div className="relative group">
            <div className="w-full h-96 rounded-lg bg-gray-200 overflow-hidden">
                <ZoomableImage
                    src={images[currentIndex].url}
                    alt={`Product image ${currentIndex + 1}`}
                />
            </div>
            {currentIndex - 1 >= images.length &&
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            }
            {currentIndex + 1 < images.length &&
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            }
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-gray-400'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}

