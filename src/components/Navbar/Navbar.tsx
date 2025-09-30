import { useNavigate } from "react-router-dom";
import ExpandableDock from "@/components/ui/expandable-dock";
import { getAuth, signOut } from "firebase/auth";
import { TiThMenu } from "react-icons/ti";
import { IoAnalytics, IoHome, IoLogOutOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";

import { app } from "../../../firebase";

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully.");
      })
      .catch((error) => {
        console.error("Sign-out failed:", error);
      });
  };

  return (
    <ExpandableDock
      headerContent={
        <div className="flex items-center w-full justify-center">
          <span className="text-lg font-semibold">
            <TiThMenu />
          </span>
        </div>
      }
      className="max-w-lg"
    >
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-2 bg-blue-500 text-white rounded text-2xl"
        >
          <IoHome className="inline mb-1" />
        </button>
        <button
          onClick={() => navigate("/statistics")}
          className="px-2 bg-blue-500 text-white rounded text-2xl"
        >
          <IoAnalytics className="inline mb-1" />
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="px-2 bg-blue-500 text-white rounded text-2xl"
        >
          <FaRegUser className="inline mb-1" />
        </button>
        <button
          onClick={handleLogout}
          className="px-2 bg-blue-500 text-white rounded text-2xl"
        >
          <IoLogOutOutline className="inline mb-1" />
        </button>
      </div>
    </ExpandableDock>
  );
}
