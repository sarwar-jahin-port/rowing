const faqData = [
  {
    q: "How much time will our volunteers actually need to spend on this?",
    a: "Minimal time—usually less than 30 minutes a week. Your team's only task is dropping existing photos, quick phone videos, or race updates into a shared folder or chat. We handle all the heavy lifting: strategy, editing, writing, scheduling, and formatting."
  },
  {
    q: "Who retains ownership and administrative control of our social media accounts?",
    a: "Your club retains 100% control. You own all logins, passwords, and administrative rights. We publish through secure, agreed scheduling tools or prepare pre-formatted content batches for your team to post, ensuring complete control stays with your board."
  },
  {
    q: "How do you make sure the content actually sounds like our club?",
    a: "During onboarding, we define your club's tone, history, terminology, and core brand values. Every piece of content goes through an organized approval batch where your designated contact reviews and approves posts before they go live until you feel fully confident in our alignment."
  },
  {
    q: "We only have raw, low-quality phone footage. Can you actually turn that into good content?",
    a: "Yes. You do not need professional cameras or expensive gear. Modern smartphones capture great raw material. We apply professional video editing, color correction, clear audio adjustments, custom branding graphics, and engaging captions to make casual phone clips look polished and engaging."
  },
  {
    q: "Can working with an agency help us attract new members or sponsors?",
    a: "Absolutely. We design deliberate recruitment and sponsorship campaigns. By regularly highlighting learn-to-row sessions, club culture, athlete spotlights, and professional sponsor logos/mentions, we make your club attractive to prospective rowers, families, and local business sponsors."
  },
  {
    q: "What if our committee or social media volunteer changes mid-season?",
    a: "Our system creates continuity. Because we document your content calendar, media archives, brand guidelines, and approval process in a centralized hub, a committee transition won't cause your social media presence to go quiet or lose momentum."
  },
  {
    q: "How are regattas and busy racing weekends handled?",
    a: "We plan ahead around your event calendar. Before a regatta, we prepare pre-race teasers and schedule templates. During and after race day, you simply upload quick footage or results, and we rapidly assemble highlight reels, result graphics, and recap posts to capitalize on event momentum."
  },
  {
    q: "What is the typical monthly financial commitment?",
    a: "Pricing is tailored to your goals—whether you need basic monthly content planning, full video editing and scheduling, or seasonal campaign boosts. We offer transparent monthly plans and seasonal packages designed to fit a volunteer club's budget without hidden fees or surprise costs."
  },
  {
    q: "Are we locked into a long-term contract?",
    a: "No. We understand that rowing clubs operate on seasonal budgets and changing academic or regatta schedules. We offer flexible arrangements including seasonal packages, shorter trial periods, and clear notice terms so you aren't trapped in an inflexible long-term commitment."
  },
  {
    q: "How do we get started, and what happens next?",
    a: "You can request a free club content audit. We review your current online presence and send you practical observations and suggestions within 48 hours. From there, we hold a brief onboarding call to agree on your goals, set up a simple upload folder, and launch your first monthly content plan."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('faq-nav');
  const answerContainer = document.getElementById('faq-answer-display');
  const accordionContainer = document.getElementById('faq-accordion');

  // ---- Desktop / tablet: tabbed layout ----
  if (navContainer && answerContainer) {
    faqData.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.className = 'faq-nav-btn';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      btn.innerHTML = `
        <span class="faq-nav-icon"></span>
        <span class="faq-nav-text">${item.q}</span>
      `;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.faq-nav-btn').forEach(b => b.setAttribute('aria-selected', 'false'));
        btn.setAttribute('aria-selected', 'true');

        answerContainer.classList.remove('active');

        setTimeout(() => {
          answerContainer.innerHTML = `
            <h3 class="faq-a-title">${item.q}</h3>
            <p class="faq-a-text">${item.a}</p>
          `;
          answerContainer.classList.add('active');
        }, 300); // match CSS transition duration
      });

      navContainer.appendChild(btn);
    });

    if (faqData.length > 0) {
      answerContainer.innerHTML = `
        <h3 class="faq-a-title">${faqData[0].q}</h3>
        <p class="faq-a-text">${faqData[0].a}</p>
      `;
      setTimeout(() => {
        answerContainer.classList.add('active');
      }, 50);
    }
  }

  // ---- Mobile: accordion ----
  if (accordionContainer) {
    faqData.forEach((item, index) => {
      const acc = document.createElement('div');
      acc.className = 'faq-acc-item';

      const panelId = `faq-acc-panel-${index}`;
      const triggerId = `faq-acc-trigger-${index}`;

      acc.innerHTML = `
        <button class="faq-acc-trigger" id="${triggerId}" aria-expanded="false" aria-controls="${panelId}">
          <span class="faq-acc-q">${item.q}</span>
          <span class="faq-acc-icon" aria-hidden="true"></span>
        </button>
        <div class="faq-acc-panel" id="${panelId}" role="region" aria-labelledby="${triggerId}">
          <div class="faq-acc-panel-inner">
            <p>${item.a}</p>
          </div>
        </div>
      `;

      const trigger = acc.querySelector('.faq-acc-trigger');
      trigger.addEventListener('click', () => {
        const isActive = acc.classList.contains('active');

        accordionContainer.querySelectorAll('.faq-acc-item.active').forEach(openItem => {
          if (openItem !== acc) {
            openItem.classList.remove('active');
            openItem.querySelector('.faq-acc-trigger').setAttribute('aria-expanded', 'false');
          }
        });

        acc.classList.toggle('active', !isActive);
        trigger.setAttribute('aria-expanded', String(!isActive));
      });

      accordionContainer.appendChild(acc);
    });

    // Open the first question by default
    const first = accordionContainer.querySelector('.faq-acc-item');
    if (first) {
      first.classList.add('active');
      first.querySelector('.faq-acc-trigger').setAttribute('aria-expanded', 'true');
    }
  }
});
