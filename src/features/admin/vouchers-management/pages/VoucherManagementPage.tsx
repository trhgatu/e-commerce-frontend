import { useState, useEffect } from "react";
import {
  Spin,
  Card,
  Space,
  Button
} from 'antd';
import { Badge } from "@/components/ui/badge";
import { IVoucher } from "@/types";
import { VoucherTable } from "@/features/admin/vouchers-management/components/VoucherTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { getAllVouchers, softDeleteVoucherById } from "@/features/admin/vouchers-management/services/voucherService";
import {
  Trash2,
  Plus,
  Ticket,
  Download,
  RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";
import StatusFilter from "@/components/StatusFilter";

export const VoucherManagementPage = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [voucherToDelete, setVoucherToDelete] = useState<IVoucher | null>(null);
  const [filteredVouchers, setFilteredVouchers] = useState<IVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const res = await getAllVouchers(page + 1, 10, {
          isDeleted: false
        });
        setVouchers(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err);
        toast.error("Lỗi khi tải danh sách voucher");
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, [page]);

  useEffect(() => {
    let filtered = vouchers;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(voucher => {
        if (statusFilter === 'active') return voucher.isActive;
        if (statusFilter === 'inactive') return !voucher.isActive;
        return true;
      });
    }
    setFilteredVouchers(filtered);
  }, [vouchers, statusFilter]);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchTerm("");
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setLoading(true);
    try {
      const res = await getAllVouchers(1, 10, {
        search: query,
        isDeleted: false
      });
      setVouchers(res.data);
      setFilteredVouchers(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tìm kiếm voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllVouchers(page + 1, 10, {
        isDeleted: false
      });
      setVouchers(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách voucher");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (voucherToDelete) {
      try {
        await softDeleteVoucherById(voucherToDelete._id);
        setVouchers((prev) => prev.filter((v) => v._id !== voucherToDelete._id));
        toast.success("Xóa voucher thành công");
      } catch {
        toast.error("Xóa voucher thất bại");
      }
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-2xl font-semibold">
              Quản lý voucher
            </p>
            <p className="text-gray-600 mt-1">
              Quản lý toàn bộ mã giảm giá trong hệ thống
            </p>
          </div>
          <Space className="flex-shrink-0">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="solid"
              color="primary"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </Space>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Space className="flex-shrink-0">
              <SearchInput
                placeholder="Tìm kiếm theo mã voucher..."
                onSearch={handleSearch}
              />
              <StatusFilter
                value={statusFilter}
                onChange={handleStatusFilter}
              />
              <Button
                onClick={clearFilters}
                variant="solid"
                color="primary"
                className="w-full md:w-auto"
                style={{ width: '150px' }}
              >
                Xóa bộ lọc
              </Button>
            </Space>
          </div>

          <Space className="flex-shrink-0">
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.vouchers.trash)}
              variant="dashed"
              color="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.vouchers.create)}
              color="default"
              variant="solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm voucher
            </Button>
          </Space>
        </div>

        <div className="flex items-center justify-between">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Kết quả cho: "{searchTerm}"
            </Badge>
          )}
        </div>

        <div className="p-0">
          <Spin spinning={loading} tip="Đang tải danh sách voucher...">
            <div className="overflow-x-auto">
              <VoucherTable
                data={filteredVouchers}
                onShow={(voucher) => navigate(ROUTERS.ADMIN.vouchers.show(voucher._id))}
                onEdit={(voucher) => navigate(ROUTERS.ADMIN.vouchers.edit(voucher._id))}
                onDelete={(voucher) => setVoucherToDelete(voucher)}
                pagination={{
                  pageIndex: page,
                  pageCount: pageCount,
                  onPageChange: setPage,
                }}
              />
            </div>
          </Spin>

          {!loading && vouchers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Ticket className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy voucher" : "Chưa có voucher nào"}
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {searchTerm
                  ? `Không tìm thấy voucher nào phù hợp với từ khóa "${searchTerm}". Thử tìm kiếm với từ khóa khác.`
                  : "Bắt đầu bằng cách thêm mã giảm giá đầu tiên vào hệ thống."}
              </p>
              {searchTerm ? (
                <Button
                  onClick={() => {
                    clearFilters();
                    handleSearch("");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button onClick={() => navigate(ROUTERS.ADMIN.vouchers.create)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm voucher đầu tiên
                </Button>
              )}
            </div>
          )}
        </div>

        <ConfirmDeleteDialog
          open={!!voucherToDelete}
          itemName={voucherToDelete?.code || ""}
          onCancel={() => setVoucherToDelete(null)}
          onConfirm={confirmDelete}
        />
      </Card>
    </div>
  );
};