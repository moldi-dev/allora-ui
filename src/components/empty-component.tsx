import React from 'react';
import {Shirt} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

type EmptyComponentProps = {
    title: string;
    content: string;
    buttonText?: string;
    buttonAction?: () => void;
}

function EmptyComponent(props: EmptyComponentProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <div className="flex items-center justify-center">
                    <Shirt className="text-primary h-16 w-16"/>
                </div>
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{props.title}</h1>
                    <p className="text-muted-foreground">
                        {props.content}
                    </p>
                </div>
                {props.buttonText && props.buttonAction &&
                    <Button className="w-full" onClick={() => props.buttonAction()}>
                        {props.buttonText}
                    </Button>
                }
            </div>
        </div>
    );
}

export default EmptyComponent;