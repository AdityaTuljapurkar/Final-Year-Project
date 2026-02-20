import RoomList from "../pages/RoomLists";

export default function RoomsSidebar({open}) {
  if (open === false) return null ;
  return (
    <div className="flex flex-col   shrink-0 bg-teal-700 text-amber-50 p-3">
      <h2 className="mb-3 font-semibold">Rooms</h2>
      <RoomList></RoomList>
    </div>
  );
}
