import React from 'react';
import {Shirt} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

function PaymentFailureComponent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Shirt className="w-16 h-16 text-primary mb-6"/>
            <h1 className="text-3xl font-bold text-center mb-4">Payment unsuccessful</h1>
            <p className="text-xl text-center mb-2">We're sorry, but the payment didn't go through.</p>
            <p className="text-lg text-center text-muted-foreground mb-6">
                Your order is still pending and can be paid from the orders section.
            </p>
            <Button asChild>
                <Link to="/orders">Go to your orders</Link>
            </Button>
        </div>
    );
}

export default PaymentFailureComponent;