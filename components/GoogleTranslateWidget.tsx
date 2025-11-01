"use client";

import { useEffect, useRef } from "react";

/**
 * Google Translate Widget - provides instant, free translation for your entire page.
 * No API key required. Just drop this component into your layout or header.
 * 
 * Usage:
 * import GoogleTranslateWidget from "@/components/GoogleTranslateWidget";
 * <GoogleTranslateWidget />
 */
export default function GoogleTranslateWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) {
      return;
    }

    // Skip if already loaded
    if ((window as any).google?.translate) {
      initialized.current = true;
      return;
    }

    // Mark as initialized immediately to prevent race conditions
    initialized.current = true;

    // Add custom styles to blend with header and HIDE the banner
    const style = document.createElement("style");
    style.id = "google-translate-custom-styles";
    style.textContent = `
      /* Hide the annoying top banner completely */
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
      }
      
      body {
        top: 0 !important;
        position: static !important;
      }
      
      /* Style the widget to match header */
      #google_translate_element {
        display: inline-block;
      }
      
      #google_translate_element .goog-te-gadget {
        font-family: inherit;
        font-size: 0 !important;
      }
      
      #google_translate_element .goog-te-gadget-simple {
        background-color: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 9999px !important;
        padding: 0.5rem 0.75rem !important;
        font-size: 0.75rem !important;
        font-weight: 600 !important;
        color: white !important;
        transition: all 0.2s !important;
        line-height: 1 !important;
      }
      
      #google_translate_element .goog-te-gadget-simple:hover {
        background-color: rgba(255, 255, 255, 0.15) !important;
      }
      
      #google_translate_element .goog-te-gadget-simple .goog-te-menu-value {
        color: white !important;
      }
      
      #google_translate_element .goog-te-gadget-simple .goog-te-menu-value span {
        color: white !important;
        font-size: 0.75rem !important;
      }
      
      #google_translate_element .goog-te-gadget-simple img {
        display: none !important;
      }
      
      #google_translate_element .goog-te-gadget-icon {
        display: none !important;
      }
      
      /* Additional banner hiding */
      .goog-te-banner-frame {
        display: none !important;
      }
      
      iframe.goog-te-banner-frame {
        display: none !important;
      }
      
      #goog-gt-tt {
        display: none !important;
      }
      
      .goog-text-highlight {
        background: none !important;
        box-shadow: none !important;
      }
    `;
    
    // Only add style if not already present
    if (!document.getElementById("google-translate-custom-styles")) {
      document.head.appendChild(style);
    }

    // Load Google Translate script
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    
    // Initialize widget callback
    (window as any).googleTranslateElementInit = () => {
      const element = document.getElementById("google_translate_element");
      if (element && !element.hasChildNodes()) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "hi,te,en,ta,kn,ml,mr,bn,gu,pa,ur",
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    document.body.appendChild(script);

    // Aggressively hide the banner using MutationObserver
    const hideBanner = () => {
      // Hide all possible banner elements
      const selectors = [
        '.goog-te-banner-frame',
        'iframe.goog-te-banner-frame',
        '.skiptranslate iframe',
        '#goog-gt-tt',
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.height = '0';
        });
      });
      
      // Force body to stay at top
      if (document.body) {
        document.body.style.top = '0';
        document.body.style.position = 'static';
      }
    };

    // Watch for banner injection
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        hideBanner();
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Hide immediately and set interval as backup
    hideBanner();
    const intervalId = setInterval(hideBanner, 100);

    return () => {
      // Cleanup on unmount
      clearInterval(intervalId);
      observer.disconnect();
      
      const existingScript = document.querySelector(
        'script[src*="translate.google.com"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      const existingStyle = document.getElementById("google-translate-custom-styles");
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
      initialized.current = false;
    };
  }, []);

  return (
    <div className="inline-flex items-center">
      <div id="google_translate_element" className="inline-block"></div>
    </div>
  );
}
