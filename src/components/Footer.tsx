import { Link } from 'react-router-dom';

interface FooterProps {
  exploreLabel: string;
}

export default function Footer({ exploreLabel }: FooterProps) {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-left">© Deep Plate 2026</div>
      <div className="footer-center">SEOUL</div>
      <div className="footer-right">
        <Link to="/places">{exploreLabel}<span className="red-arrow" aria-hidden="true">→</span></Link>
      </div>
    </footer>
  );
}
