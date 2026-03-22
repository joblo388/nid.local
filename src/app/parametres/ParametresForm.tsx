"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserData = {
  id: string;
  username: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
};

export function ParametresForm({ user }: { user: UserData }) {
  const { update } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState(user.username ?? "");
  const [name, setName] = useState(user.name ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const [imageData, setImageData] = useState<string | null | undefined>(undefined);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      setProfileError("L'image doit faire moins de 500 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      setImageData(result);
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setImagePreview(null);
    setImageData(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setLoadingProfile(true);

    const body: Record<string, string | null> = { username, name };
    if (imageData !== undefined) body.image = imageData;

    const res = await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoadingProfile(false);

    if (!res.ok) {
      setProfileError(data.error ?? "Une erreur est survenue.");
    } else {
      setProfileSuccess("Profil mis à jour.");
      await update();
      router.refresh();
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoadingPassword(true);
    const res = await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setLoadingPassword(false);

    if (!res.ok) {
      setPasswordError(data.error ?? "Une erreur est survenue.");
    } else {
      setPasswordSuccess("Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  const initial = (username || name || user.email || "?")[0].toUpperCase();

  return (
    <div className="space-y-5">
      {/* Profile section */}
      <section
        className="rounded-xl p-6"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <h2 className="text-[15px] font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
          Profil
        </h2>

        <form onSubmit={saveProfile} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ border: "2px solid var(--border)" }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-bold text-white"
                  style={{ background: "var(--green)" }}
                >
                  {initial}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                JPG, PNG ou GIF — max 500 KB
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
                >
                  Choisir une photo
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-[12px] transition-opacity hover:opacity-70"
                    style={{ color: "var(--red-text)" }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFile}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Nom d&apos;utilisateur
            </label>
            <div className="flex items-center">
              <span
                className="px-3 py-2 rounded-l-lg text-[13px]"
                style={{ background: "var(--bg-secondary)", color: "var(--text-tertiary)", border: "0.5px solid var(--border)", borderRight: "none" }}
              >
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                className="flex-1 px-3 py-2 text-[13px] rounded-r-lg outline-none"
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
              />
            </div>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Lettres minuscules, chiffres, - et _ seulement
            </p>
          </div>

          {/* Display name */}
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Nom d&apos;affichage (optionnel)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="Votre vrai nom ou surnom"
              className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Courriel
            </label>
            <input
              type="email"
              value={user.email ?? ""}
              disabled
              className="w-full px-3 py-2 text-[13px] rounded-lg"
              style={{ background: "var(--bg-secondary)", color: "var(--text-tertiary)", border: "0.5px solid var(--border)", opacity: 0.7 }}
            />
            <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Le courriel ne peut pas être modifié pour l&apos;instant.
            </p>
          </div>

          {profileError && (
            <p className="text-[12px]" style={{ color: "var(--red-text)" }}>{profileError}</p>
          )}
          {profileSuccess && (
            <p className="text-[12px]" style={{ color: "var(--green)" }}>{profileSuccess}</p>
          )}

          <button
            type="submit"
            disabled={loadingProfile}
            className="px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--green)" }}
          >
            {loadingProfile ? "Enregistrement…" : "Enregistrer les changements"}
          </button>
        </form>
      </section>

      {/* Password section */}
      {user.email && (
        <section
          className="rounded-xl p-6"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <h2 className="text-[15px] font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
            Mot de passe
          </h2>

          <form onSubmit={savePassword} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
              />
            </div>

            {passwordError && (
              <p className="text-[12px]" style={{ color: "var(--red-text)" }}>{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-[12px]" style={{ color: "var(--green)" }}>{passwordSuccess}</p>
            )}

            <button
              type="submit"
              disabled={loadingPassword}
              className="px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--green)" }}
            >
              {loadingPassword ? "Enregistrement…" : "Changer le mot de passe"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
