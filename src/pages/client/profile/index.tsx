import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Save } from "lucide-react";
import { authStore } from "../../../stores/authStore";
import clientApi from "../../../api/core/client";
import type { ClientResponseDto, UpdateClientDto } from "../../../api/core/client";
import { showToast } from "../../../utils/notification";

const ClientProfile: React.FC = () => {
  const user = authStore.getUser();
  const [profile, setProfile] = useState<ClientResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    skinHistory: "",
    allergies: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await clientApi.getClient(user.id);
        if (res.success) {
          setProfile(res.data);
          setForm({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            email: res.data.email || "",
            phoneNumber: res.data.phoneNumber || "",
            dateOfBirth: res.data.dateOfBirth || "",
            skinHistory: res.data.skinHistory || "",
            allergies: res.data.allergies || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updateData: UpdateClientDto = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth,
        skinHistory: form.skinHistory,
        allergies: form.allergies,
      };
      const res = await clientApi.updateClient(profile.id, updateData);
      if (res.success) {
        showToast("Profile updated", "success");
        setProfile(res.data);
        // Update auth store fullName if needed
        if (res.data.fullName) {
          const currentUser = authStore.getUser();
          if (currentUser) {
            currentUser.fullName = res.data.fullName;
            localStorage.setItem("auth_user", JSON.stringify(currentUser));
          }
        }
      } else {
        showToast(res.message || "Update failed", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and medical history.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="tel" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skin History</label>
          <textarea value={form.skinHistory} onChange={e => setForm({...form, skinHistory: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Past treatments, allergies, etc."></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
          <textarea value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="List any known allergies"></textarea>
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2">
          <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ClientProfile;