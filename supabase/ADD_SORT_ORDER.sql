-- Ekzekuto nëse ke krijuar tashmë tabelën videos PA sort_order.
-- Shton kolonën sort_order dhe i jep vlera ekzistuese (0, 1, 2, ...).
ALTER TABLE videos ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Jep rend sipas created_at për rreshtat që kanë sort_order NULL ose të barabartë
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 AS rn
  FROM videos
)
UPDATE videos SET sort_order = ordered.rn
FROM ordered WHERE videos.id = ordered.id;
