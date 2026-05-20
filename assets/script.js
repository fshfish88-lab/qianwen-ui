const capabilityCards = Array.from(document.querySelectorAll(".capability-card"));
const resultCount = document.querySelector("#resultCount");
const resultList = document.querySelector("#resultList");
const manualTime = document.querySelector("#manualTime");
const qwenTime = document.querySelector("#qwenTime");
const autoSelect = document.querySelector("#autoSelect");
const startGenerate = document.querySelector("#startGenerate");
const copyLink = document.querySelector("#copyLink");
const linkOutput = document.querySelector("#linkOutput");
const copyOfficialLink = document.querySelector("#copyOfficialLink");
const officialLinkOutput = document.querySelector("#officialLinkOutput");
const channelToggles = Array.from(document.querySelectorAll(".channel-toggle"));
const scenarioButtons = Array.from(document.querySelectorAll(".scenario-tags button"));
const scenarioNext = document.querySelector("#scenarioNext");
const editQuestionButtons = Array.from(document.querySelectorAll(".edit-question"));
const workflowPreview = document.querySelector("#workflowPreview");
const modelCards = Array.from(document.querySelectorAll(".model-grid article"));
const applyCopyButtons = Array.from(document.querySelectorAll(".apply-copy"));
const posterCards = Array.from(document.querySelectorAll(".generated-gallery article"));
const builderButtons = Array.from(document.querySelectorAll(".builder-nav button"));
const previewTitle = document.querySelector("#previewTitle");
const previewCopy = document.querySelector("#previewCopy");
const previewStats = document.querySelector("#previewStats");
const integrationItems = Array.from(document.querySelectorAll(".integration-item"));

const outputStepLabels = {
  推文文案: "文案生成",
  主视觉海报: "视觉生成",
  报名网页: "网页生成",
  口播脚本: "视频脚本",
  发布二维码: "发布入口",
  资料解析: "资料解析"
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function activateRevealFallback() {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

async function setupMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
    return;
  }

  try {
    if (!window.gsap) {
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js");
    }
    if (!window.ScrollTrigger) {
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");
    }
  } catch (error) {
    activateRevealFallback();
    return;
  }

  if (!window.gsap || !window.ScrollTrigger) {
    activateRevealFallback();
    return;
  }

  document.documentElement.classList.add("motion-ready");
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(".reveal", { autoAlpha: 0, y: 42 });
  gsap.to(".hero-copy", { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" });
  gsap.to(".hero-console", { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, delay: 0.18, ease: "power3.out" });
  gsap.to(".hero-orbit span", {
    yPercent: -18,
    rotate: 10,
    ease: "none",
    scrollTrigger: {
      trigger: ".motion-hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.utils.toArray(".reveal:not(.hero-copy):not(.hero-console)").forEach((item) => {
    gsap.to(item, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 78%",
        toggleActions: "play none none reverse"
      }
    });
  });

  gsap.to(".ai-console", {
    y: -24,
    scale: 1.025,
    ease: "none",
    scrollTrigger: {
      trigger: ".motion-hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.utils.toArray(".flow-grid article").forEach((card, index) => {
    gsap.fromTo(
      card,
      { autoAlpha: 0, y: 70, scale: 0.94 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: (index % 5) * 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 86%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

function refreshOutputs() {
  const outputs = capabilityCards
    .filter((card) => card.classList.contains("enabled"))
    .map((card) => card.dataset.output);
  const taskCount = outputs.length;

  if (resultCount) {
    resultCount.textContent = `${taskCount} 个成果`;
  }

  if (resultList) {
    resultList.innerHTML = outputs.map((output) => `<li>${output}</li>`).join("");
  }

  if (manualTime) {
    manualTime.textContent = `${taskCount} 小时`;
  }

  if (qwenTime) {
    qwenTime.textContent = `${taskCount} 分钟`;
  }

  if (workflowPreview) {
    const steps = ["需求理解", ...outputs.map((output) => outputStepLabels[output] || output), "成果整合"];
    workflowPreview.innerHTML = steps.map((step) => `<i>${step}</i>`).join("");
  }
}

capabilityCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("enabled");
    const state = card.classList.contains("enabled") ? "已开启" : "可选";
    const label = card.querySelector("em");
    if (label) {
      label.textContent = state;
    }
    refreshOutputs();
  });
});

if (autoSelect) {
  autoSelect.addEventListener("click", () => {
    capabilityCards.forEach((card) => {
      const isCore = ["推文文案", "主视觉海报", "报名网页", "发布二维码"].includes(card.dataset.output);
      card.classList.toggle("enabled", isCore);
      const label = card.querySelector("em");
      if (label) {
        label.textContent = isCore ? "已开启" : "可选";
      }
    });
    refreshOutputs();
  });
}

if (startGenerate) {
  startGenerate.addEventListener("click", () => {
    startGenerate.textContent = "正在生成校园传播包";
    startGenerate.setAttribute("aria-busy", "true");
    window.setTimeout(() => {
      startGenerate.textContent = "传播包已生成";
      startGenerate.removeAttribute("aria-busy");
    }, 900);
  });
}

if (copyLink && linkOutput) {
  copyLink.addEventListener("click", () => {
    linkOutput.classList.add("visible");
    copyLink.textContent = "体验链接已复制";
  });
}

if (copyOfficialLink && officialLinkOutput) {
  copyOfficialLink.addEventListener("click", () => {
    officialLinkOutput.classList.add("visible");
    copyOfficialLink.textContent = "官网链接已复制";
  });
}

channelToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const isSelected = !button.classList.contains("selected");
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
    button.textContent = isSelected ? "已选择" : "选择";
  });
});

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scenarioButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    if (scenarioNext) {
      scenarioNext.textContent = button.dataset.next || "千问提取任务目标和交付物";
    }
  });
});

editQuestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest(".question-row");
    const value = row?.querySelector("span");
    if (!row || !value) {
      return;
    }
    if (!button.dataset.original) {
      button.dataset.original = value.textContent;
    }
    const isEdited = !row.classList.contains("edited");
    row.classList.toggle("edited", isEdited);
    value.textContent = isEdited ? button.dataset.alt : button.dataset.original;
    button.textContent = isEdited ? "已修改" : "修改";
  });
});

modelCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.classList.toggle("flipped");
    }
  });
});

applyCopyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("article");
    const isApplied = !button.classList.contains("applied");
    button.classList.toggle("applied", isApplied);
    card?.classList.toggle("applied", isApplied);
    button.textContent = isApplied ? "已应用" : "应用";
  });
});

function selectPoster(card) {
  posterCards.forEach((item) => item.classList.remove("selected"));
  card.classList.add("selected");
}

posterCards.forEach((card) => {
  card.addEventListener("click", () => selectPoster(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectPoster(card);
    }
  });
});

builderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    builderButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (previewTitle) {
      previewTitle.textContent = button.dataset.title;
    }
    if (previewCopy) {
      previewCopy.textContent = button.dataset.copy;
    }
    if (previewStats) {
      previewStats.innerHTML = (button.dataset.stats || "")
        .split("|")
        .map((stat) => `<span>${stat}</span>`)
        .join("");
    }
  });
});

function selectIntegrationItem(item) {
  integrationItems.forEach((card) => card.classList.remove("selected"));
  item.classList.add("selected");
}

integrationItems.forEach((item) => {
  item.addEventListener("click", () => selectIntegrationItem(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectIntegrationItem(item);
    }
  });
});

refreshOutputs();
window.addEventListener("load", setupMotion);
