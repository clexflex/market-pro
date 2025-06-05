import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MarketPro Research Dashboard | Professional Market Analysis Platform',
  description: 'Advanced market research dashboard providing comprehensive data visualization, competitive analysis, and growth forecasting for global skin boosters market. Interactive charts, regional insights, and detailed segment analysis.',
  keywords: 'market research, dashboard, data visualization, competitive analysis, market forecasting, business intelligence, skin boosters market, global market analysis',
  authors: [{ name: 'MarketPro Analytics' }],
  creator: 'MarketPro Analytics',
  publisher: 'MarketPro Analytics',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://marketpro-dashboard.com',
    title: 'MarketPro Research Dashboard',
    description: 'Professional market research dashboard with interactive data visualization and comprehensive analysis tools.',
    siteName: 'MarketPro Dashboard',
    images: [
      {
        url: '/api/og-image',
        width: 1200,
        height: 630,
        alt: 'MarketPro Research Dashboard Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketPro Research Dashboard',
    description: 'Professional market research dashboard with interactive data visualization.',
    creator: '@marketpro',
    images: ['/api/og-image']
  },
   manifest: '/manifest.json'
};

export const viewport = {
  width: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MarketPro Research Dashboard",
              "applicationCategory": "BusinessApplication",
              "description": "Professional market research dashboard with comprehensive data visualization and analysis capabilities",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "MarketPro Analytics"
              },
              "featureList": [
                "Interactive Data Visualization",
                "Market Forecasting",
                "Competitive Analysis", 
                "Regional Insights",
                "Segment Deep Dive",
                "Export Capabilities"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        {/* Main Application Content */}
        <div id="main-content" className="h-full">
          {children}
        </div>

        {/* Analytics Script Placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Performance Monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Performance monitoring
                if ('web-vitals' in window) {
                  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
                    onCLS(console.log);
                    onFID(console.log);
                    onFCP(console.log);
                    onLCP(console.log);
                    onTTFB(console.log);
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}