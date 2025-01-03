import React from 'react';
import PaymentSuccessComponent from "@/components/payment-success-page/payment-success-component.tsx";
import Footer from "@/components/ui/footer.tsx";

function PaymentSuccessPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <PaymentSuccessComponent/>
            </div>
            <Footer/>
        </div>
    );
}

export default PaymentSuccessPage;