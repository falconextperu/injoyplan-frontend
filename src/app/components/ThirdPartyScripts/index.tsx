"use client";

import Script from 'next/script';
import { useCookieStore } from '../../zustand/cookies';

// IMPORTANT: Replace this with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export default function ThirdPartyScripts() {
    const { preferences } = useCookieStore();

    return (
        <>
            {/* 
              Only load Analytics scripts if the user has consented to 'analytics' cookies.
              Next.js <Script> component handles insertion into the <head> or <body>.
            */}
            {preferences.analytics && (
                <>
                    {/* Google Analytics via TAG Manager (gtag.js) */}
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());

                            gtag('config', '${GA_MEASUREMENT_ID}');
                        `}
                    </Script>
                </>
            )}

            {/* 
              Example: Advertising Scripts (Facebook Pixel, etc.)
              Only render if preferences.advertising is true
            */}
            {preferences.advertising && (
                <>
                    {/* Add advertising scripts here */}
                </>
            )}
        </>
    );
}
