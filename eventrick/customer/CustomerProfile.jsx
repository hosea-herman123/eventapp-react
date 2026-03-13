import React, { useEffect, useState } from "react";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    try {
      const res = await fetch("http://localhost:4000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      const profile = data.user || data;

      setUser(profile);
      setFormData({ ...formData, name: profile.name || "", email: profile.email || "" });
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      await fetchProfile();
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Profile update failed: " + err.message);
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!"); return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: formData.currentPassword, newPassword: formData.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password change failed");
      alert("Password changed successfully!");
      setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert("Password change failed: " + err.message);
    } finally { setSaving(false); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) return <p className="text-center py-8 text-gray-400">Loading profile...</p>;
  if (!user) return <p className="text-center py-8 text-gray-400">Access Denied. Please log in.</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">Profile Settings</h1>

      <div className="bg-gray-900 p-4 rounded-lg shadow space-y-2 text-gray-200 text-sm">
        <h2 className="font-semibold">Account Information</h2>
        <div className="flex justify-between">
          <span>Email:</span> <span className="text-gray-400">{user.email || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span>Role:</span>
          <span className={`px-2 py-0.5 rounded text-xs ${
            user.role === "admin" ? "bg-blue-600" : user.role === "employee" ? "bg-green-600" : "bg-gray-700"
          } text-white`}>
            {user.role || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Member since:</span> <span className="text-gray-400">{formatDate(user.createdAt || user.joined)}</span>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg shadow space-y-2 text-gray-200 text-sm">
        <h2 className="font-semibold">Update Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-2">
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-sm" required />
          <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-sm" required />
          <button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">{saving ? "Updating..." : "Update"}</button>
        </form>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg shadow space-y-2 text-gray-200 text-sm">
        <h2 className="font-semibold">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-2">
          <input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleInputChange} placeholder="Current Password" className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-sm" required />
          <input name="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} placeholder="New Password" className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-sm" required />
          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-sm" required />
          {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <p className="text-red-600 text-xs">Passwords do not match</p>
          )}
          <button type="submit" disabled={saving || formData.newPassword !== formData.confirmPassword} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
            {saving ? "Changing..." : "Change"}
          </button>
        </form>
      </div>
    </div>
  );
}
