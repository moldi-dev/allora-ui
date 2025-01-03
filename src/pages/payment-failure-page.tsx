import React from 'react';
import PaymentFailureComponent from "@/components/payment-failure-page/payment-failure-component.tsx";
import Footer from "@/components/ui/footer.tsx";

function PaymentFailurePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <PaymentFailureComponent/>
            </div>
            <Footer/>
        </div>
    );
}

export default PaymentFailurePage;