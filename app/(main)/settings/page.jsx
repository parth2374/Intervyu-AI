"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Menu,
  X,
  User,
  Lock,
  Bell,
  CreditCard,
  Link as LinkIcon,
  Trash2,
  Save,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { auth, storage } from "@/config/firebaseConfig";
import {
  updateProfile,
  updateEmail,
  signInWithEmailAndPassword,
  updatePassword,
  signOut as firebaseSignOut,
  deleteUser,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuthContext } from "@/app/provider";

const NAV = [
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { id: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
  { id: "integrations", label: "Integrations", icon: <LinkIcon className="h-4 w-4" /> }
];

export default function Settings() {
  const [openNav, setOpenNav] = useState(false);
  const [section, setSection] = useState("profile");
  const router = useRouter();
  const { user } = useAuthContext()

  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user])

  // profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null); // preview URL
  const [avatarFile, setAvatarFile] = useState(null); // actual File
  const [uploadProgress, setUploadProgress] = useState(0);
  const avatarRef = useRef(null);

  // integrations
  const [apiKey, setApiKey] = useState("sk_live_••••••••••••••");

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // load current user on mount
  useEffect(() => {
    const u = auth.currentUser;
    if (u) {
      setName(u.displayName || "");
      setEmail(u.email || "");
      setAvatarPreview(u.photoURL || null);
    }
  }, []);

  // close mobile nav on section change
  useEffect(() => {
    setOpenNav(false);
  }, [section]);

  // helper: upload file to firebase storage and return download URL
  const uploadAvatarToStorage = async (file, uid, onProgress) => {
    if (!file) throw new Error("No file provided");
    const path = `avatars/${uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(pct);
        },
        (err) => reject(err),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  };

  const handleAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarPreview(url);
    setAvatarFile(f);
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide both name and email");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("No authenticated user found");
      return;
    }

    setSavingProfile(true);

    try {
      let photoURL = user.photoURL || null;

      // if a new avatar file was selected, upload it
      if (avatarFile) {
        try {
          setUploadProgress(0);
          const url = await uploadAvatarToStorage(avatarFile, user.uid, (pct) => {
            setUploadProgress(pct);
          });
          photoURL = url;
        } catch (err) {
          console.error("Avatar upload failed:", err);
          toast.error("Avatar upload failed. Try again.");
          setSavingProfile(false);
          return;
        } finally {
          setUploadProgress(0);
        }
      }

      // update displayName/photoURL
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });

      // update email if changed
      if (email !== user.email) {
        try {
          await updateEmail(user, email);
        } catch (err) {
          console.error("updateEmail error:", err);
          // If requires recent login, prompt for password and reauthenticate
          if (err?.code === "auth/requires-recent-login" || err?.code === "auth/requires-recent-sign-in") {
            const pwd = window.prompt("To change your email, please re-enter your password to reauthenticate:");
            if (!pwd) {
              toast.error("Reauthentication cancelled — email not changed.");
            } else {
              try {
                await signInWithEmailAndPassword(auth, user.email, pwd);
                await updateEmail(auth.currentUser, email);
                toast.success("Email updated after reauthentication");
              } catch (reauthErr) {
                console.error("reauth/updateEmail error:", reauthErr);
                toast.error("Failed to reauthenticate — email not updated.");
              }
            }
          } else {
            toast.error("Failed to update email.");
          }
        }
      }

      toast.success("Profile saved");
    } catch (err) {
      console.error("saveProfile error:", err);
      toast.error("Failed to save profile");
    } finally {
      setSavingProfile(false);
      setAvatarFile(null);
    }
  };

  const handleRegenerateKey = () => {
    const generated = "sk_live_" + Math.random().toString(36).slice(2, 18);
    setApiKey(generated);
    toast.success("API key regenerated");
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out");
      router.push("/auth");
    } catch (err) {
      console.error("sign out error:", err);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* left nav */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4 lg:block">
            <div>
              <h1 className="text-xl font-semibold">Settings</h1>
              <p className="text-sm text-gray-500">Manage your account and preferences</p>
            </div>

            {/* mobile toggle */}
            <button
              onClick={() => setOpenNav((s) => !s)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md bg-white border shadow-sm"
              aria-label="Toggle menu"
            >
              {openNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Sidebar (mobile overlay behavior) */}
          <div className={`bg-white border rounded-xl overflow-hidden ${openNav ? "block" : "hidden"} lg:block`}>
            <nav className="divide-y">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`w-full text-left px-4 cursor-pointer py-3 flex items-center gap-3 ${section === item.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* right content */}
        <div className="lg:col-span-3">
          <div className="bg-white border rounded-2xl px-6 py-6 shadow-sm">
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold capitalize">{section}</h2>
                <p className="text-sm text-gray-500">Update your {section} settings</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => {
                    if (section === "profile") handleSaveProfile();
                  }}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  <Save className="h-4 w-4" /> Save
                </button>

                <button onClick={handleSignOut} title="Sign out" className="flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>

            {/* content by section */}
            {section === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 gap-4">
                    <label className="text-sm text-gray-600">Full name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border px-3 py-2" />

                    <label className="text-sm text-gray-600">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border px-3 py-2" />

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        <Save className="h-4 w-4" /> {savingProfile ? "Saving..." : "Save profile"}
                      </button>
                    </div>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full mt-2">
                        <div className="text-xs text-gray-500 mb-1">Uploading avatar: {uploadProgress}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div style={{ width: `${uploadProgress}%` }} className="h-2 rounded-full transition-all"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div
                    className="h-28 w-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-xl font-semibold text-white"
                    style={{ background: "linear-gradient(90deg,#6366f1,#ec4899)" }}
                  >
                    {!avatarPreview ? (name?.[0]?.toUpperCase() || "U") : <img src={avatarPreview} alt="avatar" className="h-28 w-28 object-cover" />}
                  </div>

                  <input ref={avatarRef} onChange={handleAvatar} type="file" accept="image/*" className="hidden" id="avatar" />
                  <div className="flex gap-2">
                    <label htmlFor="avatar" className="inline-flex items-center px-3 py-2 rounded-md border cursor-pointer">Upload</label>
                    <button onClick={() => { setAvatarPreview(null); setAvatarFile(null); if (avatarRef.current) avatarRef.current.value = null }} className="inline-flex items-center px-3 py-2 rounded-md border">Remove</button>
                  </div>
                  <div className="text-xs text-gray-500">Tip: uploading persists avatar to Firebase Storage and sets it on your profile.</div>
                </div>
              </div>
            )}

            {section === "billing" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-md border bg-gray-50">
                  <div className="text-sm text-gray-500">Plan</div>
                  <div className="font-semibold">Free</div>
                  <div className="text-sm text-gray-400 mt-1">{user?.credits} interviews remaining</div>
                </div>

                <div className="p-4 rounded-md border">
                  <div className="text-sm text-gray-500">Add credits</div>
                  <button onClick={() => router.push('/billing')} className="mt-2 cursor-pointer inline-flex px-4 py-2 rounded-md bg-blue-600 text-white">Add credits</button>
                </div>
              </div>
            )}

            {section === "integrations" && (
              <div className="max-w-xl space-y-4">
                <div>
                  <div className="text-sm text-gray-500">API Key</div>
                  <div className="mt-2 flex items-center gap-3">
                    <input value={apiKey} readOnly className="rounded-md border px-3 py-2 w-full" />
                    <button onClick={() => { navigator.clipboard.writeText(apiKey); toast.success("Copied API key") }} className="px-3 py-2 rounded-md border">Copy</button>
                    <button onClick={handleRegenerateKey} className="px-3 py-2 rounded-md bg-yellow-500 text-white">Regenerate</button>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Webhooks</div>
                  <div className="mt-2 text-sm text-gray-600">No webhooks configured.</div>
                  <div className="mt-3">
                    <button onClick={() => toast("Webhook setup (demo)")} className="px-3 py-2 rounded-md border">Configure</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}