import React, { useEffect, useState } from "react";
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
} from "antd";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const { Option } = Select;

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewModal, setViewModal] = useState({ visible: false, group: null });
  const [form] = Form.useForm();

  // --- Load groups ---
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Group");
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách nhóm!");
    } finally {
      setLoading(false);
    }
  };

  // --- Load cars ---
  const fetchCars = async () => {
    try {
      const res = await api.get("/Car");
      setCars(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách xe!");
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchCars();
  }, []);

  // --- Thêm nhóm ---
  const handleAddGroup = async (values) => {
    try {
      const car = cars.find((c) => Number(c.carId) === Number(values.carId));
      if (!car) {
        message.error("Hãy chọn một xe hợp lệ!");
        return;
      }

      await api.post("/Group", {
        groupName: values.groupName,
        description: values.description,
        carId: car.carId, // ✅ gửi đúng CarID
      });

      message.success("Thêm nhóm thành công!");
      setIsModalVisible(false);
      form.resetFields();
      fetchGroups();
    } catch (err) {
      console.error(err);
      message.error("Không thể thêm nhóm!");
    }
  };

  // --- Xoá nhóm ---
 const handleDelete = async (groupId) => {
  if (!groupId) {
    message.error("Không tìm thấy ID nhóm để xoá!");
    return;
  }
  try {
    await api.delete(`/Group/${groupId}/delete`); 
    message.success("Xoá nhóm thành công!");
    setGroups((prev) => prev.filter((g) => g.groupId !== groupId));
  } catch (err) {
    console.error(err);
    message.error("Không thể xoá nhóm!");
  }
};

  // --- Xem thông tin nhóm ---
  const handleViewGroup = (record) => {
    setViewModal({ visible: true, group: record });
  };

  const columns = [
    { title: "Tên nhóm", dataIndex: "groupName", key: "groupName" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Xe",
      dataIndex: "car",
      key: "car",
      render: (car) =>
        car ? `${car.carName} (${car.plateNumber})` : "Chưa có xe",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewGroup(record)}
          />
          <Popconfirm
            title="Xác nhận xoá nhóm này?"
            onConfirm={() =>
              handleDelete(record.groupId || record.id)
            } // ✅ fix field đúng
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý nhóm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Thêm nhóm
        </Button>
      </div>

      <Table
        dataSource={groups}
        columns={columns}
        rowKey={(record) => record.groupId || record.id} // ✅ fix key đúng
        loading={loading}
        pagination={{ pageSize: 6 }}
      />

      {/* Modal thêm nhóm */}
      <Modal
        title="Thêm nhóm mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleAddGroup}>
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
        </Form>
      </Modal>

      {/* Modal xem chi tiết nhóm */}
      <Modal
        open={viewModal.visible}
        onCancel={() => setViewModal({ visible: false, group: null })}
        footer={null}
        title="Thông tin nhóm"
      >
        {viewModal.group && (
          <div className="space-y-3">
            <p>
              <strong>Tên nhóm:</strong> {viewModal.group.groupName}
            </p>
            <p>
              <strong>Mô tả:</strong> {viewModal.group.description}
            </p>
            {viewModal.group.car ? (
              <>
                <p>
                  <strong>Xe:</strong> {viewModal.group.car.carName}
                </p>
                <p>
                  <strong>Biển số:</strong> {viewModal.group.car.plateNumber}
                </p>
                <p>
                  <strong>Màu sắc:</strong> {viewModal.group.car.color}
                </p>
                <img
                  src={viewModal.group.car.image}
                  alt="car"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </>
            ) : (
              <p>Chưa có xe được gán</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
