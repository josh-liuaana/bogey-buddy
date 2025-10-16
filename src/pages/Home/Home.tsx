import { getAuth } from "firebase/auth";
import { FaRegUser } from "react-icons/fa";
import { MdGolfCourse, MdOutlineQueryStats } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo_proto.png";

export function Home() {
  const user = getAuth().currentUser;
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dune-sand text-deep-forest gap-8">
      <h1 className="text-5xl">Bogey Buddy</h1>
      <p className="text-sm text-center max-w-md px-10">
        Check out your amateur statistics to find your golfing strengths and
        weaknesses
      </p>
      <img src={logo} alt="Golf" className="w-60 h-60" />
      <p className="text-2xl text-center">
        Hi {user?.displayName?.split(" ")[0]}
      </p>
      <div className="flex flex-row gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-2 text-4xl bg-terracotta text-dune-sand rounded h-20 w-20 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] "
        >
          <FaRegUser />
        </button>
        <button
          onClick={() => navigate("/statistics")}
          className="px-4 py-2 text-4xl bg-terracotta text-dune-sand rounded h-20 w-20 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] "
        >
          <MdOutlineQueryStats />
        </button>
        <button
          onClick={() => navigate("/round-setup")}
          className="px-4 py-2 text-4xl bg-terracotta text-dune-sand rounded h-20 w-20 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] "
        >
          <MdGolfCourse />
        </button>
      </div>
    </main>
  );
}
