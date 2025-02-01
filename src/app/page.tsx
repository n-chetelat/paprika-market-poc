import React from "react";

const spices = [
  { id: 1, name: "Oregano", color: "Green", price: 2.5, company: "Herb Haven" },
  {
    id: 2,
    name: "Cracked Black Pepper",
    color: "Black",
    price: 3.0,
    company: "Spice World",
  },
  {
    id: 3,
    name: "Garlic Salt",
    color: "White",
    price: 1.8,
    company: "Flavor Fusion",
  },
  {
    id: 4,
    name: "Marjoram",
    color: "Green",
    price: 2.7,
    company: "Herb Haven",
  },
  { id: 5, name: "Paprika", color: "Red", price: 2.2, company: "Spice World" },
  {
    id: 6,
    name: "Bar-B-Q Seasoning",
    color: "Brown",
    price: 3.5,
    company: "Grill Masters",
  },
  {
    id: 7,
    name: "Sage",
    color: "Gray-Green",
    price: 2.9,
    company: "Herb Haven",
  },
  {
    id: 8,
    name: "Parsley",
    color: "Green",
    price: 2.4,
    company: "Flavor Fusion",
  },
  {
    id: 9,
    name: "Thyme Leaves",
    color: "Green",
    price: 2.6,
    company: "Spice World",
  },
];

const SpiceMenuHero = () => {
  return (
    <div className="bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {spices.map((spice) => (
            <div key={spice.id} className="bg-gray-800 p-5 rounded-lg">
              <a
                href={`/catalog/ ${spice.id}`}
                className="text-xl font-bold hover:underline"
              >
                {spice.name}
              </a>
              <p className="text-sm italic">from {spice.company}</p>
              <p className="text-red-500 text-lg font-bold mt-2">
                ${spice.price.toFixed(2)} per 100g
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-lg mb-4">
            Get some spices from these lovely people!
          </p>
          <button className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpiceMenuHero;
