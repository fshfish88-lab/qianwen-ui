const capabilityCards = Array.from(document.querySelectorAll(".capability-card"));
const resultCount = document.querySelector("#resultCount");
const resultList = document.querySelector("#resultList");
const manualTime = document.querySelector("#manualTime");
const qwenTime = document.querySelector("#qwenTime");
const autoSelect = document.querySelector("#autoSelect");
const startGenerate = document.querySelector("#startGenerate");
const qwenIconButton = document.querySelector("#qwenIconButton");
const heroGenerate = document.querySelector("#heroGenerate");
const submitBrief = document.querySelector("#submitBrief");
const sendCopyMessage = document.querySelector("#sendCopyMessage");
const previewSignup = document.querySelector("#previewSignup");
const deployPreview = document.querySelector("#deployPreview");
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

function getToastStack() {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }
  return stack;
}

function showToast(title, detail = "") {
  const stack = getToastStack();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong>${detail ? `<span>${detail}</span>` : ""}`;
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 220);
  }, 2600);
}

function setButtonBusy(button, loadingText, doneText, callback) {
  if (!button) {
    return;
  }
  const originalText = button.dataset.originalText || button.textContent;
  button.dataset.originalText = originalText;
  button.textContent = loadingText;
  button.classList.add("is-loading");
  button.setAttribute("aria-busy", "true");

  window.setTimeout(() => {
    button.textContent = doneText;
    button.classList.remove("is-loading");
    button.removeAttribute("aria-busy");
    callback?.();
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1800);
  }, 720);
}

function scrollToSection(selector) {
  const target = document.querySelector(selector);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function copyText(text) {
  if (!navigator.clipboard || !text) {
    return;
  }
  navigator.clipboard.writeText(text).catch(() => {});
}

function emitQwenParticles(button) {
  const layer = button?.querySelector(".qwen-particles");
  if (!layer) {
    return;
  }

  const colors = ["#ffffff", "#ff8a2a", "#8d82ff", "#7ee8ff"];
  for (let index = 0; index < 22; index += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 22 + Math.random() * 0.28;
    const distance = 48 + Math.random() * 54;
    const size = 4 + Math.random() * 7;
    particle.className = "qwen-particle";
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--particle-color", colors[index % colors.length]);
    layer.appendChild(particle);
    window.setTimeout(() => particle.remove(), 860);
  }
}

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
  gsap.set(".hero-kicker, .hero-title-line, .hero-subtitle, .hero-actions, .capability-strip", { autoAlpha: 0 });
  gsap.set(".hero-title .line-1", { y: 46, filter: "blur(8px)" });
  gsap.set(".hero-title .line-2", { y: 24, scale: 0.88, filter: "blur(10px)" });
  gsap.set(".hero-subtitle, .hero-actions, .capability-strip", { y: 24 });
  gsap.set(".hero-console", { y: 52, scale: 0.94, rotateX: 8, filter: "blur(10px)" });

  const heroIntro = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroIntro
    .to(".hero-copy", { autoAlpha: 1, y: 0, duration: 0.01 }, 0)
    .to(".hero-kicker", { autoAlpha: 1, y: 0, duration: 0.45 }, 0)
    .to(".hero-title .line-1", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8 }, 0.2)
    .to(".hero-title .line-2", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "back.out(1.16)" }, 0.5)
    .to(".hero-subtitle", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.8)
    .to(".hero-actions", { autoAlpha: 1, y: 0, duration: 0.72 }, 1.1)
    .to(".capability-strip", { autoAlpha: 1, y: 0, duration: 0.72 }, 1.22)
    .to(".hero-console", { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)", duration: 1, ease: "back.out(1.12)" }, 1.3);

  gsap.to(".hero-console", {
    y: -14,
    rotateX: 2,
    rotateY: -3,
    duration: 5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 2.4
  });
  gsap.to(".qwen-icon-button", { y: -14, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true });
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

if (qwenIconButton) {
  qwenIconButton.addEventListener("click", () => {
    qwenIconButton.classList.remove("is-spinning");
    void qwenIconButton.offsetWidth;
    qwenIconButton.classList.add("is-spinning");
    qwenIconButton.setAttribute("aria-pressed", "true");
    emitQwenParticles(qwenIconButton);
    showToast("千问图标正在启动", "三叶片正在旋转，创意粒子已释放。");
    window.setTimeout(() => {
      qwenIconButton.classList.remove("is-spinning");
      qwenIconButton.setAttribute("aria-pressed", "false");
    }, 920);
  });
}

document.querySelectorAll(".header-action, .primary-button, .hero-command button, .preview-hero button, .chat-input button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("button-pressed");
    window.setTimeout(() => button.classList.remove("button-pressed"), 180);
  });
});

if (heroGenerate) {
  heroGenerate.addEventListener("click", () => {
    const heroSection = document.querySelector(".hero-section");
    heroSection?.classList.add("is-launching");
    window.setTimeout(() => heroSection?.classList.remove("is-launching"), 1400);
    setButtonBusy(heroGenerate, "生成中", "已生成", () => {
      showToast("宣传套件已生成", "千问已完成需求理解、能力调度和发布入口预览。");
      scrollToSection("#workflow");
    });
  });
}

if (submitBrief) {
  submitBrief.addEventListener("click", () => {
    setButtonBusy(submitBrief, "理解中", "已提交", () => {
      if (scenarioNext) {
        scenarioNext.textContent = "千问已提取受众、目标、交付物和风格方向";
      }
      showToast("创作需求已提交", "下一步可以查看千问如何拆解任务。");
      scrollToSection("#understand");
    });
  });
}

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
    showToast("已智能推荐工作流", "文案、视觉、网页和发布入口已自动开启。");
  });
}

if (startGenerate) {
  startGenerate.addEventListener("click", () => {
    startGenerate.textContent = "正在生成校园传播包";
    startGenerate.setAttribute("aria-busy", "true");
    window.setTimeout(() => {
      startGenerate.textContent = "传播包已生成";
      startGenerate.removeAttribute("aria-busy");
      showToast("传播包生成完成", "文案、海报、网页和视频脚本已进入整合预览。");
      scrollToSection("#integrate");
    }, 900);
  });
}

if (sendCopyMessage) {
  sendCopyMessage.addEventListener("click", () => {
    const panel = sendCopyMessage.closest(".chat-panel");
    const input = sendCopyMessage.closest(".chat-input");
    if (!panel || !input) {
      return;
    }
    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.textContent = "请再给我一个更有行动感的版本。";
    const aiMessage = document.createElement("div");
    aiMessage.className = "message ai";
    aiMessage.textContent = "已补充更强 CTA：现在加入，把你的第一个 AI 作品做出来。";
    panel.insertBefore(userMessage, input);
    panel.insertBefore(aiMessage, input);
    showToast("文案对话已更新", "新的行动号召已经加入聊天记录。");
  });
}

if (copyLink && linkOutput) {
  copyLink.addEventListener("click", () => {
    linkOutput.classList.add("visible");
    copyLink.textContent = "体验链接已复制";
    copyText(linkOutput.textContent.trim());
    showToast("体验链接已复制", "可以粘贴到社群、推文或海报二维码里。");
  });
}

if (copyOfficialLink && officialLinkOutput) {
  copyOfficialLink.addEventListener("click", () => {
    officialLinkOutput.classList.add("visible");
    copyOfficialLink.textContent = "官网链接已复制";
    copyText(officialLinkOutput.textContent.trim());
    showToast("千问官网链接已复制", "链接已经准备好分享。");
  });
}

if (previewSignup) {
  previewSignup.addEventListener("click", () => {
    showToast("报名入口已打开", "正在跳转到最终加入页面。");
    scrollToSection("#join");
  });
}

if (deployPreview) {
  deployPreview.addEventListener("click", () => {
    setButtonBusy(deployPreview, "部署中", "预览已部署", () => {
      showToast("本地预览已部署", "报名网页已接入发布分享页面。");
      scrollToSection("#publish");
    });
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
