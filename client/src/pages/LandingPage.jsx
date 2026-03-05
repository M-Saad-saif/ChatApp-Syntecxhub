import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div style={{alignItems:"center"}}>

        <img src="/chating.png" alt="" style={{width:"29px"}} />
        <span className="landing-logo">ChitChat</span>
        </div>
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-ghost btn-sm">
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="landing-badge">Real-time messaging</div>
        <h1 className="landing-headline">
          Conversations that
          <br />
          <em>actually flow.</em>
        </h1>
        <p className="landing-sub">
          1-to-1 chats, group rooms, typing indicators — built for teams who
          care about clarity and speed.
        </p>
        <div className="landing-cta">
          <Link to="/signup" className="btn btn-primary">
            Create account
          </Link>
          <Link to="/login" className="btn btn-ghost">
            Sign in
          </Link>
        </div>
      </main>

      <div className="landing-features">
        {[
          {
            icon: "⚡",
            title: "Real-time",
            desc: "Messages arrive instantly via WebSocket",
          },
          {
            icon: "🔒",
            title: "Secure",
            desc: "JWT auth + bcrypt password hashing",
          },
          {
            icon: "👥",
            title: "Groups",
            desc: "Create group chats with multiple members",
          },
          {
            icon: "✓",
            title: "Read receipts",
            desc: "Know when messages are seen",
          },
        ].map((f) => (
          <div key={f.title} className="landing-feature-card">
            <div className="landing-feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
