
/**
 * Các mức độ kỹ năng được phép sử dụng.
 */
export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

/**
 * Dữ liệu của một kỹ năng.
 * id được dùng làm React key ổn định.
 */
export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

/**
 * Props truyền vào component SkillBadge.
 */
export interface SkillBadgeProps {
  skill: Skill;
}

/**
 * Các chỉ số thống kê của profile.
 *
 * Ví dụ:
 * {
 *   "Projects Completed": 12,
 *   "Experience": "3 Years",
 *   "Win Rate": "85%"
 * }
 *
 * Cấu trúc Record giúp Object.entries()
 * chuyển object thành các cặp [tên, giá trị].
 */
export type ProfileStats = Record<string, string | number>;

/**
 * Props truyền vào component DeveloperCard.
 */
export interface DeveloperCardProps {
  // Tên hiển thị trên profile.
  name: string;

  // Vai trò: Developer, Pro Gamer, ...
  role: string;

  // URL avatar, chỉ sử dụng HTTPS khi truyền ảnh.
  avatarUrl?: string;

  // Các chỉ số thống kê.
  stats: ProfileStats;

  // Danh sách kỹ năng.
  skills: Skill[];
}
