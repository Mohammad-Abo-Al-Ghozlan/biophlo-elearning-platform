import { useId, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import "../../styles/landing.css";

export function HomeFooter() {
  const newsletterId = useId();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterStatus("Enter your email address to subscribe.");
      return;
    }
    window.localStorage.setItem("biophlo-newsletter-email", email);
    setNewsletterStatus(`Thanks — ${email} is on the BIOPHLO updates list.`);
    setNewsletterEmail("");
  };

  return (
    <div className="bio-home home-footer-scope">
      <footer className="site-footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/assets/biophlo-logo-transparent.png" alt="BIOPHLO" />
            <div className="social-links" aria-label="Social media">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="BIOPHLO on Facebook">f</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="BIOPHLO on Instagram">◎</a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="BIOPHLO on YouTube">▶</a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="BIOPHLO on LinkedIn">in</a>
            </div>
          </div>

          <div className="footer-column">
            <h2>Quick Links</h2>
            <Link to="/">Home</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/about">About</Link>
            <Link to="/resources">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-column">
            <h2>Resources</h2>
            <Link to="/support">Help Center</Link>
            <Link to="/resources">Student Guide</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/legal/privacy">Privacy Policy</Link>
            <Link to="/legal/terms">Terms of Service</Link>
          </div>

          <div className="footer-subscribe">
            <h2>Subscribe</h2>
            <p>Get the latest updates and new courses.</p>
            <form onSubmit={submitNewsletter}>
              <label className="sr-only" htmlFor={newsletterId}>Your email address</label>
              <input
                id={newsletterId}
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  setNewsletterStatus("");
                }}
                required
              />
              <button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button>
            </form>
            {newsletterStatus && <p className="subscribe-status" role="status">{newsletterStatus}</p>}
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Biophlo.</span>
          <span>Science today. A brighter tomorrow. <ShieldCheck size={17} /></span>
        </div>
      </footer>
    </div>
  );
}