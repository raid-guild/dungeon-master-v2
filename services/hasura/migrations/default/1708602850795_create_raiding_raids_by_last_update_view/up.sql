CREATE VIEW raiding_raids_by_last_update AS
SELECT
    r.id AS raid_id,
    r.name AS raid_name,
    latest_update.update AS latest_update,
    latest_update.created_at AS latest_update_created_at
FROM "public"."raids" r
LEFT JOIN LATERAL (
    SELECT
        u.update,
        u.created_at
    FROM "public"."updates" u
    WHERE u.raid_id = r.id
    ORDER BY u.created_at DESC
    LIMIT 1
) AS latest_update ON true
WHERE r.status_key = 'RAIDING'
ORDER BY latest_update_created_at DESC;
