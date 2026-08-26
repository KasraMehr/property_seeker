import { useState, useEffect } from "react";
import userService from "@/features/users-management/services/userService";

/**
 * Fetches all users once and returns a { id → full_name } map.
 * Used to resolve created_by IDs to human-readable names without backend changes.
 */
export default function useUsersMap() {
  const [map, setMap] = useState({});

  useEffect(() => {
    let cancelled = false;
    userService
      .getAll()
      .then((res) => {
        if (cancelled) return;
        const users = res?.data?.results || res?.data || [];
        const m = {};
        users.forEach((u) => {
          m[u.id] = u.full_name || u.username || `#${u.id}`;
        });
        setMap(m);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return map;
}
