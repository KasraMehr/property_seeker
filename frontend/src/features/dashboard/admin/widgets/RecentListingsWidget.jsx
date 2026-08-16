import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/formatters";

export default function RecentListingsWidget({ listings = [], loading }) {
  const recentListings = listings.slice(0, 5);

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">آخرین آگهی‌ها</h2>

        <Link
          to="/admin/listings"
          className="text-sm text-primary hover:underline"
        >
          مشاهده همه
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-12 rounded-lg bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      ) : recentListings.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted">
          هنوز آگهی‌ای ثبت نشده است
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted">
                  عنوان
                </th>

                <th className="px-3 py-3 text-right text-xs font-semibold text-muted">
                  قیمت
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentListings.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Title */}
                  <td className="px-3 py-3 max-w-60">
                    <div className="truncate">
                      <span
                        className="font-medium text-foreground"
                        title={listing.title}
                      >
                        {listing.title || "بدون عنوان"}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    {listing.listed_sale_price ? (
                      <div className="flex flex-col">
                        <span className="text-[11px] text-muted">فروش</span>
                        <span className="font-medium text-emerald-600">
                          {formatPrice(listing.listed_sale_price)}
                        </span>
                      </div>
                    ) : listing.listed_rent_amount ? (
                      <div className="flex flex-col">
                        <span className="text-[11px] text-muted">اجاره</span>
                        <span className="font-medium text-sky-600">
                          {formatPrice(listing.listed_rent_amount)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
