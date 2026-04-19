import "./MessageBubble.css";

export type MessageRole = "user" | "character";

export interface MessageBubbleProps {
  role: MessageRole;
  text: string;
  senderName?: string;
  timestamp?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MessageBubble({
  role,
  text,
  senderName,
  timestamp,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  return (
    <div className={`message-bubble message-bubble--${role}`}>
      {senderName && (
        <span className="message-bubble__sender">{senderName}</span>
      )}
      <div className="message-bubble__body">
        <p className="message-bubble__text">{text}</p>
        <div className="message-bubble__footer">
          {timestamp && (
            <span className="message-bubble__time">{timestamp}</span>
          )}
          <div className="message-bubble__actions">
            {onEdit && (
              <button className="message-bubble__action-btn" onClick={onEdit} title="Edit message">✏</button>
            )}
            {onDelete && (
              <button className="message-bubble__action-btn" onClick={onDelete} title="Delete message">🗑</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
