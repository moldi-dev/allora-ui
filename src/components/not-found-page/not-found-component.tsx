import React from 'react';
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

function NotFoundComponent() {
    return (
        <div
            className="flex min-h-[100dvh] items-center justify-center bg-white px-4 py-12">
            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <X width={200} height={200} className="mx-auto mb-6 text-primary"/>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Sorry, we couldn't find the page you were looking for.
                    </div>
                    <div className="mt-4 text-muted-foreground">
                        The page you requested may have been moved or deleted. Please check the URL or try navigating
                        from the homepage.
                    </div>
                </CardContent>
                <CardFooter className="flex">
                    <Link to="/home" className="w-full">
                        <Button
                            className="w-full rounded-lg text-primary px-4 py-3 font-medium text-white hover:bg-[#ffa500] focus:outline-none">
                            Go to Homepage
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default NotFoundComponent;