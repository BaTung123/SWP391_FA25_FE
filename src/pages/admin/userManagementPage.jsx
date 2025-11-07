import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Switch,
  Alert,
  Modal,
  Form,
  Input,
  Pagination,
  Typography,
  Tooltip,
  Select,
  Empty,
} from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  SearchOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const { Text } = Typography;
const { Option } = Select;

const roleLabel = (roleNumber) => {
  const num = Number(roleNumber);
  if (num === 2) return "Nhân viên";
  if (num === 0) return "Thành viên";
  return "Không xác định";
};
const statusLabel = (deleteAt) => (deleteAt ? "Ngừng hoạt động" : "Hoạt động");

export default function UserManagementPage() {
  const [usersRaw, setUsersRaw] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Modal + form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Search & Filters
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // ===== API: Get Users =====
  const fetchUsers = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await api.get("/User");
      const list = Array.isArray(res.data) ? res.data : [res.data];

      const mapped = list
        .map((u) => ({
          id: u.userId ?? u.id ?? 0,
          name: u.fullName ?? u.userName ?? "",
          email: u.email ?? "",
          roleNumber: typeof u.role === "number" ? u.role : Number(u.role ?? 0),
          roleText:
            typeof u.role === "number" ? roleLabel(u.role) : roleLabel(Number(u.role ?? 0)),
          statusText: statusLabel(u.deleteAt),
          deleteAt: u.deleteAt ?? null,
          raw: u,
        }))
        // Lọc bỏ admin (role === 1), chỉ giữ lại staff (role === 2) và member (role === 0)
        .filter((u) => Number(u.roleNumber) !== 1);

      setUsersRaw(mapped);
      setCurrentPage(1);
    } catch (e) {
      console.error("Fetch /User error:", e?.response?.data || e?.message);
      setErrMsg("Không tải được danh sách người dùng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Toggle status (local only) =====
  const toggleUserStatus = (userId) => {
    setUsersRaw((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              statusText: u.statusText === "Hoạt động" ? "Ngừng hoạt động" : "Hoạt động",
            }
          : u
      )
    );
  };

  // ===== Add user (POST /User/register, role=1) =====
  const handleAddUser = async (values) => {
    try {
      setLoading(true);
      const userName =
        values.email?.split("@")[0] ||
        values.name.trim().replace(/\s+/g, "").toLowerCase();

      await api.post("/User/register", {
        userName,
        fullName: values.name,
        email: values.email,
        password: values.password,
        role: 2, // Nhân viên (Staff)
      });

      await fetchUsers();
      form.resetFields();
      setIsModalOpen(false);
    } catch (e) {
      console.error("POST /User/register error:", e?.response?.data || e?.message);
      setErrMsg(
        e?.response?.data?.message ||
          "Không tạo được người dùng. Vui lòng kiểm tra dữ liệu và thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== Tìm kiếm & Lọc =====
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return usersRaw.filter((u) => {
      const matchKW =
        !kw ||
        [u.name, u.email].filter(Boolean).some((t) => String(t).toLowerCase().includes(kw));

      const matchRole =
        roleFilter === "all" ? true : Number(u.roleNumber) === Number(roleFilter);

      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? u.statusText === "Hoạt động"
          : u.statusText !== "Hoạt động";

      return matchKW && matchRole && matchStatus;
    });
  }, [usersRaw, keyword, roleFilter, statusFilter]);

  // ===== Pagination slice sau khi lọc =====
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ===== Columns =====
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 90,
      render: (v) => <Text strong>{v}</Text>,
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
      render: (v) => <Text>{v || "-"}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
      ellipsis: true,
      render: (v) => <Text type="secondary">{v || "-"}</Text>,
    },
    {
      title: "Vai trò",
      dataIndex: "roleText",
      key: "roleText",
      align: "center",
      width: 140,
      render: (text, record) => (
        <Tag color={record.roleNumber === 2 ? "geekblue" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusText",
      key: "statusText",
      align: "center",
      width: 160,
      render: (status) =>
        status === "Hoạt động" ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Hoạt động
          </Tag>
        ) : (
          <Tag color="error" icon={<StopOutlined />}>
            Ngừng hoạt động
          </Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Tooltip
          title={
            record.statusText === "Hoạt động"
              ? "Chuyển sang ngừng hoạt động (hiển thị local)"
              : "Chuyển sang hoạt động (hiển thị local)"
          }
        >
          <Switch
            checked={record.statusText === "Hoạt động"}
            onChange={() => toggleUserStatus(record.id)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      {/* Header */}
      <Card
        styles={{ padding: 16 }}
        className="border border-gray-100 shadow-sm"
        title={
          <Space>
            <TeamOutlined />
            <span className="font-semibold">Quản lý người dùng</span>
          </Space>
        }
        extra={
          <Space wrap>
            <Input
              allowClear
              style={{ width: 260 }}
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<SearchOutlined />}
              placeholder="Tìm theo tên hoặc email"
            />
            <Select
              value={roleFilter}
              onChange={(v) => {
                setRoleFilter(v);
                setCurrentPage(1);
              }}
              style={{ width: 180 }}
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value={0}>Thành viên</Option>
              <Option value={2}>Nhân viên</Option>
            </Select>
            <Select
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
              style={{ width: 200 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Ngừng hoạt động</Option>
            </Select>

            {/* Đã bỏ nút Làm mới */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Thêm nhân viên
            </Button>
          </Space>
        }
      />

      {/* Alert lỗi */}
      {errMsg && (
        <Alert type="error" message="Có lỗi xảy ra" description={errMsg} showIcon />
      )}

      {/* Bảng */}
      <Card styles={{ padding: 0 }} style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={currentUsers}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="middle"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có người dùng phù hợp"
              />
            ),
          }}
        />
      </Card>

      {/* Phân trang */}
      <Space style={{ width: "100%", justifyContent: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Space>

      {/* Modal thêm người dùng */}
      <Modal
        title={
          <Space>
            <UserAddOutlined />
            <span>Thêm nhân viên mới</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={loading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser} requiredMark={false}>
          <Form.Item
            label="Tên người dùng"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
