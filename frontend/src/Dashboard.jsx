import { useState } from "react";

const categoryColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-teal-500"
];

export default function Dashboard({ userData, logout, refresh }) {

  if (!userData) {
    return null;
  }

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = userData.categories || {};
  const allLinks = Object.values(categories).flat();

  const deleteLink = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/delete-link/${id}`, {
        method: "DELETE"
      });
      refresh();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const isRecent = (date) => {
    const now = new Date();
    const created = new Date(date);
    return (now - created) / (1000 * 60 * 60) <= 24;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8">Social Saver</h1>

          <ul className="space-y-4">
            <li onClick={() => { setActiveTab("dashboard"); setActiveFilter("All"); }} className="cursor-pointer">
              Dashboard
            </li>
            <li onClick={() => { setActiveTab("categories"); setSelectedCategory(null); }} className="cursor-pointer">
              My Categories
            </li>
            <li onClick={() => setActiveTab("recent")} className="cursor-pointer">
              Recent Saves
            </li>
          </ul>
        </div>

        <button onClick={logout} className="bg-red-500 text-white py-2 rounded-lg">
          Logout
        </button>
      </div>

      <div className="flex-1 p-8">

        {activeTab === "dashboard" && (
          <>
            <h2 className="text-2xl font-bold mb-6">All Saved Reels</h2>

            <div className="flex gap-3 mb-8 flex-wrap">
              <button onClick={() => setActiveFilter("All")} className="px-4 py-2 bg-blue-600 text-white rounded-full">
                All
              </button>

              {Object.keys(categories).map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)} className="px-4 py-2 bg-white border rounded-full">
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {(activeFilter === "All" ? allLinks : categories[activeFilter] || [])
                .map(item => (
                  <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm">
                    <p className="text-sm mb-3">{item.ai_result}</p>

                    <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">
                      View Reel
                    </a>

                    <button onClick={() => deleteLink(item._id)} className="block mt-3 text-red-500 text-sm">
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}

        {activeTab === "categories" && !selectedCategory && (
          <>
            <h2 className="text-2xl font-bold mb-6">My Categories</h2>

            <div className="grid grid-cols-3 gap-6">
              {Object.entries(categories).map(([cat, links], index) => (
                <div
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-6 rounded-xl text-white cursor-pointer ${categoryColors[index % categoryColors.length]}`}
                >
                  <h3 className="text-lg font-semibold">{cat}</h3>
                  <p className="text-sm mt-2">{links.length} Reels</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "categories" && selectedCategory && (
          <>
            <button onClick={() => setSelectedCategory(null)} className="mb-4 text-blue-600">
              ← Back
            </button>

            <div className="grid grid-cols-3 gap-6">
              {(categories[selectedCategory] || []).map(item => (
                <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm">
                  <p className="text-sm mb-3">{item.ai_result}</p>

                  <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">
                    View Reel
                  </a>

                  <button onClick={() => deleteLink(item._id)} className="block mt-3 text-red-500 text-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "recent" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Last 24 Hours</h2>

            <div className="grid grid-cols-3 gap-6">
              {allLinks.filter(link => isRecent(link.created_at)).map(item => (
                <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm">
                  <p className="text-sm mb-3">{item.ai_result}</p>

                  <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">
                    View Reel
                  </a>

                  <button onClick={() => deleteLink(item._id)} className="block mt-3 text-red-500 text-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}