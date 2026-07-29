import { Anek_Malayalam, Noto_Serif_Malayalam } from "next/font/google";
import "./globals.css";

const anekMalayalam = Anek_Malayalam({
  subsets: ["malayalam", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-anek-malayalam",
  display: "swap",
});

const notoSerifMalayalam = Noto_Serif_Malayalam({
  subsets: ["malayalam", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-serif-malayalam",
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
        className={`${anekMalayalam.variable} ${notoSerifMalayalam.variable} font-anek bg-sand text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
