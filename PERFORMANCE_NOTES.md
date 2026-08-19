PERFORMANCE / UX NOTES
=======================
The safest performance changes in this patch are limited to the Academy mobile filter
layout and existing lightweight rendering.

The source already contained:
- requestAnimationFrame-throttled header scroll state;
- passive scroll listener;
- lightweight FloatingActions without Framer Motion;
- database-driven blog cover_image_url support.

This patch avoids adding new animation libraries or continuous scroll loops.
