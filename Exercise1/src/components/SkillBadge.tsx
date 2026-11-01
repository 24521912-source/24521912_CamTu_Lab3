
import type { SkillBadgeProps } from "../types/profile";
import styles from "./SkillBadge.module.css";

/**
 * Hiển thị một kỹ năng và cấp độ tương ứng.
 */
export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <li className={styles.badge}>
      <span className={styles.skillName}>
        {skill.name}
      </span>
      <span className={styles.skillLevel}>
        ({skill.level})
      </span>
    </li>
  );
}
