import { useMemo, useState } from "react";
import { Search, Plus, Star, ChevronRight, Heart, CarFront, UserRound } from "lucide-react";
import { cars, type Car } from "./data";

type Tab = "discover" | "cars" | "profile";

function Score({ value }: { value: number }) {
  return (
    <span className="score">
      <Star size={15} fill="currentColor" />
      {value.toFixed(1)}
    </span>
  );
}

function CarCard({ car, onClick }: { car: Car; onClick: () => void }) {
  return (
    <button className="car-card" onClick={onClick}>
      <div className="car-image">
        <img src={car.image} alt={`${car.make} ${car.model}`} />
        <div className="image-score"><Score value={car.rating} /></div>
      </div>
      <div className="card-body">
        <div className="eyebrow">{car.make} · {car.generation}</div>
        <h3>{car.model}</h3>
        <p>{car.ratings.toLocaleString()} ratings · {car.owners} owners</p>
      </div>
    </button>
  );
}

function CarDetail({ car, close }: { car: Car; close: () => void }) {
  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="detail" onClick={(e) => e.stopPropagation()}>
        <img className="detail-image" src={car.image} alt="" />
        <div className="detail-content">
          <button className="close" onClick={close}>×</button>
          <div className="eyebrow">{car.make} · {car.generation} · {car.year}</div>
          <div className="detail-title">
            <div>
              <h1>{car.model}</h1>
              <p>{car.driven.toLocaleString()} people have driven one · {car.owners} owners</p>
            </div>
            <div className="big-score"><Score value={car.rating} /><small>{car.ratings.toLocaleString()} ratings</small></div>
          </div>

          <div className="tags">{car.tags.map(tag => <span key={tag}>{tag}</span>)}</div>

          <div className="rating-grid">
            {[
              ["Driving", 9.4], ["Sound", 9.5], ["Steering", 9.1],
              ["Performance", 9.0], ["Comfort", 7.7], ["Looks", 9.3],
              ["Reliability", 8.4], ["Value", 8.6],
            ].map(([label, value]) => (
              <div className="metric" key={String(label)}>
                <span>{label}</span><strong>{Number(value).toFixed(1)}</strong>
              </div>
            ))}
          </div>

          <div className="actions">
            <button className="primary"><Plus size={17}/> Add to garage</button>
            <button className="secondary"><Star size={17}/> Rate this car</button>
            <button className="secondary"><Heart size={17}/> Want it</button>
          </div>

          <div className="review">
            <div className="review-user"><div className="avatar">B</div><div><strong>Benjamin</strong><small>Owned · 3 years</small></div><Score value={9.4}/></div>
            <p>"One of those cars that feels special every time you start it. The engine and steering are the reason I'd keep it forever."</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("discover");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Car | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return cars;
    return cars.filter(c => `${c.make} ${c.model} ${c.generation}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="app">
      <header className="nav">
        <button className="logo" onClick={() => setTab("discover")}>CARDB<span>•</span></button>
        <nav>
          <button className={tab === "discover" ? "active" : ""} onClick={() => setTab("discover")}>Discover</button>
          <button className={tab === "cars" ? "active" : ""} onClick={() => setTab("cars")}>Cars</button>
          <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>My garage</button>
        </nav>
        <button className="profile-button" onClick={() => setTab("profile")}><UserRound size={18}/><span>Benjamin</span></button>
      </header>

      <main>
        {tab === "discover" && (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">THE SOCIAL DATABASE FOR CAR PEOPLE</p>
                <h1>Your automotive taste,<br/><em>documented.</em></h1>
                <p className="hero-copy">Rate the cars you've owned. Log the ones you've driven. Build your garage. Discover what other enthusiasts actually think.</p>
              </div>
              <div className="hero-search">
                <Search size={19}/>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a car, make or generation..." />
              </div>
            </section>

            <section className="section">
              <div className="section-head"><div><p className="eyebrow">COMMUNITY</p><h2>Cars people are talking about</h2></div><button className="text-button">View all <ChevronRight size={16}/></button></div>
              <div className="grid">{filtered.map(car => <CarCard key={car.id} car={car} onClick={() => setSelected(car)} />)}</div>
            </section>

            <section className="statement">
              <p className="eyebrow">THE IDEA</p>
              <h2>Not a car magazine.<br/><em>A record of experience.</em></h2>
              <p>Professional reviews tell you what a journalist thinks. CARDB shows you what people who actually owned and drove the car think.</p>
            </section>
          </>
        )}

        {tab === "cars" && (
          <section className="page-section">
            <p className="eyebrow">DATABASE</p><h1>Explore cars.</h1>
            <div className="search-large"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." /></div>
            <div className="grid">{filtered.map(car => <CarCard key={car.id} car={car} onClick={() => setSelected(car)} />)}</div>
          </section>
        )}

        {tab === "profile" && (
          <section className="profile-page">
            <div className="profile-hero"><div className="avatar big">B</div><div><p className="eyebrow">PROFILE</p><h1>Benjamin</h1><p>Car enthusiast · 8 cars owned · 47 driven</p></div></div>
            <div className="profile-stats"><div><strong>47</strong><span>Driven</span></div><div><strong>8</strong><span>Owned</span></div><div><strong>21</strong><span>Brands</span></div><div><strong>9.1</strong><span>Avg. rating</span></div></div>
            <div className="section-head"><div><p className="eyebrow">YOUR GARAGE</p><h2>Cars you've experienced</h2></div><button className="primary"><Plus size={17}/> Add car</button></div>
            <div className="empty-garage"><CarFront size={32}/><h3>Your garage starts here.</h3><p>Add cars you've owned or driven and start building your automotive identity.</p><button className="secondary"><Plus size={17}/> Add your first car</button></div>
          </section>
        )}
      </main>

      <footer><span>CARDB</span><span>Your automotive taste, documented.</span></footer>
      {selected && <CarDetail car={selected} close={() => setSelected(null)} />}
    </div>
  );
}