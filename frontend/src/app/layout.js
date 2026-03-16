import { PortfolioProvider } from "../../context/PortfolioContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <PortfolioProvider>
          {children}
        </PortfolioProvider>

      </body>
    </html>
  );
}