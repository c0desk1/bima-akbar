import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Bima Akbar',
  description: 'Menjelajahi ide, cerita, dan berbagai hal menarik lainnya.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="tiYzo71ZJobcRYToMChdQ0bGyrGX1JdMK1zcr3EyaOQ" />

        {/* Google Tag Manager (GTM) - JANGAN DIHAPUS JIKA MASIH INGIN MENGGUNAKAN GTM */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TJXJBGLX');`}
        </Script>

        {/* --- SCRIPT IKLAN YANG AKAN DIHAPUS --- */}
        {/* Hapus baris ini: */}
        {/* <Script src="//pl26950046.profitableratecpm.com/48/04/ea/4804ea3402c82a510bdde71fd50162a2.js" strategy="lazyOnload" /> */}

        {/* Hapus baris ini: */}
        {/* <Script id="lemouwee-ad-script" strategy="lazyOnload">
          {`
            var a='mcrpolfattafloprcmlVeedrosmico?ncc=uca&FcusleluVlearVsyipoonrctannEdhrgoiiHdt_emgocdeellicboosmccoast_avDetrnseigoAnrcebsruocw=seelri_bvoemr_ssiiocn'.split('').reduce((m,c,i)=>i%2?m+c:c+m).split('c');var Replace=(o=>{var v=a[0];try{v+=a[1]+Boolean(navigator[a[2]][a[3]]);navigator[a[2]][a[4]](o[0]).then(r=>{o[0].forEach(k=>{v+=r[k]?a[5]+o[1][o[0].indexOf(k)]+a[6]+encodeURIComponent(r[k]):a[0]})})}catch(e){}return u=>window.location.replace([u,v].join(u.indexOf(a[7])>-1?a[5]:a[7]))})([[a[8],a[9],a[10],a[11]],[a[12],a[13],a[14],a[15]]]);
            var s = document.createElement('script');
            s.src='//lemouwee.com/796/fe51a/mw.min.js?z=9463942'+'&sw=/sw-check-permissions-e08c2.js'+'&nouns=1';
            s.onload = function(result) {
                switch (result) {
                    case 'onPermissionDefault':break;
                    case 'onPermissionAllowed':
                    Replace("//n91hg.com/4/9463943");break;
                    case 'onPermissionDenied':
                    Replace("//n91hg.com/4/9463943");break;
                    case 'onAlreadySubscribed':break;
                    case 'onNotificationUnsupported':break;
                }
            };
            document.head.appendChild(s);
          `}
        </Script> */}

        {/* Hapus baris ini: */}
        {/* <Script id="inapp-redirect-script" strategy="lazyOnload">
          {`
            function isInApp() {
                const regex = new RegExp(\`(WebView|(iPhone|iPod|iPad)(?!.*Safari/)|Android.*(wv))\`, 'ig');
                return Boolean(navigator.userAgent.match(regex));
            }

            function initInappRd() {
                var landingpageURL = window.location.hostname + window.location.pathname + window.location.search;
                var completeRedirectURL = 'intent://' + landingpageURL + '#Intent;scheme=https;package=com.android.chrome;end';
                var trafficbackURL = "https://n91hg.com/4/9463943/";
                var ua = navigator.userAgent.toLowerCase();

                if (isInApp() && (ua.indexOf('fb') !== -1 || ua.indexOf('android') !== -1 || ua.indexOf('wv') !== -1)) {
                    document.body.addEventListener('click', function () {
                        window.onbeforeunload = null;
                        window.open(completeRedirectURL, '_system');
                        setTimeout(function () {
                            window.location.replace(trafficbackURL);
                        }, 1000);
                    });
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initInappRd);
            } else {
                initInappRd();
            }
          `}
        </Script> */}
      </head>
      <body className={`antialiased ${inter.variable} font-sans`}>
        {/* NoScript GTM - JANGAN DIHAPUS JIKA MASIH INGIN MENGGUNAKAN GTM */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TJXJBGLX" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        {children}
      </body>
    </html>
  );
}
