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
  Upload,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
  CarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const { Option } = Select;
const { Text } = Typography;

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // carId -> [userId] (sở hữu xe)
  const [carOwnersMap, setCarOwnersMap] = useState({});

  // modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  // Percent modal
  const [isPercentModalVisible, setIsPercentModalVisible] = useState(false);
  const [selectedGroupForPercent, setSelectedGroupForPercent] = useState(null);
  const [ownershipMap, setOwnershipMap] = useState({});        // userId -> percentage
  const [carUserIdMap, setCarUserIdMap] = useState({});        // userId -> carUserId
  const [percentIdMap, setPercentIdMap] = useState({});        // userId -> percentOwnershipId
  const [usageLimitMap, setUsageLimitMap] = useState({});      // userId -> usageLimit (giữ 0 nếu không dùng)
  const [loadingPercent, setLoadingPercent] = useState(false);

  // filters
  const [keyword, setKeyword] = useState("");
  const [carFilter, setCarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  
  // Upload states
  const [fileListAdd, setFileListAdd] = useState([]);
  const [fileListEdit, setFileListEdit] = useState([]);

  /* ========= Upload handlers ========= */
  const handleImageUploadAdd = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file hình ảnh');
      return false;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      message.error('Kích thước file không được vượt quá 5MB');
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      formAdd.setFieldsValue({ groupImg: dataUrl });
      
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: dataUrl,
        thumbUrl: dataUrl,
      };
      setFileListAdd([newFile]);
    };
    reader.onerror = () => {
      message.error('Đã xảy ra lỗi khi đọc file. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
    
    return false;
  };

  const handleImageUploadEdit = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file hình ảnh');
      return false;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      message.error('Kích thước file không được vượt quá 5MB');
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      formEdit.setFieldsValue({ groupImg: dataUrl });
      
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: dataUrl,
        thumbUrl: dataUrl,
      };
      setFileListEdit([newFile]);
    };
    reader.onerror = () => {
      message.error('Đã xảy ra lỗi khi đọc file. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
    
    return false;
  };

  const handleRemoveImageAdd = () => {
    setFileListAdd([]);
    formAdd.setFieldsValue({ groupImg: null });
  };

  const handleRemoveImageEdit = () => {
    setFileListEdit([]);
    formEdit.setFieldsValue({ groupImg: null });
  };

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

        const listGroups = Array.isArray(gRes.data) ? gRes.data : gRes.data ? [gRes.data] : [];
        const listCars = cRes.data || [];
        const rawUsers = Array.isArray(uRes.data) ? uRes.data : uRes.data ? [uRes.data] : [];
        const listUsers = rawUsers
          .filter(Boolean)
          .map((u) => ({
            id: u.userId ?? u.id,
            name: u.fullName || u.userName || u.email || `User #${u.userId ?? u.id}`,
            email: u.email,
            role: typeof u.role === "number" ? u.role : Number(u.role ?? 0),
          }))
          .filter((u) => u.id != null);

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
    const carId = Number(group?.carId ?? group?.car?.carId);
    if (!carId) return null;
    return carById.get(carId) || null;
  };

  // Thành viên của group = các user đang sở hữu carId đó (đọc từ BE)
  const getMemberIdsForGroup = (group) => {
    const carId = Number(group?.car?.carId ?? group?.carId);
    if (!carId) return [];
    return Array.isArray(carOwnersMap[carId]) ? carOwnersMap[carId] : [];
  };

  const resolveMembers = (ids) =>
    ids.map((id) => users.find((u) => Number(u.id) === Number(id))).filter(Boolean);

  /* ========= CarUser API ========= */
  async function addCarUser(carId, userId) {
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

    for (const uid of toAdd) await addCarUser(Number(carId), Number(uid));
    for (const uid of toRemove) await removeCarUser(Number(carId), Number(uid));
  }

  /* ========= Owners hydrate ========= */
  async function tryGetUsersByCar(carId) {
    try {
      const res = await api.get(`/cars/${carId}/users`); // nếu BE có
      const arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      return arr.map((u) => Number(u?.userId ?? u?.id)).filter((x) => Number.isFinite(x));
    } catch {
      return null;
    }
  }

  async function getUserCarIds(userId) {
    try {
      const r = await api.get(`/users/${userId}/cars`);
      const arr = Array.isArray(r.data) ? r.data : r.data ? [r.data] : [];
      return new Set(
        arr
          .map((it) => Number(it?.carId ?? it?.car?.carId ?? it?.car?.id ?? it?.id))
          .filter((x) => Number.isFinite(x))
      );
    } catch {
      return new Set();
    }
  }

  async function hydrateCarOwners(carsList, usersList) {
    const next = {};

    const fastResults = await Promise.allSettled(
      (carsList || []).map(async (car) => {
        const cid = Number(car?.carId ?? car?.id);
        if (!Number.isFinite(cid)) return { cid, owners: [] };
        const owners = await tryGetUsersByCar(cid);
        return { cid, owners };
      })
    );

    let needFallback = false;
    fastResults.forEach((p) => {
      const { cid, owners } = p.value || {};
      if (cid == null) return;
      if (owners === null) needFallback = true;
      else next[cid] = owners;
    });

    if (needFallback) {
      const userCarsMap = new Map();
      await Promise.allSettled(
        (usersList || []).map(async (u) => {
          const set = await getUserCarIds(u.id);
          userCarsMap.set(u.id, set);
        })
      );

      (carsList || []).forEach((car) => {
        const cid = Number(car?.carId ?? car?.id);
        if (!Number.isFinite(cid)) return;
        if (Array.isArray(next[cid])) return;
        const owners = (usersList || [])
          .filter((u) => userCarsMap.get(u.id)?.has(cid))
          .map((u) => Number(u.id));
        next[cid] = owners;
      });
    }

    setCarOwnersMap(next);
  }

  /* ========= PercentOwnership API helpers ========= */
  // Thử route không /api trước, lỗi mới thử có /api
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

  // Resolve carUserId cho (carId, userId)
  async function resolveCarUserId(carId, userId) {
    try {
      const r = await api.get(`/users/${userId}/cars`);
      const arr = Array.isArray(r.data) ? r.data : r.data ? [r.data] : [];
      const found = arr.find((it) => {
        const cid = Number(it?.carId ?? it?.car?.carId ?? it?.car?.id ?? it?.id);
        return Number(cid) === Number(carId);
      });
      if (!found) return null;
      return Number(found?.carUserId ?? found?.id); // tuỳ BE đặt tên
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
      setFileListAdd([]);

      await fetchGroupsAndRehydrate();
    } catch {
      message.error("Không thể thêm nhóm!");
    }
  };

  async function fetchGroupsAndRehydrate() {
    const gRes = await api.get("/Group");
    const listGroups = Array.isArray(gRes.data) ? gRes.data : gRes.data ? [gRes.data] : [];
    setGroups(listGroups);
    await hydrateCarOwners(cars, users);
  }

  const handleDelete = async (groupId) => {
    try {
      const group = groups.find((g) => getGroupId(g) === groupId);
      const carId = Number(group?.car?.carId ?? group?.carId);

      const currentMembers = getMemberIdsForGroup(group).map(Number);
      if (carId && currentMembers?.length) {
        for (const uid of currentMembers) {
          try {
            await removeCarUser(carId, uid);
          } catch (e) {
            console.warn(`Gỡ quan hệ car ${carId} ↔ user ${uid} thất bại`, e?.response?.data || e);
          }
        }
      }

      await api.delete(`/Group/${groupId}/delete`);
      message.success("Đã xoá nhóm và gỡ liên kết sở hữu của các thành viên.");

      await fetchGroupsAndRehydrate();
    } catch {
      message.error("Không thể xoá nhóm!");
    }
  };

  const openEditModal = (record) => {
    setEditingGroup(record);
    const carId = Number(record?.car?.carId ?? record?.carId);
    const currentMemberIds = Array.isArray(carOwnersMap[carId]) ? carOwnersMap[carId] : [];
    const imageUrl = record?.groupImg;
    
    // Nếu có ảnh, thêm vào fileListEdit để hiển thị
    if (imageUrl) {
      setFileListEdit([{
        uid: '-1',
        name: 'image.jpg',
        status: 'done',
        url: imageUrl,
        thumbUrl: imageUrl,
      }]);
    } else {
      setFileListEdit([]);
    }
    
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

      const carId = Number(editingGroup?.car?.carId ?? editingGroup?.carId);
      if (carId) {
        const prevMemberIds = (() => {
          const cid = Number(carId);
          return Array.isArray(carOwnersMap[cid]) ? carOwnersMap[cid] : [];
        })();
        const nextMemberIds = (values.memberIds || []).map(Number);
        await syncCarUsersForGroup({ carId, prevMemberIds, nextMemberIds });
      }

      message.success("Cập nhật nhóm thành công!");
      setIsEditModalVisible(false);
      setFileListEdit([]);

      await hydrateCarOwners(cars, users);
    } catch (e) {
      console.error(e);
      message.error("Không thể cập nhật nhóm!");
    }
  };

  /* ========= Percent modal ========= */
  const handleOpenPercentModal = async (record) => {
    const carId = Number(record?.car?.carId ?? record?.carId);
    if (!carId) {
      message.warning("Nhóm chưa gắn xe, không thể chỉnh phần trăm.");
      return;
    }

    setIsPercentModalVisible(true);
    setLoadingPercent(true);

    try {
      // Các user đang sở hữu xe này
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

      // Lấy toàn bộ PercentOwnership từ API
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
        // Tìm phần trăm sở hữu từ API theo carUserId
        const exist = (allPO || []).find(
          (p) => Number(p?.carUserId ?? p?.CarUserId ?? p?.caruserId ?? p?.car_user_id) === Number(cuid)
        );
        if (exist) {
          nextOwnership[m.id] = Number(exist?.percentage ?? exist?.Percentage ?? 0);
          nextUsageLimit[m.id] = Number(exist?.usageLimit ?? exist?.UsageLimit ?? 0);
          nextPercentId[m.id] = Number(exist?.id ?? exist?.Id ?? exist?.percentOwnershipId ?? 0);
        } else {
          // Nếu chưa có trong API, mặc định là 0
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
      setIsPercentModalVisible(false);
    } finally {
      setLoadingPercent(false);
    }
  };

  const handleSavePercent = async () => {
    // Tổng phải bằng 100
    const total = Object.values(ownershipMap).reduce(
      (sum, v) => sum + Number(v || 0),
      0
    );
    if (total !== 100) {
      message.warning("Tổng phần trăm phải bằng 100%!");
      return;
    }

    try {
      const carId = Number(selectedGroupForPercent?.carId ?? selectedGroupForPercent?.car?.carId);
      const members = selectedGroupForPercent?.members || [];

      // Lưu lần lượt (có thể chuyển Promise.all nếu BE chịu tải)
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

      message.success("Đã lưu phần trăm đồng sở hữu!");
      setIsPercentModalVisible(false);

      // Sau khi lưu có thể refetch cho chắc
      await hydrateCarOwners(cars, users);
    } catch (e) {
      console.error(e);
      message.error("Lưu phần trăm thất bại!");
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

      const matchCar =
        carFilter === "all"
          ? true
          : Number(g?.car?.carId ?? g?.carId) === Number(carFilter);

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
        const carId = Number(record?.car?.carId ?? record?.carId);
        const count = Array.isArray(carOwnersMap[carId]) ? carOwnersMap[carId].length : 0;
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
              onClick={() => {
                setFileListAdd([]);
                setIsAddModalVisible(true);
              }}
            >
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
        onCancel={() => {
          setIsAddModalVisible(false);
          setFileListAdd([]);
        }}
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

          <Form.Item name="groupImg" label="Ảnh nhóm">
            <Upload
              accept="image/*"
              beforeUpload={handleImageUploadAdd}
              onRemove={handleRemoveImageAdd}
              maxCount={1}
              listType="picture-card"
              fileList={fileListAdd}
            >
              {fileListAdd.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa nhóm */}
      <Modal
        title="Cập nhật nhóm"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setFileListEdit([]);
        }}
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
          <Form.Item name="groupImg" label="Ảnh nhóm">
            <Upload
              accept="image/*"
              beforeUpload={handleImageUploadEdit}
              onRemove={handleRemoveImageEdit}
              maxCount={1}
              listType="picture-card"
              fileList={fileListEdit}
            >
              {fileListEdit.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
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
        }}
        onOk={handleSavePercent}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
        width={700}
      >
        {loadingPercent ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Đang tải phần trăm đồng sở hữu...</p>
          </div>
        ) : selectedGroupForPercent && selectedGroupForPercent.members?.length ? (
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
                        {carInfo?.carName || carInfo?.name || selectedGroupForPercent.groupName || "Chưa có tên"}
                      </p>
                      {carInfo?.plateNumber && (
                        <p className="text-sm text-gray-600 mt-1">
                          Biển số: {carInfo.plateNumber}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-indigo-600 font-medium">Tổng sở hữu</p>
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

            {/* Danh sách đồng sở hữu */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  Danh sách đồng sở hữu
                </h4>
                <span className="text-sm text-gray-600">
                  Tổng: {selectedGroupForPercent.members.length} người
                </span>
              </div>

              {/* Sắp xếp members theo phần trăm giảm dần */}
              {[...selectedGroupForPercent.members]
                .sort((a, b) => (ownershipMap[b.id] || 0) - (ownershipMap[a.id] || 0))
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
                            <p className="text-xs text-gray-500 mb-1">Phần trăm đóng góp</p>
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
                                [m.id]: e.target.value === "" ? "" : Number(e.target.value),
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
