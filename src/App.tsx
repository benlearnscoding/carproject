import { useMemo, useState } from "react";
import { Search, Plus, Star, ChevronRight, Heart, CarFront, UserRound, ArrowLeft, Check } from "lucide-react";
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

function CarDetail({
  car,
  close,
  onRate,
}: {
  car: Car;
  close: () => void;
  onRate: () => void;
}) {
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
            <button className="secondary" onClick={onRate}>
  <Star size={17}/> Rate this car
</button>
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

const ratingCategories = ["Driving", "Sound", "Steering", "Performance", "Comfort", "Looks", "Reliability", "Value"];
type Experience = "owned" | "driven" | "passenger";

function RatingFlow({ car, close, complete }: { car: Car; close: () => void; complete: (score: number) => void }) {
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [scores, setScores] = useState<Record<string, number>>(
    () => Object.fromEntries(ratingCategories.map(category => [category, 8]))
  );
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / ratingCategories.length;

  const updateScore = (category: string, score: number) => {
    setScores(current => ({ ...current, [category]: score }));
  };

  return (
    <div className="modal-backdrop rating-backdrop" onClick={close}>
      <div className="rating-flow" onClick={event => event.stopPropagation()}>
        <div className="rating-topbar">
          {!submitted && step > 1 ? <button className="back" onClick={() => setStep(step - 1)}><ArrowLeft size={18} /> Back</button> : <span />}
          {!submitted && <button className="close" onClick={close}>×</button>}
        </div>

        {submitted ? (
          <div className="rating-success">
            <div className="success-mark"><Check size={25} /></div>
            <p className="eyebrow">RATING SAVED</p>
            <h2>Your experience is now part of the record.</h2>
            <p>Thanks for adding your point of view on the {car.make} {car.model}.</p>
            <button className="primary" onClick={close}>Done</button>
          </div>
        ) : (
          <>
            <div className="rating-progress" aria-label={`Step ${step} of 3`}>
              {[1, 2, 3].map(index => <span key={index} className={index <= step ? "current" : ""} />)}
            </div>
            <div className="rating-heading">
              <p className="eyebrow">RATE · {step} OF 3</p>
              <h2>{step === 1 ? "How do you know this car?" : step === 2 ? "Give it your numbers." : "Leave your mark."}</h2>
              <p>{step === 1 ? `Your context makes a rating for the ${car.make} ${car.model} more useful.` : step === 2 ? "There is no perfect car. Rate the parts that mattered to you." : "A few honest words are often more useful than a perfect score."}</p>
            </div>

            {step === 1 && (
              <div className="experience-options">
                {([
                  ["owned", "I owned one", "It was mine, for a while."],
                  ["driven", "I've driven one", "Enough time behind the wheel to know it."],
                  ["passenger", "I've ridden in one", "Experienced from the other seat."],
                ] as const).map(([value, title, description]) => (
                  <button key={value} className={`experience-option ${experience === value ? "selected" : ""}`} onClick={() => setExperience(value)}>
                    <span className="option-dot" /><span><strong>{title}</strong><small>{description}</small></span>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="score-editor">
                <div className="overall-score"><span>Your overall score</span><strong>{overall.toFixed(1)}</strong><Star size={20} fill="currentColor" /></div>
                {ratingCategories.map(category => (
                  <div className="score-row" key={category}>
                    <span>{category}</span>
                    <div className="score-buttons" aria-label={`${category} score`}>
                      {Array.from({ length: 10 }, (_, index) => index + 1).map(value => (
                        <button key={value} className={value <= scores[category] ? "filled" : ""} onClick={() => updateScore(category, value)} aria-label={`${value} out of 10`} />
                      ))}
                    </div>
                    <strong>{scores[category]}.0</strong>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="review-editor">
                <div className="your-score"><span>Your rating</span><Score value={overall} /></div>
                <label htmlFor="review">What stood out?</label>
                <textarea id="review" value={review} onChange={event => setReview(event.target.value)} maxLength={500} placeholder="What did it feel like to drive, own, or ride in? The details people remember are the ones worth sharing." />
                <div className="review-meta"><span>Optional · be specific, be honest.</span><span>{review.length}/500</span></div>
              </div>
            )}

            <div className="rating-actions">
              <button className="secondary" onClick={close}>Cancel</button>
              {step < 3 ? <button className="primary" disabled={step === 1 && !experience} onClick={() => setStep(step + 1)}>Continue <ChevronRight size={17} /></button> : <button className="primary" onClick={() => { complete(overall); setSubmitted(true); }}><Star size={17} /> Publish rating</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("discover");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Car | null>(null);
  const [ratingCar, setRatingCar] = useState<Car | null>(null);
  const [submittedRatings, setSubmittedRatings] = useState<Record<string, number>>({});

  const displayedCar = (car: Car): Car => {
    const submittedScore = submittedRatings[car.id];
    if (submittedScore === undefined) return car;
    return { ...car, rating: (car.rating * car.ratings + submittedScore) / (car.ratings + 1), ratings: car.ratings + 1 };
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return cars;
    return cars.filter(c => `${c.make} ${c.model} ${c.generation}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="app">
      <header className="nav">
        <button className="logo" onClick={() => setTab("discover")}>DRIVEN<span>•</span></button>
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
              <div className="grid">{filtered.map(car => <CarCard key={car.id} car={displayedCar(car)} onClick={() => setSelected(displayedCar(car))} />)}</div>
            </section>

            <section className="statement">
              <p className="eyebrow">THE IDEA</p>
              <h2>Not a car magazine.<br/><em>A record of experience.</em></h2>
              <p>Professional reviews tell you what a journalist thinks. Driven shows you what people who actually owned and drove the car think.</p>
            </section>
          </>
        )}

        {tab === "cars" && (
          <section className="page-section">
            <p className="eyebrow">DATABASE</p><h1>Explore cars.</h1>
            <div className="search-large"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." /></div>
            <div className="grid">{filtered.map(car => <CarCard key={car.id} car={displayedCar(car)} onClick={() => setSelected(displayedCar(car))} />)}</div>
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

      <footer><span>DRIVEN</span><span>Your automotive taste, documented.</span></footer>
      {selected && (
  <CarDetail
    car={selected}
    close={() => setSelected(null)}
    onRate={() => setRatingCar(selected)}
  />
)}
      {ratingCar && <RatingFlow car={ratingCar} close={() => setRatingCar(null)} complete={(score) => {
        const updatedCar = { ...ratingCar, rating: (ratingCar.rating * ratingCar.ratings + score) / (ratingCar.ratings + 1), ratings: ratingCar.ratings + 1 };
        setSubmittedRatings(current => ({ ...current, [ratingCar.id]: score }));
        setSelected(current => current?.id === ratingCar.id ? updatedCar : current);
      }} />}
    </div>
  );
}
