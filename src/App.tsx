import {useEffect} from "react";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import SignInPage from "@/pages/SignInPage.tsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import SignUpPage from "@/pages/SignUpPage.tsx";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import HomePage from "@/pages/HomePage.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 3,
            staleTime: 1000 * 60 * 60 * 5,
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
          <Route path="sign-in" element={<SignInPage/>} />
          <Route path="sign-up" element={<SignUpPage/>} />
          <Route path="" element={<HomePage/>}/>
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
              <ReactQueryDevtools initialIsOpen={false}/>
          </QueryClientProvider>
      </BrowserRouter>
  )
}

export default App
