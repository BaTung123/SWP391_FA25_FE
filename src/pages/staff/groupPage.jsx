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

  // local state để nhớ thành viên từng nhóm (không phụ thuộc BE)
  const [groupMembersMap, setGroupMembersMap] = useState({});

  // modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  // UI-only percent modal
  const [isPercentModalVisible, setIsPercentModalVisible] = useState(false);
  const [selectedGroupForPercent, setSelectedGroupForPercent] = useState(null);
  const [ownershipMap, setOwnershipMap] = useState({});

  // filters
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
  };

  /* ========= Car lookup ========= */
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
    const carId = Number(group?.carId ?? group?.car?.carId);
    if (!carId) return null;
    return carById.get(carId) || null;
  };

  /* ========= CarUser API helpers ========= */
  // Dùng API bạn cung cấp:
  // GET /users/{userId}/cars  (không dùng ở đây)
  // POST /cars/{carId}/users/{userId}/add
  // DELETE /cars/{carId}/users/{userId}/remove

  async function addCarUser(carId, userId) {
    try {
      await api.post(`/cars/${carId}/users/${userId}/add`);
    } catch (e) {
      console.error("addCarUser failed", e?.response?.data || e);
      throw e;
    }
  }

  async function removeCarUser(carId, userId) {
    try {
      await api.delete(`/cars/${carId}/users/${userId}/remove`);
    } catch (e) {
      console.error("removeCarUser failed", e?.response?.data || e);
      throw e;
    }
  }

  async function syncCarUsersForGroup({ carId, prevMemberIds, nextMemberIds }) {
    const prev = new Set((prevMemberIds || []).map(Number));
    const next = new Set((nextMemberIds || []).map(Number));
    const toAdd = [...next].filter((id) => !prev.has(id));
    const toRemove = [...prev].filter((id) => !next.has(id));

    // Gọi tuần tự để dễ debug; có thể Promise.all nếu backend chịu được
    for (const uid of toAdd) {
      await addCarUser(Number(carId), Number(uid));
    }
    for (const uid of toRemove) {
      await removeCarUser(Number(carId), Number(uid));
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
      fetchGroups();
    } catch {
      message.error("Không thể thêm nhóm!");
    }
  };

  const handleDelete = async (groupId) => {
    try {
      const group = groups.find((g) => getGroupId(g) === groupId);
      const carId = Number(group?.car?.carId ?? group?.carId);
      const currentMembers = getMemberIdsForGroup(group);

      // Tháo link user–car trước khi xoá nhóm (nếu muốn)
      if (carId && currentMembers?.length) {
        for (const uid of currentMembers) {
          try {
            await removeCarUser(carId, Number(uid));
          } catch {}
        }
      }

      await api.delete(`/Group/${groupId}/delete`);
      removeMembersForGroup(groupId);
      message.success("Xoá nhóm thành công!");
      fetchGroups();
    } catch {
      message.error("Không thể xoá nhóm!");
    }
  };

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

      // 1) Cập nhật info nhóm
      await api.put(`/Group/${id}/update`, {
        groupName: values.groupName,
        groupImg: values.groupImg || "",
      });

      // 2) Đồng bộ Car–User theo danh sách memberIds mới
      const prevMemberIds = getMemberIdsForGroup(editingGroup).map(Number);
      const nextMemberIds = (values.memberIds || []).map(Number);
      const carId = Number(editingGroup?.car?.carId ?? editingGroup?.carId);

      if (carId) {
        await syncCarUsersForGroup({ carId, prevMemberIds, nextMemberIds });
      }

      // 3) Cập nhật state local
      setMembersForGroup(id, nextMemberIds);
      setGroups((prev) =>
        prev.map((g) =>
          getGroupId(g) === id
            ? { ...g, groupName: values.groupName, groupImg: values.groupImg }
            : g
        )
      );

      message.success("Cập nhật nhóm thành công!");
      setIsEditModalVisible(false);
    } catch (e) {
      console.error(e);
      message.error("Không thể cập nhật nhóm!");
    }
  };

  /* ========= Modal phần trăm (UI only – không gọi API) ========= */
  const handleOpenPercentModal = (record) => {
    const ids = getMemberIdsForGroup(record);
    const members = resolveMembers(ids);
    const initMap = {};
    members.forEach((m) => (initMap[m.id] = 0));
    setSelectedGroupForPercent({ ...record, members });
    setOwnershipMap(initMap);
    setIsPercentModalVisible(true);
  };

  const handleSavePercent = () => {
    const total = Object.values(ownershipMap).reduce((sum, v) => sum + Number(v || 0), 0);
    if (total !== 100) return message.warning("Tổng phần trăm phải bằng 100%!");
    message.success("Lưu phần trăm thành công (chỉ giao diện)!");
    setIsPercentModalVisible(false);
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

      const matchCar =
        carFilter === "all" ? true : Number(g?.car?.carId ?? g?.carId) === Number(carFilter);

      return matchKW && matchCar;
    });
  }, [groups, keyword, carFilter]);

  const totalItems = filteredGroups.length;
  const currentRows = filteredGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          <Popconfirm
            title="Xác nhận xoá nhóm này?"
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

          <Form.Item name="groupImg" label="Ảnh nhóm (URL)">
            <Input placeholder="https://..." />
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

      {/* Modal phần trăm (UI only) */}
      <Modal
        title="Chỉnh sửa phần trăm đồng sở hữu"
        open={isPercentModalVisible}
        onCancel={() => setIsPercentModalVisible(false)}
        onOk={handleSavePercent}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        {selectedGroupForPercent && selectedGroupForPercent.members?.length ? (
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
