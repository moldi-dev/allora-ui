import React, {useEffect, useState} from 'react';
import {UserResponse} from "@/types/responses.ts";
import {Link, useSearchParams} from "react-router-dom";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Menu} from "lucide-react"; // Menu icon for mobile
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"; // Import from Shadcn UI

type AdminNavigationProps = {
    user: UserResponse;
    components;
}

function AdminNavigation(props: AdminNavigationProps) {
    const [activeComponent, setActiveComponent] = useState<string>('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const component = searchParams.get('component');
        setActiveComponent(component || '');
    }, [searchParams]);

    return (
        <>
            {/* Mobile navbar -> up to large screens */}
            <nav className="lg:hidden p-4 bg-background border-b flex justify-between items-center w-full">
                <Link to="/admin-dashboard">
                    <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                            <Menu className="h-6 w-6" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {props.components.map((item) => (
                            <DropdownMenuItem key={item.param}>
                                <Link
                                    to={`?component=${item.param}`}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                                        activeComponent === item.param
                                            ? 'text-red-500'
                                            : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    <item.icon className="h-5 w-5"/>
                                    <span>{item.name}</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                        <div className="flex-shrink-0 p-4 space-y-2">
                            <Separator/>
                            <div className="text-sm text-gray-500">
                                {props.user.username} <br/>
                                {props.user.email}
                            </div>
                            <Link to="/home">
                                <Button className="w-full block mt-4">
                                    Back to the store
                                </Button>
                            </Link>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            {/* PC sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen bg-background border-r">
                <ScrollArea className="flex-grow py-6 px-4">
                    <Link to="/admin-dashboard">
                        <h2 className="text-lg font-semibold mb-4 px-2">Admin Dashboard</h2>
                    </Link>

                    <div className="space-y-2">
                        {props.components.map((item) => (
                            <Link
                                key={item.param}
                                to={`?component=${item.param}`}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                                    activeComponent === item.param
                                        ? 'text-red-500'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </ScrollArea>

                <div className="flex-shrink-0 p-4 space-y-2">
                    <Separator />
                    <div className="text-sm text-gray-500">
                        {props.user.username} <br />
                        {props.user.email}
                    </div>
                    <Link to="/home">
                        <Button className="w-full block mt-4">
                            Go back to the store
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default AdminNavigation;
