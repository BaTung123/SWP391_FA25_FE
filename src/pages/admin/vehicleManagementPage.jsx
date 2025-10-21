import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Space } from "antd";
import api from "../../config/axios.js";

export default function VehicleManagementPage() {
  const [vehicles, setVehicles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form] = Form.useForm();

  // --- Lấy danh sách xe ---
  const fetchVehicles = async () => {
    try {
      const res = await api.get("/Car");
      setVehicles(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      message.error("Không thể tải danh sách xe.");
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
    form.setFieldsValue(record);
    setOpenModal(true);
  };

  // --- Thêm/Sửa xe ---
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        status: Number(values.status),
        batteryCapacity: Number(values.batteryCapacity),
        id: editingVehicle ? editingVehicle.id : undefined,
      };

      await api.post("/Car", payload);
      message.success(editingVehicle ? "Cập nhật xe thành công!" : "Thêm xe thành công!");
      setOpenModal(false);
      form.resetFields();
      fetchVehicles();
    } catch {
      message.error("Không thể lưu xe. Vui lòng thử lại.");
    }
  };

  const columns = [
    { title: "Tên xe", dataIndex: "carName", key: "carName" },
    { title: "Hãng", dataIndex: "brand", key: "brand" },
    { title: "Biển số", dataIndex: "plateNumber", key: "plateNumber" },
    { title: "Màu", dataIndex: "color", key: "color" },
    { title: "Pin (kWh)", dataIndex: "batteryCapacity", key: "batteryCapacity" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) =>
        value === 1 ? (
          <span style={{ color: "green" }}>Đang hoạt động</span>
        ) : (
          <span style={{ color: "gray" }}>Không hoạt động</span>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openAddModal}>
          + Thêm xe
        </Button>
      </Space>

      <Table columns={columns} dataSource={vehicles} rowKey="id" />

      <Modal
        title={editingVehicle ? "Sửa thông tin xe" : "Thêm xe mới"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="brand"
            label="Hãng xe"
            rules={[{ required: true, message: "Vui lòng nhập hãng xe" }]}
          >
            <Input placeholder="VD: VinFast" />
          </Form.Item>

          <Form.Item
            name="carName"
            label="Tên xe"
            rules={[{ required: true, message: "Vui lòng nhập tên xe" }]}
          >
            <Input placeholder="VD: VF e34" />
          </Form.Item>

          <Form.Item
            name="plateNumber"
            label="Biển số"
            rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
          >
            <Input placeholder="VD: 51H-123.45" />
          </Form.Item>

          <Form.Item name="color" label="Màu xe">
            <Input placeholder="VD: Trắng, Đen, Đỏ..." />
          </Form.Item>

          <Form.Item
            name="batteryCapacity"
            label="Dung lượng pin (kWh)"
            rules={[{ required: true, message: "Nhập dung lượng pin" }]}
          >
            <Input type="number" placeholder="VD: 42" />
          </Form.Item>

          <Form.Item name="image" label="Ảnh xe">
            <Input placeholder="URL ảnh xe (nếu có)" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              options={[
                { label: "Không hoạt động", value: 0 },
                { label: "Đang hoạt động", value: 1 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
