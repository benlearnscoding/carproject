import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Star, ChevronRight, ChevronDown, Heart, CarFront, UserRound, ArrowLeft, Check, LogOut, X, Eye, EyeOff } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { cars, type Car } from "./data";
import { supabase } from "./supabase";

type Tab = "discover" | "cars" | "profile";
type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
};
type GarageStatus = "owned" | "driven" | "want";
type GarageEntry = {
  id: string;
  carId: string;
  status: GarageStatus;
  createdAt: string;
};
const garageStatusLabels: Record<GarageStatus, string> = { owned: "Owned", driven: "Driven", want: "Want" };
type RatingExperience = "owned" | "driven" | "passenger";
type RatingSubmission = {
  experience: RatingExperience;
  scores: Record<string, number>;
  overall: number;
  review: string;
};
type SavedRating = RatingSubmission & {
  id: string;
  carId: string;
  createdAt: string;
};
type CommunityRating = {
  id: string;
  carId: string;
  overall: number;
  review: string;
  username: string;
  ratedAt: string;
};
type CommunityRatingRow = {
  id: string;
  car_id: string;
  overall: number | string;
  review_preview: string | null;
  username: string;
  rated_at: string;
};
type PublicProfile = {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  joinedAt: string;
};
type PublicProfileRow = {
  first_name: string;
  last_name: string;
  username: string;
  bio: string;
  joined_at: string;
};

const makes = [
  "Alpine",
  "Aston Martin",
  "Audi",
  "BMW",
  "Bugatti",
  "Chevrolet",
  "Ferrari",
  "Lamborghini",
  "Lotus",
  "Maserati",
  "McLaren",
  "Mercedes",
  "Mini",
  "Nissan",
  "Porsche",
  "Toyota",
  "Volkswagen",
];

const profileStorageKey = "driven.profile";

function loadStoredProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = JSON.parse(window.localStorage.getItem(profileStorageKey) || "null");
    if (!saved || !["firstName", "lastName", "email", "username", "bio"].every(key => typeof saved[key] === "string")) return null;
    return saved as UserProfile;
  } catch {
    return null;
  }
}

function profileFromUser(user: User): UserProfile {
  return {
    firstName: String(user.user_metadata.first_name ?? ""),
    lastName: String(user.user_metadata.last_name ?? ""),
    email: user.email ?? "",
    username: String(user.user_metadata.username ?? ""),
    bio: String(user.user_metadata.bio ?? ""),
  };
}

async function loadRemoteProfile(user: User): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("first_name,last_name,username,bio")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return profileFromUser(user);

  return {
    firstName: data.first_name,
    lastName: data.last_name,
    email: user.email ?? "",
    username: data.username,
    bio: data.bio,
  };
}

async function loadGarage(userId: string): Promise<GarageEntry[]> {
  const { data, error } = await supabase
    .from("garage_entries")
    .select("id,car_id,relationship,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(entry => ({
    id: entry.id,
    carId: entry.car_id,
    status: entry.relationship as GarageStatus,
    createdAt: entry.created_at,
  }));
}

async function loadRatings(userId: string): Promise<Record<string, SavedRating>> {
  const { data, error } = await supabase
    .from("car_ratings")
    .select("id,car_id,experience,scores,overall,review,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return Object.fromEntries((data ?? []).map(rating => [rating.car_id, {
    id: rating.id,
    carId: rating.car_id,
    experience: rating.experience as RatingExperience,
    scores: rating.scores as Record<string, number>,
    overall: Number(rating.overall),
    review: rating.review ?? "",
    createdAt: rating.created_at,
  }]));
}

async function loadCommunityRatings(): Promise<CommunityRating[]> {
  const { data, error } = await supabase.rpc("get_recent_community_ratings", { result_limit: 24 });
  if (error) throw error;

  const ratings = (data as CommunityRatingRow[] | null ?? []).map(rating => ({
    id: rating.id,
    carId: rating.car_id,
    overall: Number(rating.overall),
    review: rating.review_preview ?? "",
    username: rating.username,
    ratedAt: rating.rated_at,
  }));

  for (let index = ratings.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [ratings[index], ratings[randomIndex]] = [ratings[randomIndex], ratings[index]];
  }

  return ratings;
}

async function loadPublicProfile(username: string): Promise<PublicProfile> {
  const { data, error } = await supabase.rpc("get_public_profile", { profile_username: username }).single();
  if (error) throw error;
  const profile = data as PublicProfileRow;
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    username: profile.username,
    bio: profile.bio,
    joinedAt: profile.joined_at,
  };
}

function Score({ value }: { value: number }) {
  return (
    <span className="score">
      <Star size={15} fill="currentColor" />
      {value.toFixed(1)}
    </span>
  );
}

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="make-filter" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <span>{label}</span>
      <div className="filter-select">
        <button type="button" className="filter-select-trigger" aria-label={`Filter cars by ${label.toLowerCase()}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(current => !current)}>
          <span>{value || "All"}</span><ChevronDown size={14} />
        </button>
        {open && (
          <div className="filter-menu" role="listbox" aria-label={`${label} options`}>
            {["", ...options].map(option => (
              <button type="button" role="option" aria-selected={value === option} className={value === option ? "selected" : ""} key={option || "all"} onClick={() => { onChange(option); setOpen(false); }}>
                {option || "All"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MakeFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <FilterDropdown label="Make" value={value} options={makes} onChange={onChange} />;
}

function ModelFilter({ make, value, onChange }: { make: string; value: string; onChange: (value: string) => void }) {
  const models = Array.from(new Set(
    cars.filter(car => !make || car.make === make).map(car => car.model)
  )).sort((a, b) => a.localeCompare(b));

  return <FilterDropdown label="Model" value={value} options={models} onChange={onChange} />;
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
  onAdd,
  personalRating,
  profile,
}: {
  car: Car;
  close: () => void;
  onRate: () => void;
  onAdd: () => void;
  personalRating?: SavedRating;
  profile?: UserProfile;
}) {
  const experienceLabel = personalRating?.experience === "owned"
    ? "Owned"
    : personalRating?.experience === "driven"
      ? "Driven"
      : "Passenger";

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
            <button className="primary" onClick={onAdd}><Plus size={17}/> Add to garage</button>
            <button className="secondary" onClick={onRate}>
  <Star size={17}/> Rate this car
</button>
            <button className="secondary"><Heart size={17}/> Want it</button>
          </div>

          {personalRating && (
            <div className="review">
              <div className="review-user">
                <div className="avatar">{profile?.firstName.charAt(0).toUpperCase() || "Y"}</div>
                <div><strong>{profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Your rating"}</strong><small>{experienceLabel}</small></div>
                <Score value={personalRating.overall}/>
              </div>
              {personalRating.review && <p>“{personalRating.review}”</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ratingCategories = ["Driving", "Sound", "Steering", "Performance", "Comfort", "Looks", "Reliability", "Value"];

function RatingFlow({ car, close, complete, initialExperience, initialRating }: { car: Car; close: () => void; complete: (rating: RatingSubmission) => Promise<void>; initialExperience?: RatingExperience; initialRating?: SavedRating }) {
  const [step, setStep] = useState(initialExperience || initialRating ? 2 : 1);
  const [experience, setExperience] = useState<RatingExperience | null>(initialRating?.experience ?? initialExperience ?? null);
  const [scores, setScores] = useState<Record<string, number>>(
    () => Object.fromEntries(ratingCategories.map(category => [category, Number(initialRating?.scores[category] ?? 0)]))
  );
  const [review, setReview] = useState(initialRating?.review ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / ratingCategories.length;
  const scoresComplete = Object.values(scores).every(score => score > 0);

  const updateScore = (category: string, score: number) => {
    setScores(current => ({ ...current, [category]: score }));
  };

  const publish = async () => {
    if (!experience) return;
    setSaving(true);
    setError("");
    try {
      await complete({ experience, scores, overall, review: review.trim() });
      setSubmitted(true);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "We could not save your rating. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop rating-backdrop" onClick={close}>
      <div className="rating-flow" onClick={event => event.stopPropagation()}>
        <div className="rating-topbar">
          {!submitted && step > 1 && !(initialExperience && step === 2) ? <button className="back" onClick={() => setStep(step - 1)}><ArrowLeft size={18} /> Back</button> : <span />}
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
              {step < 3 ? <button className="primary" disabled={(step === 1 && !experience) || (step === 2 && !scoresComplete)} onClick={() => setStep(step + 1)}>Continue <ChevronRight size={17} /></button> : <button className="primary" disabled={saving} onClick={publish}><Star size={17} /> {saving ? "Saving…" : "Publish rating"}</button>}
            </div>
            {error && <p className="auth-error rating-save-error" role="alert">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

function joinedDateLabel(createdAt: string | null) {
  if (!createdAt) return "Driven member";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Driven member";
  return `Joined ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date)}`;
}

function CommunityRatingCard({ rating, car, onClick, onProfile }: { rating: CommunityRating; car: Car; onClick: () => void; onProfile: () => void }) {
  return (
    <article className="car-card community-rating-card">
      <button className="community-car-button" onClick={onClick} aria-label={`Open ${car.make} ${car.model}`}><div className="car-image">
          <img src={car.image} alt={`${car.make} ${car.model}`} />
          <div className="image-score"><Score value={rating.overall} /></div>
        </div></button>
      <div className="card-body">
        <div className="community-rating-meta"><button className="community-profile-link" type="button" onClick={onProfile}>@{rating.username}</button><span>{car.make}</span></div>
        <button className="community-car-copy" onClick={onClick}><h3>{car.model}</h3>{rating.review && <p className="review-preview">“{rating.review}”</p>}</button>
      </div>
    </article>
  );
}

function PublicProfileModal({ username, profile, loading, error, close }: { username: string; profile: PublicProfile | null; loading: boolean; error: string; close: () => void }) {
  return (
    <div className="modal-backdrop profile-backdrop" onClick={close}>
      <div className="profile-creator public-profile" role="dialog" aria-label={`${username}'s profile`} onClick={event => event.stopPropagation()}>
        <button className="close" onClick={close} aria-label="Close public profile">×</button>
        {loading ? <p className="public-profile-state">Loading profile…</p> : error ? <p className="auth-error" role="alert">{error}</p> : profile && (
          <>
            <div className="avatar big">{(profile.firstName || profile.username).charAt(0).toUpperCase()}</div>
            <p className="eyebrow">@{profile.username}</p>
            <h2>{`${profile.firstName} ${profile.lastName}`.trim() || profile.username}</h2>
            <p className="public-profile-joined">{joinedDateLabel(profile.joinedAt)}</p>
            {profile.bio && <p className="public-profile-bio">{profile.bio}</p>}
          </>
        )}
      </div>
    </div>
  );
}

function AddCarModal({
  close,
  add,
  initialCarId,
  initialStatus,
}: {
  close: () => void;
  add: (carId: string, status: GarageStatus) => Promise<void>;
  initialCarId?: string;
  initialStatus?: GarageStatus;
}) {
  const initialCar = cars.find(car => car.id === initialCarId);
  const [step, setStep] = useState<1 | 2>(initialStatus ? 2 : 1);
  const [make, setMake] = useState(initialCar?.make ?? "");
  const [model, setModel] = useState(initialCar?.model ?? "");
  const [status, setStatus] = useState<GarageStatus | null>(initialStatus ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const makeOptions = Array.from(new Set(cars.map(car => car.make))).sort((a, b) => a.localeCompare(b));
  const modelOptions = Array.from(new Set(cars.filter(car => car.make === make).map(car => car.model))).sort((a, b) => a.localeCompare(b));
  const selectedCar = cars.find(car => car.make === make && car.model === model);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 1) return;
    if (!selectedCar || !status) return;
    setBusy(true);
    setError("");
    try {
      await add(selectedCar.id, status);
      close();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not add this car. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop profile-backdrop" onClick={close}>
      <div className="profile-creator garage-creator" onClick={event => event.stopPropagation()}>
        <button className="close" onClick={close} aria-label="Close add car form">×</button>
        <p className="eyebrow">YOUR GARAGE</p>
        <h2>{step === 1 ? "How does this car fit your story?" : "Choose your car."}</h2>
        <p className="profile-intro">{step === 1 ? "Tell the community about your relationship with the car." : "Select the make and model to finish adding it to your garage."}</p>
        <form onSubmit={submit}>
          {step === 1 ? (
            <fieldset className="garage-status-fieldset">
              <legend>Relationship</legend>
              <div className="garage-status-options">
                {([
                  ["owned", "Owned", "It was or is yours."],
                  ["driven", "Driven", "You spent time behind the wheel."],
                  ["want", "Want", "It belongs on your shortlist."],
                ] as const).map(([value, label, description]) => (
                  <button type="button" key={value} className={status === value ? "selected" : ""} onClick={() => { setStatus(value); setStep(2); }}>
                    <span className="option-dot" /><span><strong>{label}</strong><small>{description}</small></span>
                  </button>
                ))}
              </div>
            </fieldset>
          ) : (
            <>
              <div className="garage-car-fields">
                <FilterDropdown label="Make" value={make} options={makeOptions} onChange={nextMake => { setMake(nextMake); setModel(""); }} />
                <FilterDropdown label="Model" value={model} options={modelOptions} onChange={setModel} />
              </div>
              {selectedCar && <div className="garage-preview"><img src={selectedCar.image} alt="" /><div><span>{selectedCar.make} · {selectedCar.generation}</span><strong>{selectedCar.model}</strong></div></div>}
            </>
          )}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="rating-actions garage-form-actions">
            <button type="button" className="secondary" onClick={close}>Cancel</button>
            {step === 2 && <button className="primary" type="submit" disabled={!selectedCar || busy}>{busy ? "Adding…" : "Add to garage"} <Plus size={17}/></button>}
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateProfile({
  close,
  save,
  signIn,
  profile,
  authenticated,
}: {
  close: () => void;
  save: (profile: UserProfile, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  profile: UserProfile | null;
  authenticated: boolean;
}) {
  const [signingIn, setSigningIn] = useState(!authenticated);
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (signingIn) {
        await signIn(email.trim(), password);
        close();
      } else {
        const confirmationRequired = await save(
          { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), username: username.trim().replace(/^@/, ""), bio: bio.trim() },
          password,
        );
        if (confirmationRequired) {
          setConfirmationEmail(email.trim());
        } else {
          close();
        }
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const passwordRequired = signingIn || !authenticated;
  const formValid = signingIn
    ? Boolean(email.trim() && password)
    : Boolean(firstName.trim() && lastName.trim() && email.trim() && username.trim() && (!passwordRequired || password));

  return (
    <div className="modal-backdrop profile-backdrop" onClick={close}>
      <div className="profile-creator" onClick={event => event.stopPropagation()}>
        <button className="close" onClick={close} aria-label="Close profile creator">×</button>
        {confirmationEmail ? (
          <div className="profile-confirmation" role="status">
            <div className="confirmation-icon"><Check size={25}/></div>
            <p className="eyebrow">ONE LAST STEP</p>
            <h2>Confirm your email.</h2>
            <p>We sent a confirmation link to <strong>{confirmationEmail}</strong>. Open that email and follow the link to activate your Driven account.</p>
            <button className="primary" type="button" onClick={close}>Got it</button>
          </div>
        ) : (
          <>
        <p className="eyebrow">{signingIn ? "WELCOME BACK" : authenticated ? "EDIT PROFILE" : "JOIN DRIVEN"}</p>
        <h2>{signingIn ? "Return to your garage." : authenticated ? "Refine your automotive identity." : "Your automotive identity starts here."}</h2>
        <p className="profile-intro">{signingIn ? "Sign in with the email and password you used to join." : "Your account and profile will be securely stored with Supabase."}</p>
        <form onSubmit={submit}>
          {!signingIn && <label>First name<input value={firstName} onChange={event => setFirstName(event.target.value)} placeholder="Your first name" autoFocus /></label>}
          {!signingIn && <label>Last name<input value={lastName} onChange={event => setLastName(event.target.value)} placeholder="Your last name" /></label>}
          <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" autoFocus={signingIn} /></label>
          {!signingIn && <label>Username<input value={username} onChange={event => setUsername(event.target.value)} placeholder="yourusername" autoComplete="username" /></label>}
          <label>Password {!passwordRequired && <small>Optional — only enter to change it</small>}<span className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder={signingIn ? "Your password" : authenticated ? "Leave blank to keep your password" : "Create a password"} autoComplete={signingIn ? "current-password" : "new-password"} /><button type="button" className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(current => !current)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}<span>{showPassword ? "Hide" : "Show"}</span></button></span></label>
          {!signingIn && <label>About you <small>Optional</small><textarea value={bio} onChange={event => setBio(event.target.value)} maxLength={180} placeholder="What do you love to drive?" /></label>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="profile-form-footer"><span>{signingIn ? "Secure sign in" : `${bio.length}/180`}</span><button className="primary" type="submit" disabled={!formValid || busy}>{busy ? "Please wait…" : signingIn ? "Sign in" : authenticated ? "Save profile" : "Create account"} <ChevronRight size={17} /></button></div>
          {!authenticated && <button className="auth-switch" type="button" onClick={() => { setSigningIn(current => !current); setError(""); }}>{signingIn ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</button>}
        </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("discover");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selected, setSelected] = useState<Car | null>(null);
  const [selectedGarageExperience, setSelectedGarageExperience] = useState<RatingExperience | undefined>();
  const [ratingCar, setRatingCar] = useState<Car | null>(null);
  const [savedRatings, setSavedRatings] = useState<Record<string, SavedRating>>({});
  const [communityRatings, setCommunityRatings] = useState<CommunityRating[]>([]);
  const [communityRatingsLoading, setCommunityRatingsLoading] = useState(true);
  const [publicProfileUsername, setPublicProfileUsername] = useState<string | null>(null);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
  const [publicProfileLoading, setPublicProfileLoading] = useState(false);
  const [publicProfileError, setPublicProfileError] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(loadStoredProfile);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authUserCreatedAt, setAuthUserCreatedAt] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState("");
  const [garageEntries, setGarageEntries] = useState<GarageEntry[]>([]);
  const [addingCar, setAddingCar] = useState(false);
  const [garageSeedCarId, setGarageSeedCarId] = useState<string | undefined>();
  const [garageSeedStatus, setGarageSeedStatus] = useState<GarageStatus | undefined>();

  const refreshCommunityRatings = useCallback(async (showLoading = false) => {
    if (showLoading) setCommunityRatingsLoading(true);
    try {
      setCommunityRatings(await loadCommunityRatings());
    } finally {
      if (showLoading) setCommunityRatingsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const applyUser = async (user: User | null) => {
      if (!active) return;
      setAuthUserId(user?.id ?? null);
      setAuthUserCreatedAt(user?.created_at ?? null);
      if (!user) {
        setGarageEntries([]);
        setSavedRatings({});
        return;
      }

      try {
        const [remoteProfile, remoteGarage, remoteRatings] = await Promise.all([loadRemoteProfile(user), loadGarage(user.id), loadRatings(user.id)]);
        if (!active) return;
        setProfile(remoteProfile);
        setGarageEntries(remoteGarage);
        setSavedRatings(remoteRatings);
        window.localStorage.removeItem(profileStorageKey);
      } catch (profileError) {
        if (active) setAuthNotice(profileError instanceof Error ? profileError.message : "We could not load your profile.");
      }
    };

    supabase.auth.getUser().then(({ data }) => applyUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => applyUser(session?.user ?? null), 0);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = (showLoading = false) => {
      if (showLoading) setCommunityRatingsLoading(true);
      loadCommunityRatings()
        .then(ratings => { if (active) setCommunityRatings(ratings); })
        .catch(() => { if (active && showLoading) setCommunityRatings([]); })
        .finally(() => { if (active && showLoading) setCommunityRatingsLoading(false); });
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    refresh(true);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 30000);

    return () => {
      active = false;
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    if (tab === "discover" && !communityRatingsLoading) {
      refreshCommunityRatings().catch(() => undefined);
    }
  }, [tab, communityRatingsLoading, refreshCommunityRatings]);

  const saveProfile = async (newProfile: UserProfile, password: string) => {
    const userMetadata = {
      first_name: newProfile.firstName,
      last_name: newProfile.lastName,
      username: newProfile.username,
      bio: newProfile.bio,
    };

    if (!authUserId) {
      const { data, error } = await supabase.auth.signUp({
        email: newProfile.email,
        password,
        options: { data: userMetadata, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error("An account already exists with this email. Sign in instead.");
      }

      setProfile(newProfile);
      window.localStorage.setItem(profileStorageKey, JSON.stringify(newProfile));
      setAuthNotice(data.session ? "Your Driven account is ready." : "Account created. Check your email to confirm it, then sign in.");
      return !data.session;
    }

    const userUpdate = {
      email: newProfile.email,
      data: userMetadata,
      ...(password ? { password } : {}),
    };
    const { error: authError } = await supabase.auth.updateUser(userUpdate);
    if (authError) throw authError;

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authUserId,
      first_name: newProfile.firstName,
      last_name: newProfile.lastName,
      username: newProfile.username,
      bio: newProfile.bio,
      updated_at: new Date().toISOString(),
    });
    if (profileError) throw profileError;

    setProfile(newProfile);
    setAuthNotice("Profile updated.");
    return false;
  };

  const openPublicProfile = async (username: string) => {
    setPublicProfileUsername(username);
    setPublicProfile(null);
    setPublicProfileError("");
    setPublicProfileLoading(true);
    try {
      setPublicProfile(await loadPublicProfile(username));
    } catch {
      setPublicProfileError("We couldn't load this profile. Please try again.");
    } finally {
      setPublicProfileLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const [remoteProfile, remoteGarage, remoteRatings] = await Promise.all([loadRemoteProfile(data.user), loadGarage(data.user.id), loadRatings(data.user.id)]);
    setAuthUserId(data.user.id);
    setAuthUserCreatedAt(data.user.created_at);
    setProfile(remoteProfile);
    setGarageEntries(remoteGarage);
    setSavedRatings(remoteRatings);
    window.localStorage.removeItem(profileStorageKey);
    setAuthNotice("Welcome back to Driven.");
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setAuthNotice(error.message);
    setAuthUserId(null);
    setAuthUserCreatedAt(null);
    setProfile(null);
    setGarageEntries([]);
    setSavedRatings({});
    window.localStorage.removeItem(profileStorageKey);
    setTab("discover");
  };

  const openAddCar = (carId?: string) => {
    if (!authUserId) {
      setAuthNotice("Create or sign in to your Driven account before adding cars to your garage.");
      setCreatingProfile(true);
      return;
    }
    setGarageSeedCarId(carId);
    const existingStatus = garageEntries.find(entry => entry.carId === carId)?.status;
    const ratedExperience = carId ? savedRatings[carId]?.experience : undefined;
    const ratedStatus = ratedExperience === "owned" || ratedExperience === "driven" ? ratedExperience : undefined;
    setGarageSeedStatus(existingStatus ?? ratedStatus);
    setAddingCar(true);
  };

  const openRating = (car: Car) => {
    if (!authUserId) {
      setAuthNotice("Log in or create a Driven account to rate a car.");
      setCreatingProfile(true);
      return;
    }

    setRatingCar(car);
  };

  const addCarToGarage = async (carId: string, status: GarageStatus) => {
    if (!authUserId) throw new Error("Please sign in before adding a car.");
    const { data, error } = await supabase
      .from("garage_entries")
      .upsert({ user_id: authUserId, car_id: carId, relationship: status }, { onConflict: "user_id,car_id" })
      .select("id,car_id,relationship,created_at")
      .single();
    if (error) throw error;

    const savedEntry: GarageEntry = {
      id: data.id,
      carId: data.car_id,
      status: data.relationship as GarageStatus,
      createdAt: data.created_at,
    };
    setGarageEntries(current => [savedEntry, ...current.filter(entry => entry.carId !== carId)]);
    const savedCar = cars.find(car => car.id === carId);
    setAuthNotice(`${savedCar?.make ?? "Car"} ${savedCar?.model ?? ""} added to your garage.`.trim());
  };

  const saveCarRating = async (carId: string, rating: RatingSubmission) => {
    if (!authUserId) throw new Error("Create or sign in to your Driven account to save ratings to your profile.");
    const { data, error } = await supabase
      .from("car_ratings")
      .upsert({
        user_id: authUserId,
        car_id: carId,
        experience: rating.experience,
        scores: rating.scores,
        overall: rating.overall,
        review: rating.review,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,car_id" })
      .select("id,car_id,experience,scores,overall,review,created_at")
      .single();
    if (error) throw error;

    const savedRating: SavedRating = {
      id: data.id,
      carId: data.car_id,
      experience: data.experience as RatingExperience,
      scores: data.scores as Record<string, number>,
      overall: Number(data.overall),
      review: data.review ?? "",
      createdAt: data.created_at,
    };
    setSavedRatings(current => ({ ...current, [carId]: savedRating }));
    refreshCommunityRatings().catch(() => undefined);
    const ratedCar = cars.find(car => car.id === carId);
    setAuthNotice(`Your ${savedRating.overall.toFixed(1)} rating for ${ratedCar?.make ?? "this car"} ${ratedCar?.model ?? ""} is saved.`.trim());
  };

  const displayedCar = (car: Car): Car => {
    const submittedScore = savedRatings[car.id]?.overall;
    if (submittedScore === undefined) return car;
    return { ...car, rating: (car.rating * car.ratings + submittedScore) / (car.ratings + 1), ratings: car.ratings + 1 };
  };

  const filtered = useMemo(() => {
    return cars.filter(car => {
      const matchesMake = !selectedMake || car.make === selectedMake;
      const matchesModel = !selectedModel || car.model === selectedModel;
      return matchesMake && matchesModel;
    });
  }, [selectedMake, selectedModel]);

  const garageCars = garageEntries.flatMap(entry => {
    const car = cars.find(candidate => candidate.id === entry.carId);
    return car ? [{ entry, car }] : [];
  });
  const drivenCount = garageEntries.filter(entry => entry.status === "driven" || entry.status === "owned").length;
  const ownedCount = garageEntries.filter(entry => entry.status === "owned").length;
  const garageBrands = new Set(garageCars.map(({ car }) => car.make)).size;
  const ratedCars = Object.values(savedRatings).flatMap(rating => {
    const car = cars.find(candidate => candidate.id === rating.carId);
    return car ? [{ rating, car }] : [];
  });
  const garageCarIds = new Set(garageCars.map(({ car }) => car.id));
  const profileCars = [
    ...garageCars.map(({ entry, car }) => ({ entry, car, rating: savedRatings[car.id] })),
    ...ratedCars
      .filter(({ car }) => !garageCarIds.has(car.id))
      .map(({ rating, car }) => ({ entry: null, car, rating })),
  ];
  const averagePersonalRating = ratedCars.length
    ? ratedCars.reduce((sum, { rating }) => sum + rating.overall, 0) / ratedCars.length
    : null;
  const filteredCommunityRatings = communityRatings.flatMap(rating => {
    const car = cars.find(candidate => candidate.id === rating.carId);
    if (!car || (selectedMake && car.make !== selectedMake) || (selectedModel && car.model !== selectedModel)) return [];
    return [{ rating, car }];
  }).slice(0, 12);

  return (
    <div className="app">
      <header className="nav">
        <button className="logo" onClick={() => setTab("discover")}>DRIVEN<span>•</span></button>
        <nav>
          <button className={tab === "discover" ? "active" : ""} onClick={() => setTab("discover")}>Discover</button>
          <button className={tab === "cars" ? "active" : ""} onClick={() => setTab("cars")}>Cars</button>
          <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>My garage</button>
        </nav>
        <div className="profile-actions">
          <button className="profile-button" onClick={() => authUserId ? setTab("profile") : setCreatingProfile(true)}><UserRound size={18}/><span>{authUserId && profile?.firstName ? profile.firstName : "Create profile"}</span></button>
          {authUserId && <button className="logout-button" onClick={logOut}><LogOut size={17}/><span>Log out</span></button>}
        </div>
      </header>

      {authNotice && <div className="auth-notice" role="status"><span>{authNotice}</span><button type="button" aria-label="Dismiss message" onClick={() => setAuthNotice("")}>×</button></div>}

      <main>
        {tab === "discover" && (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">THE SOCIAL DATABASE FOR CAR PEOPLE</p>
                <h1>Your automotive taste,<br/><em>documented.</em></h1>
                <p className="hero-copy">Rate the cars you've owned. Log the ones you've driven. Build your garage. Discover what other enthusiasts actually think.</p>
              </div>
              <div className="hero-filters">
                <div className="classification-filters">
                  <MakeFilter value={selectedMake} onChange={make => { setSelectedMake(make); setSelectedModel(""); }} />
                  <div className="model-filter-row">
                    <ModelFilter make={selectedMake} value={selectedModel} onChange={setSelectedModel} />
                    <button className="filter-reset" type="button" aria-label="Reset all car filters" title="Reset filters" disabled={!selectedMake && !selectedModel} onClick={() => { setSelectedMake(""); setSelectedModel(""); }}><X size={17}/></button>
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-head"><div><p className="eyebrow">COMMUNITY</p><h2>Cars people are talking about</h2></div><button className="text-button">View all <ChevronRight size={16}/></button></div>
              {communityRatingsLoading ? (
                <p className="community-empty">Loading recent ratings…</p>
              ) : filteredCommunityRatings.length ? (
                <div className="grid">{filteredCommunityRatings.map(({ rating, car }) => <CommunityRatingCard key={rating.id} rating={rating} car={displayedCar(car)} onProfile={() => openPublicProfile(rating.username)} onClick={() => { setSelectedGarageExperience(undefined); setSelected(displayedCar(car)); }} />)}</div>
              ) : (
                <p className="community-empty">No recent ratings match these filters yet.</p>
              )}
            </section>

            <section className="statement">
              <p className="eyebrow">THE IDEA</p>
              <h2>Not a car magazine.<br/><em>A record of experience.</em></h2>
              <p>Whether you own, drive, dream about cars your point of view is worth the share. Welcome to Driven, the one stop shop for car fanatics.</p>
            </section>
          </>
        )}

        {tab === "cars" && (
          <section className="page-section">
            <p className="eyebrow">DATABASE</p><h1>Explore cars.</h1>
            <div className="catalog-filters">
              <div className="classification-filters">
                <MakeFilter value={selectedMake} onChange={make => { setSelectedMake(make); setSelectedModel(""); }} />
                <div className="model-filter-row">
                  <ModelFilter make={selectedMake} value={selectedModel} onChange={setSelectedModel} />
                  <button className="filter-reset" type="button" aria-label="Reset all car filters" title="Reset filters" disabled={!selectedMake && !selectedModel} onClick={() => { setSelectedMake(""); setSelectedModel(""); }}><X size={17}/></button>
                </div>
              </div>
            </div>
            <div className="grid">{filtered.map(car => <CarCard key={car.id} car={displayedCar(car)} onClick={() => { setSelectedGarageExperience(undefined); setSelected(displayedCar(car)); }} />)}</div>
          </section>
        )}

        {tab === "profile" && (
          profile ? (
            <section className="profile-page">
              <div className="profile-hero"><div className="avatar big">{profile.firstName.charAt(0).toUpperCase()}</div><div><p className="eyebrow">@{profile.username}</p><h1>{profile.firstName} {profile.lastName}</h1><p>{authUserId ? joinedDateLabel(authUserCreatedAt) : "Saved on this device only"}</p></div><button className="secondary profile-edit" onClick={() => setCreatingProfile(true)}>{authUserId ? "Edit profile" : "Create account"}</button></div>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              <div className="profile-stats"><div><strong>{drivenCount}</strong><span>Driven</span></div><div><strong>{ownedCount}</strong><span>Owned</span></div><div><strong>{garageBrands}</strong><span>Brands</span></div><div><strong>{averagePersonalRating === null ? "—" : averagePersonalRating.toFixed(1)}</strong><span>Avg. rating</span></div></div>
              <div className="section-head"><div><p className="eyebrow">YOUR GARAGE</p><h2>Cars you've experienced</h2></div><button className="primary" onClick={() => openAddCar()}><Plus size={17}/> Add car</button></div>
              {profileCars.length ? (
                <div className="garage-grid">
                  {profileCars.map(({ entry, car, rating }) => {
                    const relationship = entry
                      ? garageStatusLabels[entry.status]
                      : rating?.experience === "passenger"
                        ? "Passenger"
                        : rating
                          ? garageStatusLabels[rating.experience]
                          : "";
                    return (
                      <button className="garage-card" key={entry?.id ?? rating?.id ?? car.id} onClick={() => { setSelectedGarageExperience(entry?.status === "owned" || entry?.status === "driven" ? entry.status : rating?.experience); setSelected(displayedCar(car)); }}>
                        <img src={car.image} alt={`${car.make} ${car.model}`} />
                        <div>
                          <span className="garage-status">{relationship}</span>
                          {rating && <span className="garage-rating"><Star size={11} fill="currentColor"/> {rating.overall.toFixed(1)}</span>}
                          <p>{car.make} · {car.generation}</p><h3>{car.model}</h3>
                          <small>{car.year} · {car.transmission}{rating ? " · Your grade" : ""}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-garage"><CarFront size={32}/><h3>Your garage starts here.</h3><p>Add cars you've owned or driven and start building your automotive identity.</p><button className="secondary" onClick={() => openAddCar()}><Plus size={17}/> Add your first car</button></div>
              )}
            </section>
          ) : (
            <section className="profile-page profile-start">
              <p className="eyebrow">YOUR GARAGE</p>
              <h1>Your history starts with <em>you.</em></h1>
              <p>Set up your profile to collect the cars you’ve owned, driven, and want next.</p>
              <button className="primary" onClick={() => setCreatingProfile(true)}><UserRound size={17}/> Create your profile</button>
            </section>
          )
        )}
      </main>

      <footer><span>DRIVEN</span><span>Your automotive taste, documented.</span></footer>
      {selected && (
  <CarDetail
    car={selected}
    close={() => { setSelected(null); setSelectedGarageExperience(undefined); }}
    onRate={() => openRating(selected)}
    onAdd={() => { openAddCar(selected.id); setSelected(null); }}
    personalRating={savedRatings[selected.id]}
    profile={profile ?? undefined}
  />
)}
      {ratingCar && <RatingFlow car={ratingCar} initialExperience={selectedGarageExperience ?? savedRatings[ratingCar.id]?.experience} initialRating={savedRatings[ratingCar.id]} close={() => setRatingCar(null)} complete={async (rating) => {
        await saveCarRating(ratingCar.id, rating);
        const updatedCar = { ...ratingCar, rating: (ratingCar.rating * ratingCar.ratings + rating.overall) / (ratingCar.ratings + 1), ratings: ratingCar.ratings + 1 };
        setSelected(current => current?.id === ratingCar.id ? updatedCar : current);
      }} />}
      {creatingProfile && <CreateProfile profile={profile} authenticated={Boolean(authUserId)} close={() => setCreatingProfile(false)} save={saveProfile} signIn={signIn} />}
      {addingCar && <AddCarModal initialCarId={garageSeedCarId} initialStatus={garageSeedStatus} close={() => setAddingCar(false)} add={addCarToGarage} />}
      {publicProfileUsername && <PublicProfileModal username={publicProfileUsername} profile={publicProfile} loading={publicProfileLoading} error={publicProfileError} close={() => { setPublicProfileUsername(null); setPublicProfile(null); setPublicProfileError(""); }} />}
    </div>
  );
}
