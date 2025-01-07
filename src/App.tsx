import {useEffect} from "react";
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import SignInPage from "@/pages/sign-in-page.tsx";
import SignUpPage from "@/pages/sign-up-page.tsx";
import NotFoundPage from "@/pages/not-found-page.tsx";
import HomePage from "@/pages/home-page.tsx";
import {Toaster} from "react-hot-toast";
import ForgotPasswordPage from "@/pages/forgot-password-page.tsx";
import AdminDashboardPage from "@/pages/admin-dashboard-page.tsx";
import ProfilePage from "@/pages/profile-page.tsx";
import SecurityPage from "@/pages/security-page.tsx";
import ProductsPage from "@/pages/products-page.tsx";
import SingleProductPage from "@/pages/single-product-page.tsx";
import CheckoutPage from "@/pages/checkout-page.tsx";
import PaymentSuccessPage from "@/pages/payment-success-page.tsx";
import PaymentFailurePage from "@/pages/payment-failure-page.tsx";
import OrdersPage from "@/pages/orders-page.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            retry: 3,
            staleTime: 1000 * 5,
        },
    },
});

const ScrollToTop = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function AppRoutes() {
    return (
      <Routes>
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="sign-in" element={<SignInPage/>} />
          <Route path="sign-up" element={<SignUpPage/>} />
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="/admin-dashboard" element={<AdminDashboardPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/security" element={<SecurityPage/>}/>
          <Route path="/products" element={<ProductsPage/>}/>
          <Route path="/product/:id" element={<SingleProductPage/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
          <Route path="/payment-success" element={<PaymentSuccessPage/>}/>
          <Route path="/payment-failure" element={<PaymentFailurePage/>}/>
          <Route path="/orders" element={<OrdersPage/>}/>
          <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    );
}

function App() {
  return (
      <BrowserRouter>
          <ScrollToTop />
          <QueryClientProvider client={queryClient}>
              <AppRoutes/>
              <Toaster
                  position="top-right"
                  reverseOrder={false}
                  gutter={8}
                  toastOptions={{
                      duration: 3000,
                  }}
              />
          </QueryClientProvider>
      </BrowserRouter>
  )
}

export default App
