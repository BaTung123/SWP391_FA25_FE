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
  Tag,
  Card,
  Row,
  Col,
  Tooltip,
  InputNumber,
  Divider,
  Avatar,
  Empty,
  Pagination,
<<<<<<< HEAD
  Popconfirm,
=======
  Progress,
<<<<<<< HEAD
>>>>>>> main
=======
  Typography,
>>>>>>> main
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  CarOutlined,
  SearchOutlined,
  PictureOutlined,
  PieChartOutlined,
<<<<<<< HEAD
  DeleteOutlined,
=======
>>>>>>> main
} from "@ant-design/icons";
import api from "../../config/axios.js";

const { Option } = Select;
const { Text } = Typography;

/* ========= LocalStorage helpers ========= */
const PERCENT_KEY = "ownership_percent_map"; // { [groupId]: { [userId]: percent } }
const LS_KEY = "group_members_map"; // { [groupId]: number[] }

const loadPercentMap = () => {
  try {
    const raw = localStorage.getItem(PERCENT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const loadMembersMap = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export default function VehicleManagementPage() {
  const [vehicles, setVehicles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openShareModal, setOpenShareModal] = useState(false);

  const [openShareModal, setOpenShareModal] = useState(false); // Modal xem phần trăm
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Xe được chọn để xem phần trăm

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [form] = Form.useForm();

  // --- Lấy danh sách xe ---
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Car");
      setVehicles(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      message.error("Không thể tải danh sách xe.");
    } finally {
      setLoading(false);
    }
  };

  // --- Lấy danh sách nhóm ---
  const fetchGroups = async () => {
    try {
      const res = await api.get("/Group");
      const list = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      setGroups(list);
    } catch {
      // Không hiển thị lỗi vì có thể không có quyền truy cập
    }
  };

  // --- Lấy danh sách người dùng ---
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
          raw: u,
        }))
        .filter((u) => u.id != null);
      setUsers(mapped);
    } catch {
      // Không hiển thị lỗi vì có thể không có quyền truy cập
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchGroups();
    fetchUsers();
  }, []);

  // --- Mở modal thêm/sửa ---
  const openAddModal = () => {
    setEditingVehicle(null);
    form.resetFields();
    setOpenModal(true);
  };

  const openEditModal = (record) => {
    setEditingVehicle(record);
    form.setFieldsValue({
      ...record,
      status: Number(record?.status ?? 0),
      batteryCapacity: Number(record?.batteryCapacity ?? 0),
    });
    setOpenModal(true);
  };

  // --- Thêm/Sửa xe ---
  const handleSubmit = async (values) => {
    try {
      const payload = {
        brand: values.brand,
        carName: values.carName,
        plateNumber: values.plateNumber,
        status: Number(values.status),
        image: values.image,
        color: values.color,
        batteryCapacity: Number(values.batteryCapacity),
      };

      if (editingVehicle) {
        await api.put(`/Car/${editingVehicle.carId}/update`, payload);
        message.success("Cập nhật xe thành công!");
      } else {
        await api.post("/Car", payload);
        message.success("Thêm xe thành công!");
      }

      setOpenModal(false);
      form.resetFields();
      fetchVehicles();
    } catch (error) {
      console.error("Lỗi khi lưu xe:", error);
      message.error("Không thể lưu xe. Vui lòng thử lại.");
    }
  };
  const handleDelete = async (record) => {
    try {
      const carId = record?.carId ?? record?.id;
      if (!carId) {
        message.error("Không xác định được ID xe để xoá.");
        return;
      }
      await api.delete(`/Car/${carId}/delete`);
      message.success("Xoá xe thành công!");
      fetchVehicles();
    } catch (error) {
      console.error("Lỗi khi xoá xe:", error);
      message.error("Không thể xoá xe. Vui lòng thử lại.");
    }
  };

  // --- Lọc + tìm kiếm ---
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return vehicles.filter((v) => {
      const matchKW =
        !kw ||
        [v?.carName, v?.brand, v?.plateNumber]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const matchStatus =
        statusFilter === "all"
          ? true
          : Number(v?.status ?? 0) === Number(statusFilter);

      return matchKW && matchStatus;
    });
  }, [vehicles, keyword, statusFilter]);

  // --- Slice dữ liệu theo trang ---
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // --- Columns ---
  const columns = [
    {
      title: "Xe",
      key: "car",
      render: (_, record) => (
        <Space>
          {record?.image ? (
            <Avatar shape="square" size={40} src={record.image} />
          ) : (
            <Avatar shape="square" size={40} icon={<PictureOutlined />} />
          )}
          <div>
            <div className="font-medium">{record.carName}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.brand || "—"}
            </div>
          </div>
        </Space>
      ),
    },
    { title: "Biển số", dataIndex: "plateNumber", key: "plateNumber" },
    { title: "Màu", dataIndex: "color", key: "color", width: 120 },
    {
      title: "Pin (kWh)",
      dataIndex: "batteryCapacity",
      key: "batteryCapacity",
      align: "right",
      width: 130,
      render: (v) => (v != null ? Number(v) : "—"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (value) =>
        Number(value) === 1 ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag>Không hoạt động</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem phần trăm đồng sở hữu">
            <Button
              size="small"
              icon={<PieChartOutlined />}
              onClick={() => {
                setSelectedVehicle(record);
                setOpenShareModal(true);
              }}
            >
              Phần trăm
            </Button>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            >
              Sửa
            </Button>
          </Tooltip>
          <Popconfirm
            title="Xác nhận xoá xe?"
            description="Hành động này không thể hoàn tác."
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xoá{" "}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header + Actions */}
      <Card
        styles={{ padding: 16 }}
        className="border border-gray-100 shadow-sm"
        title={
          <Space>
            <CarOutlined />
            <span className="font-semibold">Quản lý xe</span>
          </Space>
        }
        extra={
          <Space wrap>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm theo tên/biển số/hãng"
              style={{ width: 260 }}
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Select
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
              style={{ width: 180 }}
              options={[
                { label: "Tất cả trạng thái", value: "all" },
                { label: "Đang hoạt động", value: 1 },
                { label: "Không hoạt động", value: 0 },
              ]}
            />
<<<<<<< HEAD
            {/* Nút xem phần trăm đồng sở hữu */}
            <Button
              type="default"
              icon={<PieChartOutlined />}
              onClick={() => setOpenShareModal(true)}
            >
              Xem phần trăm đồng sở hữu
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
=======
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
>>>>>>> main
              Thêm xe
            </Button>
          </Space>
        }
      />

      {/* Table */}
      <Card
        styles={{ padding: 0 }}
        className="border border-gray-100 shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={currentVehicles}
          rowKey={(r) => r.id ?? r.carId}
          size="middle"
          bordered
          loading={loading}
          sticky
          pagination={false}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu xe" />
            ),
          }}
        />
      </Card>

      {/* Pagination */}
      <Space style={{ width: "100%", justifyContent: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Space>

      {/* Modal Thêm/Sửa */}
      <Modal
        title={
          <Space>
            <CarOutlined />
            <span>{editingVehicle ? "Sửa thông tin xe" : "Thêm xe mới"}</span>
          </Space>
        }
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          colon={false}
          initialValues={{ status: 1 }}
        >
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="brand"
                label="Hãng xe"
                rules={[{ required: true, message: "Vui lòng nhập hãng xe" }]}
              >
                <Input placeholder="VD: VinFast" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="carName"
                label="Tên xe"
                rules={[{ required: true, message: "Vui lòng nhập tên xe" }]}
              >
                <Input placeholder="VD: VF e34" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="plateNumber"
                label="Biển số"
                rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
              >
                <Input placeholder="VD: 51H-123.45" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="color" label="Màu xe">
                <Input placeholder="VD: Trắng, Đen, Đỏ..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="batteryCapacity"
                label="Dung lượng pin (kWh)"
                rules={[{ required: true, message: "Nhập dung lượng pin" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="VD: 42" controls={false} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: "Không hoạt động", value: 0 },
                    { label: "Đang hoạt động", value: 1 },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "8px 0 16px" }} />

          <Form.Item name="image" label="Ảnh xe (URL)">
            <Input
              placeholder="https://link-to-image..."
              prefix={<PictureOutlined />}
            />
          </Form.Item>

          {form.getFieldValue("image") && (
            <Card
              size="small"
              type="inner"
              title="Xem trước ảnh"
              style={{ marginTop: 8 }}
            >
              <img
                src={form.getFieldValue("image")}
                alt="car"
                style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </Card>
          )}
        </Form>
      </Modal>

      {/* Modal phần trăm đồng sở hữu */}
      <Modal
        title={
          <Space>
            <PieChartOutlined />
            <span>
              Phần trăm đồng sở hữu - {selectedVehicle?.carName || ""} (
              {selectedVehicle?.plateNumber || ""})
            </span>
          </Space>
        }
        open={openShareModal}
        footer={null}
        onCancel={() => {
          setOpenShareModal(false);
          setSelectedVehicle(null);
        }}
        width={700}
      >
<<<<<<< HEAD
        {vehicles.length === 0 ? (
          <Empty description="Chưa có dữ liệu đồng sở hữu" />
        ) : (
          <Table
            dataSource={vehicles.map((v) => ({
              ...v,
              sharePercent: Math.floor(Math.random() * 60) + 20, // demo phần trăm giả
            }))}
            rowKey={(r) => r.id ?? r.carId}
            pagination={false}
            columns={[
              { title: "Tên xe", dataIndex: "carName", key: "carName" },
<<<<<<< HEAD
              {
                title: "Biển số",
                dataIndex: "plateNumber",
                key: "plateNumber",
              },
=======
              { title: "Biển số", dataIndex: "plateNumber", key: "plateNumber" },
>>>>>>> main
              {
                title: "Phần trăm sở hữu",
                dataIndex: "sharePercent",
                key: "sharePercent",
<<<<<<< HEAD
                render: (v) => (
                  <Progress percent={v} size="small" status="active" />
                ),
=======
                render: (v) => <Progress percent={v} size="small" status="active" />,
>>>>>>> main
              },
            ]}
          />
        )}
=======
        {(() => {
          if (!selectedVehicle) {
            return <Empty description="Chưa chọn xe" />;
          }

          // Tìm group có carId trùng với xe được chọn
          const carId = selectedVehicle.id ?? selectedVehicle.carId;
          const group = groups.find(
            (g) => Number(g?.car?.carId ?? g?.carId) === Number(carId)
          );

          if (!group) {
            return <Empty description="Xe này chưa có nhóm đồng sở hữu" />;
          }

          // Lấy members và phần trăm
          const groupId = group.groupId ?? group.id;
          const membersMap = loadMembersMap();
          const percentMap = loadPercentMap();
          const memberIds = membersMap[groupId] || [];
          const ownershipPercent = percentMap[groupId] || {};

          if (memberIds.length === 0) {
            return <Empty description="Nhóm chưa có thành viên" />;
          }

          // Tạo danh sách owners với thông tin đầy đủ
          const owners = memberIds
            .map((userId) => {
              const user = users.find((u) => Number(u.id) === Number(userId));
              if (!user) return null;
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                percent: Number(ownershipPercent[userId] ?? 0),
              };
            })
            .filter(Boolean);

          if (owners.length === 0) {
            return <Empty description="Không tìm thấy thông tin thành viên" />;
          }

          return (
            <Table
              dataSource={owners}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Tên thành viên",
                  dataIndex: "name",
                  key: "name",
                  render: (text) => <Text strong>{text}</Text>,
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  key: "email",
                },
                {
                  title: "Phần trăm sở hữu",
                  dataIndex: "percent",
                  key: "percent",
                  align: "center",
                  width: 200,
                  render: (v) => (
                    <Progress percent={Number(v) || 0} size="small" status="active" />
                  ),
                },
                {
                  title: "Phần trăm",
                  dataIndex: "percent",
                  key: "percentValue",
                  align: "center",
                  width: 100,
                  render: (v) => <Text>{Number(v) || 0}%</Text>,
                },
              ]}
            />
          );
        })()}
>>>>>>> main
      </Modal>
    </div>
  );
}
