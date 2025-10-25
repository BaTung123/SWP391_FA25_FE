import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import api from "../../config/axios";

const PAGE_SIZE = 12;
const IMG_FALLBACK =
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&auto=format&fit=crop";

// Icons nhỏ
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

// Format pin: nếu backend trả quá lớn (ví dụ Wh), tự chuyển sang kWh
const formatKWh = (val) => {
  const n = Number(val);
  if (!isFinite(n)) return "— kWh";
  return n > 1000 ? `${(n / 1000).toFixed(0)} kWh` : `${n} kWh`;
};

const CarCard = ({ car }) => {
  const image =
    car.image && car.image !== "string" ? car.image : IMG_FALLBACK;

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
        <h3 className="text-slate-900 font-semibold text-base truncate">
          {car.carName || "—"}
        </h3>
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
  const image =
    car.image && car.image !== "string" ? car.image : IMG_FALLBACK;

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
        <h3 className="text-slate-900 font-semibold text-base truncate">
          {car.carName || "—"}
        </h3>
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

  // UI state
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name_asc");
  const [view, setView] = useState("grid");

  const fetchCars = async () => {
    try {
      setLoading(true);
      // nếu BE hỗ trợ filter thì có thể dùng: api.get("/Car", { params: { status: 0 } })
      const res = await api.get("/Car");
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

      // CHỈ lấy status = 0 (không hoạt động) – không hiển thị trạng thái
      const filtered = list.filter((c) => c?.status === 0 || c?.status === "0");
      setCars(filtered);
    } catch (e) {
      console.error("Fetch /Car error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // danh sách brand từ API
  const brands = useMemo(() => {
    const set = new Set(
      cars
        .map((c) => c.brand)
        .filter((b) => b && String(b).trim().length > 0)
    );
    return ["all", ...Array.from(set)];
  }, [cars]);

  // search + filter + sort
  const processed = useMemo(() => {
    const kw = query.trim().toLowerCase();
    let data = cars.filter((c) => {
      const name = String(c.carName ?? "").toLowerCase();
      const brand = String(c.brand ?? "").toLowerCase();
      const plate = String(c.plateNumber ?? "").toLowerCase();
      const matchKW = !kw || name.includes(kw) || brand.includes(kw) || plate.includes(kw);
      const matchBrand = brandFilter === "all" || String(c.brand) === brandFilter;
      return matchKW && matchBrand;
    });

    switch (sortKey) {
      case "name_asc":
        data.sort((a, b) => String(a.carName ?? "").localeCompare(String(b.carName ?? "")));
        break;
      case "name_desc":
        data.sort((a, b) => String(b.carName ?? "").localeCompare(String(a.carName ?? "")));
        break;
      case "battery_desc":
        data.sort((a, b) => Number(b.batteryCapacity ?? 0) - Number(a.batteryCapacity ?? 0));
        break;
      case "battery_asc":
        data.sort((a, b) => Number(a.batteryCapacity ?? 0) - Number(b.batteryCapacity ?? 0));
        break;
      default:
        break;
    }
    return data;
  }, [cars, query, brandFilter, sortKey]);

  // paging
  const total = processed.length;
  const start = (page - 1) * PAGE_SIZE;
  const slice = processed.slice(start, start + PAGE_SIZE);
  useEffect(() => setPage(1), [query, brandFilter, sortKey]);

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Header />

      {/* Top */}
      <section className="pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-[34px] font-extrabold text-slate-900 m-0">
                Inventory
              </h1>
              <p className="text-slate-600 mt-1">
                Danh sách xe (status = 0). Chỉ hiển thị ảnh, màu, dung lượng pin và tên xe.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchCars}
                className="h-10 w-10 grid place-items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                title="Làm mới"
              >
                ⟳
              </button>
              <div className="p-0.5 rounded-xl bg-white border border-slate-200">
                <button
                  className={`px-3 py-2 rounded-lg text-sm ${
                    view === "grid" ? "bg-slate-900 text-white" : "text-slate-700"
                  }`}
                  onClick={() => setView("grid")}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-2 rounded-lg text-sm ${
                    view === "list" ? "bg-slate-900 text-white" : "text-slate-700"
                  }`}
                  onClick={() => setView("list")}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:ring-4 focus:ring-slate-100 min-w-[200px]"
                >
                  <option value="name_asc">Tên (A → Z)</option>
                  <option value="name_desc">Tên (Z → A)</option>
                  <option value="battery_desc">Pin (cao → thấp)</option>
                  <option value="battery_asc">Pin (thấp → cao)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-5">
          {/* Grid/List */}
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
                : slice.map((car) => (
                    <CarCard key={car.carId} car={car} />
                  ))}
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
                : slice.map((car) => <CarRow key={car.carId} car={car} />)}
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
                Trang <b>{page}</b> / {Math.max(1, Math.ceil(processed.length / PAGE_SIZE))}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(Math.ceil(processed.length / PAGE_SIZE), p + 1))
                }
                disabled={page >= Math.ceil(processed.length / PAGE_SIZE)}
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
