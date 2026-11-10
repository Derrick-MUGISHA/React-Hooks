import { CountrySearch } from "./CountrySearch";
import NewPostForm from "./NewPostForm";
import UserList from "./UserList";
import "./web.css";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#explore">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Atlas home"><span className="brand-mark">a</span>atlas<span className="brand-dot">.</span></a>
        <nav aria-label="Main navigation">
          <a href="#explore">Explore</a>
          <a href="#community">Community</a>
          <a className="nav-action" href="#publish">Create a post <span aria-hidden="true">↗</span></a>
        </nav>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> A LITTLE CURIOSITY GOES A LONG WAY</p>
            <h1 id="hero-title">A world of discovery.<br /><em>One place to start.</em></h1>
            <p className="hero-description">Find a country, meet the community, and share a thought.<br className="desktop-break" /> Your next discovery starts right here.</p>
            <a className="hero-link" href="#explore">Let’s explore <span aria-hidden="true">↓</span></a>
          </div>
          <div className="globe-art" aria-hidden="true">
            <span className="orbit orbit-one" /><span className="orbit orbit-two" />
            <svg viewBox="0 0 300 300" className="globe"><defs><clipPath id="globe-clip"><circle cx="150" cy="150" r="112" /></clipPath></defs><circle cx="150" cy="150" r="112" fill="#dce7cf" /><g clipPath="url(#globe-clip)" fill="none" stroke="#9bb5a3" strokeWidth="1"><ellipse cx="150" cy="150" rx="60" ry="112" /><ellipse cx="150" cy="150" rx="98" ry="112" /><path d="M38 150h224M48 105h204M48 195h204M70 65h160M70 235h160M150 38v224" /></g><g clipPath="url(#globe-clip)" fill="#467967"><path d="m57 83 34-18 31 12 10 24-18 13-8 23-24-3-10-23-20-5ZM113 140l27-7 24 14 13 32-16 26-7 35-18-11-7-41-20-22ZM181 57l41 16 36 30 14 35-27 9-23-19-25 6-12-21-27-9 4-23ZM212 185l29-9 22 21-10 22-36-4-17-13Z" /></g><circle cx="150" cy="150" r="112" fill="none" stroke="#779785" /></svg>
            <span className="globe-label">SO MUCH TO EXPLORE <span>↗</span></span>
            <span className="coordinate">01°56′ S &nbsp; 30°03′ E</span>
          </div>
        </section>
        <div className="workspace">
          <CountrySearch />
          <aside className="publish-panel panel" id="publish">
            <div className="section-kicker">YOUR CORNER OF THE WORLD</div>
            <h2>Something on your mind?</h2>
            <p className="section-description">Every conversation starts with a thought. Share yours with the community.</p>
            <NewPostForm />
          </aside>
        </div>
        <section className="community-section" id="community" aria-labelledby="community-title">
          <div className="section-heading"><div><p className="section-kicker">GOOD PEOPLE, NEW PERSPECTIVES</p><h2 id="community-title">Meet the community<span className="heading-dot">.</span></h2></div><span className="community-note">A few faces from our little world</span></div>
          <UserList />
        </section>
      </main>
      <footer><a className="brand footer-brand" href="#">atlas<span className="brand-dot">.</span></a><p>Stay curious. There’s always more to discover.</p><a href="#explore">Back to exploring ↑</a></footer>
    </>
  );
}
