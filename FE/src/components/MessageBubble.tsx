import { useState, useRef, useEffect } from "react";
import "./MessageBubble.css";

export type MessageRole = "user" | "character" | "assistant";

export interface MessageBubbleProps {
  role: MessageRole;
  text: string;
  senderName?: string;
  timestamp?: string;
  isTyping?: boolean;
  onEdit?: (newText: string) => void;
  onDelete?: () => void;
}

export default function MessageBubble({
  role,
  text,
  senderName,
  timestamp,
  isTyping,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea when in edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      textareaRef.current.focus();
    }
  }, [isEditing, editText]);

  const handleSave = () => {
    if (onEdit && editText.trim() !== text) {
      onEdit(editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  return (
    <div className={`message-bubble message-bubble--${role}`}>
      {senderName && (
        <span className="message-bubble__sender">{senderName}</span>
      )}
      <div className="message-bubble__body">
        {isTyping ? (
          <div className="message-bubble__typing">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        ) : isEditing ? (
          <div className="message-bubble__edit-container">
            <textarea
              ref={textareaRef}
              className="message-bubble__edit-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={1}
            />
            <div className="message-bubble__edit-actions">
              <button className="message-bubble__btn message-bubble__btn--save" onClick={handleSave}>Save</button>
              <button className="message-bubble__btn message-bubble__btn--cancel" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="message-bubble__text">{text}</p>
        )}
        
        {!isTyping && !isEditing && (
          <div className="message-bubble__footer">
            {timestamp && (
              <span className="message-bubble__time">{timestamp}</span>
            )}
            <div className="message-bubble__actions">
              {onEdit && (
                <button className="message-bubble__action-btn" onClick={() => { setEditText(text); setIsEditing(true); }} title="Edit message">✏</button>
              )}
              {onDelete && (
                <button className="message-bubble__action-btn" onClick={onDelete} title="Delete message">🗑</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
