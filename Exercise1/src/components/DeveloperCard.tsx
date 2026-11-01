
import { Fragment, useState } from "react";
import type { DeveloperCardProps } from "../types/profile";
import SkillBadge from "./SkillBadge";
import styles from "./DeveloperCard.module.css";

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
 * Thẻ hồ sơ sử dụng semantic HTML.
 * Không dùng thẻ div trong component.
 */
export default function DeveloperCard({
  name,
  role,
  avatarUrl = "",
  stats,
  skills,
}: DeveloperCardProps) {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<
    string | null
  >(null);

  const hasValidAvatarUrl = avatarUrl.startsWith("https://");

  const showAvatar =
    hasValidAvatarUrl && failedAvatarUrl !== avatarUrl;

  const headingId = "developer-profile-heading";

  return (
    <article
      className={styles.card}
      aria-labelledby={headingId}
    >
      <header className={styles.profileHeader}>
        <figure className={styles.avatarFigure}>
          {showAvatar ? (
            <img
              className={styles.avatar}
              src={avatarUrl}
              alt={`Avatar của ${name}`}
              width={120}
              height={120}
              onError={() => setFailedAvatarUrl(avatarUrl)}
            />
          ) : (
            <span
              className={styles.avatarFallback}
              role="img"
              aria-label={`Avatar thay thế của ${name}`}
            >
              {getInitials(name)}
            </span>
          )}
        </figure>

        <hgroup className={styles.profileInfo}>
          <h2 className={styles.name} id={headingId}>
            {name}
          </h2>
          <p className={styles.role}>{role}</p>
        </hgroup>
      </header>

      <section
        className={styles.section}
        aria-label="Profile statistics"
      >
        <h3 className={styles.sectionTitle}>Statistics</h3>

        <dl className={styles.statsList}>
          {Object.entries(stats).map(([label, value]) => (
            <Fragment key={label}>
              <dt className={styles.statTerm}>
                {label}
              </dt>
              <dd className={styles.statValue}>
                {value}
              </dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section
        className={styles.section}
        aria-label="Professional skills"
      >
        <h3 className={styles.sectionTitle}>Skills</h3>

        <ul className={styles.skillsList}>
          {skills.map((skill) => (
            <SkillBadge key={skill.id} skill={skill} />
          ))}
        </ul>
      </section>
    </article>
  );
}
