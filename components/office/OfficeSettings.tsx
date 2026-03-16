import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  DollarSign,
  Bell,
  Shield,
  Save,
  User,
  Camera,
  Upload,
  Building2,
  Key,
  Lock,
  Eye,
  EyeOff,
  Search,
  X,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Trash2,
  Edit,
  RefreshCw,
  Plus,
  Tag,
  FolderOpen,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import {
  getClients,
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  resetClientPassword,
  getCompanyById,
  getStoredAuth,
  ClientDto,
  ExpenseCategoryDto,
} from "@/lib/api";

interface OfficeSettingsProps {
  userName: string;
  profileImage: string | null;
  onProfileImageChange: (imageUrl: string | null) => void;
}

export function OfficeSettings({
  userName,
  profileImage,
  onProfileImageChange,
}: OfficeSettingsProps) {
  // Company Settings
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [officeName, setOfficeName] = useState("");
  const [officeEmail, setOfficeEmail] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [defaultCurrency, setDefaultCurrency] = useState("KES");
  const [autoReconcile, setAutoReconcile] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [companyLoading, setCompanyLoading] = useState(true);

  // Client Password Management
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Expense Category Management
  const [expenseCategories, setExpenseCategories] = useState<
    ExpenseCategoryDto[]
  >([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ExpenseCategoryDto | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );

  // Delete Category Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ExpenseCategoryDto | null>(null);

  useEffect(() => {
    fetchCompanyInfo();
    fetchClients();
    fetchExpenseCategories();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      setCompanyLoading(true);
      const auth = getStoredAuth();
      if (auth?.user?.companyId) {
        const result = await getCompanyById(auth.user.companyId);
        if (result.success && result.data) {
          setCompanyName(result.data.name || "");
          setOfficeName(result.data.ownerName || result.data.name || "");
          setOfficeEmail(result.data.email || "");
          setOfficePhone(result.data.phoneNumber || "");
          setOfficeAddress(result.data.address || "");
          if (result.data.logoUrl) {
            setCompanyLogo(result.data.logoUrl);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
    } finally {
      setCompanyLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const result = await getClients(1, 1000);
      if (result.success && result.data?.items) {
        setClients(result.data.items);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      setCategoryLoading(true);
      const result = await getExpenseCategories();
      if (result.success && result.data) {
        setExpenseCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching expense categories:", error);
      toast.error("Failed to load expense categories");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setCategoryLoading(true);
      const result = await createExpenseCategory({
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
      });

      if (result.success) {
        toast.success("Expense category created successfully!");
        setShowCategoryModal(false);
        setCategoryName("");
        setCategoryDescription("");
        fetchExpenseCategories();
      } else {
        toast.error(result.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create expense category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setCategoryLoading(true);
      const result = await updateExpenseCategory(editingCategory.id, {
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
      });

      if (result.success) {
        toast.success("Expense category updated successfully!");
        setShowCategoryModal(false);
        setEditingCategory(null);
        setCategoryName("");
        setCategoryDescription("");
        fetchExpenseCategories();
      } else {
        toast.error(result.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update expense category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const openDeleteCategoryModal = (category: ExpenseCategoryDto) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingCategoryId(categoryToDelete.id);
      const result = await deleteExpenseCategory(categoryToDelete.id);

      if (result.success) {
        toast.success("Expense category deleted successfully!");
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        fetchExpenseCategories();
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete expense category");
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const openEditCategoryModal = (category: ExpenseCategoryDto) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setShowCategoryModal(true);
  };

  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setShowCategoryModal(true);
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        onProfileImageChange(imageUrl);
        toast.success("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setCompanyLogo(imageUrl);
        toast.success("Company logo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onProfileImageChange(null);
    toast.success("Profile picture removed!");
  };

  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    toast.success("Company logo removed!");
  };

  const handleSetPassword = (client: ClientDto) => {
    setSelectedClient(client);
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!selectedClient) {
      toast.error("No client selected");
      return;
    }

    try {
      setPasswordLoading(true);
      const result = await resetClientPassword(selectedClient.id, newPassword);

      if (result.success) {
        toast.success(
          `Password set successfully for ${getClientName(selectedClient)}`
        );
        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
        setSelectedClient(null);
      } else {
        toast.error(result.message || "Failed to set password");
      }
    } catch (error) {
      console.error("Error setting password:", error);
      toast.error("Failed to set password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
    setConfirmPassword(password);
    toast.success("Random password generated!");
  };

  // Helper to get client display name
  const getClientName = (client: ClientDto) =>
    client.fullName || client.name || "Unknown";

  const filteredClients = clients.filter((client) => {
    const name = getClientName(client).toLowerCase();
    const code = (client.code || "").toLowerCase();
    const phone = client.whatsAppNumber || "";
    const search = searchTerm.toLowerCase();
    return (
      name.includes(search) || code.includes(search) || phone.includes(search)
    );
  });

  const filteredCategories = expenseCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      (category.description
        ?.toLowerCase()
        .includes(categorySearchTerm.toLowerCase()) ??
        false)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Office Settings</h2>
        <p className="text-sm text-slate-600 mt-1">
          Manage your office configuration, company branding, and client access
        </p>
      </div>

      {/* Company Branding Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Company Branding
            </h3>
            <p className="text-sm text-slate-600">
              Customize your company name and logo
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {companyLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
              <span className="ml-2 text-slate-600">
                Loading company info...
              </span>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    className="w-full px-4 py-3 border-2 border-purple-200 focus:border-purple-500 outline-none bg-white"
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      From System
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Company name is managed by the system administrator
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                  Company Logo
                </label>
                {companyLogo ? (
                  <div className="flex items-start gap-6">
                    <div className="relative group">
                      <img
                        src={companyLogo}
                        alt="Company Logo"
                        className="w-40 h-40 object-contain bg-white p-4 border-2 border-purple-200 shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="bg-white p-4 border-2 border-purple-200">
                        <p className="text-sm font-medium text-slate-900 mb-1">
                          Logo uploaded successfully!
                        </p>
                        <p className="text-xs text-slate-600">
                          This logo will appear on all your invoices and
                          documents
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all">
                            <Upload className="w-4 h-4" />
                            Replace Logo
                          </div>
                        </label>
                        <button
                          onClick={handleRemoveLogo}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-purple-300 p-8 text-center bg-white">
                    <ImageIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No logo uploaded yet</p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg transition-all">
                        <Upload className="w-5 h-5" />
                        Upload Company Logo
                      </div>
                    </label>
                    <p className="text-xs text-slate-500 mt-3">
                      Recommended: PNG or JPG, transparent background, 400x400px
                      minimum. Max 5MB
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Profile Picture
            </h3>
            <p className="text-sm text-slate-600">
              Upload your personal profile photo
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {profileImage ? (
              <img
                src={profileImage}
                alt={userName}
                className="w-32 h-32 object-cover shadow-xl ring-4 ring-blue-500/30"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="font-semibold text-slate-900 mb-1">{userName}</p>
              <p className="text-sm text-slate-600">Office Operator</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg hover:shadow-xl">
                  <Upload className="w-4 h-4" />
                  <span>Upload New Photo</span>
                </div>
              </label>
              {profileImage && (
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-all"
                >
                  Remove Photo
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Recommended: Square image, at least 400x400px. Max file size: 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Expense Category Management */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Expense Categories
              </h3>
              <p className="text-sm text-slate-600">
                Manage categories for expense tracking
              </p>
            </div>
          </div>
          <button
            onClick={openNewCategoryModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={categorySearchTerm}
              onChange={(e) => setCategorySearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 focus:border-amber-500 outline-none bg-white"
            />
          </div>
        </div>

        {categoryLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-white border-2 border-amber-200">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-2">No expense categories found</p>
            <p className="text-sm text-slate-500">
              Create categories to organize your expenses
            </p>
          </div>
        ) : (
          <div className="bg-white border-2 border-amber-200 overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-100 border-b-2 border-amber-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-amber-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-100 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-amber-600" />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 line-clamp-2">
                          {category.description || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {category.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditCategoryModal(category)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all"
                            title="Edit Category"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteCategoryModal(category)}
                            disabled={deletingCategoryId === category.id}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 transition-all disabled:opacity-50"
                            title="Delete Category"
                          >
                            {deletingCategoryId === category.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {expenseCategories.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 border-2 border-amber-200">
              <p className="text-xs font-bold text-slate-600 uppercase mb-1">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {expenseCategories.length}
              </p>
            </div>
            <div className="bg-white p-4 border-2 border-amber-200">
              <p className="text-xs font-bold text-slate-600 uppercase mb-1">
                Active Categories
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {expenseCategories.filter((c) => c.isActive).length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Client Password Management */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Client Password Management
            </h3>
            <p className="text-sm text-slate-600">
              Set or reset passwords for client portal access
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients by name, code, or phone..."
              className="w-full pl-10 pr-4 py-3 border-2 border-emerald-200 focus:border-emerald-500 outline-none bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12 bg-white border-2 border-emerald-200">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No clients found</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-emerald-200 overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-100 border-b-2 border-emerald-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Balance (KES)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Balance (USD)
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-emerald-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-slate-600">
                          {client.code || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {getClientName(client)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {client.whatsAppNumber || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-emerald-600">
                        {(client.balanceKES ?? 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-blue-600">
                        {(client.balanceUSD ?? 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleSetPassword(client)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold hover:shadow-lg transition-all"
                        >
                          <Lock className="w-4 h-4" />
                          Set Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Office Information */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Office Information
            </h3>
            <p className="text-sm text-slate-600">
              Basic office details and contact information
            </p>
          </div>
          {companyLoading && (
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin ml-auto" />
          )}
        </div>

        {companyLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-600">
                Loading office information...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Office Name
              </label>
              <input
                type="text"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                placeholder="Enter office name"
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={officeEmail}
                  onChange={(e) => setOfficeEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={officePhone}
                  onChange={(e) => setOfficePhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Office Address
              </label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                placeholder="Enter office address"
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Currency Settings */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Currency Settings
            </h3>
            <p className="text-sm text-slate-600">
              Default currency and exchange preferences
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
              Default Currency
            </label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              System Preferences
            </h3>
            <p className="text-sm text-slate-600">
              Notification and automation settings
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50">
            <div>
              <p className="font-medium text-slate-900">Auto Reconciliation</p>
              <p className="text-sm text-slate-600">
                Automatically reconcile accounts daily
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoReconcile}
                onChange={(e) => setAutoReconcile(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50">
            <div>
              <p className="font-medium text-slate-900">Email Notifications</p>
              <p className="text-sm text-slate-600">
                Receive email alerts for important events
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all"
        >
          <Save className="w-5 h-5" />
          Save All Settings
        </button>
      </div>

      {/* Expense Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl flex items-center justify-center">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {editingCategory
                          ? "Edit Category"
                          : "New Expense Category"}
                      </h3>
                      <p className="text-sm text-amber-100">
                        {editingCategory
                          ? "Update category details"
                          : "Create a new expense category"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g., Office Supplies, Utilities, Transport"
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-amber-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Brief description of this expense category..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-amber-500 outline-none bg-white resize-none"
                  />
                </div>
                <div className="bg-amber-50 border-2 border-amber-200 p-3">
                  <p className="text-xs text-amber-800">
                    <strong>💡 Tip:</strong> Use clear, descriptive names for
                    your expense categories to make expense tracking easier.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={
                      editingCategory
                        ? handleUpdateCategory
                        : handleCreateCategory
                    }
                    disabled={categoryLoading || !categoryName.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {categoryLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {editingCategory ? "Update Category" : "Create Category"}
                  </button>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Category Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && categoryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowDeleteModal(false);
              setCategoryToDelete(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Delete Category</h3>
                      <p className="text-sm text-red-100">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCategoryToDelete(null);
                    }}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="bg-red-50 border-2 border-red-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Tag className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">
                        {categoryToDelete.name}
                      </p>
                      {categoryToDelete.description && (
                        <p className="text-sm text-slate-600 mt-1">
                          {categoryToDelete.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">
                        Warning
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Deleting this category will remove it permanently. Any
                        expenses associated with this category may need to be
                        reassigned.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-slate-600">
                  Are you sure you want to delete this expense category?
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleDeleteCategory}
                    disabled={deletingCategoryId === categoryToDelete.id}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {deletingCategoryId === categoryToDelete.id ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    Yes, Delete Category
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCategoryToDelete(null);
                    }}
                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Set Client Password</h3>
                      <p className="text-sm text-emerald-100">
                        {getClientName(selectedClient)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Client Code:</strong> {selectedClient.code || "-"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Phone:</strong>{" "}
                    {selectedClient.whatsAppNumber || "-"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Balance KES:</strong>{" "}
                    {(selectedClient.balanceKES ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Balance USD:</strong>{" "}
                    {(selectedClient.balanceUSD ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-10 border-2 border-slate-200 focus:border-emerald-500 outline-none bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-emerald-500 outline-none bg-white"
                  />
                </div>
                <button
                  onClick={generateRandomPassword}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate Random Password
                </button>
                <div className="bg-amber-50 border-2 border-amber-200 p-3">
                  <p className="text-xs text-amber-800">
                    <strong>⚠ Important:</strong> Make sure to share this
                    password securely with the client. They can change it after
                    their first login.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handlePasswordSubmit}
                    disabled={passwordLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Set Password
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
