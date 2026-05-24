import RoomList from "../pages/RoomLists";

export default function RoomsSidebar({open}) {
  if (open === false) return null ;
  return (
    <div className="flex flex-col shrink-0 bg-teal-700 dark:bg-[#1a1a1a] text-amber-50 dark:text-obsidian-text border-r dark:border-obsidian-border transition-colors duration-300">
      <RoomList></RoomList>
    </div>
  );
}
