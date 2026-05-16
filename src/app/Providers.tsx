import { IntelligenceProvider } from "@/lib/IntelligenceContext";
import { ThemeProvider } from "@/components/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <IntelligenceProvider>
        {children}
      </IntelligenceProvider>
    </ThemeProvider>
  );
}
