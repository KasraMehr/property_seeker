import { useState, useEffect, useMemo } from "react";
import {
  Inbox,
  AlertCircle,
  ExternalLink,
  Phone,
  MapPin,
  User,
  Home,
  Calendar,
  Layers,
  FileX,
  Shield,
  Briefcase,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import StatusBadge from "@/shared/ui/StatusBadge";
import Button from "@/shared/ui/Button";
import ThemeToggle from "../shared/ThemeToggle";
import ScoreBadge from "@/shared/ui/ScoreBadge";
import RoleBadge from "../shared/ui/RoleBadge";

/**
 * TableShowcase — two real tables using MSW handlers
 * 1. Listings: GET /api/listing/list/
 * 2. Users: GET /api/accounts/users/
 */
export default function TableShowcase() {
  // ── Listings state ──
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState(null);
  const [listingsSort, setListingsSort] = useState({ key: null, dir: "asc" });
  const [listingsPage, setListingsPage] = useState(1);
  const [listingsSelected, setListingsSelected] = useState([]);

  // ── Users state ──
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [usersSort, setUsersSort] = useState({ key: null, dir: "asc" });
  const [usersPage, setUsersPage] = useState(1);
  const [usersSelected, setUsersSelected] = useState([]);

  const pageSize = 5;

  // Fetch listings
  useEffect(() => {
    let cancelled = false;
    const fetchListings = async () => {
      setListingsLoading(true);
      try {
        const res = await fetch("/api/listing/list/");
        if (!res.ok) throw new Error("خطا در دریافت آگهی‌ها");
        const json = await res.json();
        if (!cancelled)
          setListings(Array.isArray(json) ? json : json.results || []);
      } catch (err) {
        if (!cancelled) setListingsError(err.message);
      } finally {
        if (!cancelled) setListingsLoading(false);
      }
    };
    fetchListings();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch users
  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await fetch("/api/accounts/users/");
        if (!res.ok) throw new Error("خطا در دریافت کاربران");
        const json = await res.json();
        if (!cancelled)
          setUsers(Array.isArray(json) ? json : json.results || []);
      } catch (err) {
        if (!cancelled) setUsersError(err.message);
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    };
    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sort helpers
  const handleListingsSort = (key) => {
    setListingsSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const handleUsersSort = (key) => {
    setUsersSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const applySort = (data, sort) => {
    if (!sort.key) return data;
    return [...data].sort((a, b) => {
      let av = a[sort.key];
      let bv = b[sort.key];
      if (sort.key === "district") {
        av = a.district?.name || "";
        bv = b.district?.name || "";
      }
      if (sort.key === "assigned") {
        av = a.assigned_to?.full_name || "";
        bv = b.assigned_to?.full_name || "";
      }
      if (sort.key === "agency") {
        av = a.agency?.name || "";
        bv = b.agency?.name || "";
      }
      if (sort.key === "role") {
        av = a.role?.[0]?.name || "";
        bv = b.role?.[0]?.name || "";
      }
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  };

  const listingsSorted = useMemo(
    () => applySort(listings, listingsSort),
    [listings, listingsSort],
  );
  const usersSorted = useMemo(
    () => applySort(users, usersSort),
    [users, usersSort],
  );

  const listingsPaged = useMemo(() => {
    const start = (listingsPage - 1) * pageSize;
    return listingsSorted.slice(start, start + pageSize);
  }, [listingsSorted, listingsPage]);

  const usersPaged = useMemo(() => {
    const start = (usersPage - 1) * pageSize;
    return usersSorted.slice(start, start + pageSize);
  }, [usersSorted, usersPage]);

  const listingsTotalPages = Math.ceil(listingsSorted.length / pageSize);
  const usersTotalPages = Math.ceil(usersSorted.length / pageSize);

  // Select helpers
  const toggleSelect = (id, selected, setSelected, paged) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = (paged, selected, setSelected) => {
    const all = paged.every((r) => selected.includes(r.id));
    if (all) {
      setSelected((prev) =>
        prev.filter((id) => !paged.find((r) => r.id === id)),
      );
    } else {
      setSelected((prev) => [...new Set([...prev, ...paged.map((r) => r.id)])]);
    }
  };

  const listingsAllSelected =
    listingsPaged.length > 0 &&
    listingsPaged.every((r) => listingsSelected.includes(r.id));
  const usersAllSelected =
    usersPaged.length > 0 &&
    usersPaged.every((r) => usersSelected.includes(r.id));

  // Format helpers
  const formatPrice = (value) => {
    if (!value) return "—";
    return new Intl.NumberFormat("fa-IR").format(value) + " ت";
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fa-IR");
  };

  const sourceBadge = (source) => {
    const map = {
      divar: {
        bg: "bg-purple-500/10",
        text: "text-purple-500",
        label: "دیوار",
      },
      sheypoor: {
        bg: "bg-orange-500/10",
        text: "text-orange-500",
        label: "شیپور",
      },
    };
    const s = map[source] || {
      bg: "bg-muted/10",
      text: "text-muted",
      label: source,
    };
    return (
      <span
        className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium ${s.bg} ${s.text}`}
      >
        {s.label}
      </span>
    );
  };

  // Error component
  const ErrorState = ({ message, onRetry }) => (
    <div className="min-h-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle size={32} className="text-danger mx-auto mb-2" />
        <p className="text-sm text-muted mb-3">{message}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          تلاش مجدد
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6 space-y-10">
      <ThemeToggle />

      {/* SECTION 1: LISTINGS TABLE */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            آگهی‌ها
          </h1>
          <span className="text-xs text-muted">{listings.length} مورد</span>
        </div>

        {listingsError ? (
          <ErrorState
            message={listingsError}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <>
            <Table
              sortable
              onSort={handleListingsSort}
              sortState={listingsSort}
              loading={listingsLoading}
              emptyState={
                <Table.EmptyState
                  icon={Inbox}
                  title="آگهی یافت نشد"
                  description="هنوز آگهی ثبت نشده است."
                  action={
                    <Button variant="primary" size="sm">
                      آگهی جدید
                    </Button>
                  }
                />
              }
            >
              <Table.Header>
                <Table.Column align="center" width="40px">
                  <input
                    type="checkbox"
                    checked={listingsAllSelected}
                    onChange={() =>
                      toggleAll(
                        listingsPaged,
                        listingsSelected,
                        setListingsSelected,
                      )
                    }
                    className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
                  />
                </Table.Column>
                <Table.Column sortKey="title">عنوان</Table.Column>
                <Table.Column sortKey="status" align="center">
                  وضعیت
                </Table.Column>
                <Table.Column sortKey="score" align="center">
                  امتیاز
                </Table.Column>
                <Table.Column sortKey="source" align="center">
                  منبع
                </Table.Column>
                <Table.Column sortKey="district">منطقه</Table.Column>
                <Table.Column sortKey="assigned">کارشناس</Table.Column>
                <Table.Column sortKey="listed_sale_price">قیمت</Table.Column>
                <Table.Column sortKey="build_year">سال ساخت</Table.Column>
                <Table.Column sortKey="room_count" align="center">
                  اتاق
                </Table.Column>
                <Table.Column sortKey="floor_number" align="center">
                  طبقه
                </Table.Column>
                <Table.Column sortKey="created_at">تاریخ</Table.Column>
                <Table.Column align="center">عملیات</Table.Column>
              </Table.Header>

              <Table.Body
                empty={!listingsLoading && listingsPaged.length === 0}
              >
                {listingsPaged.map((row) => (
                  <Table.Row
                    key={row.id}
                    selected={listingsSelected.includes(row.id)}
                  >
                    <Table.Cell align="center">
                      <input
                        type="checkbox"
                        checked={listingsSelected.includes(row.id)}
                        onChange={() =>
                          toggleSelect(
                            row.id,
                            listingsSelected,
                            setListingsSelected,
                            listingsPaged,
                          )
                        }
                        className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
                      />
                    </Table.Cell>

                    {/* Title + thumbnail */}
                    <Table.Cell>
                      <div className="flex items-center gap-2.5 min-w-0">
                        {row.hs_picture ? (
                          <img
                            src={row.hs_picture}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-border"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-(--role-subtle)/30 border border-border flex items-center justify-center shrink-0">
                            <FileX size={14} className="text-muted" />
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-medium text-sm truncate max-w-40">
                            {row.title}
                          </span>
                          <div className="flex items-center gap-1 text-muted text-[11px]">
                            <Phone size={10} />
                            <span className="dir-ltr">{row.phone}</span>
                          </div>
                        </div>
                      </div>
                    </Table.Cell>

                    {/* Status */}
                    <Table.Cell align="center">
                      <StatusBadge
                        status={row.status}
                        type="property"
                        variant="soft"
                        size="sm"
                        showIcon
                      />
                    </Table.Cell>

                    {/* Score */}
                    <Table.Cell align="center">
                      <ScoreBadge
                        score={row.score}
                        size="sm"
                        showLabel={false}
                      />
                    </Table.Cell>

                    {/* Source */}
                    <Table.Cell align="center">
                      {sourceBadge(row.source)}
                    </Table.Cell>

                    {/* District */}
                    <Table.Cell>
                      <div className="flex items-center gap-1 text-muted text-xs">
                        <MapPin size={12} />
                        <span>{row.district?.name || "—"}</span>
                      </div>
                    </Table.Cell>

                    {/* Assigned */}
                    <Table.Cell>
                      {row.assigned_to ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-(--role-primary)/10 text-(--role-primary) flex items-center justify-center text-[9px] font-bold">
                            {row.assigned_to.full_name?.charAt(0)}
                          </div>
                          <span className="text-xs text-foreground">
                            {row.assigned_to.full_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">تخصیص نیافته</span>
                      )}
                    </Table.Cell>

                    {/* Price */}
                    <Table.Cell>
                      <div className="flex flex-col text-xs gap-0.5">
                        {row.listed_sale_price ? (
                          <span className="text-foreground font-medium">
                            {formatPrice(row.listed_sale_price)}
                          </span>
                        ) : row.listed_rent_amount ? (
                          <>
                            <span className="text-foreground font-medium">
                              {formatPrice(row.listed_rent_amount)}
                            </span>
                            {row.listed_deposit_amount && (
                              <span className="text-muted text-[10px]">
                                ودیعه: {formatPrice(row.listed_deposit_amount)}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                        {row.price_per_meter_toman && (
                          <span className="text-[10px] text-(--role-primary)">
                            متری: {formatPrice(row.price_per_meter_toman)}
                          </span>
                        )}
                      </div>
                    </Table.Cell>

                    {/* Build year */}
                    <Table.Cell>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Calendar size={12} />
                        <span>{row.build_year || "—"}</span>
                      </div>
                    </Table.Cell>

                    {/* Room count */}
                    <Table.Cell align="center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted">
                        <Home size={12} />
                        <span>{row.room_count ?? "—"}</span>
                      </div>
                    </Table.Cell>

                    {/* Floor number */}
                    <Table.Cell align="center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted">
                        <Layers size={12} />
                        <span>{row.floor_number ?? "—"}</span>
                      </div>
                    </Table.Cell>

                    {/* Date */}
                    <Table.Cell className="text-muted text-xs">
                      {formatDate(row.created_at)}
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell align="center">
                      <TableActions
                        actions={[
                          {
                            label: "مشاهده",
                            icon: ExternalLink,
                            onClick: () => console.log("view", row.id),
                          },
                          {
                            label: "تبدیل به ملک",
                            icon: Home,
                            onClick: () => console.log("convert", row.id),
                          },
                        ]}
                        onEdit={() => console.log("edit", row.id)}
                        onDelete={() => console.log("delete", row.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <TablePagination
              page={listingsPage}
              totalPages={listingsTotalPages}
              onChange={setListingsPage}
            />
          </>
        )}
      </section>

      {/* ════════════════════════════════════════
          SECTION 2: USERS TABLE
          ════════════════════════════════════════ */}
      <section className="pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            کاربران
          </h1>
          <span className="text-xs text-muted">{users.length} مورد</span>
        </div>

        {usersError ? (
          <ErrorState
            message={usersError}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <>
            <Table
              sortable
              onSort={handleUsersSort}
              sortState={usersSort}
              loading={usersLoading}
              emptyState={
                <Table.EmptyState
                  icon={Inbox}
                  title="کاربری یافت نشد"
                  description="هنوز کاربری ثبت نشده است."
                  action={
                    <Button variant="primary" size="sm">
                      کاربر جدید
                    </Button>
                  }
                />
              }
            >
              <Table.Header>
                <Table.Column align="center" width="40px">
                  <input
                    type="checkbox"
                    checked={usersAllSelected}
                    onChange={() =>
                      toggleAll(usersPaged, usersSelected, setUsersSelected)
                    }
                    className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
                  />
                </Table.Column>
                <Table.Column sortKey="full_name">نام</Table.Column>
                <Table.Column sortKey="phone">شماره تماس</Table.Column>
                <Table.Column sortKey="national_id">کد ملی</Table.Column>
                <Table.Column sortKey="role" align="center">
                  نقش
                </Table.Column>
                <Table.Column sortKey="agency">آژانس</Table.Column>
                <Table.Column align="center">مناطق خدمت</Table.Column>
                <Table.Column sortKey="is_active" align="center">
                  وضعیت
                </Table.Column>
                <Table.Column sortKey="created_at">تاریخ عضویت</Table.Column>
                <Table.Column align="center">عملیات</Table.Column>
              </Table.Header>

              <Table.Body empty={!usersLoading && usersPaged.length === 0}>
                {usersPaged.map((row) => (
                  <Table.Row
                    key={row.id}
                    selected={usersSelected.includes(row.id)}
                  >
                    <Table.Cell align="center">
                      <input
                        type="checkbox"
                        checked={usersSelected.includes(row.id)}
                        onChange={() =>
                          toggleSelect(
                            row.id,
                            usersSelected,
                            setUsersSelected,
                            usersPaged,
                          )
                        }
                        className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
                      />
                    </Table.Cell>

                    {/* Name */}
                    <Table.Cell>
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                          ${
                            row.is_owner
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-(--role-primary)/10 text-(--role-primary)"
                          }
                        `}
                        >
                          {row.full_name?.charAt(0)}
                        </div>
                        <Table.Cell align="center">
                          {row.role?.map((r, i) => (
                            <RoleBadge
                              key={i}
                              role={r.name === "مدیر" ? "admin" : "operator"}
                              variant="soft"
                              size="sm"
                            />
                          ))}
                        </Table.Cell>
                      </div>
                    </Table.Cell>

                    {/* Phone */}
                    <Table.Cell className="text-muted font-mono text-xs dir-ltr">
                      {row.phone}
                    </Table.Cell>

                    {/* National ID */}
                    <Table.Cell className="text-muted font-mono text-xs dir-ltr">
                      {row.national_id}
                    </Table.Cell>

                    {/* Role */}
                    <Table.Cell align="center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {row.role?.map((r, i) => (
                          <span
                            key={i}
                            className={`
                              inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium
                              ${
                                r.name === "مدیر"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-(--role-primary)/10 text-(--role-primary)"
                              }
                            `}
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </Table.Cell>

                    {/* Agency */}
                    <Table.Cell>
                      <div className="flex items-center gap-1 text-muted text-xs">
                        <Briefcase size={12} />
                        <span>{row.agency?.name || "—"}</span>
                      </div>
                    </Table.Cell>

                    {/* Service districts */}
                    <Table.Cell align="center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {row.service_districts?.map((d) => (
                          <span
                            key={d.id}
                            className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-(--role-subtle)/30 text-muted"
                          >
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </Table.Cell>

                    {/* Active status */}
                    <Table.Cell align="center">
                      <StatusBadge
                        status={row.is_active ? "active" : "inactive"}
                        type="user"
                        variant="dot"
                        size="sm"
                      />
                    </Table.Cell>

                    {/* Date */}
                    <Table.Cell className="text-muted text-xs">
                      {formatDate(row.created_at)}
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell align="center">
                      <TableActions
                        onView={() => console.log("view user", row.id)}
                        onEdit={() => console.log("edit user", row.id)}
                        onDelete={() => console.log("delete user", row.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <TablePagination
              page={usersPage}
              totalPages={usersTotalPages}
              onChange={setUsersPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
