// app/signin/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./signin.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const [loading, setLoading] = useState(false);

  // const birthate = birthDate;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const fullAddress = [
        address?.trim(),
        neighborhood && `Neighborhood: ${neighborhood}`,
        building && `Building: ${building}`,
        buildingNo && `No: ${buildingNo}`,
        floor && `Floor: ${floor}`,
        apartmentUnit && `Unit: ${apartmentUnit}`,
        district && `District: ${district}`,
        province && `Province: ${province}`,
      ]
        .filter(Boolean)
        .join(", ");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/customers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName: name,
          lastName: surname,
          phone,
          address: fullAddress,
          birthDate,
          
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const id = String(data.customerId ?? data.id);
        localStorage.setItem("customerId", id);
        if (data.token) localStorage.setItem("token", data.token);
        router.replace(`/profile/${encodeURIComponent(id)}`);
        setMessage("Account created. You can log in now.");
      } else {
        setMessage(data?.message || "Could not register");
      }
    } catch {
      setMessage("Cannot reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mainContainer">
      <form className="signinBox" onSubmit={handleSubmit}>
        <h1 className="signinH">Register</h1>
        <div className="nameRow">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="inputName" autoComplete="given-name" required />
          <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} className="inputName" autoComplete="family-name" required />
        </div>

        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="inputField" autoComplete="email" required />
        <input type="date" placeholder="Birth date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="inputField" autoComplete="bday" required />

        <div className="phone">
          <p className="doksan">+90</p>
          <input type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="inputField" autoComplete="tel" required />
        </div>

        <p className="adressInfo">Address Information</p>

        <div className="addressing1">
          <div className="addressing2">
            <input
              className="inputField"
              type="text"
              placeholder="Province/Country"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              autoComplete="address-level1"
              required
            />
            <input
              className="inputField"
              type="text"
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              autoComplete="address-level2"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="inputField"
            required
          />

          <div className="addressing2">
            <input
              type="text"
              placeholder="Building Name"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="inputField"
              required
            />
            <input
              type="text"
              placeholder="Building No"
              value={buildingNo}
              onChange={(e) => setBuildingNo(e.target.value)}
              className="inputField"
              required
            />
          </div>

          <div className="addressing2">
            <input
              type="text"
              placeholder="Floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="inputField"
              required
            />
            <input
              type="text"
              placeholder="Apartment Unit"
              value={apartmentUnit}
              onChange={(e) => setApartmentUnit(e.target.value)}
              className="inputField"
              required
            />
          </div>

          <textarea
            placeholder="Address Description"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            className="inputAddress"
            autoComplete="street-address"
            rows={3}
            required
          />
        </div>
        <p className="adressInfo">Password</p>
        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="inputField" autoComplete="new-password" required />

        <button type="submit" className="loginBtn" disabled={loading}>{loading ? "Creating..." : "Sign In"}</button>

        <p className="pls">
          If you have an account{" "}
          <Link href="/login" className="link">Log in</Link>
        </p>

        {message && <p className="msgText">{message}</p>}
      </form>
    </main>
  );
}
