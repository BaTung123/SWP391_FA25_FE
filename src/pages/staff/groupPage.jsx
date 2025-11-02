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
  ReloadOutlined,
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

  // state tạm cho thành viên & phần trăm (không dùng localStorage)
  const [groupMembersMap, setGroupMembersMap] = useState({}); // { [groupId]: number[] }
  const [percentMap, setPercentMap] = useState({});           // { [groupId]: { [userId]: number } }

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  // Modal phần trăm
  const [isPercentModalVisible, setIsPercentModalVisible] = useState(false);
  const [selectedGroupForPercent, setSelectedGroupForPercent] = useState(null);
  const [ownershipMap, setOwnershipMap] = useState({});

  const [keyword, setKeyword] = useState("");
  const [carFilter, setCarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  /* ========= Load data ========= */
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Group");
      const list = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setGroups(list);
    } catch {
      message.error("Không tải được danh sách nhóm!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await api.get("/Car");
      setCars(res.data || []);
    } catch {
      message.error("Không tải được danh sách xe!");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/User");
      const list = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      const mapped = list
        .filter(Boolean)
        .map((u) => ({
          id: u.userId ?? u.id,
          name: u.fullName || u.userName || u.email || `User #${u.userId ?? u.id}`,
          email: u.email,
          role: typeof u.role === "number" ? u.role : Number(u.role ?? 0),
          raw: u,
        }))
        .filter((u) => u.id != null);
      setUsers(mapped);
    } catch {
      message.error("Không tải được danh sách thành viên!");
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchCars();
    fetchUsers();
  }, []);

  /* ========= Member options ========= */
  const memberOptions = useMemo(
    () =>
      users
        .filter((u) => (typeof u.role === "number" ? u.role : Number(u.role ?? 0)) === 0)
        .map((u) => ({
          label: `${u.name}${u.email ? ` (${u.email})` : ""}`,
          value: u.id,
        })),
    [users]
  );

  /* ========= Helpers ========= */
  const getGroupId = (record) => record?.groupId ?? record?.id;
  const getMemberIdsForGroup = (group) => {
    const gid = getGroupId(group);
    if (!gid) return [];
    return Array.isArray(groupMembersMap[gid]) ? groupMembersMap[gid] : [];
  };
  const resolveMembers = (ids) =>
    ids.map((id) => users.find((u) => Number(u.id) === Number(id))).filter(Boolean);

  const setMembersForGroup = (groupId, userIds) => {
    setGroupMembersMap((prev) => ({ ...prev, [groupId]: (userIds || []).map(Number) }));
  };
  const removeMembersForGroup = (groupId) => {
    setGroupMembersMap((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
    setPercentMap((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  };

  /* ========= CarUser API helpers (giữ để dùng ở Edit/Delete) ========= */
  async function addCarUser(carId, userId, pct) {
    try {
      await api.post(`/cars/${carId}/users/${userId}/add`, {
        ownershipPercentage: typeof pct === "number" ? pct : null,
      });
    } catch (e) {}
  }
  async function removeCarUser(carId, userId) {
    try {
      await api.delete(`/cars/${carId}/users/${userId}/remove`);
    } catch (e) {}
  }
  async function syncCarUsersForGroup({ carId, prevMemberIds, nextMemberIds, percentOfGroup }) {
    const prev = new Set((prevMemberIds || []).map(Number));
    const next = new Set((nextMemberIds || []).map(Number));
    const toAdd = [...next].filter((id) => !prev.has(id));
    const toRemove = [...prev].filter((id) => !next.has(id));
    await Promise.all(
      toAdd.map((uid) => addCarUser(Number(carId), Number(uid), Number(percentOfGroup?.[uid])))
    );
    await Promise.all(toRemove.map((uid) => removeCarUser(Number(carId), Number(uid))));
  }

  /* ========= PercentOwnership API helpers ========= */
  const normalizePO = (po) => ({
    id: po?.id ?? po?.percentOwnershipId ?? null,
    carId: Number(po?.carId ?? po?.car?.carId ?? po?.carUser?.carId),
    userId: Number(po?.userId ?? po?.carUser?.userId),
    percentage: Number(po?.ownershipPercentage ?? po?.percentage ?? po?.percent ?? 0),
  });

  async function listPercentOwnership() {
    const res = await api.get(`/PercentOwnership`);
    const arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
    return arr.map(normalizePO);
  }

  async function ensurePercentRowsForMembers(carId, memberIds, defaultValue = 0) {
    try {
      const list = await listPercentOwnership();
      const have = new Set(list.filter((po) => po.carId === Number(carId)).map((po) => `${po.userId}`));
      const need = (memberIds || []).map(Number).filter((uid) => !have.has(`${uid}`));
      if (!need.length) return;
      await Promise.all(
        need.map((uid) =>
          api.post(`/PercentOwnership`, {
            carId: Number(carId),
            userId: Number(uid),
            ownershipPercentage: defaultValue,
          })
        )
      );
    } catch (e) {}
  }

  async function deletePercentRowsForMembers(carId, memberIds) {
    try {
      const list = await listPercentOwnership();
      const targets = list.filter(
        (po) => po.carId === Number(carId) && memberIds.map(Number).includes(Number(po.userId))
      );
      await Promise.all(targets.filter((po) => po.id != null).map((po) => api.delete(`/PercentOwnership/${po.id}`)));
    } catch (e) {}
  }

  async function upsertPercentOwnerships(carId, mapUserToPercent) {
    try {
      const list = await listPercentOwnership();
      const byKey = new Map();
      list.forEach((po) => byKey.set(`${po.carId}-${po.userId}`, po));

      const tasks = Object.entries(mapUserToPercent || {}).map(([uidStr, pct]) => {
        const userId = Number(uidStr);
        const key = `${carId}-${userId}`;
        const ex = byKey.get(key);
        const body = { carId: Number(carId), userId, ownershipPercentage: Number(pct) };
        return ex?.id ? api.put(`/PercentOwnership/${ex.id}`, body) : api.post(`/PercentOwnership`, body);
      });
      await Promise.all(tasks);
    } catch (e) {}
  }

  /* ========= Add Group (CHỈ carId, groupName, groupImg) ========= */
  const handleAddGroup = async (values) => {
    try {
      const car = cars.find((c) => Number(c.carId) === Number(values.carId));
      if (!car) return message.error("Hãy chọn một xe hợp lệ!");

      const payload = {
        carId: Number(car.carId),
        groupName: String(values.groupName || "").trim(),
        groupImg: String(values.groupImg || "").trim(), // có thể rỗng nếu BE cho phép
      };

      await api.post("/Group", payload, { headers: { "Content-Type": "application/json" } });

      message.success("Thêm nhóm thành công!");
      setIsAddModalVisible(false);
      formAdd.resetFields();
      fetchGroups();
    } catch (err) {
      console.error("Create Group FAILED:", err?.response?.data || err);
      message.error("Không thể thêm nhóm. Kiểm tra carId/groupName/groupImg.");
    }
  };

  /* ========= Delete Group ========= */
  const handleDelete = async (groupId) => {
    try {
      const group = groups.find((g) => getGroupId(g) === groupId);
      const carId = Number(group?.car?.carId ?? group?.carId);
      const currentMembers = getMemberIdsForGroup(group);

      if (carId && currentMembers?.length) {
        await Promise.all(currentMembers.map((uid) => removeCarUser(carId, Number(uid))));
        await deletePercentRowsForMembers(carId, currentMembers.map(Number));
      }

      await api.delete(`/Group/${groupId}/delete`);
      removeMembersForGroup(groupId);
      message.success("Xoá nhóm thành công!");
      fetchGroups();
    } catch {
      message.error("Không thể xoá nhóm!");
    }
  };

  /* ========= Edit Group ========= */
  const openEditModal = (record) => {
    setEditingGroup(record);
    const currentMemberIds = getMemberIdsForGroup(record);
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

      const prevMemberIds = getMemberIdsForGroup(editingGroup).map(Number);
      const nextMemberIds = (values.memberIds || []).map(Number);
      const carId = Number(editingGroup?.car?.carId ?? editingGroup?.carId);

      // cập nhật state thành viên (chỉ khi sửa nhóm)
      setMembersForGroup(id, nextMemberIds);

      // đồng bộ CarUser & PercentOwnership
      if (carId) {
        await syncCarUsersForGroup({
          carId,
          prevMemberIds,
          nextMemberIds,
          percentOfGroup: (percentMap || {})[id] || {},
        });

        const added = nextMemberIds.filter((m) => !prevMemberIds.includes(m));
        const removed = prevMemberIds.filter((m) => !nextMemberIds.includes(m));
        if (added.length) await ensurePercentRowsForMembers(carId, added, 0);
        if (removed.length) await deletePercentRowsForMembers(carId, removed);
      }

      setGroups((prev) =>
        prev.map((g) =>
          getGroupId(g) === id ? { ...g, groupName: values.groupName, groupImg: values.groupImg } : g
        )
      );

      message.success("Cập nhật nhóm thành công!");
      setIsEditModalVisible(false);
    } catch {
      message.error("Không thể cập nhật nhóm!");
    }
  };

  /* ========= Chỉnh sửa phần trăm ========= */
  const handleOpenPercentModal = (record) => {
    const ids = getMemberIdsForGroup(record);
    const members = resolveMembers(ids);
    const gid = getGroupId(record);
    const saved = percentMap[gid] || {};
    const initMap = {};
    members.forEach((m) => (initMap[m.id] = saved[m.id] ?? 0));
    setSelectedGroupForPercent({ ...record, members });
    setOwnershipMap(initMap);
    setIsPercentModalVisible(true);
  };

  const handleSavePercent = async () => {
    if (!selectedGroupForPercent) return;
    const gid = getGroupId(selectedGroupForPercent);
    const total = Object.values(ownershipMap).reduce((sum, v) => sum + Number(v || 0), 0);
    if (total !== 100) return message.warning("Tổng phần trăm phải bằng 100%!");

    setPercentMap((prev) => ({ ...prev, [gid]: ownershipMap }));

    const carId = Number(selectedGroupForPercent?.car?.carId ?? selectedGroupForPercent?.carId);
    const memberIds = getMemberIdsForGroup(selectedGroupForPercent);
    if (carId && memberIds?.length) {
      const payload = {};
      memberIds.forEach((uid) => (payload[uid] = Number(ownershipMap[uid] ?? 0)));
      await upsertPercentOwnerships(carId, payload);
    }

    message.success("Đã lưu phần trăm đồng sở hữu!");
    setIsPercentModalVisible(false);
  };

  /* ========= Filter + Pagination ========= */
  const filteredGroups = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return groups.filter((g) => {
      const matchKW =
        !kw ||
        [g?.groupName, g?.description, g?.car?.carName, g?.car?.plateNumber]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const matchCar =
        carFilter === "all" ? true : Number(g?.car?.carId ?? g?.carId) === Number(carFilter);

      return matchKW && matchCar;
    });
  }, [groups, keyword, carFilter]);

  const totalItems = filteredGroups.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = filteredGroups.slice(startIndex, endIndex);

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
      dataIndex: "car",
      key: "car",
      render: (car) => (car ? `${car.carName} (${car.plateNumber})` : "Chưa có xe"),
    },
    {
      title: "Thành viên",
      key: "membersCount",
      render: (_, record) => {
        const count = getMemberIdsForGroup(record).length;
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
            <Button icon={<CarOutlined />} onClick={() => handleOpenPercentModal(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa thông tin & thành viên">
            <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          </Tooltip>
          <Popconfirm title="Xác nhận xoá nhóm này?" onConfirm={() => handleDelete(getGroupId(record))}>
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
            <Button icon={<ReloadOutlined />} onClick={fetchGroups}>
              Làm mới
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
              Thêm nhóm
            </Button>
          </Space>
        }
      />

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

      {/* Modal thêm nhóm (CHỈ 3 TRƯỜNG) */}
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

          <Form.Item
            name="groupImg"
            label="Ảnh nhóm (URL)"
            // Nếu BE cho phép rỗng, bỏ required. Nếu bắt buộc, giữ rule này.
            // rules={[{ required: true, message: "Nhập đường dẫn ảnh nhóm!" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa nhóm (giữ phần chọn thành viên tại đây) */}
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
          <Form.Item name="groupImg" label="Ảnh nhóm (URL)">
            <Input placeholder="https://..." />
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

      {/* Modal chỉnh phần trăm đồng sở hữu */}
      <Modal
        title="Chỉnh sửa phần trăm đồng sở hữu"
        open={isPercentModalVisible}
        onCancel={() => setIsPercentModalVisible(false)}
        onOk={handleSavePercent}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        {selectedGroupForPercent && selectedGroupForPercent.members?.length > 0 ? (
          <div className="space-y-3">
            {selectedGroupForPercent.members.map((m) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1 }}>
                  {m.name} {m.email ? `(${m.email})` : ""}
                </span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  suffix="%"
                  value={ownershipMap[m.id] || ""}
                  onChange={(e) =>
                    setOwnershipMap((prev) => ({
                      ...prev,
                      [m.id]: Number(e.target.value),
                    }))
                  }
                  style={{ width: 120 }}
                />
              </div>
            ))}
          </div>
        ) : (
          <Empty description="Nhóm chưa có thành viên" />
        )}
      </Modal>
    </div>
  );
}
