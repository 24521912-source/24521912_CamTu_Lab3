
import DeveloperCard from "./components/DeveloperCard";
import type {
  DeveloperCardProps,
  Skill,
} from "./types/profile";

// Danh sách kỹ năng có ID ổn định.
const developerSkills: Skill[] = [
  {
    id: "skill-react",
    name: "React",
    level: "Advanced",
  },
  {
    id: "skill-typescript",
    name: "TypeScript",
    level: "Intermediate",
  },
  {
    id: "skill-python",
    name: "Python",
    level: "Advanced",
  },
  {
    id: "skill-gaming",
    name: "Competitive Gaming",
    level: "Intermediate",
  },
];

// Dữ liệu mẫu truyền vào DeveloperCard qua props.
const developerProfile: DeveloperCardProps = {
  name: "Alex Morgan",
  role: "Frontend Engineer & Pro Gamer",
  avatarUrl: "https://example.invalid/avatar.png",
  stats: {
    "Projects Completed": 24,
    "Years of Experience": 4,
    "Tournament Wins": 8,
    "Win Rate": "82%",
  },
  skills: developerSkills,
};

export default function App() {
  return (
    <main>
      <h1>Developer & Pro-Gamer Profile</h1>

      <DeveloperCard {...developerProfile} />
    </main>
  );
}
