
import type { SkillBadgeProps } from "../types/profile";

/**
 * Hiển thị tên và cấp độ của một kỹ năng.
 * Component chỉ nhận props và render, không thay đổi dữ liệu.
 */
export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <li>
      <span>{skill.name}</span>{" "}
      <span>({skill.level})</span>
    </li>
  );
}
