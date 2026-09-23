import "./style.css";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supa = createClient(supabaseUrl, supabaseAnonKey);

// --- Toast notification system ---
function ensureToastContainer(): HTMLDivElement {
  let container = document.querySelector<HTMLDivElement>(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

function showToast(
  type: "success" | "error" | "info",
  title: string,
  message: string,
  duration = 4500,
) {
  const container = ensureToastContainer();
  const icons = { success: "\u2713", error: "\u2717", info: "\u2139" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML =
    `<span class="toast-icon">${icons[type]}</span>` +
    `<div class="toast-body"><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div>` +
    `<button class="toast-close" aria-label="Dismiss">&times;</button>` +
    `<span class="toast-progress" style="animation-duration:${duration}ms"></span>`;
  container.appendChild(toast);

  const dismiss = () => {
    if (toast.classList.contains("toast-exit")) return;
    toast.classList.add("toast-exit");
    toast.addEventListener("animationend", () => toast.remove());
  };
  toast.querySelector(".toast-close")!.addEventListener("click", dismiss);
  window.setTimeout(dismiss, duration);
}
// --- End toast system ---

const app = document.querySelector<HTMLDivElement>("#app")!;

const logo = `<img src="/seda-logo.jpg" alt="Social and Economic Development for Africa logo">`;
const arrow = `<span class="arrow" aria-hidden="true">→</span>`;
const images = {
  hero: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1800&q=85",
  mission:
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=85",
  education:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85",
  health:
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=85",
  water:
    "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=85",
  earth:
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=85",
  event:
    "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=85",
  team: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=85",
  donation:
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=85",
};

app.innerHTML = `
  <div class="top-contact-bar"><div class="container top-contact-inner"><div class="contact-meta"><a href="tel:+23276920000">+232-76-920-000</a><a href="mailto:info@sedafrica.org">info@sedafrica.org</a><span>Freetown, Sierra Leone</span></div><div class="social-handles"><a href="https://www.facebook.com/share/1CHKMHM6ZG/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.24-1.47 1.48-1.47H16V4.13c-.31-.04-1.37-.13-2.6-.13-2.57 0-4.33 1.57-4.33 4.45V11H6v3h3.1v8h.4Z"/></svg></a><a href="https://www.instagram.com/sed_africa?stkn=MWZoNzc4Y3k1cnZvYw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85 0-3.2.01-3.58.07-4.85C7.38 3.92 8.9 2.38 12 2.16Zm0 4.15a5.69 5.69 0 1 0 0 11.38 5.69 5.69 0 0 0 0-11.38Zm6.24-.74a1.24 1.24 0 1 0 0 2.48 1.24 1.24 0 0 0 0-2.48Z"/></svg></a><a href="https://x.com/sedafricaorg" target="_blank" rel="noopener noreferrer" aria-label="X" title="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2.5h3.6l-7.86 9.02L24 21.5h-7.23l-5.66-6.8-6.47 6.8H1l8.4-9.65L0 2.5h7.44l5.12 6.2L18.9 2.5Z"/></svg></a><a href="https://www.linkedin.com/company/social-and-economic-development-for-africa/about/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06Zm1.78 13.02H3.56V9h3.56v11.45Z"/></svg></a></div></div></div>
  <header class="site-header" id="top">
    <div class="container header-inner">
      <a class="brand" href="#top">${logo}<span><strong>SEDA</strong><small>Social and Economic<br>Development for Africa</small></span></a>
      <button class="menu-toggle" aria-label="Open menu">☰</button>
      <nav class="site-nav" aria-label="Main navigation">
        <a class="active" href="#top">Home</a><a href="#about">About Us</a><div class="nav-dropdown"><button type="button">Programs</button><div class="dropdown-menu"><a href="#projects">Education</a><a href="#projects">Agriculture</a><a href="#projects">Gender & Children</a><a href="#projects">Community Empowerment</a></div></div><a href="#news">Blog</a><a href="#contact">Contact</a>
      </nav>
      <a class="donate-btn profile-btn" href="#donate">Donate <span aria-hidden="true">♥</span></a>
    </div>
  </header>

  <main>
    <section class="hero" style="--hero-image:url('${images.hero}')">
      <div class="hero-overlay"></div><div class="container hero-content"><p class="kicker">BUILDING STRONGER COMMUNITIES</p><h1>Social and Economic<br><em>Development for Africa</em></h1><p class="hero-copy">SEDA works with government and international partners to build human capacity, support vulnerable people, empower women, and strengthen rural communities in Sierra Leone.</p><div class="hero-actions"><button class="donate-btn donate-action">Support Our Work ♥</button><a class="learn-btn" href="#about">Learn More ${arrow}</a></div></div>
    </section>

    <section class="mission section-pad" id="about"><div class="container mission-grid"><div class="mission-photo image-frame"><img src="${images.mission}" alt="Children learning and growing together"><button class="play-btn" aria-label="Play our story">▶</button></div><div class="mission-copy"><p class="kicker green">OUR MISSION</p><h2>Building Human Capacity<br>Across Sierra Leone</h2><p>SEDA aims to build human capacity, help poor and vulnerable people, empower women, and provide relief while raising the effectiveness of communities.</p><ul class="check-list"><li>Education and learning materials</li><li>Women and girls' empowerment</li><li>Rural economic development</li></ul></div><div class="stats-grid"><div><img class="stat-icon education-icon" src="/icons/Education.png" alt=""><strong>Education</strong><small>School support</small></div><div><img class="stat-icon blue-icon" src="/icons/Agriculture.png" alt=""><strong>Agriculture</strong><small>Rice production</small></div><div><img class="stat-icon blue-icon" src="/icons/Women & Girls.png" alt=""><strong>Women & Girls</strong><small>Skills and scholarships</small></div><div><img class="stat-icon blue-icon" src="/icons/Rural Communities.png" alt=""><strong>Rural Communities</strong><small>Economic welfare</small></div></div></div></section>

    <section class="impact-band approach-band"><div class="impact-half approach-panel"><div class="container-small"><p class="kicker light">HOW WE WORK</p><h2>Local knowledge.<br>Practical action.</h2><p>SEDA brings communities, partners, and public institutions together around solutions that can last.</p><div class="approach-metrics"><div><strong>04</strong><span>program areas</span></div><div><strong>01</strong><span>shared mission</span></div><div><strong>∞</strong><span>possibilities</span></div></div><a class="learn-btn approach-link" href="#about">Explore our approach ${arrow}</a></div></div><div class="impact-half volunteer-panel" id="volunteer"><div class="container-small"><p class="kicker light">JOIN OUR MISSION</p><h2>Become A Volunteer</h2><p>Join SEDA in building human capacity and supporting vulnerable people across Sierra Leone.</p><form class="volunteer-form"><input required placeholder="Full Name"><input required type="email" placeholder="Email Address"><input required type="tel" placeholder="Phone Number"><select required><option value="">Select Role</option><option>Education support</option><option>Agriculture support</option><option>Community outreach</option></select><button class="form-submit" type="submit">Submit Application ${arrow}</button></form></div></div></section>

    <section class="projects section-pad" id="projects"><div class="container"><div class="section-title"><p class="kicker green">OUR CAUSES</p><h2>Practical Action for Lasting Change</h2></div><div class="project-grid"><article class="project-card"><img src="${images.education}" alt="Students learning together"><div><h3>Education</h3><p>Providing school and learning materials for orphaned children and sensitizing communities on the importance of education.</p><a href="#program-education">Learn More ${arrow}</a></div></article><article class="project-card"><img src="${images.earth}" alt="Smallholder farmer working in a field"><div><h3>Agriculture</h3><p>Promoting sustainable farming, increasing rice production, and improving the welfare of smallholder farmers.</p><a href="#program-agriculture">Learn More ${arrow}</a></div></article><article class="project-card"><img src="${images.health}" alt="Young woman receiving support"><div><h3>Gender & Children's Affairs</h3><p>Supporting girls' scholarships, skills acquisition for young women, and meaningful participation in decision-making.</p><a href="#program-gender">Learn More ${arrow}</a></div></article><article class="project-card"><img src="${images.water}" alt="Community members working together"><div><h3>Community Empowerment</h3><p>Improving the socio-economic welfare of rural communities through practical, locally led development.</p><a href="#program-community">Learn More ${arrow}</a></div></article></div></div></section>

    <section class="stories section-pad"><div class="container"><div class="section-title"><p class="kicker green">WHAT PEOPLE SAY</p><h2>Stories of Hope and Change</h2></div><div class="quotes"><article><span class="quote-mark">“</span><p>SEDA changed my life. I got the education I always dreamed of. Today, I am proud to help my family.</p><div class="person"><span class="person-photo p1"></span><strong>Ravi Kumar<small>Student</small></strong></div></article><article><span class="quote-mark">“</span><p>The healthcare camps in our village have been a blessing. We are grateful for their support and care.</p><div class="person"><span class="person-photo p2"></span><strong>Sunita Devi<small>Villager</small></strong></div></article><article><span class="quote-mark">“</span><p>Volunteering with SEDA has been the most rewarding experience of my life.</p><div class="person"><span class="person-photo p3"></span><strong>Amit Sharma<small>Volunteer</small></strong></div></article></div></div></section>

    <section class="updates section-pad" id="events"><div class="container updates-grid"><div class="impact-progress"><div class="section-title align-left"><p class="kicker green">OUR MOMENTUM</p><h2>Small steps. Real progress.</h2></div><p class="progress-intro">Every program moves forward through people, partnerships, and practical action in communities.</p><div class="progress-item"><div><strong>Education access</strong><span>Building opportunity through learning</span></div><b>82%</b><i><em style="width:82%"></em></i></div><div class="progress-item"><div><strong>Food resilience</strong><span>Supporting smallholder producers</span></div><b>68%</b><i><em style="width:68%"></em></i></div><div class="progress-item"><div><strong>Women and girls</strong><span>Opening pathways to participation</span></div><b>74%</b><i><em style="width:74%"></em></i></div><a class="green-btn progress-link" href="#projects">Explore our programs</a></div><div class="latest-news" id="news"><div class="section-title align-left"><p class="kicker green">FROM OUR BLOG</p><h2>Latest News & Updates</h2></div><div class="blog-grid"><article><img src="${images.event}" alt="Community event"><small>SEDA UPDATE</small><h3>Why Education Builds Stronger Communities</h3><a href="#news">Read More ${arrow}</a></article><article><img src="${images.team}" alt="SEDA team in the field"><small>FIELD NOTE</small><h3>Supporting Smallholder Rice Producers</h3><a href="#news">Read More ${arrow}</a></article><article><img src="${images.water}" alt="Community members working together"><small>COMMUNITY STORY</small><h3>Women Leading Local Development</h3><a href="#news">Read More ${arrow}</a></article></div></div></div></section>

    <section class="newsletter"><div class="container newsletter-inner"><div class="paper-plane">⌁</div><div><p class="kicker light">STAY CONNECTED</p><h2>Subscribe To Our Newsletter</h2><p>Stay updated with our latest activities, events and success stories.</p></div><form class="newsletter-form"><input required type="email" placeholder="Enter your email address"><button type="submit">Subscribe Now</button></form></div></section>
  </main>

  <footer class="site-footer" id="contact"><div class="container footer-grid"><div class="footer-about"><a class="brand footer-brand" href="#top">${logo}<span><strong>SEDA</strong><small>Social & Economic<br>Development for Africa</small></span></a><p>An independent community focused and nonprofit organization working for social and economic development in Sierra Leone.</p><div class="socials"><a href="https://www.facebook.com/share/1CHKMHM6ZG/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.24-1.47 1.48-1.47H16V4.13c-.31-.04-1.37-.13-2.6-.13-2.57 0-4.33 1.57-4.33 4.45V11H6v3h3.1v8h.4Z"/></svg></a><a href="https://www.instagram.com/sed_africa?stkn=MWZoNzc4Y3k1cnZvYw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85 0-3.2.01-3.58.07-4.85C7.38 3.92 8.9 2.38 12 2.16Zm0 4.15a5.69 5.69 0 1 0 0 11.38 5.69 5.69 0 0 0 0-11.38Zm6.24-.74a1.24 1.24 0 1 0 0 2.48 1.24 1.24 0 0 0 0-2.48Z"/></svg></a><a href="https://x.com/sedafricaorg" target="_blank" rel="noopener noreferrer" aria-label="X" title="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2.5h3.6l-7.86 9.02L24 21.5h-7.23l-5.66-6.8-6.47 6.8H1l8.4-9.65L0 2.5h7.44l5.12 6.2L18.9 2.5Z"/></svg></a><a href="https://www.linkedin.com/company/social-and-economic-development-for-africa/about/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06Zm1.78 13.02H3.56V9h3.56v11.45Z"/></svg></a></div></div><div><h3>Quick Links</h3><a href="#about">About Us</a><a href="/education.html">Programs</a><a href="#news">News</a><a href="#contact">Contact</a></div><div><h3>Get Involved</h3><a href="#donate">Donate Now</a><a href="#volunteer">Volunteer</a><a href="#volunteer">Partner With Us</a><a href="#contact">Membership</a><a href="#contact">Support SEDA</a></div><div><h3>Contact Us</h3><p><svg class="contact-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C7.03 2 3 6.03 3 11c0 7 9 11 9 11s9-4 9-11c0-4.97-4.03-9-9-9Zm0 12.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg> No. 13 Walpole Street,<br>Freetown, Sierra Leone</p><p><svg class="contact-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2Z"/></svg> +232-76-920-000</p><p><svg class="contact-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg> <a class="email-link" href="mailto:aabs8210@yahoo.com">aabs8210@yahoo.com</a></p></div></div><div class="footer-bottom"><div class="container"><span>© 2026 SEDA. All Rights Reserved.</span><span>Made with purpose for Sierra Leone.</span></div></div><div class="footer-policy-row"><div class="container"><a href="/privacy-policy.html">Privacy Policy</a><a href="/terms-conditions.html">Terms & Conditions</a><a href="/cookie-policy.html">Cookie Policy</a><a href="/admin.html">Admin</a></div></div></footer>
`;

const officialEmail = "info@sedafrica.org";
app.innerHTML = app.innerHTML.replaceAll("aabs8210@yahoo.com", officialEmail);
app.innerHTML = app.innerHTML.replaceAll(">Blog<", ">News<");
app.innerHTML = app.innerHTML.replaceAll(
  'href="#program-education"',
  'href="/education.html"',
);
app.innerHTML = app.innerHTML.replaceAll(
  'href="#program-agriculture"',
  'href="/agriculture.html"',
);
app.innerHTML = app.innerHTML.replaceAll(
  'href="#program-gender"',
  'href="/gender-children.html"',
);
app.innerHTML = app.innerHTML.replaceAll(
  'href="#program-community"',
  'href="/community-empowerment.html"',
);
app.innerHTML = app.innerHTML.replaceAll(
  'href="#projects">Education',
  'href="/education.html">Education',
);
app.innerHTML = app.innerHTML.replaceAll(
  'href="#projects">Agriculture',
  'href="/agriculture.html">Agriculture',
);
app.innerHTML = app.innerHTML.replaceAll(
  'href="#projects">Gender & Children',
  'href="/gender-children.html">Gender & Children',
);
app.innerHTML = app.innerHTML.replaceAll(
  'href="#projects">Community Empowerment',
  'href="/community-empowerment.html">Community Empowerment',
);
setupMissionAnimation();
setupHeroSlideshow();

function setupHeroSlideshow() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  const slides = [images.hero, images.event, images.team, images.mission];
  let current = 0;
  window.setInterval(() => {
    hero.classList.add("is-fading");
    window.setTimeout(() => {
      current = (current + 1) % slides.length;
      hero.style.setProperty("--hero-image", `url('${slides[current]}')`);
      hero.classList.remove("is-fading");
    }, 650);
  }, 6500);
}

function setupMissionAnimation() {
  const mission = document.querySelector<HTMLElement>(".mission-grid");
  if (!mission) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    mission.classList.add("is-visible");
    return;
  }
  const showMission = () => mission.classList.add("is-visible");
  if (!("IntersectionObserver" in window)) {
    showMission();
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        showMission();
        observer.disconnect();
      }
    },
    { threshold: 0.2 },
  );
  observer.observe(mission);
}

document
  .querySelector<HTMLButtonElement>(".menu-toggle")
  ?.addEventListener("click", () => {
    document.querySelector(".site-nav")?.classList.toggle("open");
  });

document
  .querySelectorAll<HTMLAnchorElement>(".site-nav a")
  .forEach((link) =>
    link.addEventListener("click", () =>
      document.querySelector(".site-nav")?.classList.remove("open"),
    ),
  );
document
  .querySelectorAll<HTMLButtonElement>(".nav-dropdown > button")
  .forEach((button) =>
    button.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 720px)").matches) {
        button.parentElement?.classList.toggle("open");
      }
    }),
  );
document
  .querySelectorAll<HTMLButtonElement>(".donate-action")
  .forEach((button) =>
    button.addEventListener("click", () => {
      window.location.hash = "donate";
      renderDonationPage();
    }),
  );
document
  .querySelectorAll<HTMLButtonElement>(".amounts button")
  .forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelector(".amounts .selected")
        ?.classList.remove("selected");
      button.classList.add("selected");
    }),
  );
document
  .querySelector<HTMLFormElement>(".volunteer-form")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveVolunteer(event.currentTarget as HTMLFormElement);
  });
document
  .querySelector<HTMLFormElement>(".newsletter-form")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveNewsletter(event.currentTarget as HTMLFormElement);
  });

function getFormValues(form: HTMLFormElement) {
  return Array.from(
    form.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea"),
  ).map((field) => field.value);
}

async function saveVolunteer(form: HTMLFormElement) {
  const values = getFormValues(form);
  const { error } = await supa.from("volunteers").insert({
    full_name: values[0],
    email: values[1],
    phone: values[2],
    role: values[3],
  });
  if (error) {
    showToast("error", "Submission Failed", "We could not submit your application. Please try again.");
  } else {
    showToast("success", "Application Sent", "Thank you! Your volunteer application has been submitted.");
    form.reset();
  }
}

async function saveNewsletter(form: HTMLFormElement) {
  const values = getFormValues(form);
  const { error } = await supa.from("newsletter_subscribers").insert({
    email: values[0],
  });
  if (error && error.code === "23505") {
    showToast("info", "Already Subscribed", "You are already subscribed! Thank you.");
  } else if (error) {
    showToast("error", "Subscription Failed", "Something went wrong. Please try again.");
  } else {
    showToast("success", "Subscribed", "Thank you for subscribing to our newsletter!");
    form.reset();
  }
}

async function saveContactMessage(form: HTMLFormElement) {
  const values = getFormValues(form);
  const { error } = await supa.from("contact_messages").insert({
    name: values[0],
    email: values[1],
    message: values[2],
  });
  if (error) {
    showToast("error", "Message Failed", "We could not send your message. Please try again.");
  } else {
    showToast("success", "Message Sent", "Thank you! Your message has been sent to SEDA.");
    form.reset();
  }
}

async function saveDonation(amount: number, frequency: string, purpose: string, email: string, name: string) {
  const { error } = await supa.from("donations").insert({
    amount,
    currency: "EUR",
    frequency,
    purpose,
    donor_name: name,
    donor_email: email,
    status: "completed",
  });
  return !error;
}

async function loadDynamicNews() {
  const desk = document.querySelector(".news-desk");
  if (!desk) return;
  const { data } = await supa.from("news_articles").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(6);
  if (!data || data.length === 0) return;
  const lead = data[0];
  const sidebar = data.slice(1, 3);
  const lower = data.slice(3, 6);
  const leadHtml = `<article class="lead-story news-item" data-category="${lead.category || "Community"}"><img src="${lead.image_url || images.event}" alt="${lead.title}"><div class="lead-copy"><small>${(lead.category || "COMMUNITY").toUpperCase()} · ${lead.published_at ? new Date(lead.published_at).toLocaleDateString() : ""}</small><h2>${lead.title}</h2><p>${lead.summary || ""}</p><a href="#contact">Read the full field note ${arrow}</a></div></article>`;
  const railHtml = sidebar.map((a) => `<article class="news-item" data-category="${a.category || "Community"}"><img src="${a.image_url || images.event}" alt="${a.title}"><small>${(a.category || "").toUpperCase()} · ${a.published_at ? new Date(a.published_at).toLocaleDateString() : ""}</small><h3>${a.title}</h3><p>${a.summary || ""}</p><a href="#contact">Read story ${arrow}</a></article>`).join("");
  const lowerHtml = lower.map((a) => {
    const d = a.published_at ? new Date(a.published_at) : new Date(a.created_at);
    return `<article class="news-item" data-category="${a.category || "Community"}"><div class="date-stamp">${d.getDate()}<br><small>${d.toLocaleString("en", { month: "short" }).toUpperCase()}</small></div><div><small>${(a.category || "").toUpperCase()}</small><h3>${a.title}</h3><p>${a.summary || ""}</p></div></article>`;
  }).join("");
  desk.innerHTML = leadHtml + (sidebar.length ? `<div class="news-rail">${railHtml}</div>` : "") + (lower.length ? `<div class="news-lower">${lowerHtml}</div>` : "");
  const newsItems = document.querySelectorAll<HTMLElement>(".news-item");
  const applyNewsFilter = (term: string, category: string) =>
    newsItems.forEach((item) => {
      const matchesText = item.textContent?.toLowerCase().includes(term.toLowerCase()) ?? false;
      const matchesCategory = category === "all" || item.dataset.category === category;
      item.style.display = matchesText && matchesCategory ? "" : "none";
    });
  document.querySelectorAll<HTMLButtonElement>(".news-filters button").forEach((button) =>
    button.addEventListener("click", () => {
      document.querySelector(".news-filters .active")?.classList.remove("active");
      button.classList.add("active");
      applyNewsFilter(document.querySelector<HTMLInputElement>("#news-search")?.value ?? "", button.dataset.filter ?? "all");
    }));
  document.querySelector<HTMLInputElement>("#news-search")?.addEventListener("input", (event) => {
    applyNewsFilter((event.target as HTMLInputElement).value, document.querySelector<HTMLButtonElement>(".news-filters .active")?.dataset.filter ?? "all");
  });
}

function renderDonationPage() {
  app.innerHTML = `
    <header class="site-header donation-header"><div class="container header-inner"><a class="brand" href="#top">${logo}<span><strong>SEDA</strong><small>Social and Economic<br>Development for Africa</small></span></a><a class="donation-back" href="#top">← Back to website</a></div></header>
    <main class="donation-page"><section class="donation-form-panel"><div class="donation-form-inner"><p class="kicker green">MAKE A DIFFERENCE</p><h1>Your Donation</h1><h2>Choose your donation frequency<span>*</span></h2><div class="frequency-options"><button class="choice-card active"><i></i><strong>Single Donation</strong></button><button class="choice-card"><i></i><strong>Monthly Donation</strong></button></div><h2>Choose a donation amount or enter your own amount</h2><div class="donation-amounts"><button class="choice-card amount-card active"><i></i><strong>€75</strong></button><button class="choice-card amount-card"><i></i><strong>€125</strong></button><button class="choice-card amount-card"><i></i><strong>€180</strong></button><button class="choice-card amount-card"><i></i><strong>€250</strong></button></div><button class="own-amount"><i></i> Your Own Amount</button><label class="donation-label" for="donation-purpose">Where would you like your donation to go to?*</label><select id="donation-purpose"><option>Where it's most needed</option><option>Education and learning materials</option><option>Agriculture and rice production</option><option>Women and girls' empowerment</option><option>Rural community development</option></select><button class="continue-btn" id="continue-donation">Continue</button></div></section><section class="donation-visual" style="--donation-image:url('${images.donation}')"><div class="donation-visual-overlay"></div><div class="donation-message"><strong>Your support helps build human capacity and stronger communities across Sierra Leone.</strong><small>Social and Economic Development for Africa</small></div><div class="visual-dots"><i></i><i></i><i></i><i class="active"></i></div></section></main>`;

  document
    .querySelectorAll<HTMLButtonElement>(".choice-card")
    .forEach((choice) =>
      choice.addEventListener("click", () => {
        const group = choice.classList.contains("amount-card")
          ? ".amount-card"
          : ".frequency-options .choice-card";
        document.querySelector(`${group}.active`)?.classList.remove("active");
        choice.classList.add("active");
      }),
    );
  document
    .querySelector<HTMLButtonElement>(".own-amount")
    ?.addEventListener("click", () =>
      showToast("info", "Custom Amount", "You can enter your own amount on the next step."),
    );
  document
    .querySelector<HTMLButtonElement>("#continue-donation")
    ?.addEventListener("click", renderPaymentStep);
}

function renderPaymentStep() {
  const panel = document.querySelector<HTMLDivElement>(".donation-form-inner");
  if (!panel) return;
  panel.innerHTML = `<p class="kicker green">SECURE CHECKOUT</p><h1>Complete Your Donation</h1><p class="payment-intro">Enter your details below to complete your support for SEDA's work in Sierra Leone.</p><form class="payment-form" id="payment-form"><label>Cardholder name<input required autocomplete="cc-name" placeholder="Full name on card"></label><label>Card number<input required inputmode="numeric" autocomplete="cc-number" maxlength="19" placeholder="1234 5678 9012 3456"></label><div class="payment-row"><label>Expiry date<input required autocomplete="cc-exp" maxlength="5" placeholder="MM / YY"></label><label>Security code<input required inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="CVV"></label></div><label>Email address<input required type="email" autocomplete="email" placeholder="you@example.com"></label><button class="continue-btn" type="submit">Submit Donation</button><small class="payment-note">Your payment details are used only for this checkout demonstration and are not stored.</small></form>`;
  document
    .querySelector<HTMLFormElement>("#payment-form")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input")).map((i) => i.value);
      const donorName = inputs[0];
      const donorEmail = inputs[4];
      const amountEl = document.querySelector<HTMLButtonElement>(".amount-card.active");
      const amount = amountEl ? parseInt(amountEl.textContent?.replace(/[^0-9]/g, "") || "75") : 75;
      const freq = document.querySelector<HTMLButtonElement>(".frequency-options .choice-card.active")?.textContent?.trim().includes("Monthly") ? "monthly" : "single";
      const purpose = document.querySelector<HTMLSelectElement>("#donation-purpose")?.value || "Where it's most needed";
      await saveDonation(amount, freq, purpose, donorEmail, donorName);
      panel.innerHTML = `<div class="payment-success"><span>\u2713</span><p class="kicker green">THANK YOU</p><h1>Donation Ready</h1><p>Your support will help SEDA build human capacity and strengthen communities across Sierra Leone.</p><a class="donation-back" href="#top">Return to website ${arrow}</a></div>`;
    });
}

function renderInfoPage(pageName: "about" | "news" | "contact") {
  const page =
    pageName === "about"
      ? `<p class="kicker green">ABOUT SEDA</p><h1>Working with communities<br><em>for a stronger Sierra Leone</em></h1><p class="info-lead">Social and Economic Development for Africa is an independent community focused and nonprofit organization with a mission to build human capacity and improve the socio-economic welfare of rural communities.</p><div class="info-columns"><article><span>01</span><h2>Our mission</h2><p>We help poor and vulnerable people, empower women, provide relief, and raise the efficiency and effectiveness of people across Sierra Leone.</p></article><article><span>02</span><h2>Our focus</h2><p>Our work brings together education, food security, agriculture, accountability, and practical economic empowerment.</p></article><article><span>03</span><h2>Our values</h2><p>We work openly with government, communities, donors, and international organizations to create useful, lasting change.</p></article></div><div class="info-banner"><div><p class="kicker light">OUR PURPOSE</p><h2>Human capacity. Dignity. Opportunity.</h2></div><a class="learn-btn" href="#donate">Support our work ${arrow}</a></div>`
      : pageName === "news"
        ? `<div class="news-mast"><div><p class="kicker green">SEDA NEWSROOM</p><h1>Stories from the<br><em>work in motion</em></h1><p class="info-lead">Field notes, community voices, and practical updates from SEDA programs across Sierra Leone.</p></div><div class="news-tools"><label>⌕<input id="news-search" placeholder="Search stories"></label><div class="news-filters"><button class="active" data-filter="all">All</button><button data-filter="Education">Education</button><button data-filter="Agriculture">Agriculture</button><button data-filter="Community">Community</button></div></div></div><section class="news-desk"><article class="lead-story news-item" data-category="Community"><img src="${images.event}" alt="SEDA community forum"><div class="lead-copy"><small>COMMUNITY · 2 HOURS AGO</small><h2>When communities lead, change lasts longer</h2><p>Inside a SEDA forum in Freetown, local leaders, families, and partners map practical next steps for stronger education and rural livelihoods.</p><a href="#contact">Read the full field note ${arrow}</a></div></article><div class="news-rail"><article class="news-item" data-category="Agriculture"><img src="${images.earth}" alt="Smallholder farmer"><small>AGRICULTURE · MAY 2024</small><h3>Supporting smallholder rice producers</h3><p>What sustainable production looks like when farmers shape the plan.</p><a href="#contact">Read story ${arrow}</a></article><article class="news-item" data-category="Education"><img src="${images.education}" alt="Students learning together"><small>EDUCATION · MAY 2024</small><h3>Why learning materials make a difference</h3><p>A closer look at the everyday tools that help children stay engaged.</p><a href="#contact">Read story ${arrow}</a></article></div><div class="news-lower"><article class="news-item" data-category="Community"><div class="date-stamp">18<br><small>MAY</small></div><div><small>COMMUNITY STORY</small><h3>Women leading local development</h3><p>Skills, confidence, and participation can shift the future of a family.</p></div></article><article class="news-item" data-category="Education"><div class="date-stamp">09<br><small>MAY</small></div><div><small>SEDA UPDATE</small><h3>Building stronger school partnerships</h3><p>Working with communities to make education support more responsive.</p></div></article><article class="news-item" data-category="Agriculture"><div class="date-stamp">28<br><small>APR</small></div><div><small>FIELD NOTE</small><h3>Food security starts close to home</h3><p>How local agricultural knowledge informs our approach.</p></div></article></div></section>`
        : `<p class="kicker green">CONTACT SEDA</p><h1>Let’s work together<br><em>for Sierra Leone</em></h1><p class="info-lead">Whether you want to support a program, partner with SEDA, or learn more about our work, our team would be glad to hear from you.</p><div class="contact-layout"><div class="contact-details"><div><span class="contact-icon location-icon" aria-hidden="true"><svg class="contact-svg" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 7 9 11 9 11s9-4 9-11c0-4.97-4.03-9-9-9Zm0 12.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg></span><h2>Head office</h2><p>No. 13 Walpole Street<br>Freetown, Sierra Leone</p></div><div><span class="contact-icon" aria-hidden="true"><svg class="contact-svg" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2Z"/></svg></span><h2>Call us</h2><p>+232-76-920-000</p></div><div><span class="contact-icon" aria-hidden="true"><svg class="contact-svg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg></span><h2>Email</h2><p><a class="email-link" href="mailto:aabs8210@yahoo.com">aabs8210@yahoo.com</a></p></div></div><form class="contact-form" id="contact-form"><label>Your name<input required placeholder="Full name"></label><label>Email address<input required type="email" placeholder="you@example.com"></label><label>How can we help?<textarea required rows="5" placeholder="Tell us about your question or partnership idea"></textarea></label><button class="continue-btn" type="submit">Send message ${arrow}</button></form></div><section class="contact-map"><div class="section-title align-left"><p class="kicker green">FIND US</p><h2>Visit the SEDA office</h2></div><iframe title="SEDA office location map" src="https://www.openstreetmap.org/export/embed.html?bbox=-13.275%2C8.475%2C-13.225%2C8.505&layer=mapnik&marker=8.488%2C-13.235" loading="lazy"></iframe></section>`;

  const infoHeroImage =
    pageName === "about"
      ? images.mission
      : pageName === "news"
        ? images.event
        : images.hero;
  const infoHeroTitle =
    pageName === "about"
      ? "About SEDA"
      : pageName === "news"
        ? "News & stories"
        : "Contact Us";
  const infoHeroText =
    pageName === "about"
      ? "Building human capacity and stronger communities across Sierra Leone."
      : pageName === "news"
        ? "Field notes, community voices, and updates from the work in motion."
        : "Let’s work together for Sierra Leone.";
  app.innerHTML = `<header class="site-header info-header"><div class="container header-inner"><a class="brand" href="#top">${logo}<span><strong>SEDA</strong><small>Social and Economic<br>Development for Africa</small></span></a><button class="menu-toggle" aria-label="Open menu">☰</button><nav class="site-nav" aria-label="Main navigation"><a href="#top">Home</a><a class="active" href="#${pageName}">${pageName === "about" ? "About Us" : pageName === "news" ? "News" : "Contact"}</a><div class="nav-dropdown"><button type="button">Programs</button><div class="dropdown-menu"><a href="/education.html">Education</a><a href="/agriculture.html">Agriculture</a><a href="/gender-children.html">Gender & Children</a><a href="/community-empowerment.html">Community Empowerment</a></div></div><a href="#donate">Donate</a></nav></div></header><main class="info-page"><section class="info-hero" style="--info-hero-image:url('${infoHeroImage}')"><div class="info-hero-overlay"></div><div class="info-hero-copy"><h1>${infoHeroTitle}</h1><p>${infoHeroText}</p></div></section><div class="container info-content">${page}</div></main><footer class="info-footer"><div class="container"><strong>Social and Economic Development for Africa</strong><span>Freetown, Sierra Leone · +232-76-920-000 · aabs8210@yahoo.com</span></div></footer>`;
  app.innerHTML = app.innerHTML.replaceAll("aabs8210@yahoo.com", officialEmail);
  app.innerHTML = app.innerHTML.replaceAll(">Blog<", ">News<");
  if (pageName === "about") {
    document
      .querySelector(".info-content")
      ?.insertAdjacentHTML(
        "beforeend",
        `<section class="about-collage"><div class="collage-intro"><p class="kicker green">WHO WE ARE</p><p>SEDA is a community focused organization working with people, partners, and institutions to create practical opportunities for a stronger Sierra Leone.</p></div><div class="collage-main-image"><img src="${images.health}" alt="Child in a community setting"></div><div class="collage-group-image"><img src="${images.mission}" alt="Children learning together"></div><div class="collage-icon" aria-hidden="true">♧</div><div class="collage-middle-copy"><p>Our work connects education, agriculture, women and girls' empowerment, and rural development. We listen to local priorities and turn shared ideas into action.</p></div><div class="collage-need"><p class="kicker green">NEED</p><p>SEDA supports communities facing barriers to opportunity. Through practical programs and trusted partnerships, we help people build confidence, resilience, and a future they can shape.</p><a href="#contact">READ MORE</a></div><div class="collage-grey-image"><img src="${images.education}" alt="Children in a classroom"></div></section>`,
      );
  }
  app.innerHTML = app.innerHTML.replaceAll(
    "Read the full field note ",
    "Read the full field note",
  );
  setProgramLinks();
  app.innerHTML = app.innerHTML.replaceAll(">Blog<", ">News<");
  if (pageName === "news") {
    loadDynamicNews();
  }
  const newsItems = document.querySelectorAll<HTMLElement>(".news-item");
  const applyNewsFilter = (term: string, category: string) =>
    newsItems.forEach((item) => {
      const matchesText =
        item.textContent?.toLowerCase().includes(term.toLowerCase()) ?? false;
      const matchesCategory =
        category === "all" || item.dataset.category === category;
      item.style.display = matchesText && matchesCategory ? "" : "none";
    });
  document
    .querySelectorAll<HTMLButtonElement>(".news-filters button")
    .forEach((button) =>
      button.addEventListener("click", () => {
        document
          .querySelector(".news-filters .active")
          ?.classList.remove("active");
        button.classList.add("active");
        applyNewsFilter(
          document.querySelector<HTMLInputElement>("#news-search")?.value ?? "",
          button.dataset.filter ?? "all",
        );
      }),
    );
  document
    .querySelector<HTMLInputElement>("#news-search")
    ?.addEventListener("input", (event) => {
      applyNewsFilter(
        (event.target as HTMLInputElement).value,
        document.querySelector<HTMLButtonElement>(".news-filters .active")
          ?.dataset.filter ?? "all",
      );
    });
  document
    .querySelector<HTMLButtonElement>(".menu-toggle")
    ?.addEventListener("click", () =>
      document.querySelector(".site-nav")?.classList.toggle("open"),
    );
  document
    .querySelectorAll<HTMLButtonElement>(".nav-dropdown > button")
    .forEach((button) =>
      button.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 720px)").matches) {
          button.parentElement?.classList.toggle("open");
        }
      }),
    );
  document
    .querySelector<HTMLFormElement>("#contact-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      saveContactMessage(event.currentTarget as HTMLFormElement);
    });
}

function setProgramLinks() {
  const routes = [
    "#program-education",
    "#program-agriculture",
    "#program-gender",
    "#program-community",
  ];
  document
    .querySelectorAll<HTMLElement>(".dropdown-menu a")
    .forEach((link, index) => {
      link.setAttribute("href", routes[index]);
    });
}

function renderProgramPage(
  program: "education" | "agriculture" | "gender" | "community",
) {
  const details = {
    education: {
      label: "PROGRAM 01",
      title: "Education for every child",
      text: "SEDA provides school and learning materials for orphaned children and works with communities to raise awareness of the importance of education.",
      image: images.education,
      points: [
        "School and learning materials",
        "Support for orphaned children",
        "Community education awareness",
      ],
    },
    agriculture: {
      label: "PROGRAM 02",
      title: "Stronger smallholder agriculture",
      text: "We promote sustainable agricultural practices, increase rice production, and improve the socio-economic status of smallholder farmers.",
      image: images.earth,
      points: [
        "Sustainable farming practices",
        "Increased rice production",
        "Support for smallholder farmers",
      ],
    },
    gender: {
      label: "PROGRAM 03",
      title: "Empowering women and girls",
      text: "SEDA helps girls stay in school, creates skills opportunities for young women, and promotes their inclusion in decision-making and nation-building.",
      image: images.health,
      points: [
        "Educational scholarships",
        "Skills acquisition opportunities",
        "Women and girls in leadership",
      ],
    },
    community: {
      label: "PROGRAM 04",
      title: "Rural community development",
      text: "Our work improves the socio-economic welfare of rural communities through locally led action, partnerships, and practical economic empowerment.",
      image: images.team,
      points: [
        "Community-led development",
        "Economic empowerment",
        "Partnerships for lasting change",
      ],
    },
  }[program];
  app.innerHTML = `<header class="site-header info-header"><div class="container header-inner"><a class="brand" href="#top">${logo}<span><strong>SEDA</strong><small>Social and Economic<br>Development for Africa</small></span></a><button class="menu-toggle" aria-label="Open menu">☰</button><nav class="site-nav" aria-label="Main navigation"><a href="#top">Home</a><a href="#about">About Us</a><div class="nav-dropdown"><button type="button">Programs</button><div class="dropdown-menu"><a href="#program-education">Education</a><a href="#program-agriculture">Agriculture</a><a href="#program-gender">Gender & Children</a><a href="#program-community">Community Empowerment</a></div></div><a href="#news">Blog</a><a href="#contact">Contact</a><a href="#donate">Donate</a></nav></div></header><main class="info-page"><div class="container info-content program-content"><p class="kicker green">${details.label}</p><h1>${details.title}</h1><div class="program-hero"><img src="${details.image}" alt="${details.title}"><div><p class="info-lead">${details.text}</p><ul class="program-points">${details.points.map((point) => `<li>${point}</li>`).join("")}</ul><a class="continue-btn program-cta" href="#contact">Partner with SEDA</a></div></div></div></main><footer class="info-footer"><div class="container"><strong>Social and Economic Development for Africa</strong><span>Freetown, Sierra Leone · +232-76-920-000 · <a class="email-link" href="mailto:info@sedafrica.org">info@sedafrica.org</a></span></div></footer>`;
  setProgramLinks();
  document
    .querySelector<HTMLButtonElement>(".menu-toggle")
    ?.addEventListener("click", () =>
      document.querySelector(".site-nav")?.classList.toggle("open"),
    );
}

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#donate") renderDonationPage();
  else if (window.location.hash === "#about") renderInfoPage("about");
  else if (window.location.hash === "#news") renderInfoPage("news");
  else if (window.location.hash === "#contact") renderInfoPage("contact");
  else if (window.location.hash === "#program-education")
    renderProgramPage("education");
  else if (window.location.hash === "#program-agriculture")
    renderProgramPage("agriculture");
  else if (window.location.hash === "#program-gender")
    renderProgramPage("gender");
  else if (window.location.hash === "#program-community")
    renderProgramPage("community");
  else if (document.querySelector(".donation-page")) window.location.reload();
  else if (document.querySelector(".info-page")) window.location.reload();
});

if (window.location.hash === "#donate") renderDonationPage();
else if (window.location.hash === "#about") renderInfoPage("about");
else if (window.location.hash === "#news") renderInfoPage("news");
else if (window.location.hash === "#contact") renderInfoPage("contact");
else if (window.location.hash === "#program-education")
  renderProgramPage("education");
else if (window.location.hash === "#program-agriculture")
  renderProgramPage("agriculture");
else if (window.location.hash === "#program-gender")
  renderProgramPage("gender");
else if (window.location.hash === "#program-community")
  renderProgramPage("community");
else setProgramLinks();
