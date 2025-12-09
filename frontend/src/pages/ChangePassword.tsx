import { useState } from "react";
import { useUsers } from "../context/UsersContext";
import { Check, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { changePassword } from "../services/api/profile";
import { useMutation } from "@tanstack/react-query";

export default function ChangePassword() {
  const { currentUser } = useUsers();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.oldPassword = t("changePassword.oldPasswordRequired");
    }
    if (!formData.newPassword) {
      newErrors.newPassword = t("changePassword.newPasswordRequired");
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t("changePassword.passwordMinLength");
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("changePassword.confirmPasswordRequired");
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("changePassword.passwordsNotMatch");
    }
    if (currentUser?.password && formData.password !== currentUser.password) {
      newErrors.oldPassword = t("changePassword.incorrectOldPassword");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const mutation = useMutation({
  mutationFn: changePassword,
  onSuccess: () => {
    toast.success(t("changePassword.successMessage"));
    setSuccess(true);

    // Reset form
    setFormData({ password: "", newPassword: "", confirmPassword: "" });
    setErrors({});

    // Remove success message after few seconds
    setTimeout(() => setSuccess(false), 3000);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => {
    toast.error(error.response?.data?.message || t("changePassword.error"));
  }
});


 const handleSave = () => {
  if (!currentUser) {
    toast("❌ " + t("changePassword.noUser"));
    return;
  }

  if (!validateForm()) return;

  mutation.mutate({
    password: formData.password,   // ← مهم جدًا
    newPassword: formData.newPassword // ← مهم جدًا
  });
};


  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "" };
    if (password.length < 6) return { strength: 1, text: t("changePassword.weak") };
    if (password.length < 8) return { strength: 2, text: t("changePassword.medium") };
    return { strength: 3, text: t("changePassword.strong") };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text">
            {t("changePassword.title")}
          </h2>
          <p className="mt-1 text-muted">
            {t("changePassword.subtitle")}
          </p>
        </div>
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg text-text hover:bg-hover"
        >
          <ArrowLeft size={16} />
          {t("changePassword.backToProfile")}
        </Link>
      </div>

      {/* Password Form Card */}
      <div className="card">
        <div className="p-6 space-y-6">
          {/* Old Password */}
          <div>
            <label className="block mb-3 text-sm font-medium text-text">
              {t("changePassword.oldPassword")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={18} className="text-muted" />
              </div>
              <input
                type={showPasswords.old ? "text" : "password"}
                className={`w-full pl-10 pr-10 input ${errors.oldPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={t("changePassword.oldPasswordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("old")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-text"
              >
                {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-3 text-sm font-medium text-text">
              {t("changePassword.newPassword")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={18} className="text-muted" />
              </div>
              <input
                type={showPasswords.new ? "text" : "password"}
                className={`w-full pl-10 pr-10 input ${errors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                placeholder={t("changePassword.newPasswordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-text"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted">
                    {t("changePassword.passwordStrength")}
                  </span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.strength === 1 ? "text-red-600" :
                    passwordStrength.strength === 2 ? "text-yellow-600" :
                    "text-green-600"
                  }`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-1 rounded-full ${
                        level <= passwordStrength.strength
                          ? level === 1 ? "bg-red-500" :
                            level === 2 ? "bg-yellow-500" :
                            "bg-green-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-3 text-sm font-medium text-text">
              {t("changePassword.confirmPassword")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={18} className="text-muted" />
              </div>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                className={`w-full pl-10 pr-10 input ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder={t("changePassword.confirmPasswordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-text"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-background rounded-b-xl">
          {success && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check size={18} />
              <span className="text-sm font-medium">
                {t("changePassword.successMessage")}
              </span>
            </div>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary/90"
            >
              <Check size={18} />
              {t("changePassword.saveChanges")}
            </button>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="p-6 mt-6 rounded-lg card">
        <h3 className="mb-4 text-lg font-semibold text-text">
          {t("changePassword.securityTips")}
        </h3>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 mt-2 rounded-full bg-muted" />
            {t("changePassword.tip1")}
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 mt-2 rounded-full bg-muted" />
            {t("changePassword.tip2")}
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 mt-2 rounded-full bg-muted" />
            {t("changePassword.tip3")}
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 mt-2 rounded-full bg-muted" />
            {t("changePassword.tip4")}
          </li>
        </ul>
      </div>
    </div>
  );
}