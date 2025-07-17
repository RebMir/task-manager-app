import clsx from "clsx";
import { useEffect, useState } from "react";
import { useGetAllUsersQuery } from "../../redux/slices/api/userApiSlice";
import { getInitials } from "../../utils";
import Loading from "../Loading";

const UserList = ({ team, setTeam }) => {
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (team.length > 0) {
      setSelected(team.map((user) => user._id));
    }
  }, [team]);

  const handleSelect = (user) => {
    const alreadySelected = selected.includes(user._id);

    if (alreadySelected) {
      setSelected(selected.filter((id) => id !== user._id));
      setTeam(team.filter((member) => member._id !== user._id));
    } else {
      setSelected([...selected, user._id]);
      setTeam([...team, user]);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">Failed to load users.</p>;

  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Assign Team Members
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
        {users?.map((user) => {
          const isActive = selected.includes(user._id);
          return (
            <div
              key={user._id}
              onClick={() => handleSelect(user)}
              className={clsx(
                "cursor-pointer flex items-center gap-2 px-3 py-2 rounded border",
                isActive
                  ? "bg-blue-100 border-blue-400 text-blue-800"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                {getInitials(user.name)}
              </div>
              <span className="text-sm">{user.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
