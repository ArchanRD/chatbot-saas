import type { Metadata } from "next";
import { ClientAuthProvider } from "@/context/ClientAuthProvider";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Script from "next/script";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Conversy</title>
        {/* open graph */}
        <meta property="og:image" content="<generated>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Handlee&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon_io/android-chrome-192x192.png"/>
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon_io/android-chrome-512x512.png"/>
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        {/* Conversy support bot integration  */}
        <Script src="https://conversy.archan.dev/widget/chatbot.js" data-api-key={process.env.NEXT_PUBLIC_CONVERSY_SUPPORT_BOT_API_KEY}></Script>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ZCKF801L4B"></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
           gtag('config', 'G-ZCKF801L4B');`}
        </Script>       
      </head>
      <ClientAuthProvider>
        <body>
          <NextTopLoader color="#000" showSpinner={false} />
          {children}
        </body>
      </ClientAuthProvider>
    </html>
  );
}
