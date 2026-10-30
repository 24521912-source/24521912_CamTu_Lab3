
import { Fragment, useState } from "react";
import type { DeveloperCardProps } from "../types/profile";
import SkillBadge from "./SkillBadge";

/**
 * Tạo chữ viết tắt từ tên.
 * Ví dụ: "Alex Morgan" -> "AM".
 */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Thẻ hồ sơ lập trình viên / game thủ.
 * Sử dụng semantic HTML, không dùng thẻ div.
 */
export default function DeveloperCard({
  name,
  role,
  avatarUrl = "",
  stats,
  skills,
}: DeveloperCardProps) {
  // Lưu URL của ảnh bị lỗi để hiển thị initials thay thế.
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<
    string | null
  >(null);

  const hasValidAvatarUrl =
    avatarUrl.startsWith("https://");

  const showAvatar =
    hasValidAvatarUrl && failedAvatarUrl !== avatarUrl;

  const headingId = "developer-profile-heading";

  return (
    <article aria-labelledby={headingId}>
      <header>
        <figure>
          {showAvatar ? (
            <img
              src={avatarUrl}
              alt={`Avatar của ${name}`}
              width={120}
              height={120}
              onError={() => setFailedAvatarUrl(avatarUrl)}
            />
          ) : (
            <span
              role="img"
              aria-label={`Avatar thay thế của ${name}`}
            >
              {getInitials(name)}
            </span>
          )}
        </figure>

        <hgroup>
          <h2 id={headingId}>{name}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      <section aria-label="Profile statistics">
        <h3>Statistics</h3>

        <dl>
          {Object.entries(stats).map(([label, value]) => (
            <Fragment key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section aria-label="Professional skills">
        <h3>Skills</h3>

        <ul>
          {skills.map((skill) => (
            <SkillBadge key={skill.id} skill={skill} />
          ))}
        </ul>
      </section>
    </article>
  );
}
