import { Frame, LockKeyhole, Monitor } from "lucide-react";
export default function AboutPage() {
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <p className="section-eyebrow">ABOUT THE STUDIO</p>
          <h1>Built to explore.</h1>
          <p className="admin-muted">
            An art gallery, and a space to learn React.
          </p>
        </div>
      </div>
      <div className="studio-about-grid">
        {[
          {
            icon: Frame,
            title: "A connected collection",
            text: "Manage artworks, prices, available stock, order statuses, and review visibility. Your changes appear in the gallery in this browser.",
          },
          {
            icon: Monitor,
            title: "Local by design",
            text: "Catalog changes, orders, and reviews use browser storage. They are not shared across devices. Clearing site data removes them. Uploaded images are limited to 1 MB each; browser storage capacity is limited.",
          },
          {
            icon: LockKeyhole,
            title: "Workspace access",
            text: "Sign in to organize your collection, update artwork details, and manage feedback. This learning project uses browser-based access; server authentication is not connected yet.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <section className="studio-card" key={title}>
            <Icon size={24} />
            <h2>{title}</h2>
            <p className="admin-muted">{text}</p>
          </section>
        ))}
      </div>
      <p className="studio-local-note">
        Learning concepts: components, props, conditional rendering, useState,
        and useContext. No real payments or deliveries.
      </p>
    </>
  );
}
