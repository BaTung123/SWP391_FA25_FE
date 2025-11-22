import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Popconfirm,
  Tag,
  Card,
  Typography,
  Tooltip,
  Pagination,
  Empty,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  CarOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const { Option } = Select;
const { Text } = Typography;

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [percentNotice, setPercentNotice] = useState(null);

  // carId -> [userId] (sở hữu xe)
  const [carOwnersMap, setCarOwnersMap] = useState({});

  // modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  // Percent modal
  const [isPercentModalVisible, setIsPercentModalVisible] = useState(false);
  const [selectedGroupForPercent, setSelectedGroupForPercent] =
    useState(null);
  const [ownershipMap, setOwnershipMap] = useState({}); // userId -> percentage
  const [carUserIdMap, setCarUserIdMap] = useState({}); // userId -> carUserId
  const [percentIdMap, setPercentIdMap] = useState({}); // userId -> percentOwnershipId
  const [usageLimitMap, setUsageLimitMap] = useState({}); // userId -> usageLimit
  const [loadingPercent, setLoadingPercent] = useState(false);

  // filters
  const [keyword, setKeyword] = useState("");
  const [carFilter, setCarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  /* ========= Base fetch ========= */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [gRes, cRes, uRes] = await Promise.all([
          api.get("/Group"),
          api.get("/Car"),
          api.get("/User"),
        ]);

        const listGroups = Array.isArray(gRes.data)
          ? gRes.data
          : gRes.data
          ? [gRes.data]
          : [];

        const listCars = cRes.data || [];

        const rawUsers = Array.isArray(uRes.data)
          ? uRes.data
          : uRes.data
          ? [uRes.data]
          : [];

        // chỉ giữ member (role = 0)
        const listUsers = rawUsers
          .filter(Boolean)
          .map((u) => {
            const roleNum =
              typeof u.role === "number" ? u.role : Number(u.role ?? 0);

            return {
              id: u.userId ?? u.id,
              name:
                u.fullName ||
                u.userName ||
                u.email ||
                `User #${u.userId ?? u.id}`,
              email: u.email,
              role: roleNum,
            };
          })
          .filter((u) => u.id != null)
          .filter((u) => u.role === 0);

        setGroups(listGroups);
        setCars(listCars);
        setUsers(listUsers);

        await hydrateCarOwners(listCars, listUsers);
      } catch (e) {
        console.error(e);
        message.error("Không tải được dữ liệu!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ========= Member options ========= */
  const memberOptions = useMemo(
    () =>
      users.map((u) => ({
        label: `${u.name}${u.email ? ` (${u.email})` : ""}`,
        value: u.id,
      })),
    [users]
  );

  /* ========= Helpers ========= */
  const getGroupId = (record) => record?.groupId ?? record?.id;

  // Car lookup
  const carById = useMemo(() => {
    const map = new Map();
    (cars || []).forEach((c) => {
      const id = Number(c?.carId ?? c?.id);
      if (id != null) map.set(id, c);
    });
    return map;
  }, [cars]);

  const getCarInfoOfGroup = (group) => {
    const embedded = group?.car;
    if (embedded?.carName || embedded?.plateNumber) return embedded;

    const carId = Number(
      group?.car?.carId ?? group?.carId ?? group?.CarId
    );
    if (!carId) return null;

    return carById.get(carId) || null;
  };

  // Thành viên của group = các user đang sở hữu carId đó
  const getMemberIdsForGroup = (group) => {
    const carId = Number(
      group?.car?.carId ?? group?.carId ?? group?.CarId
    );
    if (!carId) return [];
    return Array.isArray(carOwnersMap[carId]) ? carOwnersMap[carId] : [];
  };

  const resolveMembers = (ids) =>
    ids
      .map((id) => users.find((u) => Number(u.id) === Number(id)))
      .filter(Boolean);

  /* ========= CarUser API ========= */
  async function addCarUser(carId, userId) {
    // nếu baseURL chưa có /api thì đổi thành `/api/cars/${carId}/users/${userId}/add`
    await api.post(`/cars/${carId}/users/${userId}/add`);
  }

  async function removeCarUser(carId, userId) {
    await api.delete(`/cars/${carId}/users/${userId}/remove`);
  }

  async function syncCarUsersForGroup({ carId, prevMemberIds, nextMemberIds }) {
    const prev = new Set((prevMemberIds || []).map(Number));
    const next = new Set((nextMemberIds || []).map(Number));
    const toAdd = [...next].filter((id) => !prev.has(id));
    const toRemove = [...prev].filter((id) => !next.has(id));

    let added = 0;
    let removed = 0;
    for (const uid of toAdd) {
      try {
        await addCarUser(Number(carId), Number(uid));
        added++;
      } catch {}
    }
    for (const uid of toRemove) {
      try {
        await removeCarUser(Number(carId), Number(uid));
        removed++;
      } catch {}
    }

    return { added, removed };
  }

  /* ========= Owners hydrate ========= */
  async function getUserCarIds(userId) {
    try {
      // nếu cần prefix /api thì đổi path tương ứng
      const r = await api.get(`/users/${userId}/cars`);
      const arr = Array.isArray(r.data) ? r.data : r.data ? [r.data] : [];
      return new Set(
        arr
          .map((it) =>
            Number(it?.carId ?? it?.car?.carId ?? it?.car?.id ?? it?.id)
          )
          .filter((x) => Number.isFinite(x))
      );
    } catch {
      return new Set();
    }
  }

  async function hydrateCarOwners(carsList, usersList) {
    const next = {};

    // lấy danh sách carId cho từng user qua /users/{userId}/cars
    const userCarsMap = new Map();

    await Promise.allSettled(
      (usersList || []).map(async (u) => {
        const ownedCarIds = await getUserCarIds(u.id); // Set<number>
        userCarsMap.set(u.id, ownedCarIds);
      })
    );

    // build map carId -> [userId]
    (carsList || []).forEach((car) => {
      const cid = Number(car?.carId ?? car?.id);
      if (!Number.isFinite(cid)) return;

      const owners = (usersList || [])
        .filter((u) => userCarsMap.get(u.id)?.has(cid))
        .map((u) => Number(u.id));

      next[cid] = owners;
    });

    setCarOwnersMap(next);
  }

  /* ========= PercentOwnership API helpers ========= */
  async function poGetAll() {
    try {
      const r = await api.get("/PercentOwnership");
      return Array.isArray(r.data) ? r.data : r.data ? [r.data] : [];
    } catch {
      const r2 = await api.get("/api/PercentOwnership");
      return Array.isArray(r2.data) ? r2.data : r2.data ? [r2.data] : [];
    }
  }
  async function poPost(payload) {
    try {
      await api.post("/PercentOwnership", payload);
    } catch {
      await api.post("/api/PercentOwnership", payload);
    }
  }
  async function poPut(id, payload) {
    try {
      await api.put(`/PercentOwnership/${id}`, payload);
    } catch {
      await api.put(`/api/PercentOwnership/${id}`, payload);
    }
  }

  // Resolve carUserId cho (carId, userId) từ /users/{userId}/cars
  async function resolveCarUserId(carId, userId) {
    try {
      const r = await api.get(`/users/${userId}/cars`);
      const arr = Array.isArray(r.data) ? r.data : r.data ? [r.data] : [];
      const found = arr.find((it) => {
        const cid = Number(
          it?.carId ?? it?.car?.carId ?? it?.car?.id ?? it?.id
        );
        return Number(cid) === Number(carId);
      });
      if (!found) return null;
      return Number(found?.carUserId ?? found?.id);
    } catch {
      return null;
    }
  }

  /* ========= CRUD ========= */
  const handleAddGroup = async (values) => {
    try {
      const car = cars.find((c) => Number(c.carId) === Number(values.carId));
      if (!car) return message.error("Hãy chọn một xe hợp lệ!");

      const payload = {
        carId: Number(car.carId),
        groupName: String(values.groupName || "").trim(),
        groupImg: String(values.groupImg || "").trim(),
      };

      await api.post("/Group", payload);
      message.success("Thêm nhóm thành công!");
      setIsAddModalVisible(false);
      formAdd.resetFields();

      await fetchGroupsAndRehydrate();
    } catch {
      message.error("Không thể thêm nhóm!");
    }
  };

  async function fetchGroupsAndRehydrate() {
    const gRes = await api.get("/Group");
    const listGroups = Array.isArray(gRes.data)
      ? gRes.data
      : gRes.data
      ? [gRes.data]
      : [];
    setGroups(listGroups);
    await hydrateCarOwners(cars, users);
  }

  const handleDelete = async (groupId) => {
    try {
      const group = groups.find((g) => getGroupId(g) === groupId);
      const carId = Number(
        group?.car?.carId ?? group?.carId ?? group?.CarId
      );

      const currentMembers = getMemberIdsForGroup(group).map(Number);
      if (carId && currentMembers?.length) {
        for (const uid of currentMembers) {
          try {
            await removeCarUser(carId, uid);
          } catch (e) {
            console.warn(
              `Gỡ quan hệ car ${carId} ↔ user ${uid} thất bại`,
              e?.response?.data || e
            );
          }
        }
      }

      await api.delete(`/Group/${groupId}/delete`);
      message.success("Đã xoá nhóm và gỡ liên kết sở hữu của các thành viên.");
      setNotice({ type: "success", text: "Đã xoá nhóm và gỡ liên kết sở hữu của các thành viên." });

      await fetchGroupsAndRehydrate();
    } catch {
      message.error("Không thể xoá nhóm!");
    }
  };

  const openEditModal = (record) => {
    setEditingGroup(record);
    const carId = Number(
      record?.car?.carId ?? record?.carId ?? record?.CarId
    );
    const currentMemberIds = Array.isArray(carOwnersMap[carId])
      ? carOwnersMap[carId]
      : [];
    formEdit.setFieldsValue({
      groupName: record.groupName,
      groupImg: record.groupImg || "",
      memberIds: currentMemberIds,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateGroup = async (values) => {
    try {
      const id = getGroupId(editingGroup);
      if (!id) return;

      await api.put(`/Group/${id}/update`, {
        groupName: values.groupName,
        groupImg: values.groupImg || "",
      });

      const carId = Number(
        editingGroup?.car?.carId ??
          editingGroup?.carId ??
          editingGroup?.CarId
      );
      if (carId) {
        const prevMemberIds = (() => {
          const cid = Number(carId);
          return Array.isArray(carOwnersMap[cid]) ? carOwnersMap[cid] : [];
        })();
        const nextMemberIds = (values.memberIds || []).map(Number);
        const { added, removed } = await syncCarUsersForGroup({ carId, prevMemberIds, nextMemberIds });
        if (added > 0 || removed > 0) {
          const txt = `Đã cập nhật thành viên: +${added}, -${removed}.`;
          message.success(txt);
          setNotice({ type: "success", text: txt });
        } else {
          const txt = "Đã cập nhật thành viên nhóm thành công.";
          message.success(txt);
          setNotice({ type: "success", text: txt });
        }
      }

      message.success("Cập nhật nhóm thành công!");
      setNotice({ type: "success", text: "Cập nhật nhóm thành công!" });
      setIsEditModalVisible(false);

      await hydrateCarOwners(cars, users);
    } catch (e) {
      console.error(e);
      message.error("Không thể cập nhật nhóm!");
    }
  };

  /* ========= Percent modal ========= */
  const handleOpenPercentModal = async (record) => {
    const carId = Number(
      record?.car?.carId ?? record?.carId ?? record?.CarId
    );
    if (!carId) {
      message.warning("Nhóm chưa gắn xe, không thể chỉnh phần trăm.");
      return;
    }

    setIsPercentModalVisible(true);
    setLoadingPercent(true);
    setPercentNotice(null);

    try {
      // userId đang sở hữu xe này (từ CarUser map)
      const ids = Array.isArray(carOwnersMap[carId]) ? carOwnersMap[carId] : [];
      const members = resolveMembers(ids);

      if (members.length === 0) {
        message.warning("Xe này chưa có người sở hữu.");
        setIsPercentModalVisible(false);
        setLoadingPercent(false);
        return;
      }

      // Resolve carUserId cho từng user
      const mapUserToCarUserId = {};
      await Promise.all(
        members.map(async (m) => {
          const cuid = await resolveCarUserId(carId, m.id);
          if (cuid) mapUserToCarUserId[m.id] = cuid;
        })
      );

      // Lấy toàn bộ PercentOwnership
      const allPO = await poGetAll();
      const nextOwnership = {};
      const nextPercentId = {};
      const nextUsageLimit = {};

      members.forEach((m) => {
        const cuid = mapUserToCarUserId[m.id];
        if (!cuid) {
          nextOwnership[m.id] = 0;
          nextUsageLimit[m.id] = 0;
          return;
        }
        const exist = (allPO || []).find(
          (p) =>
            Number(
              p?.carUserId ?? p?.CarUserId ?? p?.caruserId ?? p?.car_user_id
            ) === Number(cuid)
        );
        if (exist) {
          nextOwnership[m.id] = Number(
            exist?.percentage ?? exist?.Percentage ?? 0
          );
          nextUsageLimit[m.id] = Number(
            exist?.usageLimit ?? exist?.UsageLimit ?? 0
          );
          nextPercentId[m.id] = Number(
            exist?.id ?? exist?.Id ?? exist?.percentOwnershipId ?? 0
          );
        } else {
          nextOwnership[m.id] = 0;
          nextUsageLimit[m.id] = 0;
        }
      });

      setSelectedGroupForPercent({ ...record, members, carId });
      setCarUserIdMap(mapUserToCarUserId);
      setPercentIdMap(nextPercentId);
      setOwnershipMap(nextOwnership);
      setUsageLimitMap(nextUsageLimit);
    } catch (e) {
      console.error("Lỗi khi tải phần trăm đồng sở hữu:", e);
      message.error("Không thể tải phần trăm đồng sở hữu. Vui lòng thử lại.");
      setNotice({ type: "error", text: "Không thể tải phần trăm đồng sở hữu. Vui lòng thử lại." });
      setIsPercentModalVisible(false);
    } finally {
      setLoadingPercent(false);
    }
  };

  const handleSavePercent = async () => {
    const values = Object.values(ownershipMap).map((v) => Number(v || 0));
    const invalid = values.some((v) => Number.isNaN(v) || v < 0 || v > 100);
    if (invalid) {
      const txt = "Giá trị phần trăm phải trong khoảng 0% đến 100%.";
      message.error(txt);
      setPercentNotice({ type: "error", text: txt });
      return;
    }
    const total = values.reduce((sum, v) => sum + v, 0);
    if (total > 100) {
      const txt = `Tổng phần trăm đang vượt quá 100% (=${total}%).`;
      message.error(txt);
      setPercentNotice({ type: "error", text: txt });
      return;
    }
    if (total < 100) {
      const txt = `Tổng phần trăm chưa đủ 100% (=${total}%).`;
      message.warning(txt);
      setPercentNotice({ type: "warning", text: txt });
      return;
    }

    try {
      const members = selectedGroupForPercent?.members || [];

      for (const m of members) {
        const cuid = carUserIdMap[m.id];
        if (!cuid) {
          console.warn("Không tìm thấy carUserId cho user", m.id);
          continue;
        }
        const body = {
          carUserId: Number(cuid),
          percentage: Number(ownershipMap[m.id] || 0),
          usageLimit: Number(usageLimitMap[m.id] || 0),
        };

        const existId = percentIdMap[m.id];
        if (existId != null) {
          await poPut(Number(existId), body);
        } else {
          await poPost(body);
        }
      }

      const affected = members.length;
      const txt = `Đã lưu phần trăm cho ${affected} thành viên.`;
      message.success(txt);
      setPercentNotice({ type: "success", text: txt });
      setIsPercentModalVisible(false);
      await hydrateCarOwners(cars, users);
    } catch (e) {
      console.error(e);
      message.error("Lưu phần trăm thất bại!");
      setPercentNotice({ type: "error", text: "Lưu phần trăm thất bại!" });
    }
  };

  /* ========= Filter + Pagination ========= */
  const filteredGroups = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return groups.filter((g) => {
      const matchKW =
        !kw ||
        [g?.groupName, g?.car?.carName, g?.car?.plateNumber]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const gidCarId = Number(
        g?.car?.carId ?? g?.carId ?? g?.CarId
      );

      const matchCar =
        carFilter === "all" ? true : gidCarId === Number(carFilter);

      return matchKW && matchCar;
    });
  }, [groups, keyword, carFilter]);

  const totalItems = filteredGroups.length;
  const currentRows = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ========= Columns ========= */
  const columns = [
    {
      title: "Tên nhóm",
      dataIndex: "groupName",
      key: "groupName",
      render: (v) => <Text strong>{v}</Text>,
    },
    {
      title: "Xe",
      key: "car",
      render: (_, record) => {
        const car = getCarInfoOfGroup(record);
        if (!car) return "Chưa có xe";
        const name = car.carName || car.name || "Không rõ tên";
        const plate = car.plateNumber || car.plate || "—";
        return `${name} - ${plate}`;
      },
    },
    {
      title: "Thành viên",
      key: "membersCount",
      render: (_, record) => {
        const carId = Number(
          record?.car?.carId ?? record?.carId ?? record?.CarId
        );
        const count = Array.isArray(carOwnersMap[carId])
          ? carOwnersMap[carId].length
          : 0;
        return <Tag color="blue">{count} thành viên</Tag>;
      },
      width: 140,
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      width: 280,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Phần trăm đồng sở hữu">
            <Button
              icon={<CarOutlined />}
              onClick={() => handleOpenPercentModal(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa thông tin & thành viên">
            <Button
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá nhóm?"
            okText="Xoá nhóm & gỡ liên kết"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(getGroupId(record))}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ========= Render ========= */
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card
        title={<span className="font-semibold">Quản lý nhóm</span>}
        extra={
          <Space wrap>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm theo tên nhóm/xe/biển số"
              style={{ width: 280 }}
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Select
              value={carFilter}
              onChange={(v) => {
                setCarFilter(v);
                setCurrentPage(1);
              }}
              style={{ width: 220 }}
            >
              <Option value="all">Tất cả xe</Option>
              {cars.map((c) => (
                <Option key={c.carId} value={c.carId}>
                  {c.carName} - {c.plateNumber}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalVisible(true)}
            >
              Thêm nhóm
            </Button>
          </Space>
        }
      />

      {notice && (
        <div className={`px-4 py-2 rounded-md border ${notice.type === "error" ? "bg-red-50 border-red-200 text-red-700" : notice.type === "warning" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "bg-green-50 border-green-200 text-green-700"}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{notice.text}</span>
            <button className="text-current opacity-70 hover:opacity-100" onClick={() => setNotice(null)} aria-label="Close">×</button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card>
        <Table
          dataSource={currentRows}
          columns={columns}
          rowKey={(record) => getGroupId(record)}
          loading={loading}
          pagination={false}
          size="middle"
          locale={{ emptyText: <Empty description="Không có nhóm nào" /> }}
        />
      </Card>

      {/* Pagination */}
      <Space style={{ width: "100%", justifyContent: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={(p) => setCurrentPage(p)}
          showSizeChanger={false}
        />
      </Space>

      {/* Modal thêm nhóm */}
      <Modal
        title="Thêm nhóm mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={() => formAdd.submit()}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAddGroup}>
          <Form.Item
            name="carId"
            label="Chọn xe"
            rules={[{ required: true, message: "Hãy chọn một xe!" }]}
          >
            <Select placeholder="Chọn xe">
              {cars.map((car) => (
                <Option key={car.carId} value={car.carId}>
                  {car.carName} - {car.plateNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="groupName"
            label="Tên nhóm"
            rules={[{ required: true, message: "Nhập tên nhóm!" }]}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa nhóm */}
      <Modal
        title="Cập nhật nhóm"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => formEdit.submit()}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={formEdit} layout="vertical" onFinish={handleUpdateGroup}>
          <Form.Item
            name="groupName"
            label="Tên nhóm"
            rules={[{ required: true, message: "Nhập tên nhóm!" }]}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>
          <Form.Item name="memberIds" label="Thành viên trong nhóm">
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn thành viên"
              options={memberOptions}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal phần trăm */}
      <Modal
        title="Chỉnh sửa phần trăm đồng sở hữu"
        open={isPercentModalVisible}
        onCancel={() => {
          setIsPercentModalVisible(false);
          setLoadingPercent(false);
          setPercentNotice(null);
        }}
        onOk={handleSavePercent}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
        width={700}
      >
        {percentNotice && (
          <div className={`mb-3 px-4 py-2 rounded-md border ${percentNotice.type === "error" ? "bg-red-50 border-red-200 text-red-700" : percentNotice.type === "warning" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "bg-green-50 border-green-200 text-green-700"}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{percentNotice.text}</span>
              <button className="opacity-70 hover:opacity-100" onClick={() => setPercentNotice(null)} aria-label="Close">×</button>
            </div>
          </div>
        )}
        {loadingPercent ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">
              Đang tải phần trăm đồng sở hữu...
            </p>
          </div>
        ) : selectedGroupForPercent &&
          selectedGroupForPercent.members?.length ? (
          <div>
            {/* Thông tin xe */}
            {(() => {
              const carInfo = getCarInfoOfGroup(selectedGroupForPercent);
              return (
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-600 font-medium">Xe</p>
                      <p className="text-lg font-bold text-indigo-900">
                        {carInfo?.carName ||
                          carInfo?.name ||
                          selectedGroupForPercent.groupName ||
                          "Chưa có tên"}
                      </p>
                      {carInfo?.plateNumber && (
                        <p className="text-sm text-gray-600 mt-1">
                          Biển số: {carInfo.plateNumber}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-indigo-600 font-medium">
                        Tổng sở hữu
                      </p>
                      <p className="text-lg font-bold text-indigo-900">
                        {Object.values(ownershipMap).reduce(
                          (sum, v) => sum + Number(v || 0),
                          0
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Danh sách đồng sở hữu (giao diện cũ của bạn) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  Danh sách đồng sở hữu
                </h4>
                <span className="text-sm text-gray-600">
                  Tổng: {selectedGroupForPercent.members.length} người
                </span>
              </div>

              {[...selectedGroupForPercent.members]
                .sort(
                  (a, b) =>
                    (ownershipMap[b.id] || 0) - (ownershipMap[a.id] || 0)
                )
                .map((m) => {
                  const percentage = ownershipMap[m.id] || 0;
                  return (
                    <div
                      key={m.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold text-sm">
                                {m.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {m.name}
                              </h5>
                              {m.email && (
                                <p className="text-sm text-gray-600">
                                  {m.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">
                              Phần trăm đóng góp
                            </p>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-indigo-600 h-2 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-indigo-900 min-w-[2.5rem]">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            suffix="%"
                            value={ownershipMap[m.id] ?? ""}
                            onChange={(e) =>
                              setOwnershipMap((prev) => ({
                                ...prev,
                                [m.id]:
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                              }))
                            }
                            style={{ width: 100 }}
                            className="ml-2"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <Empty description="Xe hiện chưa có ai sở hữu" />
        )}
      </Modal>
    </div>
  );
}
