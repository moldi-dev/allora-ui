import {ClipLoader} from "react-spinners";

type LoadingComponentProps = {
    color?: string;
}

function LoadingComponent(props: LoadingComponentProps) {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-[80dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center w-full max-w-2xl mt-10 mb-10">
                    <ClipLoader size={100} color={props.color ? props.color : "black"} />
                </div>
            </div>
        </div>
    );
}

export default LoadingComponent;