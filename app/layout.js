import { Baloo_Chettan_2, Manjari } from "next/font/google";
import "./globals.css";

const balooChettan2 = Baloo_Chettan_2({
  subsets: ["malayalam", "latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const manjari = Manjari({
  subsets: ["malayalam", "latin"],
  weight: ["400", "700"],
  variable: "--font-manjari",
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
        className={`${balooChettan2.variable} ${manjari.variable} font-mal bg-sand text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
