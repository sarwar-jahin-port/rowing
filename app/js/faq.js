const faqData = [
  {
    q: "We are a volunteer-run club. Do we really need an agency?",
    a: "Yes—especially when volunteer time is limited. Our goal is not to replace your team. It is to reduce the burden of planning and producing content."
  },
  {
    q: "We do not always have great photos. Is that a problem?",
    a: "No. We can start with the assets you already have. We can also provide repeatable photo and video capture checklists so coaches, athletes, and event volunteers can collect more usable material."
  },
  {
    q: "Do you only design, or do you also write captions?",
    a: "Depending on the package, we can support content planning, caption direction, branded design, short-form editing, and delivery. The exact scope will be stated clearly in the proposal."
  },
  {
    q: "Do you publish the posts for us?",
    a: "That depends on your club’s workflow. We can deliver publish-ready files, or publishing support can be added if the appropriate access and approval process are agreed."
  },
  {
    q: "How quickly will we receive content?",
    a: "Turnaround depends on the scope and the required inputs. The agreed turnaround will be stated in the proposal. Delays in receiving required information from the club may affect the delivery timeline."
  },
  {
    q: "Can we stop after one month?",
    a: "The initial engagement can begin as a one-month trial. Renewal depends on the club’s satisfaction, needs, and mutual agreement."
  },
  {
    q: "We already work with another designer or agency.",
    a: "That is not a problem. We can work alongside your existing team or take ownership of a specific content stream, such as recruitment, regatta recaps, or athlete spotlights."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('faq-nav');
  const answerContainer = document.getElementById('faq-answer-display');
  const rightColumn = document.querySelector('.faq-right');
  
  if (!navContainer || !answerContainer) return;

  // Render navigation buttons
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
      // Update active state
      document.querySelectorAll('.faq-nav-btn').forEach(b => b.setAttribute('aria-selected', 'false'));
      btn.setAttribute('aria-selected', 'true');
      
      // Animate out
      answerContainer.classList.remove('active');
      
      setTimeout(() => {
        // Update content
        answerContainer.innerHTML = `
          <h3 class="faq-a-title">${item.q}</h3>
          <p class="faq-a-text">${item.a}</p>
        `;
        // Animate in
        answerContainer.classList.add('active');
      }, 300); // match CSS transition duration

      // On mobile, scroll to the answer
      if (window.innerWidth < 992) {
         setTimeout(() => {
             rightColumn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
         }, 350);
      }
    });
    
    navContainer.appendChild(btn);
  });

  // Initialize first item
  if (faqData.length > 0) {
    answerContainer.innerHTML = `
      <h3 class="faq-a-title">${faqData[0].q}</h3>
      <p class="faq-a-text">${faqData[0].a}</p>
    `;
    // Small delay to allow CSS transition on first load if desired
    setTimeout(() => {
        answerContainer.classList.add('active');
    }, 50);
  }
});
