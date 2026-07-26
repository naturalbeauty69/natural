<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Sitemap — Natural Beauty Clinic &amp; Academy</title>
<style>
  body { font-family: -apple-system, Sora, sans-serif; background:#F8F5EE; color:#1F2420; margin:0; padding:40px 24px; }
  .wrap { max-width: 900px; margin: 0 auto; }
  h1 { color:#0E4B3C; font-size: 22px; margin-bottom: 4px; }
  p.sub { color:#4B534D; font-size: 13px; margin-top:0; margin-bottom: 24px; }
  table { width:100%; border-collapse: collapse; background:#FBF9F4; border-radius:12px; overflow:hidden; box-shadow: 0 8px 30px -12px rgba(14,75,60,0.18); }
  th { text-align:left; background:#0E4B3C; color:#F8F5EE; font-size:12px; text-transform:uppercase; letter-spacing:0.08em; padding:12px 16px; }
  td { padding:12px 16px; border-top:1px solid rgba(14,75,60,0.08); font-size:14px; }
  tr:hover td { background:#F3E6BE33; }
  a { color:#1C6B4F; text-decoration:none; }
  a:hover { color:#C9A227; text-decoration:underline; }
  .count { color:#C9A227; font-weight:600; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Natural Beauty Clinic &amp; Academy — Sitemap</h1>
  <p class="sub"><span class="count"><xsl:value-of select="count(sm:urlset/sm:url)"/></span> pages indexed for search engines.</p>
  <table>
    <tr><th>URL</th><th>Last Modified</th></tr>
    <xsl:for-each select="sm:urlset/sm:url">
      <tr>
        <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
        <td><xsl:value-of select="substring(sm:lastmod, 1, 10)"/></td>
      </tr>
    </xsl:for-each>
  </table>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
