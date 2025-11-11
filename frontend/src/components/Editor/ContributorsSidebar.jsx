/** @format */

const ContributorsSidebar = ({ users, onLeave, roomId }) => (
  <div className="w-64 bg-gray-100 p-4 border-r flex flex-col">
    <h3 className="font-semibold mb-4">Contributors ({users.length})</h3>
    <ul className="flex-grow overflow-auto">
      {users.map((u) => (
        <li key={u.id || u._id} className="mb-2 flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: u.color || "#4F46E5" }}
          />
          <span>{u.username}</span>
        </li>
      ))}
      {users.length === 0 && <li>No one else here</li>}
    </ul>
    <button
      onClick={() => {
        navigator.clipboard.writeText(roomId);
        alert("Room ID copied!");
      }}
      className="py-1 px-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Copy Room ID
    </button>
    <button
      onClick={onLeave}
      className="py-1 px-2 mt-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Leave Room
    </button>
  </div>
);
export default ContributorsSidebar;
