"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await fetch(`http://127.0.0.1:8000/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Health Product Price Compare
      </h1>

      <div className="flex gap-2">
        <input
          className="border p-2"
          placeholder="Search (e.g. whey protein)"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={search}
          className="bg-blue-500 text-white px-4"
        >
          Search
        </button>
      </div>

      <div className="mt-6">
        {results.map((item, i) => (
          <div key={i} className="border p-4 mb-2">
            <p className="font-semibold">{item.site}</p>
            <p>₹{item.price}</p>
            <a
              href={item.link}
              target="_blank"
              className="text-blue-600"
            >
              Buy Now →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}