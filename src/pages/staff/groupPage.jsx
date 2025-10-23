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
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
  CarOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const { Option } = Select;
const { Title, Text } = Typography;

/* ========= LocalStorage helpers ========= */
const LS_KEY = "group_members_map"; // { [groupId]: number[] }
const loadMembersMap = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    // ignore parse error
    return {};
  }
};
const saveMembersMap = (map) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(map || {}));
  } catch  {
    // ignore quota error
  }
};

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // local members map { [groupId]: number[] }
  const [groupMembersMap, setGroupMembersMap] = useState({});

  // UI states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [viewModal, setViewModal] = useState({ visible: false, group: null });
  const [editingGroup, setEditingGroup] = useState(null);

  // Search / filter / pagination
  const [keyword, setKeyword] = useState("");
  const [carFilter, setCarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  /* ========= Load data ========= */
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Group");
      const list = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setGroups(list);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách nhóm!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await api.get("/Car");
      setCars(res.data || []);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách thành viên!");
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchCars();
    fetchUsers();
    setGroupMembersMap(loadMembersMap());
  }, []);

  /* ========= Options: chỉ Member (role = 0) ========= */
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
    ids
      .map((id) => users.find((u) => Number(u.id) === Number(id)))
      .filter(Boolean);

  const setMembersForGroup = (groupId, userIds) => {
    setGroupMembersMap((prev) => {
      const next = { ...prev, [groupId]: (userIds || []).map(Number) };
      saveMembersMap(next);
      return next;
    });
  };

  const removeMembersForGroup = (groupId) => {
    setGroupMembersMap((prev) => {
      const next = { ...prev };
      delete next[groupId];
      saveMembersMap(next);
      return next;
    });
  };

  /* ========= Add Group (members local only) ========= */
  const handleAddGroup = async (values) => {
    try {
      const car = cars.find((c) => Number(c.carId) === Number(values.carId));
      if (!car) return message.error("Hãy chọn một xe hợp lệ!");

      const resCreate = await api.post("/Group", {
        groupName: values.groupName,
        description: values.description,
        carId: car.carId,
      });

      const created = resCreate?.data || {};
      const groupId = created.groupId ?? created.id;

      if (groupId && Array.isArray(values.memberIds) && values.memberIds.length > 0) {
        setMembersForGroup(groupId, values.memberIds);
      }

      message.success("Thêm nhóm thành công!");
      setIsAddModalVisible(false);
      formAdd.resetFields();
      fetchGroups();
    } catch (err) {
      console.error(err);
      message.error("Không thể thêm nhóm!");
    }
  };

  /* ========= View Group ========= */
  const handleViewGroup = (record) => setViewModal({ visible: true, group: record });

  /* ========= Delete Group ========= */
  const handleDelete = async (groupId) => {
    if (!groupId) return message.error("Không tìm thấy ID nhóm để xoá!");
    try {
      await api.delete(`/Group/${groupId}/delete`);
      removeMembersForGroup(groupId);
      message.success("Xoá nhóm thành công!");
      fetchGroups();
    } catch (err) {
      console.error(err);
      message.error("Không thể xoá nhóm!");
    }
  };

  /* ========= Edit Group (update name/img on BE, members local) ========= */
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

      setMembersForGroup(id, values.memberIds || []);

      // cập nhật nhanh name/img hiển thị
      setGroups((prev) =>
        prev.map((g) =>
          getGroupId(g) === id ? { ...g, groupName: values.groupName, groupImg: values.groupImg } : g
        )
      );

      message.success("Cập nhật nhóm thành công!");
      setIsEditModalVisible(false);
    } catch (err) {
      console.error(err);
      message.error("Không thể cập nhật nhóm!");
    }
  };

  /* ========= Filter + Pagination (giống style User/Vehicle) ========= */
  const filteredGroups = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    return groups.filter((g) => {
      const matchKW =
        !kw ||
        [g?.groupName, g?.description, g?.car?.carName, g?.car?.plateNumber]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const matchCar =
        carFilter === "all"
          ? true
          : Number(g?.car?.carId ?? g?.carId) === Number(carFilter);

      return matchKW && matchCar;
    });
  }, [groups, keyword, carFilter]);

  const totalItems = filteredGroups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = filteredGroups.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => handleViewGroup(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa thông tin & thành viên (local)">
            <Button type="default" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
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
      {/* Header + Actions */}
      <Card
        styles={{ padding: 16 }}
        className="border border-gray-100 shadow-sm"
        title={
          <Space>
            <span className="font-semibold">Quản lý nhóm</span>
          </Space>
        }
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
      <Card styles={{ padding: 0 }} className="border border-gray-100 shadow-sm">
        <Table
          dataSource={currentRows}
          columns={columns}
          rowKey={(record) => getGroupId(record)}
          loading={loading}
          pagination={false} // dùng Pagination rời giống các trang khác
          size="middle"
          locale={{
            emptyText: <Empty description="Không có nhóm nào" />,
          }}
        />
      </Card>

      {/* Pagination (rời) */}
      <Space style={{ width: "100%", justifyContent: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Space>

      {/* ===== Modal thêm nhóm ===== */}
      <Modal
        title="Thêm nhóm mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={() => formAdd.submit()}
        okText="Lưu"
        cancelText="Hủy"
     destroyOnHidden
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAddGroup}>
          <Form.Item
            name="groupName"
            label="Tên nhóm"
            rules={[{ required: true, message: "Nhập tên nhóm!" }]}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Nhập mô tả" rows={3} />
          </Form.Item>

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

          {/* Thành viên (local only) */}
          <Form.Item name="memberIds" label="Thành viên trong nhóm">
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn thành viên (chỉ hiển thị Member)"
              options={memberOptions}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== Modal chỉnh sửa nhóm ===== */}
      <Modal
        title="Cập nhật nhóm"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => formEdit.submit()}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={formEdit} layout="vertical" onFinish={handleUpdateGroup}>
          <Form.Item
            name="groupName"
            label="Tên nhóm"
            rules={[{ required: true, message: "Nhập tên nhóm!" }]}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>

          {/* Swagger: /Group/{id}/update nhận groupName + groupImg */}
          <Form.Item name="groupImg" label="Ảnh nhóm (URL)">
            <Input placeholder="https://..." />
          </Form.Item>

          {/* Thành viên (local only) */}
          <Form.Item name="memberIds" label="Thành viên trong nhóm">
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn thành viên (chỉ hiển thị Member)"
              options={memberOptions}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== Modal xem chi tiết ===== */}
      <Modal
        open={viewModal.visible}
        onCancel={() => setViewModal({ visible: false, group: null })}
        footer={null}
        title="Thông tin nhóm"
        destroyOnHidden
      >
        {viewModal.group &&
          (() => {
            const ids = getMemberIdsForGroup(viewModal.group);
            const members = resolveMembers(ids);
            const g = viewModal.group;

            const formattedCreated = g.createdAt
              ? new Date(g.createdAt).toLocaleString("vi-VN")
              : "(Không có)";

            return (
              <div className="space-y-3">
                <p>
                  <strong>Tên nhóm:</strong> {g.groupName}
                </p>
                <p>
                  <strong>Mô tả:</strong> {g.description || "(không có)"}
                </p>
                <p>
                  <strong>Ngày tạo:</strong> {formattedCreated}
                </p>

                {g.groupImg ? (
                  <div>
                    <strong>Ảnh nhóm:</strong>
                    <div className="mt-2">
                      <img
                        src={g.groupImg}
                        alt="Ảnh nhóm"
                        className="w-full max-h-64 object-contain rounded-lg border"
                      />
                    </div>
                  </div>
                ) : (
                  <p>
                    <strong>Ảnh nhóm:</strong> (chưa có)
                  </p>
                )}

                {g.car ? (
                  <>
                    <p>
                      <strong>Xe:</strong> {g.car.carName}
                    </p>
                    <p>
                      <strong>Biển số:</strong> {g.car.plateNumber}
                    </p>
                  </>
                ) : (
                  <p>Chưa có xe được gán</p>
                )}

                <div>
                  <strong>Thành viên ({members.length}):</strong>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {members.length > 0 ? (
                      members.map((m) => (
                        <Tag key={m.id} color="geekblue">
                          {m.name}
                          {m.email ? ` (${m.email})` : ""}
                        </Tag>
                      ))
                    ) : (
                      <div>(Chưa có thành viên)</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
      </Modal>
    </div>
  );
}
