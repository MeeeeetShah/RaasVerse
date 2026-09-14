import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://raasverse.com'),
  title: "RaasVerse | Book Ahmedabad's Biggest Garba Passes & Events",
  description: "RaasVerse brings you Ahmedabad's grandest Navratri Garba passes, concerts, and cultural celebrations with 100% verified tickets, instant WhatsApp booking, and exclusive discounts.",
  keywords: "RaasVerse, Navratri Passes, Garba Ahmedabad, Mandalam Garba, Suvarn Navratri, Garba Passes 2026, Book Garba Tickets",
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  openGraph: {
    title: "RaasVerse | Navratri Passes • Events • Vibes",
    description: "Book verified Garba passes in Ahmedabad for Navratri 2026. Best prices, instant WhatsApp confirmation, and premium VIP access.",
    images: ["/assets/logo.png"],
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-[#07070a] text-slate-100 antialiased min-h-screen selection:bg-rose-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
