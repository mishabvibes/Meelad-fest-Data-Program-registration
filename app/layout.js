import { Amiri, Noto_Sans_Malayalam, Inter } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-malayalam",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷൻ",
  description: "ഹയാത്തുൽ ഇസ്‌ലാം ഹയർ സെക്കണ്ടറി മദ്‌റസ - മീലാദ് ഫെസ്റ്റ് പ്രോഗ്രാം രജിസ്ട്രേഷൻ",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <body
        className={`${amiri.variable} ${notoMalayalam.variable} ${inter.variable} font-mal bg-sand text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
