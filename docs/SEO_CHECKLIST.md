# SEO – Çfarë është implementuar

## 1. Meta & share (index.html + React)

- **Title, description** – në `index.html` si default; nga Admin (Site & SEO) përditësohen edhe në React për crawlerët që ekzekutojnë JS.
- **Open Graph** – `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale`, `og:image:width/height` për share në TikTok/Facebook/Twitter.
- **Twitter Card** – `summary_large_image` me title, description, image.
- **Canonical** – `https://oldgem.net` në head.
- Nga Admin mund të ndryshosh: **Meta title**, **Meta description**, **OG/Share image URL** (për imazhin kur ndahet linku).

## 2. JSON-LD (Schema.org)

- Në `index.html` është shtuar **WebSite** schema (emër, url, përshkrim, publisher, language) që Google ta lexojë direkt nga HTML.

## 3. Struktura faqeje

- **Një H1** – titulli kryesor i faqes (headline nga Admin) është `<h1>`.
- **Seksion “How it works”** – paragraf i shkurtër me fjalë kyçe (premium video, free registration, watch on any device). Teksti mund të ndryshohet nga Admin → **SEO intro**.
- **Lazy loading** – thumbnail-at e videove kanë `loading="lazy"` për ngarkim më të shpejtë.

## 4. Sitemap & robots

- **sitemap.xml** – një URL kanonik (`https://oldgem.net/`), `lastmod`, `changefreq`, `priority`.
- **robots.txt** – lejon Google, Bing, Twitter, Facebook dhe referon te sitemap.

## 5. Admin – Site & SEO

- Meta title  
- Meta description  
- OG / Share image URL  
- Landing headline (H1)  
- Landing subhead  
- **SEO intro** – paragrafi nën titull (për SEO; nëse bosh, përdoret teksti default).  
- Footer text  

Për **seo_intro** në tabelën ekzistuese `site_settings`, ekzekuto në Supabase SQL Editor skedarin **`supabase/ADD_SEO_INTRO.sql`**.

## 6. Këshilla shtesë

- Përditëso **lastmod** në sitemap kur bësh ndryshime të mëdha.
- Testo share-in: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator).
- Kontrollo titullin dhe përshkrimin në [Google Search Console](https://search.google.com/search-console) pas indeksimit.
