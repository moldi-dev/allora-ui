export const FileSvgDraw = () => {
    return (
        <>
            <svg
                className="w-8 h-8 mb-3 text-primary dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
            </svg>
            <p className="mb-1 flex text-sm text-black">
                <span className="font-semibold">Product images</span>
            </p>
            <p className="text-xs text-gray-500">
                Click here to upload the product images
            </p>
            <p className="text-xs text-gray-500">
                You can upload 5 pictures, each one having at most 5MB
            </p>
            <p className="text-xs text-gray-500">
                PNG, JPG or JPEG
            </p>
        </>
    );
};