import { useCallback, useEffect } from "react";

import useResource from "@/shared/resource/useResource";
import useResourceQuery from "@/shared/resource/useResourceQuery";

import listingService from "@/features/listings/services/listingService";

/**
 * useListing
 *
 * Listing resource hook.
 *
 * Responsibilities:
 * - Compose generic resource logic.
 * - Compose generic query logic.
 * - Provide listing-specific actions.
 * - Automatically refresh data when query changes.
 */
export default function useListing() {
  // Generic CRUD + fetch state
  const resource = useResource({
    service: listingService,
  });

  // Generic query management
  const query = useResourceQuery({
    // TODO: pass SHCEMA
    // filterSchema: LISTING_FILTER_SCHEMA,
    // filterOptions: {
    //   users: operators,
    //   status: statuses,
    // },
    pageSize: 25,
    initialOrdering: "-created_at",
  });

  /**
   * Reload current page using active query params.
   */
  const refresh = useCallback(() => {
    return resource.fetchList(query.queryParams);
  }, [resource.fetchList, query.queryParams]);

  /**
   * Automatically refetch whenever
   * search / filters / ordering / page changes.
   */
  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Assign listing to an operator.
   */
  const assign = useCallback(
    async (listingId, userId) => {
      await listingService.assign(listingId, userId);

      await refresh();
    },
    [refresh],
  );

  /**
   * Convert listing to owner.
   */
  const convertToOwner = useCallback(
    async (listingId, ownerData) => {
      await listingService.convertToOwner(listingId, ownerData);

      await refresh();
    },
    [refresh],
  );

  /**
   * Convert listing to property.
   */
  const convertToProperty = useCallback(
    async (listingId, propertyData) => {
      await listingService.convertToProperty(listingId, propertyData);

      await refresh();
    },
    [refresh],
  );

  return {
    // Generic resource
    ...resource,

    // Refresh
    refresh,

    // Filters
    filters: query.filters,
    setFilter: query.setFilter,
    clearFilter: query.clearFilter,
    clearAll: query.clearAll,

    //Active chips
    activeChips: query.activeChips,
    activeCount: query.activeCount,

    // Sorting
    ordering: query.ordering,
    setOrdering: query.setOrdering,

    // Pagination
    page: query.page,
    setPage: query.setPage,

    // Backend query params
    queryParams: query.queryParams,

    // Listing specific actions
    assign,
    convertToOwner,
    convertToProperty,
  };
}
