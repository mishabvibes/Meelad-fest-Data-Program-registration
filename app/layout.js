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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://your-production-domain.com"),
  title: "മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷൻ",
  description: "ഹയാത്തുൽ ഇസ്‌ലാം ഹയർ സെക്കണ്ടറി മദ്‌റസ - മീലാദ് ഫെസ്റ്റ് പ്രോഗ്രാം രജിസ്ട്രേഷൻ",
  openGraph: {
    title: "മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷൻ | Hayathul Islam HSS",
    description: "ഹയാത്തുൽ ഇസ്‌ലാം ഹയർ സെക്കണ്ടറി മദ്‌റസ മീലാദ് ഫെസ്റ്റ് പ്രോഗ്രാം ഓൺലൈൻ രജിസ്ട്രേഷൻ ഫോം",
    siteName: "Meelad Fest",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "Meelad Fest Logo",
      },
    ],
    locale: "ml_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷൻ",
    description: "ഹയാത്തുൽ ഇസ്‌ലാം ഹയർ സെക്കണ്ടറി മദ്‌റസ മീലാദ് ഫെസ്റ്റ് പ്രോഗ്രാം ഓൺലൈൻ രജിസ്ട്രേഷൻ",
    images: ["/images/logo.png"],
  },
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
