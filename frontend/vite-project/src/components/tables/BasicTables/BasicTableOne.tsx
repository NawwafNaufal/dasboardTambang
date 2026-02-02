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
  tanggal: string;
  hari: string;
  plan: string;
  actual: string;
  rkap: string;
  toppabiring: string;
  batara: string;
  utsg: string;
  annur: string;
}

const tableData: TableData[] = [
  {
    tanggal: "1-Jan-25",
    hari: "Rabu",
    plan: "28.287",
    actual: "19.209",
    rkap: "8.075",
    toppabiring: "3.611",
    batara: "3.897",
    utsg: "9.650",
    annur: "2.051",
  },
  {
    tanggal: "2-Jan-25",
    hari: "Kamis",
    plan: "28.287",
    actual: "22.944",
    rkap: "8.075",
    toppabiring: "4.419",
    batara: "6.197",
    utsg: "8.300",
    annur: "4.028",
  },
  {
    tanggal: "3-Jan-25",
    hari: "Jumat",
    plan: "28.287",
    actual: "17.352",
    rkap: "8.075",
    toppabiring: "5.558",
    batara: "5.489",
    utsg: "3.612",
    annur: "2.694",
  },
];

const editableFields = [
  { key: "actual", label: "Actual" },
  { key: "toppabiring", label: "Toppabiring" },
  { key: "batara", label: "Batara" },
  { key: "utsg", label: "UTSG" },
  { key: "annur", label: "Annur" },
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
                  Tanggal
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Hari
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Plan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Actual
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  RKAP
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Toppabiring
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Batara
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  UTSG
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-900 text-start text-theme-xs dark:text-white">
                  Annur
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
                  <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {data.tanggal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.hari}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.plan}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.actual}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.rkap}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.toppabiring}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.batara}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.utsg}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.annur}
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