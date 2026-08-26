export type Car = {
  id: string;
  make: string;
  model: string;
  generation: string;
  year: number;
  image: string;
  rating: number;
  ratings: number;
  driven: number;
  owners: number;
  tags: string[];
};

export const cars: Car[] = [
  {
    id: "r8-v8",
    make: "Audi",
    model: "R8 V8",
    generation: "Type 42",
    year: 2012,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    rating: 9.1,
    ratings: 842,
    driven: 1190,
    owners: 284,
    tags: ["V8", "Manual", "Analog", "Weekend"],
  },
  {
    id: "997-carrera-s",
    make: "Porsche",
    model: "911 Carrera S",
    generation: "997.2",
    year: 2010,
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    rating: 9.3,
    ratings: 1240,
    driven: 1860,
    owners: 412,
    tags: ["Flat-6", "Manual", "Classic", "Driver"],
  },
  {
    id: "m3-e46",
    make: "BMW",
    model: "M3",
    generation: "E46",
    year: 2004,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    rating: 9.2,
    ratings: 2184,
    driven: 3020,
    owners: 690,
    tags: ["Straight-6", "Manual", "Icon", "Driver"],
  },
  {
    id: "a110",
    make: "Alpine",
    model: "A110",
    generation: "Pure",
    year: 2022,
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
    rating: 8.8,
    ratings: 524,
    driven: 810,
    owners: 156,
    tags: ["Lightweight", "Turbo", "French", "Fun"],
  },
];