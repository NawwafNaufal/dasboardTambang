import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Pencil, Trash2 } from "lucide-react";
import EditModal, { type DynamicFormData } from "../../ui/modal/EditModal";
import DeleteModal from "../../ui/modal/DeleteModal";

interface TableData {
  bulan: string;
  tahun: string;
  produk: string;
  plan: string;
  rkap: string;
}

const tableData: TableData[] = [
  {
    bulan: "Januari",
    tahun: "2025",
    produk: "Loading Hauling",
    plan: "28.287",
    rkap: "8.075",
  },
  {
    bulan: "Februari",
    tahun: "2025",
    produk: "Loading Hauling",
    plan: "28.287",
    rkap: "8.075",
  },
  {
    bulan: "Maret",
    tahun: "2025",
    produk: "Loading Hauling",
    plan: "28.287",
    rkap: "8.075",
  },
];

const editableFields = [
  { key: "plan", label: "Plan" },
  { key: "rkap", label: "RKAP" },
];

export default function BasicTableOne() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<DynamicFormData>({});

  const handleEdit = (index: number) => {
    setEditIndex(index);
    
    // Ambil hanya field yang editable
    const dataToEdit: DynamicFormData = {};
    editableFields.forEach(field => {
      dataToEdit[field.key] = tableData[index][field.key as keyof TableData];
    });
    
    setFormData(dataToEdit);
    setIsEditModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Delete row:", deleteIndex);
    // Tambahkan logika delete di sini
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  const handleEditModalSubmit = (data: DynamicFormData) => {
    console.log("Update data:", { index: editIndex, data });
    // Tambahkan logika update di sini
    setIsEditModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  No
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Bulan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Tahun
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Loading Hauling
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Plan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  RKAP
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.bulan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.tahun}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.produk}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.plan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.rkap}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors dark:text-blue-400 dark:hover:bg-blue-400/10"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors dark:text-red-400 dark:hover:bg-red-400/10"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditModalSubmit}
        initialData={formData}
        fields={editableFields}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={confirmDelete}
      />
    </>
  );
}