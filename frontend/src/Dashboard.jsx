import { useState } from "react";

export default function Dashboard({ userData }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = userData.categories || {};
  const totalLinks = userData.total_links || 0;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h1 className="text-xl font-bold mb-8">Curator</h1>

        <ul className="space-y-4 text-gray-600">
          <li className="font-semibold text-blue-600">Dashboard</li>
          <li>My Categories</li>
          <li>Recent Saves</li>
          <li>Settings</li>
        </ul>

        <div className="mt-12 text-sm text-green-600">
          WhatsApp Bot Connected
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Find a saved reel..."
            className="w-1/2 px-4 py-2 rounded-lg border border-gray-300"
          />

          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
            + Save Link
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Saves</p>
            <h2 className="text-2xl font-bold mt-2">{totalLinks}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Categories</p>
            <h2 className="text-2xl font-bold mt-2">
              {Object.keys(categories).length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">User</p>
            <h2 className="text-lg font-semibold mt-2">
              {userData.phone}
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveFilter("All")}
            className={`px-4 py-2 rounded-full ${
              activeFilter === "All"
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            All
          </button>

          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full ${
                activeFilter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {Object.entries(categories).map(([category, links]) => {
          if (activeFilter !== "All" && activeFilter !== category) {
            return null;
          }

          return (
            <div key={category} className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {category} ({links.length})
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {links.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition"
                  >
                    <p className="text-xs text-gray-400 mb-2">
                      Instagram
                    </p>

                    <p className="text-sm font-medium mb-3 line-clamp-3">
                      {item.ai_result}
                    </p>

                    <a
                      href={item.url}
                      target="_blank"
                      className="text-blue-600 text-sm font-semibold"
                    >
                      View Reel →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}