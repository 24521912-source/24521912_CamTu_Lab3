
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

// Thông tin hiển thị trên Profile Card.
const developerProfile: DeveloperCardProps = {
  name: "Nguyễn Thị Cẩm Tú",
  role: "Data Engineer & Data Scientist",
  avatarUrl: "https://www.pngkey.com/png/detail/30-302310_minion-despicable-me-minions.png",
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
    <main className="page">
      <h1 className="pageTitle">
        Developer & Pro-Gamer Profile
      </h1>

      <DeveloperCard {...developerProfile} />
    </main>
  );
}
