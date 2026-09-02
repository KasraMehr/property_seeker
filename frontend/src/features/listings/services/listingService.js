import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.LISTINGS.LIST.url, { params });

const getById = (id) => api.get(API_ENDPOINTS.LISTINGS.DETAIL(id).url);

/** PUT /api/listing/<id>/review/  body: { review_status } */
const review = (id, review_status) =>
  api.put(API_ENDPOINTS.LISTINGS.REVIEW(id).url, { review_status });

/** PUT /api/listing/bulk/review-change-status/ */
const bulkReview = (listing_ids, review_status) =>
  api.put(API_ENDPOINTS.LISTINGS.BULK_REVIEW.url, {
    listing_ids,
    review_status,
  });

/** POST /api/listing/<id>/promote/ */
const promote = (id, data) =>
  api.post(API_ENDPOINTS.LISTINGS.PROMOTE(id).url, data);

const listingService = {
  getAll,
  getById,
  review,
  bulkReview,
  promote,
};

export default listingService;