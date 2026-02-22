import { Link } from "react-router";
import { paths } from "@/config/paths";
import moviehhLogo from "@/assets/moviehh_logo.png";

const footerLinks = {
  explore: [
    { name: "Movies", to: paths.movies.getHref() },
    { name: "Cinemas", to: paths.cinemas.getHref() },
  ],
  account: [
    { name: "Login", to: paths.auth.login.getHref() },
    { name: "Sign Up", to: paths.auth.register.getHref() },
  ],
};

export const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-border overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-8 bg-primary/5 blur-2xl" />

      <div className="content-wrapper py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-4">
            <Link to="/" className="group w-fit">
              <img
                src={moviehhLogo}
                className="w-32 opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                alt="MovieHH"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your premier destination for the latest movies and cinema
              experiences. Book tickets with ease.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Explore
            </h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.explore.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Account
            </h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.account.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MovieHH. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Made with</span>
            <span className="text-primary">♥</span>
            <span>for movie lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
