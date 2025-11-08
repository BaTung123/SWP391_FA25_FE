import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import api from "../../config/axios";

const PAGE_SIZE = 12;
const IMG_FALLBACK =
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&auto=format&fit=crop";

// Icons
const IconColor = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="currentColor" d="M12 3a9 9 0 1 1-6.364 2.636A9 9 0 0 1 12 3m0 2a7 7 0 1 0 4.95 2.05A7 7 0 0 0 12 5Zm0 3l3 6H9l3-6Z"/>
  </svg>
);
const IconBattery = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="currentColor" d="M16,7H3A2,2 0 0,0 1,9V15A2,2 0 0,0 3,17H16A2,2 0 0,0 18,15V14H19A1,1 0 0,0 20,13V11A1,1 0 0,0 19,10H18V9A2,2 0 0,0 16,7Z"/>
  </svg>
);

// helpers
const formatKWh = (val) => {
  const n = Number(val);
  if (!isFinite(n)) return "— kWh";
  return n > 1000 ? `${(n / 1000).toFixed(0)} kWh` : `${n} kWh`;
};
const normStatus = (s) => {
  const v = String(s ?? "").toLowerCase();
  if (v === "1" || v === "active" || v === "dang hoat dong") return "active";
  if (v === "0" || v === "inactive" || v === "khong hoat dong") return "inactive";
  if (v.includes("maint")) return "maintenance";
  if (v.includes("idle") || v.includes("ranh")) return "idle";
  return "active";
};
const statusBadge = (s) => {
  const map = {
    active: { text: "Đang hoạt động", cls: "bg-green-100 text-green-800" },
    maintenance: { text: "Bảo trì", cls: "bg-yellow-100 text-yellow-800" },
    idle: { text: "Đang rảnh", cls: "bg-blue-100 text-blue-800" },
    inactive: { text: "Không hoạt động", cls: "bg-slate-100 text-slate-700" },
  };
  const it = map[normStatus(s)] ?? map.active;
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${it.cls}`}>{it.text}</span>;
};

const CarCard = ({ car }) => {
  const image = car.image && car.image !== "string" ? car.image : IMG_FALLBACK;
  return (
    <div className="group rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300 overflow-hidden">
      <img
        src={image}
        alt={car.carName}
        onError={(e) => (e.currentTarget.src = IMG_FALLBACK)}
        className="h-56 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-slate-900 font-semibold text-base truncate">
            {car.carName || "—"}
          </h3>
          {statusBadge(car.status)}
        </div>
        <div className="mt-1 text-sm text-slate-600 truncate">
          Biển số: <span className="font-medium">{car.plateNumber || "—"}</span>
        </div>
        <div className="mt-2 flex items-center gap-5 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <IconColor />
            <span className="truncate">{car.color || "—"}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconBattery />
            <span>{formatKWh(car.batteryCapacity)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const CarRow = ({ car }) => {
  const image = car.image && car.image !== "string" ? car.image : IMG_FALLBACK;
  return (
    <div className="group rounded-2xl bg-white border border-slate-100 p-3 md:p-4 flex gap-4 items-center shadow-sm hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300">
      <div className="relative w-[140px] h-[96px] shrink-0 overflow-hidden rounded-xl">
        <img
          src={image}
          alt={car.carName}
          onError={(e) => (e.currentTarget.src = IMG_FALLBACK)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-slate-900 font-semibold text-base truncate">
            {car.carName || "—"}
          </h3>
          {statusBadge(car.status)}
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Biển số: <span className="font-medium">{car.plateNumber || "—"}</span>
        </div>
        <div className="mt-1 text-sm text-slate-600 flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <IconColor />
            <span className="truncate">{car.color || "—"}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconBattery />
            <span>{formatKWh(car.batteryCapacity)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default function WarehousePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // NEW
  const [sortKey, setSortKey] = useState("name_asc");
  const [view, setView] = useState("grid");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // đúng yêu cầu: không dùng /api vì đã config baseURL
        const res = await api.get("/Car");
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCars(list);
      } catch (e) {
        console.error("Fetch /Car error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const brands = useMemo(() => {
    const setB = new Set(
      cars.map((c) => c.brand).filter((b) => b && String(b).trim())
    );
    return ["all", ...Array.from(setB)];
  }, [cars]);

  const processed = useMemo(() => {
    const kw = query.trim().toLowerCase();
    let data = cars.filter((c) => {
      const name = String(c.carName ?? "").toLowerCase();
      const brand = String(c.brand ?? "").toLowerCase();
      const plate = String(c.plateNumber ?? "").toLowerCase();
      const sOk =
        statusFilter === "all" ? true : normStatus(c.status) === statusFilter;
      const bOk = brandFilter === "all" || String(c.brand) === brandFilter;
      const kOk = !kw || name.includes(kw) || brand.includes(kw) || plate.includes(kw);
      return sOk && bOk && kOk;
    });

    switch (sortKey) {
      case "name_asc":
        data.sort((a, b) =>
          String(a.carName ?? "").localeCompare(String(b.carName ?? ""))
        );
        break;
      case "name_desc":
        data.sort((a, b) =>
          String(b.carName ?? "").localeCompare(String(a.carName ?? ""))
        );
        break;
      case "battery_desc":
        data.sort(
          (a, b) =>
            Number(b.batteryCapacity ?? 0) - Number(a.batteryCapacity ?? 0)
        );
        break;
      case "battery_asc":
        data.sort(
          (a, b) =>
            Number(a.batteryCapacity ?? 0) - Number(b.batteryCapacity ?? 0)
        );
        break;
      default:
        break;
    }
    return data;
  }, [cars, query, brandFilter, statusFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const slice = processed.slice(start, start + PAGE_SIZE);
  useEffect(() => setPage(1), [query, brandFilter, statusFilter, sortKey]);

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Header />

      {/* Toolbar */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="relative md:w-[420px]">
                <input
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 pr-10 outline-none focus:ring-4 focus:ring-slate-100"
                  placeholder="Tìm theo tên / hãng / biển số"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:ring-4 focus:ring-slate-100 min-w-[180px]"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b === "all" ? "Tất cả hãng" : b}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:ring-4 focus:ring-slate-100 min-w-[200px]"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="idle">Đang rảnh</option>
                  <option value="inactive">Không hoạt động</option>
                </select>

                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:ring-4 focus:ring-slate-100 min-w-[200px]"
                >
                  <option value="name_asc">Tên (A → Z)</option>
                  <option value="name_desc">Tên (Z → A)</option>
                  <option value="battery_desc">Pin (cao → thấp)</option>
                  <option value="battery_asc">Pin (thấp → cao)</option>
                </select>

                <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    className={`px-3 h-11 ${view === "grid" ? "bg-slate-100" : "bg-white"}`}
                    onClick={() => setView("grid")}
                    title="Grid"
                  >
                    ⬛⬛
                  </button>
                  <button
                    className={`px-3 h-11 ${view === "list" ? "bg-slate-100" : "bg-white"}`}
                    onClick={() => setView("list")}
                    title="List"
                  >
                    ≣
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-5">
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {loading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <div key={i} className="rounded-2xl bg-white border border-slate-100 p-4">
                      <div className="animate-pulse rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 h-56" />
                      <div className="mt-4 h-4 w-2/3 bg-slate-200 rounded" />
                      <div className="mt-2 h-3 w-1/2 bg-slate-100 rounded" />
                    </div>
                  ))
                : slice.map((car) => <CarCard key={car.carId ?? car.id} car={car} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {loading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <div key={i} className="rounded-2xl bg-white border border-slate-100 p-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-[160px] h-[100px] bg-slate-200 rounded-xl animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 w-1/2 bg-slate-200 rounded" />
                          <div className="mt-2 h-3 w-1/3 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </div>
                  ))
                : slice.map((car) => <CarRow key={car.carId ?? car.id} car={car} />)}
            </div>
          )}

          {/* Pagination */}
          {!loading && processed.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 h-10 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
              >
                ← Trước
              </button>
              <span className="text-slate-600 text-sm">
                Trang <b>{page}</b> / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 h-10 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          )}

          {!loading && processed.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 py-16 grid place-items-center">
              <div className="text-center">
                <div className="text-5xl mb-2">🗂️</div>
                <p className="text-slate-600">Không có xe phù hợp</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
