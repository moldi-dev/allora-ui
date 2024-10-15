import {Button} from "@/components/ui/button.tsx";
import {ClipLoader} from "react-spinners";
import React from "react";

type LoadingButtonProps = {
    clipLoaderColor: string;
    isLoading: boolean;
    className?: string;
    type: "submit" | "reset" | "button";
    children?: React.ReactNode;
    onClick?: () => void;
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
}

const LoadingButton = (props: LoadingButtonProps) => {
    return (
        <Button variant={props.variant} size={props.size} onClick={props.onClick} disabled={props.isLoading}
                className={props.className} type={props.type}>
            {props.isLoading ? (
                <ClipLoader
                    color={props.clipLoaderColor}
                    loading={props.isLoading}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            ) : (
                props.children
            )}
        </Button>
    );
};

export default LoadingButton;