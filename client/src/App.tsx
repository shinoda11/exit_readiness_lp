import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import { FRIEND_INVITE_ENABLED } from "@shared/const";
import { Redirect } from "wouter";
import Home from "./pages/Home";
import FitGate from "./pages/FitGate";
import FitResult from "./pages/FitResult";
import PrepMode from "./pages/PrepMode";
import PassOnboarding from "./pages/PassOnboarding";
import PassResendLogin from "./pages/PassResendLogin";
import PassUpgrade from "./pages/PassUpgrade";
import InvitePass from "./pages/InvitePass";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/fit-gate"} component={FitGate} />
      <Route path={"/fit-result"} component={FitResult} />
      <Route path={"/prep-mode"} component={PrepMode} />
      <Route path={"/pass/onboarding"} component={PassOnboarding} />
      <Route path={"/pass/resend-login"} component={PassResendLogin} />
      <Route path={"/pass/upgrade"} component={PassUpgrade} />
      {/* 友人紹介LP導線は本番で無効化（FRIEND_INVITE_ENABLED=falseの場合は/へリダイレクト） */}
      <Route path={"/invite/pass/:token"}>
        {FRIEND_INVITE_ENABLED ? <InvitePass /> : <Redirect to="/" />}
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
