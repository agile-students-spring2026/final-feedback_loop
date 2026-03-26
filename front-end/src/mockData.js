const games = [
  { id: 1, title: "Pixel Quest", description: "Retro puzzle adventure", genre: "Adventure", version: "v0.1" },
  { id: 2, title: "Rogue Galaxy", description: "Roguelike RPG", genre: "RPG", version: "v0.2" },
  { id: 3, title: "Puzzle Mania", description: "Brain teasers", genre: "Puzzle", version: "v0.3" },
  { id: 4, title: "Cyber Drift", description: "Neon racing", genre: "Racing", version: "v0.4" },
  { id: 5, title: "Mystic Isle", description: "Survival mystery", genre: "Survival", version: "v0.5" },
]

const followedGames = [
  {
    id: 1,
    title: "Project Alpha",
    developer: "Studio 1",
    image: "https://picsum.photos/seed/alpha/300/200",
    isNew: true,
    description: "Puzzle game. New level added.",
    time: "2 hours ago",
    following: true,
  },
  {
    id: 2,
    title: "Project Beta",
    developer: "Studio 2",
    image: "https://picsum.photos/seed/beta/300/200",
    isNew: true,
    description: "Dungeon crawler. Kill stuff and get loot.",
    time: "5 hours ago",
    following: true,
  },
  {
    id: 3,
    title: "Project Gamma",
    developer: "Studio 3",
    image: "https://picsum.photos/seed/gamma/300/200",
    isNew: false,
    description: "Platformer. Still in early alpha.",
    time: "1 day ago",
    following: true,
  },
  {
    id: 4,
    title: "Project Delta",
    developer: "Studio 4",
    image: "https://picsum.photos/seed/delta/300/200",
    isNew: false,
    description: "PvP action game.",
    time: "3 days ago",
    following: true,
  },
]

const notifications = [
  {
    id: 1,
    message: "Player #1 started following your project",
    type: "follow",
  },
  {
    id: 2,
    message: "Player #2 submitted feedback on your project",
    type: "feedback",
  },
  {
    id: 3,
    message: "Player #3 started following your project",
    type: "follow",
  },
]

const projectUpdates = [
  {
    id: 1,
    title: "Project Alpha",
    developer: "Studio 1",
    image: "https://picsum.photos/seed/alpha/300/200",
    time: "Updated at 2:30 PM",
    description: "Added level 4. Fixed a bug.",
  },
  {
    id: 2,
    title: "Project Beta",
    developer: "Studio 2",
    image: "https://picsum.photos/seed/beta/300/200",
    time: "Updated at 11:00 AM",
    description: "Changed enemy spawns. Added new weapons.",
  },
]

const feedbackComments = [
  {
    id: 1,
    player: "Player #1",
    time: "2 hours ago",
    text: "I loved it great game. Level 3 was my favorite",
    likes: 4,
    replies: [
      {
        id: 101,
        name: "Studio 1",
        isDev: true,
        time: "1 hour ago",
        text: "Thanks, fixing it next patch.",
      },
    ],
  },
  {
    id: 2,
    player: "Player #2",
    time: "5 hours ago",
    text: "Really enjoying the art style",
    likes: 7,
    replies: [],
  },
  {
    id: 3,
    player: "Player #3",
    time: "1 day ago",
    text: "Found a physics bug",
    likes: 2,
    replies: [],
  },
]

const myPlaytests = [
  { id: 101, title: "Neon Drift Test Build", description: "Early racing prototype", version: "v0.1" },
  { id: 102, title: "Puzzle Alpha", description: "Logic puzzle system test", version: "v0.2" },
  { id: 103, title: "Survival Island Build", description: "Core survival mechanics", version: "v0.3" }
]

export { games, followedGames, notifications, projectUpdates, feedbackComments, myPlaytests }
