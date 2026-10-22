import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
export default function ProfilePage() {
  const { user, profile, refresh } = useAuth();
  const [name, setName] = useState(profile?.full_name || ""),
    [phone, setPhone] = useState(profile?.phone || ""),
    [addresses, setAddresses] = useState([]),
    [form, setForm] = useState({
      label: "Home",
      line1: "",
      line2: "",
      postal_code: "",
    });
  useEffect(() => {
    supabase
      .from("delivery_addresses")
      .select("*")
      .then(({ data }) => setAddresses(data || []));
  }, []);
  async function saveProfile(e) {
    e.preventDefault();
    await supabase
      .from("profiles")
      .update({ full_name: name, phone })
      .eq("id", profile.id);
    refresh();
  }
  async function addAddress(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("delivery_addresses")
      .insert({
        customer_id: user.id,
        label: form.label,
        line1: form.line1,
        line2: form.line2 || null,
        postal_code: form.postal_code,
        is_default: addresses.length === 0,
      })
      .select()
      .single();
    console.log("DATA", data);
    console.log("ERROR", error);
    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      setAddresses((v) => [...v, data]);
    }

    setForm({
      label: "Home",
      line1: "",
      line2: "",
      postal_code: "",
    });

    toast.success("Delivery address added successfully");
  }
  return (
    <main className="container-ui py-8">
      <h1 className="section-title">Profile and addresses</h1>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <form onSubmit={saveProfile} className="card space-y-4 p-5">
          <h2 className="font-black">Profile</h2>
          <label className="label">
            Full name
            <input
              className="input mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="label">
            Phone
            <input
              className="input mt-1"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <button className="btn-primary">Save profile</button>
        </form>
        <form onSubmit={addAddress} className="card space-y-4 p-5">
          <h2 className="font-black">Add delivery address</h2>
          {["label", "line1", "line2", "postal_code"].map((k) => (
            <label className="label" key={k}>
              {k.replaceAll("_", " ")}
              <input
                className="input mt-1"
                required={k !== "line2"}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
          <button className="btn-primary">Add address</button>
        </form>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {addresses.map((a) => (
          <div className="card p-4" key={a.id}>
            <strong>{a.label}</strong>
            <p className="text-sm">
              {a.line1} {a.line2}, {a.postal_code}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
