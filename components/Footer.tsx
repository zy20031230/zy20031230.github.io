import { profile } from "@/data/profile";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-400">
        <p>
          © {currentYear} {profile.name}. All rights reserved.
        </p>
        <p className="mt-1">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mt-1 text-xs text-gray-300">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            Next.js
          </a>{" "}
          &amp;{" "}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            Tailwind CSS
          </a>
        </p>
      </div>
    </footer>
  );
}
