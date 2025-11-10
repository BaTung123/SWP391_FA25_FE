import React, { useEffect, useMemo, useState } from "react";
import {
  FaCreditCard,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import api from "../../config/axios";

const safeNum = (v, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};

const VotePage = () => {
  // ---------------- UI states ----------------
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 5;

  const [selectedForm, setSelectedForm] = useState(null);
  const votedSummary = useMemo(() => {
    if (!selectedForm) {
      return {
        votedMembers: [],
        pendingMembers: [],
        extraVoters: [],
        votedSet: new Set(),
      };
    }

    const members = Array.isArray(selectedForm.members)
      ? selectedForm.members
      : [];

    const votedSet = new Set(
      (selectedForm.votedUserIds ?? [])
        .map((id) => safeNum(id, NaN))
        .filter((id) => Number.isFinite(id))
    );

    const votedMembers = members.filter((m) =>
      votedSet.has(safeNum(m?.id ?? m?.userId, NaN))
    );
    const pendingMembers = members.filter(
      (m) => !votedSet.has(safeNum(m?.id ?? m?.userId, NaN))
    );
    const extraVoters = Array.from(votedSet).filter(
      (id) =>
        !members.some((m) => safeNum(m?.id ?? m?.userId, NaN) === safeNum(id, NaN))
    );

    return { votedMembers, pendingMembers, extraVoters, votedSet };
  }, [selectedForm]);

  const formatDateOnly = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("vi-VN"); // chỉ ngày
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "Đã đánh giá": "bg-green-100 text-green-800",
      "Chờ đánh giá": "bg-yellow-100 text-yellow-800",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  // ---------------- Data fetching helpers ----------------
  const fetchGroupMembers = async (groupId) => {
    // (Nếu sau này có /Group/{id}/members thì dùng; hiện tại screenshot chỉ có GET /Group và GET /Group/{id})
    try {
      const r = await api.get(`/Group/${groupId}/members`);
      const arr = Array.isArray(r.data) ? r.data : [];
      return arr
        .map((m) => ({
          id: safeNum(m?.id ?? m?.userId),
          name: m?.name ?? m?.fullName ?? m?.email ?? `User #${m?.id ?? m?.userId}`,
          fullName: m?.fullName,
          email: m?.email,
        }))
        .filter((m) => Number.isFinite(m.id));
    } catch {
      // fallback suy ra theo xe
    }

    try {
      const gr = await api.get("/Group");
      const list = Array.isArray(gr.data) ? gr.data : [];
      const g = list.find((x) => safeNum(x.id ?? x.groupId) === safeNum(groupId));
      const carId = g?.carId ?? g?.vehicleId;
      if (!carId) return [];

      const ur = await api.get("/User");
      const users = Array.isArray(ur.data) ? ur.data : [];
      const members = [];

      const chunk = 8;
      for (let i = 0; i < users.length; i += chunk) {
        const batch = users.slice(i, i + chunk);
        const rs = await Promise.all(
          batch.map(async (u) => {
            const uid = safeNum(u?.id ?? u?.userId, NaN);
            if (!Number.isFinite(uid)) return null;
            try {
              const owned = await api.get(`/users/${uid}/cars`);
              const cars = Array.isArray(owned.data) ? owned.data : [];
              const has = cars.some((c) => safeNum(c?.carId ?? c?.id) === safeNum(carId));
              if (has) {
                return {
                  id: uid,
                  name: u?.fullName ?? u?.name ?? u?.email ?? `User #${uid}`,
                  fullName: u?.fullName,
                  email: u?.email,
                };
              }
              return null;
            } catch {
              return null;
            }
          })
        );
        rs.forEach((x) => x && members.push(x));
      }
      return members;
    } catch {
      return [];
    }
  };

  const fetchVotesForForm = async (formId) => {
    const normalizeVotes = (maybeVotes, assumedFormId) => {
      if (!Array.isArray(maybeVotes)) return [];
      return maybeVotes
        .map((v) => {
          if (!v) return null;
          const fidRaw = v?.formId ?? v?.FormId ?? v?.formID ?? assumedFormId;
          const fid = safeNum(fidRaw, NaN);
          if (!Number.isFinite(fid) || fid !== safeNum(formId, NaN)) return null;
          return {
            id: v?.id ?? v?.voteId ?? v?.VoteId,
            userId: v?.userId ?? v?.UserId,
            formId: fid,
            decision: !!(v?.decision ?? v?.Decision ?? v?.agree),
          };
        })
        .filter(Boolean);
    };

    // const tryUrls = [
    //   `/Vote/form/${formId}`,
    //   `/Vote/${formId}`,
    //   `/Vote/form?formId=${formId}`,
    //   `/Vote/by-form/${formId}`,
    //   `/Vote/by-form?formId=${formId}`,
    //   `/Vote?formId=${formId}`,
    // ];

    // for (const url of tryUrls) {
    //   try {
    //     const r = await api.get(url);
    //     const arr = Array.isArray(r.data)
    //       ? r.data
    //       : Array.isArray(r.data?.data)
    //       ? r.data.data
    //       : undefined;
    //     const votes = normalizeVotes(arr, formId);
    //     if (votes.length) return votes;
    //   } catch {
    //     // thử endpoint tiếp theo
    //   }
    // }
    try {
      const r = await api.get("/Vote");
      const arr = Array.isArray(r.data)
        ? r.data
        : Array.isArray(r.data?.data)
        ? r.data.data
        : [];
      const votes = normalizeVotes(arr);
      if (votes.length) return votes;
    } catch {
      // bỏ qua lỗi cuối cùng
    }

    return [];
  };

  const fetchFormResults = async (formId) => {
    try {
      const r = await api.get(`/Form/${formId}/results`);
      const d = r?.data ?? {};
      const yes = safeNum(d?.agreeVotes);
      const no = safeNum(d?.disagreeVotes);
      return { yes, no };
    } catch {
      return { yes: 0, no: 0 };
    }
  };

  // ✅ Lấy TÊN NHÓM trực tiếp bằng GET /Group/{id}, kèm thông tin xe
  const fetchVehicleAndGroupInfo = async (groupId) => {
    try {
      // gọi thẳng /Group/{id}
      const gRes = await api.get(`/Group/${groupId}`);
      const g = gRes?.data ?? {};

      const groupName =
        g?.name ?? g?.groupName ?? (g ? `Nhóm #${g.id ?? g.groupId}` : "");

      const carId = g?.carId ?? g?.vehicleId;
      let vehicleName = "";
      let licensePlate = "";

      if (carId) {
        const tryUrls = [`/Car/${carId}`, `/Vehicle/${carId}`, `/cars/${carId}`];
        for (const url of tryUrls) {
          try {
            const r = await api.get(url);
            const d = r?.data ?? {};
            vehicleName = d?.carName ?? d?.name ?? d?.vehicleName ?? "";
            licensePlate = d?.plateNumber ?? d?.plate ?? d?.licensePlate ?? "";
            break;
          } catch {}
        }
      }

      return { vehicleName, licensePlate, groupName };
    } catch {
      // fallback: list group rồi tìm (phòng trường hợp /Group/{id} bị hạn chế)
      try {
        const gr = await api.get("/Group");
        const list = Array.isArray(gr.data) ? gr.data : [];
        const g = list.find((x) => safeNum(x.id ?? x.groupId) === safeNum(groupId));
        const groupName =
          g?.name ?? g?.groupName ?? (g ? `Nhóm #${g.id ?? g.groupId}` : "");

        const carId = g?.carId ?? g?.vehicleId;
        let vehicleName = "";
        let licensePlate = "";

        if (carId) {
          const tryUrls = [`/Car/${carId}`, `/Vehicle/${carId}`, `/cars/${carId}`];
          for (const url of tryUrls) {
            try {
              const r = await api.get(url);
              const d = r?.data ?? {};
              vehicleName = d?.carName ?? d?.name ?? d?.vehicleName ?? "";
              licensePlate = d?.plateNumber ?? d?.plate ?? d?.licensePlate ?? "";
              break;
            } catch {}
          }
        }
        return { vehicleName, licensePlate, groupName };
      } catch {
        return { vehicleName: "", licensePlate: "", groupName: "" };
      }
    }
  };

  const loadAllForms = async () => {
    setLoading(true);
    try {
      const r = await api.get("/Form");
      const raw = Array.isArray(r.data) ? r.data : [];
      const normalized = raw
        .map((f) => ({
          id: safeNum(f.formId ?? f.id),
          title: f.formTitle ?? f.title ?? `Form #${f.formId ?? f.id}`,
          groupId: Number.isFinite(safeNum(f.groupId)) ? safeNum(f.groupId) : null,
          startDate: f.startDate,
          endDate: f.endDate,
        }))
        .filter((f) => Number.isFinite(f.id));

      const resultRows = [];
      const chunk = 6;
      for (let i = 0; i < normalized.length; i += chunk) {
        const batch = normalized.slice(i, i + chunk);
        const rows = await Promise.all(
          batch.map(async (f) => {
            const { yes, no } = await fetchFormResults(f.id);
            const votes = await fetchVotesForForm(f.id);
            const votedIds = votes
              .map((v) => safeNum(v.userId, NaN))
              .filter((uid) => Number.isFinite(uid));

            // members & vehicle & groupName
            let members = [];
            let vehicleName = "";
            let licensePlate = "";
            let groupName = "";

            if (f.groupId) {
              members = await fetchGroupMembers(f.groupId);
              const info = await fetchVehicleAndGroupInfo(f.groupId);
              vehicleName = info.vehicleName || vehicleName;
              licensePlate = info.licensePlate || licensePlate;
              groupName = info.groupName || groupName;
            }

            const totalMembers = members.length;
            const status =
              totalMembers > 0 && yes + no >= totalMembers ? "Đã đánh giá" : "Chờ đánh giá";

            return {
              ...f,
              totalMembers,
              votedUserIds: Array.from(new Set(votedIds)),
              yes,
              no,
              status,
              vehicleName,
              licensePlate,
              groupName,
              members,
            };
          })
        );
        resultRows.push(...rows);
      }

      // sort by endDate desc, then startDate desc
      resultRows.sort((a, b) => {
        const ea = a.endDate ? new Date(a.endDate).getTime() : 0;
        const eb = b.endDate ? new Date(b.endDate).getTime() : 0;
        if (eb !== ea) return eb - ea;
        const sa = a.startDate ? new Date(a.startDate).getTime() : 0;
        const sb = b.startDate ? new Date(b.startDate).getTime() : 0;
        return sb - sa;
      });

      setForms(resultRows);
    } catch (e) {
      console.error("loadAllForms error:", e);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Filtering & paging ----------------
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return forms.filter((f) => {
      const matchKW =
        !kw ||
        [f.title, f.vehicleName, f.licensePlate, f.groupName]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const matchStatus = statusFilter === "all" ? true : f.status === statusFilter;
      return matchKW && matchStatus;
    });
  }, [forms, keyword, statusFilter]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentRows = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  // ---------------- Render ----------------
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaCreditCard className="text-gray-600" />
            <span className="font-semibold text-gray-900">Quản lý đánh giá</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative" style={{ width: 260 }}>
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm theo tiêu đề/xe/biển số/nhóm"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-8 py-1.5 h-8 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {keyword && (
                <button
                  onClick={() => {
                    setKeyword("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 h-8 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              style={{ width: 180 }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đã đánh giá">Đã đánh giá</option>
              <option value="Chờ đánh giá">Chờ đánh giá</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Tiêu đề", "Nhóm", "Xe", "Trạng thái", "Khoảng thời gian", "Thao tác"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không có biểu mẫu nào.
                  </td>
                </tr>
              ) : (
                currentRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      <div className="font-medium">{row.title}</div>
                    </td>

                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {row.groupName || "—"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="font-medium text-gray-900">
                        {row.vehicleName || "—"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {row.licensePlate || "—"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(row.status)}
                      <div className="text-xs text-gray-500 mt-1">
                        {row.yes + row.no}/{row.totalMembers} phiếu
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {formatDateOnly(row.startDate)} – {formatDateOnly(row.endDate)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => setSelectedForm(row)}
                          title="Xem chi tiết phiếu bầu"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center py-4">
        <nav className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-2 rounded-l-md bg-white text-gray-500 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 text-sm ${
                currentPage === page
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-2 rounded-r-md bg-white text-gray-500 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </nav>
      </div>

      {/* Modal View Votes */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Đồng sở hữu {selectedForm.groupName || `nhóm #${selectedForm.groupId ?? "—"}`} —{" "}
                {selectedForm.title}
              </h3>
              <button
                onClick={() => setSelectedForm(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-left">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Thành viên nhóm
              </h4>
              {selectedForm.members.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Chưa có dữ liệu thành viên nhóm.
                </div>
              ) : (
                selectedForm.members.map((m) => {
                  const memberId = safeNum(m?.id ?? m?.userId, NaN);
                  const hasVoted = votedSummary.votedSet.has(memberId);
                  return (
                    <div
                      key={m.id ?? memberId}
                      className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-100 bg-gray-50"
                    >
                      <span className="text-sm text-gray-800">
                        {m.fullName || m.name || m.email || `User #${m.id}`}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          hasVoted
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {hasVoted ? "Đã đánh giá" : "Chưa đánh giá"}
                      </span>
                    </div>
                  );
                })
              )}

              {votedSummary.extraVoters.length > 0 && (
                <div className="mt-4 border border-blue-100 rounded-lg p-3 bg-blue-50/40">
                  <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    Phiếu từ thành viên không xác định
                  </span>
                  <div className="mt-2 space-y-1 text-sm text-blue-700">
                    {votedSummary.extraVoters.map((id) => (
                      <div key={`extra-${id}`} className="truncate">
                        • Người dùng #{id}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotePage;
