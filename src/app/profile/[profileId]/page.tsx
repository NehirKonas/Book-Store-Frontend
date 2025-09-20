"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "./signin.css";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/useAuth";

type Customer = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  birthDate?: string;
};

const toYYYYMMDD = (d?: string) => (d ? (d.length >= 10 ? d.slice(0, 10) : d) : "");
function parseAddress(full?: string) {
  const result = {
    addressDesc: "",
    neighborhood: "",
    building: "",
    buildingNo: "",
    floor: "",
    apartmentUnit: "",
    district: "",
    province: "",
  };
  if (!full) return result;
  const parts = full.split(", ").filter(Boolean);
  for (const part of parts) {
    const [rawKey, ...rest] = part.split(":");
    const val = rest.join(":").trim();
    const key = rawKey?.trim()?.toLowerCase();
    if (!rest.length) {
      if (!result.addressDesc) result.addressDesc = part;
      continue;
    }
    if (key?.startsWith("neighborhood")) result.neighborhood = val;
    else if (key === "building") result.building = val;
    else if (key === "no") result.buildingNo = val;
    else if (key === "floor") result.floor = val;
    else if (key === "unit") result.apartmentUnit = val;
    else if (key === "district") result.district = val;
    else if (key === "province") result.province = val;
  }
  return result;
}

function composeAddress({
  addressDesc,
  neighborhood,
  building,
  buildingNo,
  floor,
  apartmentUnit,
  district,
  province,
}: {
  addressDesc?: string;
  neighborhood?: string;
  building?: string;
  buildingNo?: string;
  floor?: string;
  apartmentUnit?: string;
  district?: string;
  province?: string;
}) {
  const parts: string[] = [];
  if (addressDesc?.trim()) parts.push(addressDesc.trim());
  if (neighborhood?.trim()) parts.push(`Neighborhood: ${neighborhood.trim()}`);
  if (building?.trim()) parts.push(`Building: ${building.trim()}`);
  if (buildingNo?.trim()) parts.push(`No: ${buildingNo.trim()}`);
  if (floor?.trim()) parts.push(`Floor: ${floor.trim()}`);
  if (apartmentUnit?.trim()) parts.push(`Unit: ${apartmentUnit.trim()}`);
  if (district?.trim()) parts.push(`District: ${district.trim()}`);
  if (province?.trim()) parts.push(`Province: ${province.trim()}`);
  return parts.join(", ");
}

export default function ProfilePage() {
  const { loggedIn, loading: authLoading, id: authId } = useAuth(true);
  const params = useParams() as { customerId?: string }; // Fixed: was profileId, now customerId
  const router = useRouter();
  const API_BASE = useMemo(() => process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080", []);
  
  // Get the customer ID from URL parameter
  const urlCustomerId = params?.customerId;
  
  // Authorization check - make sure logged-in user matches the profile being accessed
  useEffect(() => {
    if (!authLoading && loggedIn && authId && urlCustomerId) {
      if (authId !== urlCustomerId) {
        // User is trying to access someone else's profile - redirect to their own
        console.log(`Redirecting: logged in as ${authId}, but trying to access ${urlCustomerId}`);
        router.replace(`/profile/${encodeURIComponent(authId)}`);
        return;
      }
    }
  }, [authLoading, loggedIn, authId, urlCustomerId, router]);

  // Use the URL customer ID if it matches the logged-in user
  const [id, setId] = useState<string | null>(null);
  
  useEffect(() => {
    if (authLoading || !loggedIn) return;
    
    if (authId && urlCustomerId && authId === urlCustomerId) {
      setId(urlCustomerId);
    } else if (authId && !urlCustomerId) {
      // Fallback to authId if URL doesn't have customerId
      setId(authId);
    }
  }, [authLoading, loggedIn, authId, urlCustomerId]);

  // ---- your existing profile state & logic (unchanged) ----
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingNo, setBuildingNo] = useState("");
  const [floor, setFloor] = useState("");
  const [apartmentUnit, setApartmentUnit] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  // fetchProfile (same as your original)
  const fetchProfile = async (customerId: string, signal?: AbortSignal) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await fetch(`${API_BASE}/api/customers/${customerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || `Failed to load profile (${res.status})`);
    }

    const data: Customer = await res.json();
    setName(data.firstName ?? "");
    setSurname(data.lastName ?? "");
    setEmail(data.email ?? "");
    setPhone(data.phone ?? "");
    setBirthDate(toYYYYMMDD(data.birthDate));

    const parsed = parseAddress(data.address);
    setAddress(parsed.addressDesc || data.address || "");
    setNeighborhood(parsed.neighborhood || "");
    setBuilding(parsed.building || "");
    setBuildingNo(parsed.buildingNo || "");
    setFloor(parsed.floor || "");
    setApartmentUnit(parsed.apartmentUnit || "");
    setDistrict(parsed.district || "");
    setProvince(parsed.province || "");
  };

  useEffect(() => {
    if (!id) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        await fetchProfile(id, ctrl.signal);
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(e?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [id, API_BASE]);

  async function handleSaveProfile() {
    if (!id) return;
    setMessage(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      setSavingProfile(true);

      const combinedAddress = composeAddress({
        addressDesc: address,
        neighborhood,
        building,
        buildingNo,
        floor,
        apartmentUnit,
        district,
        province,
      });

      const body = {
        firstName: name,
        lastName: surname,
        phone,
        address: combinedAddress,
        birthDate: birthDate || "",
      };

      const res = await fetch(`${API_BASE}/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.message ||
            (res.status === 404 ? "Profile not found." : `Failed to update profile (${res.status})`)
        );
      }

      let updated: Customer | null = null;
      try {
        updated = await res.json();
      } catch {
        updated = null;
      }

      if (updated) {
        setName(updated.firstName ?? "");
        setSurname(updated.lastName ?? "");
        setEmail(updated.email ?? "");
        setPhone(updated.phone ?? "");
        setBirthDate(toYYYYMMDD(updated.birthDate));
        const parsed = parseAddress(updated.address);
        setAddress(parsed.addressDesc || updated.address || "");
        setNeighborhood(parsed.neighborhood || "");
        setBuilding(parsed.building || "");
        setBuildingNo(parsed.buildingNo || "");
        setFloor(parsed.floor || "");
        setApartmentUnit(parsed.apartmentUnit || "");
        setDistrict(parsed.district || "");
        setProvince(parsed.province || "");
      } else {
        await fetchProfile(id);
      }

      setMessage("Profile updated ✅");
      setEditing(false);
    } catch (e: any) {
      setMessage(e?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (newPassword.length < 6) return setMessage("New password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setMessage("Passwords do not match.");

    try {
      setSavingPwd(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const body = { userId: Number(id), currentPassword, newPassword };
      const res = await fetch(`${API_BASE}/api/customers/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || (res.status === 400 ? "Bad request." : `Failed to update password (${res.status})`));
      }

      setMessage("Password updated ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err?.message || "Could not update password");
    } finally {
      setSavingPwd(false);
    }
  }

  // Show loading while checking authentication
  if (authLoading || (loggedIn && !id)) {
    return (
      <main className="mainContainer">
        <div className="signinBox" style={{ maxWidth: 520 }}>
          <h1 className="signinH">Your Profile</h1>
          <p className="msgText">Loading…</p>
        </div>
      </main>
    );
  }

  // User not logged in - useAuth should handle redirect, but just in case
  if (!loggedIn) {
    return null;
  }

  // Show error if we have one
  if (err) {
    return (
      <main className="mainContainer">
        <div className="signinBox" style={{ maxWidth: 520 }}>
          <h1 className="signinH">Profile Error</h1>
          <p className="msgText" style={{ color: "#ef4444" }}>{err}</p>
          <p className="pls">
            <Link href="/dashboard" className="link">← Back to store</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mainContainer">
      <div className="try">
        <div className="signinBox">
          <h1 className="signinH">{name}&apos;s Profile</h1>
          <div className="nameRow">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="inputName" disabled={!editing} />
            <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} className="inputName" disabled={!editing} />
          </div>

          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="inputField" disabled />
          <input type="date" placeholder="Birth date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="inputField" disabled={!editing} />

          <div className="phone">
            <p className="doksan">+90</p>
            <input type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="inputField" disabled={!editing} />
          </div>

          <p className="adressInfo">Address Information</p>
          <div className="addressing1">
            <div className="addressing2">
              <input className="inputField" type="text" placeholder="Province/Country" value={province} onChange={(e) => setProvince(e.target.value)} disabled={!editing} />
              <input className="inputField" type="text" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!editing} />
            </div>

            <input type="text" placeholder="Neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="inputField" disabled={!editing} />
            <div className="addressing2">
              <input type="text" placeholder="Building Name" value={building} onChange={(e) => setBuilding(e.target.value)} className="inputField" disabled={!editing} />
              <input type="text" placeholder="Building No" value={buildingNo} onChange={(e) => setBuildingNo(e.target.value)} className="inputField" disabled={!editing} />
            </div>

            <div className="addressing2">
              <input type="text" placeholder="Floor" value={floor} onChange={(e) => setFloor(e.target.value)} className="inputField" disabled={!editing} />
              <input type="text" placeholder="Apartment Unit" value={apartmentUnit} onChange={(e) => setApartmentUnit(e.target.value)} className="inputField" disabled={!editing} />
            </div>

            <textarea placeholder="Address Description" value={address} onChange={(e) => setAddress(e.target.value)} className="inputAddress" rows={3} disabled={!editing} />
          </div>

          <button
            type="button"
            className="Edit"
            onClick={() => {
              if (savingProfile) return;
              if (editing) void handleSaveProfile();
              else {
                setMessage(null);
                setEditing(true);
              }
            }}
            disabled={savingProfile}
            style={{ opacity: savingProfile ? 0.7 : 1, pointerEvents: savingProfile ? "none" : "auto" }}
          >
            {savingProfile ? "Saving…" : editing ? "Save Changes" : "Edit Your Profile"}
          </button>

          <p className="pls">
            <Link href="/dashboard" className="link">← Back to store</Link>
          </p>

          {message && <p className="msgText">{message}</p>}

          {/* Optional: Logout */}
          <button
            className="loginBtn"
            onClick={() => {
              localStorage.removeItem("customerId");
              localStorage.removeItem("token");
              router.replace("/login");
            }}
            style={{ marginTop: 12 }}
          >
            Logout
          </button>
        </div>

        {/* Change Password */}
        <div className="PassFam">
          <p className="signinH">Change Password</p>
          <div className="PassFam-inner" onSubmit={handleChangePassword}>
            <input className="inputField" type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required autoComplete="current-password" />
            <input className="inputField" type="password" placeholder="New password (min 6 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
            <input className="inputField" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" />

            {message && (
              <p className="msgText" aria-live="polite" style={{ marginTop: 6, color: message.includes("✅") ? "#10b981" : "#ef4444" }}>
                {message}
              </p>
            )}

            <button type="submit" className="loginBtn" disabled={savingPwd} style={{ marginTop: 8, opacity: savingPwd ? 0.7 : 1, pointerEvents: savingPwd ? "none" : "auto" }}>
              {savingPwd ? "Saving…" : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}