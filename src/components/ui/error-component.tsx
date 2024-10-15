import {TriangleAlertIcon} from "lucide-react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {GENERIC_ERROR_MESSAGE} from "@/constants.ts";

type ErrorComponentProps = {
    title?: string;
    message?: string;
}

function ErrorComponent(props: ErrorComponentProps) {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-[80dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <Card className="w-full max-w-2xl mt-10 mb-10">
                    <CardHeader className="text-center">
                        <TriangleAlertIcon width={200} height={200} className="mx-auto text-primary"/>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {props.title ? props.title : "Oops, something went wrong!"}
                        </div>
                        <div className="mt-4 text-muted-foreground">
                            {props.message ? props.message : GENERIC_ERROR_MESSAGE}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default ErrorComponent;