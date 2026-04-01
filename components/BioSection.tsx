"use client";

import Image from "next/image";
import { useState } from "react";
import { profile } from "@/data/profile";

// 社交链接图标 SVG（内联，无需外部图标库）
function IconGoogleScholar() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5h3.5V22h5v-6.5h7V22h5V9.5H24L12 0z" />
    </svg>
  );
}
function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function IconCV() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default function BioSection() {
  const [imgError, setImgError] = useState(false);
  const links: { href: string; icon: React.ReactNode; label: string }[] = [];

  // 支持 "user AT domain.com" 反爬格式，自动转换为真实 mailto
  if (profile.email) {
    const realEmail = profile.email.replace(/\s*AT\s*/i, "@");
    links.push({ href: `mailto:${realEmail}`, icon: <IconEmail />, label: "Email" });
  }
  if (profile.googleScholarUrl)
    links.push({ href: profile.googleScholarUrl, icon: <IconGoogleScholar />, label: "Google Scholar" });
  if (profile.githubUrl)
    links.push({ href: profile.githubUrl, icon: <IconGitHub />, label: "GitHub" });
  if (profile.linkedinUrl)
    links.push({ href: profile.linkedinUrl, icon: <IconLinkedIn />, label: "LinkedIn" });
  if (profile.cvUrl)
    links.push({ href: profile.cvUrl, icon: <IconCV />, label: "CV" });

  return (
    <section id="bio" className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Photo */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            {/* 3:4 竖版容器 */}
            <div className="w-36 md:w-44 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center"
              style={{ aspectRatio: "3/4" }}>
              {imgError ? (
                <span className="text-5xl font-bold text-gray-300 select-none">
                  {profile.name.charAt(0)}
                </span>
              ) : (
                <Image
                  src={profile.photo}
                  alt={profile.name}
                  width={176}
                  height={235}
                  className="object-cover w-full h-full [image-orientation:from-image]"
                  style={{ objectPosition: "center top" }}
                  priority
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-primary">
              {profile.name}
              {profile.nameZh && (
                <span className="ml-2 text-xl font-normal text-gray-500">
                  {profile.nameZh}
                </span>
              )}
            </h1>
            <p className="mt-1 text-base text-gray-600">{profile.position}</p>
            <p className="text-base text-gray-600">
              {profile.department && <>{profile.department}, </>}
              <a
                href={profile.labUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {profile.lab}
              </a>
            </p>
            <p className="text-base text-gray-600">{profile.university}</p>
            {profile.advisor && (
              <p className="text-sm text-gray-500 mt-0.5">
                Advisor:{" "}
                <a
                  href={profile.advisorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {profile.advisor}
                </a>
              </p>
            )}

            {/* Social links */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-accent transition-colors border border-gray-200 rounded-full px-3 py-1 hover:border-accent"
                  title={l.label}
                >
                  {l.icon}
                  <span>{l.label}</span>
                </a>
              ))}
            </div>

            {/* Bio paragraphs */}
            <div className="mt-6 space-y-3">
              {profile.bio.map((para, i) => (
                <p key={i} className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
