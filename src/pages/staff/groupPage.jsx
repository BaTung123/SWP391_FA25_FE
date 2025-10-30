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
  Tooltip,
  Pagination,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  CarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const { Option } = Select;

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]); // chỉ role=member
  const [loading, setLoading] = useState(false);

  // carId -> [userId]
  const [membersByCarId, setMembersByCarId] = useState({});

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [viewModal, setViewModal] = useState({ visible: false, group: null });
  const [editingGroup, setEditingGroup] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [carFilter, setCarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  /* =================== FETCH =================== */
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Group");
      setGroups(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
    } catch {
      message.error("Không thể tải danh sách nhóm!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await api.get("/Car");
      setCars(res.data || []);
    } catch {
      message.error("Không thể tải danh sách xe!");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/User");
      const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      const members = data
        .filter((u) => Number(u.role ?? 0) === 0)
        .map((u) => ({
          id: u.userId ?? u.id,
          name: u.fullName || u.userName || u.email || `User #${u.userId ?? u.id}`,
          email: u.email,
        }))
        .filter((u) => u.id != null);
      setUsers(members);
    } catch {
      message.error("Không thể tải danh sách thành viên!");
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchCars(), fetchUsers()]);
      await fetchGroups();
    })();
  }, []);

  // ---- CarUser helpers ----
  const doesUserOwnCar = async (userId, carId) => {
    try {
      const res = await api.get(`/users/${userId}/cars`);
      const arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      return arr.some((c) => Number(c.carId ?? c.id) === Number(carId));
    } catch {
      return false;
    }
  };

  const safeAddOwner = async (carId, userId) => {
    const owns = await doesUserOwnCar(userId, carId);
    if (owns) return;
    await api.post(`/cars/${carId}/users/${userId}/add`);
  };

  const safeRemoveOwner = async (carId, userId) => {
    const owns = await doesUserOwnCar(userId, carId);
    if (!owns) return;
    await api.delete(`/cars/${carId}/users/${userId}/remove`);
  };

  const fetchMembersForCar = async (carId) => {
    if (!carId || users.length === 0) return [];
    try {
      const results = await Promise.all(
        users.map(async (u) => {
          try {
            const res = await api.get(`/users/${u.id}/cars`);
            const userCars = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
            const owns = userCars.some((c) => Number(c.carId ?? c.id) === Number(carId));
            return owns ? u.id : null;
          } catch {
            return null;
          }
        })
      );
      const memberIds = results.filter(Boolean).map(Number);
      setMembersByCarId((prev) => ({ ...prev, [carId]: memberIds }));
      return memberIds;
    } catch {
      return [];
    }
  };

  const hydrateAllCarsMembers = async (groupsList) => {
    const carIds = [
      ...new Set(
        groupsList
          .map((g) => Number(g?.car?.carId ?? g?.carId))
          .filter((id) => !Number.isNaN(id))
      ),
    ];
    await Promise.all(carIds.map((cid) => fetchMembersForCar(cid)));
  };

  useEffect(() => {
    if (groups.length && users.length) {
      hydrateAllCarsMembers(groups);
    }
  }, [groups, users]);

  /* =================== HELPERS =================== */
  const getGroupId = (g) => g?.groupId ?? g?.id;
  const getCarIdOfGroup = (g) => Number(g?.car?.carId ?? g?.carId);
  const memberOptions = useMemo(
    () =>
      users.map((u) => ({
        label: `${u.name}${u.email ? ` (${u.email})` : ""}`,
        value: u.id,
      })),
    [users]
  );
  const getMemberIdsForGroup = (g) => {
    const cid = getCarIdOfGroup(g);
    return Array.isArray(membersByCarId[cid]) ? membersByCarId[cid] : [];
  };
  const resolveCarForGroup = (g) =>
    g?.car ?? cars.find((c) => Number(c.carId) === Number(g?.carId));

  const humanizeError = (e) => {
    const d = e?.response?.data;
    if (typeof d === "string") return d;
    return d?.message || d?.title || d?.detail || "Server error";
  };

  /* =================== ADD GROUP =================== */
  const handleAddGroup = async (values) => {
    const car = cars.find((c) => Number(c.carId) === Number(values.carId));
    if (!car) return message.error("Vui lòng chọn xe hợp lệ!");

    // Nếu DB ràng buộc 1-1 Car-Group: chặn xe đã thuộc nhóm khác
    const carAlreadyUsed = groups.some(
      (g) => Number(g?.car?.carId ?? g?.carId) === Number(car.carId)
    );
    if (carAlreadyUsed) {
      return message.warning("Chiếc xe này đã thuộc một nhóm khác. Vui lòng chọn xe khác.");
    }

    const payload = {
      groupName: values.groupName?.trim(),
      ...(values.description?.trim() ? { description: values.description.trim() } : {}),
      ...(values.groupImg?.trim() ? { groupImg: values.groupImg.trim() } : {}),
      carId: Number(car.carId),
    };

    try {
      await api.post("/Group", payload, { headers: { "Content-Type": "application/json" } });

  
      const memberIds = (values.memberIds || []).map(Number).filter(Boolean);
      for (const uid of memberIds) {
        await safeAddOwner(Number(car.carId), uid);
      }

 
      await fetchMembersForCar(Number(car.carId));
      message.success("Thêm nhóm thành công!");
      setIsAddModalVisible(false);
      formAdd.resetFields();
      fetchGroups();
    } catch (err) {
      console.error("Create group failed:", err?.response?.data || err);
      message.error(humanizeError(err));
    }
  };

  /* =================== EDIT GROUP =================== */
  const openEditModal = async (record) => {
    setEditingGroup(record);
    const carId = getCarIdOfGroup(record);
    const current = membersByCarId[carId]?.length
      ? membersByCarId[carId]
      : await fetchMembersForCar(carId);

    formEdit.setFieldsValue({
      groupName: record.groupName,
      groupImg: record.groupImg || "",
      memberIds: current || [],
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateGroup = async (values) => {
    const id = getGroupId(editingGroup);
    if (!id) return;
    const carId = getCarIdOfGroup(editingGroup);

    try {
  
      await api.put(`/Group/${id}/update`, {
        groupName: values.groupName,
        groupImg: values.groupImg || "",
      });

      // 2) diff thành viên -> remove trước, add sau (đều có precheck)
      const prev = new Set(getMemberIdsForGroup(editingGroup));
      const next = new Set((values.memberIds || []).map(Number));
      const toAdd = [...next].filter((uid) => !prev.has(uid));
      const toRemove = [...prev].filter((uid) => !next.has(uid));

      for (const uid of toRemove) {
        await safeRemoveOwner(carId, uid);
      }
      for (const uid of toAdd) {
        await safeAddOwner(carId, uid);
      }

      await fetchMembersForCar(carId);

      message.success("Cập nhật nhóm thành công!");
      setIsEditModalVisible(false);
      // cập nhật tên/ảnh hiển thị
      setGroups((prev) =>
        prev.map((g) =>
          getGroupId(g) === id ? { ...g, groupName: values.groupName, groupImg: values.groupImg } : g
        )
      );
    } catch (err) {
      console.error("Update group failed:", err?.response?.data || err);
      message.error(humanizeError(err));
    }
  };

  /* =================== DELETE GROUP =================== */
  const handleDeleteGroup = async (record) => {
    const id = getGroupId(record);
    try {
      await api.delete(`/Group/${id}/delete`);
      message.success("Đã xoá nhóm!");
      fetchGroups();
    } catch (err) {
      console.error("Delete group failed:", err?.response?.data || err);
      message.error(humanizeError(err));
    }
  };

  /* =================== FILTER & PAGINATION =================== */
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRows = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

  /* =================== COLUMNS =================== */
  const columns = [
    { title: "Tên nhóm", dataIndex: "groupName", key: "groupName" },
    {
      title: "Xe",
      key: "car",
      render: (_, record) => {
        const car = resolveCarForGroup(record);
        return car ? `${car.carName} (${car.plateNumber})` : "Chưa có xe";
      },
    },
    {
      title: "Thành viên",
      key: "members",
      align: "center",
      width: 140,
      render: (_, record) => {
        const count = getMemberIdsForGroup(record).length;
        return <Tag color="blue">{count} thành viên</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 260,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => setViewModal({ visible: true, group: record })}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa nhóm & thành viên">
            <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá nhóm?"
            onConfirm={() => handleDeleteGroup(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* =================== RENDER =================== */
  return (
    <div className="space-y-4">
      <Card
        title="Quản lý nhóm"
        extra={
          <Space wrap>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm nhóm / biển số / tên xe"
              style={{ width: 260 }}
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

      <Card>
        <Table
          dataSource={currentRows}
          columns={columns}
          rowKey={(r) => r.groupId ?? r.id}
          loading={loading}
          pagination={false}
          size="middle"
          locale={{ emptyText: <Empty description="Không có nhóm nào" /> }}
        />
      </Card>

      <Space style={{ width: "100%", justifyContent: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredGroups.length}
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
            name="groupName"
            label="Tên nhóm"
            rules={[{ required: true, message: "Nhập tên nhóm!" }]}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>
          <Form.Item name="groupImg" label="Ảnh nhóm (URL)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item
            name="carId"
            label="Chọn xe"
            rules={[{ required: true, message: "Vui lòng chọn xe!" }]}
          >
            <Select placeholder="Chọn xe">
              {cars.map((car) => (
                <Option key={car.carId} value={car.carId}>
                  {car.carName} - {car.plateNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="memberIds" label="Chọn thành viên (role = member)">
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

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết nhóm"
        open={viewModal.visible}
        onCancel={() => setViewModal({ visible: false, group: null })}
        footer={null}
        destroyOnClose
      >
        {viewModal.group ? (
          <div>
            <p><b>Tên nhóm:</b> {viewModal.group.groupName}</p>
            <p>
              <b>Xe:</b>{" "}
              {(() => {
                const car = resolveCarForGroup(viewModal.group);
                return car ? `${car.carName} (${car.plateNumber})` : "Chưa có xe";
              })()}
            </p>
            <p>
              <b>Số thành viên:</b> {getMemberIdsForGroup(viewModal.group).length}
            </p>
            {viewModal.group.groupImg && (
              <img
                src={viewModal.group.groupImg}
                alt="group"
                style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
              />
            )}
          </div>
        ) : (
          <Empty />
        )}
      </Modal>
    </div>
  );
}
