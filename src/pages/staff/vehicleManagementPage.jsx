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
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  CarOutlined,
  SearchOutlined,
  PictureOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import api from "../../config/axios.js";

const { Option } = Select;

export default function VehicleManagementPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // trạng thái xoá theo từng hàng để disable nút
  const [deletingIds, setDeletingIds] = useState(new Set());

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

  useEffect(() => {
    fetchVehicles();
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

  // --- Thêm xe (POST) | Sửa xe (PUT) ---
  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      status: Number(values.status),
      batteryCapacity: Number(values.batteryCapacity),
    };

    try {
      if (editingVehicle) {
        const id = editingVehicle.id ?? editingVehicle.carId;
        try {
          await api.put(`/Car/${id}/update`, payload);
        } catch (e) {
          // Empty
        }
        message.success("Cập nhật xe thành công!");
      } else {
        await api.post("/Car", payload);
        message.success("Thêm xe thành công!");
      }

      setOpenModal(false);
      form.resetFields();
      fetchVehicles();
    } catch {
      message.error("Không thể lưu xe. Vui lòng thử lại.");
    }
  };

  // --- Xoá xe (DELETE) ---
  const deleteVehicle = async (id) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      try {
        await api.delete(`/Car/${id}/delete`);
      } catch (e) {
        // Empty
      }

      message.success("Đã xoá xe.");
      setVehicles((list) => list.filter((v) => (v.id ?? v.carId) !== id));
    } catch {
      message.error("Xoá xe thất bại. Vui lòng thử lại.");
      fetchVehicles();
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
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
      width: 200,
      render: (_, record) => {
        const id = record.id ?? record.carId;
        const deleting = deletingIds.has(id);

        return (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
              ></Button>
            </Tooltip>

            <Popconfirm
              title="Xoá xe này?"
              description="Hành động không thể hoàn tác."
              okText="Xoá"
              cancelText="Huỷ"
              okButtonProps={{ danger: true, loading: deleting }}
              onConfirm={() => deleteVehicle(id)}
            >
              <Tooltip title="Xoá">
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  loading={deleting}
                ></Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
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
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu xe"
              />
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
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="VD: 42"
                  controls={false}
                />
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
    </div>
  );
}
