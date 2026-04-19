import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  type Character,
  type CreateCharacterPayload,
  type UpdateCharacterPayload,
} from "../api/characterApi";
import { uploadImage } from "../api/uploadApi";
import "./MyCharactersPage.css";

type FormState = {
  name: string;
  description: string;
  personality: string;
  systemPrompt: string;
  avatarUrl: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  personality: "",
  systemPrompt: "",
  avatarUrl: "",
};

export default function MyCharactersPage() {
  const navigate = useNavigate();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Image upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirmation delete
  const [deletingId, setDeletingId] = useState<string | null>(null);



  // Fetch user's characters
  const fetchMyCharacters = () => {
    setLoading(true);
    getMyCharacters()
      .then(setCharacters)
      .catch(() => setError("Failed to load characters."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyCharacters();
  }, []);

  // Open form for creating
  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    setShowForm(true);
  };

  // Open form for editing
  const openEditForm = (char: Character) => {
    setEditingId(char.id);
    setForm({
      name: char.name,
      description: char.description,
      personality: char.personality,
      systemPrompt: char.systemPrompt,
      avatarUrl: char.avatarUrl ?? "",
    });
    setFormError(null);
    setAvatarFile(null);
    setAvatarPreview(char.avatarUrl ?? null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      // Upload new avatar first if a file was selected
      let resolvedAvatarUrl = form.avatarUrl || undefined;
      if (avatarFile) {
        setUploading(true);
        resolvedAvatarUrl = await uploadImage(avatarFile);
        setUploading(false);
      }

      if (editingId) {
        const payload: UpdateCharacterPayload = {
          name: form.name,
          description: form.description,
          personality: form.personality,
          systemPrompt: form.systemPrompt,
          avatarUrl: resolvedAvatarUrl,
        };
        await updateCharacter(editingId, payload);
      } else {
        const payload: CreateCharacterPayload = {
          name: form.name,
          description: form.description,
          personality: form.personality,
          systemPrompt: form.systemPrompt,
          avatarUrl: resolvedAvatarUrl,
        };
        await createCharacter(payload);
      }
      closeForm();
      fetchMyCharacters();
    } catch (err: any) {
      setUploading(false);
      const msg =
        err?.response?.data?.message ?? "Something went wrong. Try again.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCharacter(id);
      setDeletingId(null);
      fetchMyCharacters();
    } catch {
      setError("Failed to delete character.");
    }
  };

  return (
    <main className="my-chars">
      {/* Page header */}
      <header className="my-chars__header">
        <div>
          <h1 className="my-chars__title">My Characters</h1>
          <p className="my-chars__subtitle">Manage your AI personas</p>
        </div>
        <button
          id="create-character-btn"
          className="my-chars__create-btn"
          onClick={openCreateForm}
        >
          + New Character
        </button>
      </header>

      {/* Page-level error */}
      {error && (
        <p className="my-chars__page-error" role="alert">
          {error}
        </p>
      )}

      {/* Character list */}
      {loading ? (
        <p className="my-chars__status">Loading...</p>
      ) : characters.length === 0 ? (
        <div className="my-chars__empty">
          <p className="my-chars__empty-text">
            You haven't created any characters yet.
          </p>
          <button className="my-chars__create-btn" onClick={openCreateForm}>
            + Create your first character
          </button>
        </div>
      ) : (
        <ul className="my-chars__list">
          {characters.map((char) => (
            <li key={char.id} className="my-chars__card">
              {/* Avatar */}
              <div className="my-chars__card-avatar">
                {char.avatarUrl ? (
                  <img src={char.avatarUrl} alt={char.name} />
                ) : (
                  char.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="my-chars__card-info">
                <strong className="my-chars__card-name">{char.name}</strong>
                <p className="my-chars__card-desc">{char.description}</p>
              </div>

              {/* Actions */}
              <div className="my-chars__card-actions">
                <button
                  id={`view-char-btn-${char.id}`}
                  className="btn btn--ghost"
                  onClick={() => navigate(`/character/${char.id}`)}
                >
                  View
                </button>
                <button
                  id={`edit-char-btn-${char.id}`}
                  className="btn btn--ghost"
                  onClick={() => openEditForm(char)}
                >
                  Edit
                </button>
                <button
                  id={`delete-char-btn-${char.id}`}
                  className="btn btn--danger"
                  onClick={() => setDeletingId(char.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ── Create / Edit Form Modal ── */}
      {showForm && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Character form"
        >
          <div className="modal">
            <div className="modal__header">
              <h2 className="modal__title">
                {editingId ? "Edit Character" : "Create Character"}
              </h2>
              <button
                id="close-form-btn"
                className="modal__close"
                onClick={closeForm}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form id="character-form" className="char-form" onSubmit={handleSubmit}>
              <div className="char-form__group">
                <label htmlFor="char-name" className="char-form__label">
                  Name
                </label>
                <input
                  id="char-name"
                  name="name"
                  type="text"
                  className="char-form__input"
                  placeholder="e.g. Aria the Wise"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="char-form__group">
                <label htmlFor="char-description" className="char-form__label">
                  Description
                </label>
                <textarea
                  id="char-description"
                  name="description"
                  className="char-form__textarea"
                  placeholder="A short public description of this character…"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="char-form__group">
                <label htmlFor="char-personality" className="char-form__label">
                  Personality
                </label>
                <textarea
                  id="char-personality"
                  name="personality"
                  className="char-form__textarea"
                  placeholder="Describe the character's personality traits…"
                  value={form.personality}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="char-form__group">
                <label htmlFor="char-system-prompt" className="char-form__label">
                  System Prompt
                </label>
                <textarea
                  id="char-system-prompt"
                  name="systemPrompt"
                  className="char-form__textarea char-form__textarea--tall"
                  placeholder="The hidden instruction sent to the AI model…"
                  value={form.systemPrompt}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="char-form__group">
                <label className="char-form__label">
                  Avatar Image{" "}
                  <span className="char-form__label-optional">(optional)</span>
                </label>

                {/* Preview */}
                {avatarPreview && (
                  <div className="char-form__avatar-preview">
                    <img src={avatarPreview} alt="Avatar preview" />
                  </div>
                )}

                <input
                  id="char-avatar-file"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {avatarPreview ? "Change Image" : "Choose Image"}
                </button>
                {uploading && (
                  <span className="char-form__upload-status">Uploading…</span>
                )}
              </div>

              {formError && (
                <p className="char-form__error" role="alert">
                  {formError}
                </p>
              )}

              <div className="char-form__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button
                  id="character-form-submit-btn"
                  type="submit"
                  className="btn btn--primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving…"
                    : editingId
                    ? "Save Changes"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingId && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm deletion"
        >
          <div className="modal modal--sm">
            <div className="modal__header">
              <h2 className="modal__title">Delete character?</h2>
            </div>
            <p className="modal__body-text">
              This action cannot be undone. The character will be permanently
              removed.
            </p>
            <div className="modal__footer">
              <button
                className="btn btn--ghost"
                onClick={() => setDeletingId(null)}
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                className="btn btn--danger"
                onClick={() => handleDelete(deletingId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
