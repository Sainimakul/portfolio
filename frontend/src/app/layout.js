import { PortfolioProvider } from "../../context/PortfolioContext";
import "./globals.css";
import TrackerProvider from "../../context/TrackerProvider";

export const metadata = {
  title: "Makul Portfolio",
  description: "Full Stack Developer Portfolio",
  icons: {
    icon: "/favicon.png", // make sure this exists in /public
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <PortfolioProvider>
                    <TrackerProvider />

          {children}
        </PortfolioProvider>

      </body>
    </html>
  );
}