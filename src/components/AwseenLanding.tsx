"use client";

import { FormEvent, useEffect, useState } from "react";

const services = [
  {
    icon: "🌐",
    title: "Сайт-визитка на WordPress",
    text: "Быстрый сайт для компании, специалиста или локального бизнеса: домен, хостинг, SSL, 5–7 страниц, форма заявки, карта, базовое SEO и понятная админка.",
    tags: ["WordPress", "5–7 страниц", "Домен", "SSL"],
  },
  {
    icon: "🛒",
    title: "Сайт-магазин / каталог",
    text: "WooCommerce-каталог или интернет-магазин с карточками товаров, корзиной, заявками, оплатой по договорённости и базовой CRM-логикой.",
    tags: ["WooCommerce", "Каталог", "Товары", "Заявки"],
  },
  {
    icon: "🤖",
    title: "AI-агент для сайта",
    text: "Чат-ассистент, который отвечает на вопросы клиентов, объясняет услуги, собирает контакты и помогает не терять заявки ночью и в выходные.",
    tags: ["AI чат", "Лиды 24/7", "FAQ", "Продажи"],
  },
  {
    icon: "✈️",
    title: "Telegram-бот и уведомления",
    text: "Бот или простая связка, где каждая заявка с сайта сразу приходит вам в Telegram: имя, контакт, услуга, сообщение и источник заявки.",
    tags: ["Telegram", "Уведомления", "Заявки", "Бот"],
  },
  {
    icon: "📊",
    title: "Мини-CRM и автоматизации",
    text: "Google Sheets CRM, простая воронка, статусы заявок, напоминания, автоответы и интеграции через n8n, Make или плагины WordPress.",
    tags: ["CRM", "Google Sheets", "n8n", "Автоматизация"],
  },
  {
    icon: "🔍",
    title: "Аудит сайта и SEO-база",
    text: "Проверка текущего сайта: структура, тексты, скорость, мобильная версия, доверие, формы, базовые SEO-ошибки и что исправить в первую очередь.",
    tags: ["SEO", "Скорость", "Конверсия", "Аудит"],
  },
];

const businessCardIncluded = [
  "Регистрация доменного имени под ваш бизнес на reg.ru на 1 год. Далее продление домена оплачивается отдельно по тарифам reg.ru.",
  "Установка WordPress и базовая настройка сайта на хостинге.",
  "Сгенерированный логотип: 3 варианта на выбор, финальная версия под сайт.",
  "Создание 5–7 базовых страниц: Главная, О компании, Услуги, Цены, Примеры/Портфолио, Контакты, Как нас найти.",
  "Контакты, кнопки звонка/мессенджера, карта, форма заявки и понятный путь клиента до обращения.",
  "SSL-сертификат на 6 месяцев. Дальнейшее продление оплачивается отдельно по тарифам reg.ru или выбранного провайдера.",
  "Базовая SEO-подготовка: title, description, заголовки, человекопонятные URL, favicon, robots.txt и sitemap.",
  "Адаптация под телефон, планшет и компьютер.",
  "Консультация по управлению сайтом: как менять текст, фото, цены, страницы и заявки.",
  "Более 2 ревизий после первой версии, но общий объём изменений не более 30% от согласованного контента и структуры.",
];

const process = [
  ["01", "Бриф и структура", "Определяем услугу, аудиторию, страницы, стиль, домен, контакты и что должен делать сайт: заявки, звонки, мессенджеры или оплата."],
  ["02", "Дизайн и сборка", "Делаю визуал, логотип, страницы, формы, карту, мобильную версию и базовую структуру WordPress."],
  ["03", "Запуск и проверка", "Подключаю домен, SSL, проверяю формы, скорость, мобильную версию, заявки и базовую индексацию."],
  ["04", "Обучение и развитие", "Показываю, как управлять сайтом. Далее можно добавить CRM, Telegram-бота, AI-агента, оплату или рекламу."],
];

const plans = [
  {
    name: "Сайт-визитка",
    price: "от 35 000 ₽",
    desc: "Базовый запуск для малого бизнеса",
    featured: true,
    features: [
      "Домен на 1 год через reg.ru",
      "WordPress + 5–7 страниц",
      "3 варианта AI-логотипа",
      "SSL на 6 месяцев",
      "Форма заявки + карта + мессенджеры",
      "Базовое SEO и мобильная версия",
      "Консультация и ревизии по условиям",
    ],
  },
  {
    name: "Сайт + CRM",
    price: "от 55 000 ₽",
    desc: "Когда нужно не просто получить заявку, а не потерять её",
    featured: false,
    features: [
      "Всё из сайта-визитки",
      "Google Sheets CRM или простая воронка",
      "Telegram-уведомления о заявках",
      "Статусы: новая, в работе, закрыта",
      "Шаблоны ответов клиентам",
      "Базовая аналитика заявок",
    ],
  },
  {
    name: "Сайт + AI-агент",
    price: "от 75 000 ₽",
    desc: "Для услуг, где клиент задаёт много вопросов перед покупкой",
    featured: false,
    features: [
      "Всё из сайта-визитки",
      "AI-чат на сайте",
      "Ответы на частые вопросы",
      "Сбор контактов клиента",
      "Передача горячих лидов в Telegram/CRM",
      "Настройка базы знаний по вашему бизнесу",
    ],
  },
  {
    name: "Магазин / автоматизация",
    price: "от 95 000 ₽",
    desc: "Для каталога, WooCommerce, оплат и более сложных связок",
    featured: false,
    features: [
      "WooCommerce или каталог товаров",
      "Карточки товаров и услуг",
      "Формы заказа и заявки",
      "Интеграции с CRM/таблицами",
      "Telegram-бот или уведомления",
      "Платёжные решения по задаче",
    ],
  },
];

const addOns = [
  ["Доработка страницы", "от 5 000 ₽"],
  ["Дополнительный раздел или лендинг", "от 12 000 ₽"],
  ["Telegram-уведомления о заявках", "от 10 000 ₽"],
  ["Простая Google Sheets CRM", "от 12 000 ₽"],
  ["AI-чат / AI-агент", "от 25 000 ₽"],
  ["Настройка Яндекс.Метрики", "от 5 000 ₽"],
  ["Базовый SEO-аудит", "от 15 000 ₽"],
  ["Поддержка сайта", "от 8 000 ₽/мес"],
];

const planOptions = ["Сайт-визитка — от 35 000 ₽", "Сайт + CRM — от 55 000 ₽", "Сайт + AI-агент — от 75 000 ₽", "Магазин / автоматизация — от 95 000 ₽", "Пока не знаю, нужна консультация"];

type ContactState = {
  name: string;
  contact: string;
  business: string;
  plan: string;
  message: string;
};

const emptyContact: ContactState = {
  name: "",
  contact: "",
  business: "",
  plan: "",
  message: "",
};

export function AwseenLanding() {
  const [contact, setContact] = useState<ContactState>(emptyContact);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".aw-fade"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("aw-visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function selectPlan(plan: string) {
    setContact((current) => ({ ...current, plan }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSent(false);

    if (!contact.name.trim() || !contact.contact.trim()) {
      setError("Введите имя и контакт: телефон, Telegram или email.");
      return;
    }

    const rawContact = contact.contact.trim();
    const isEmail = rawContact.includes("@") && rawContact.includes(".");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...contact,
        contact: rawContact,
        email: isEmail ? rawContact : null,
        telegram: isEmail ? null : rawContact,
        source: "awseen_russian_homepage",
      }),
    });

    if (!res.ok) {
      setError("Заявка не отправилась. Напишите напрямую в Telegram: @StanMan101");
      return;
    }

    setContact(emptyContact);
    setSent(true);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080810] text-[#f0f0f8]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#080810]/85 px-5 py-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#top" className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-transparent bg-clip-text bg-gradient-to-br from-white to-[#7c6dfa]">
            AWSEEN
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/45 md:flex">
            <a className="transition hover:text-white" href="#business-card">Сайт-визитка</a>
            <a className="transition hover:text-white" href="#services">Услуги</a>
            <a className="transition hover:text-white" href="#pricing">Цены</a>
            <a className="transition hover:text-white" href="#contact">Заявка</a>
          </nav>
          <a href="#contact" className="rounded-lg bg-[#7c6dfa] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-85">
            Обсудить проект →
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center">
          <div className="pointer-events-none absolute -top-52 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(124,109,250,0.14)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(79,209,197,0.08)_0%,transparent_70%)]" />

          <div className="relative z-10 aw-fade">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#7c6dfa]/40 bg-[#7c6dfa]/10 px-4 py-2 text-[13px] font-medium text-[#7c6dfa]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#7c6dfa]" />
              WordPress сайты, AI-агенты и автоматизации для бизнеса
            </div>
            <h1 className="mx-auto mb-6 max-w-5xl font-display text-[clamp(40px,7vw,82px)] font-extrabold leading-[1.05] tracking-[-2px]">
              Сайты, которые<br />приводят <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#7c6dfa] to-[#4fd1c5]">заявки</span>
            </h1>
            <p className="mx-auto mb-11 max-w-2xl text-[clamp(16px,2vw,20px)] font-light leading-8 text-white/50">
              Делаю понятные сайты-визитки, каталоги, CRM-связки, Telegram-ботов и AI-агентов. WordPress остаётся удобной платформой для владельца, а автоматизации можно постепенно добавлять через плагины, n8n и ИИ.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <a href="#business-card" className="inline-flex items-center gap-2 rounded-[10px] bg-[#7c6dfa] px-8 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#6c5de8]">
                Смотреть сайт-визитку →
              </a>
              <a href="#pricing" className="rounded-[10px] border border-white/10 px-8 py-4 text-base font-medium text-white transition hover:border-white/20 hover:bg-white/5">
                Цены и пакеты
              </a>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12">
              {["5–7 страниц|Базовая структура", "1 год|Домен через reg.ru", "6 месяцев|SSL-сертификат", "24/7|Заявки и AI-чат"].map((item) => {
                const [num, label] = item.split("|");
                return (
                  <div className="text-center" key={item}>
                    <div className="font-display text-3xl font-extrabold text-white">{num}</div>
                    <div className="mt-0.5 text-[13px] text-white/45">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="business-card" className="bg-[#0f0f1a] px-6 py-24 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="aw-fade">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Основной продукт</div>
              <h2 className="mb-5 font-display text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.1] tracking-[-1.5px]">Сайт-визитка<br />на WordPress</h2>
              <p className="mb-6 text-lg font-light leading-8 text-white/50">
                Это не сложная разработка ради разработки. Это аккуратная бизнес-страница, где клиент быстро понимает кто вы, что вы предлагаете, сколько это стоит и как с вами связаться.
              </p>
              <div className="rounded-[14px] border border-[#7c6dfa]/30 bg-[#7c6dfa]/10 p-6">
                <div className="mb-2 font-display text-2xl font-extrabold text-white">от 35 000 ₽</div>
                <p className="text-sm leading-6 text-white/55">Финальная цена зависит от объёма текста, количества блоков, готовности материалов, сложности формы заявки и дополнительных интеграций.</p>
              </div>
            </div>

            <div className="aw-fade rounded-[14px] border border-white/10 bg-[#080810] p-6 md:p-8">
              <h3 className="mb-5 font-display text-2xl font-bold">Что входит в сайт-визитку</h3>
              <ul className="grid gap-0">
                {businessCardIncluded.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-white/10 py-3 text-sm leading-6 text-white/55 last:border-none">
                    <span className="mt-0.5 font-bold text-[#4fd1c5]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="why-wordpress" className="border-y border-white/10 bg-gradient-to-br from-[#7c6dfa]/5 to-[#4fd1c5]/5 px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
            <div className="aw-fade md:col-span-1">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Почему WordPress</div>
              <h2 className="font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.15] tracking-[-1px]">Просто, понятно и можно развивать</h2>
            </div>
            <div className="aw-fade grid gap-4 md:col-span-2 md:grid-cols-2">
              {[
                ["Удобно для владельца", "Вы сможете сами менять тексты, фото, цены, услуги и контакты без программиста."],
                ["Много готовых решений", "Формы, SEO, карты, аналитика, безопасность, корзина и оплата часто решаются проверенными плагинами."],
                ["ИИ ускоряет разработку", "Нужную автоматизацию можно спроектировать быстрее: через плагин, API, n8n или отдельный скрипт."],
                ["Можно стартовать бюджетно", "Сначала запускаем рабочую версию сайта, потом добавляем CRM, бота, AI-чат, рекламу и аналитику."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[14px] border border-white/10 bg-[#0f0f1a] p-6">
                  <h3 className="mb-2 font-display text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-6 text-white/50">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="bg-[#0f0f1a] px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Процесс</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">От идеи до запуска<br />за понятные этапы</h2>
            </div>
            <div className="aw-fade mt-14 grid overflow-hidden rounded-[14px] border border-white/10 md:grid-cols-4">
              {process.map(([num, title, text]) => (
                <div key={num} className="border-b border-white/10 bg-[#0f0f1a] p-7 md:border-b-0 md:border-r md:last:border-r-0">
                  <div className="mb-4 font-display text-5xl font-extrabold leading-none text-[#7c6dfa]/20">{num}</div>
                  <h3 className="mb-2 font-display text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-6 text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Услуги</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">Сайт можно расширять<br />под реальные продажи</h2>
            </div>
            <div className="aw-fade mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="group relative overflow-hidden rounded-[14px] border border-white/10 bg-[#0f0f1a] p-8 transition hover:-translate-y-0.5 hover:border-[#7c6dfa]/30">
                  <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-[#7c6dfa] to-[#4fd1c5] opacity-0 transition group-hover:opacity-100" />
                  <span className="mb-5 block text-3xl">{service.icon}</span>
                  <h3 className="mb-3 font-display text-xl font-bold">{service.title}</h3>
                  <p className="mb-5 text-sm leading-7 text-white/45">{service.text}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#7c6dfa]/20 bg-[#7c6dfa]/10 px-2.5 py-1 text-[11px] text-[#7c6dfa]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#0f0f1a] px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade text-center">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Цены</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">Пакеты услуг<br />без лишней сложности</h2>
              <p className="mx-auto max-w-2xl text-lg font-light leading-8 text-white/45">Можно начать с сайта-визитки, а потом добавить CRM, Telegram-бота, AI-чат, оплату, каталог или рекламу.</p>
            </div>
            <div className="aw-fade mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => (
                <article key={plan.name} className={`relative rounded-[14px] border p-8 ${plan.featured ? "border-[#7c6dfa] bg-[#7c6dfa]/5" : "border-white/10 bg-[#080810]"}`}>
                  {plan.featured ? <div className="absolute left-1/2 top-[-12px] -translate-x-1/2 rounded-full bg-[#7c6dfa] px-3.5 py-1 text-[11px] font-medium text-white">Стартовый продукт</div> : null}
                  <div className="mb-3 font-display text-[13px] font-bold uppercase tracking-[2px] text-white/45">{plan.name}</div>
                  <div className="mb-1 font-display text-[34px] font-extrabold tracking-[-1px]">{plan.price}</div>
                  <div className="mb-6 text-[13px] text-white/45">{plan.desc}</div>
                  <ul className="mb-7">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 border-b border-white/10 py-2 text-sm text-white/45 last:border-none">
                        <span className="font-bold text-[#4fd1c5]">✓</span>{feature}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => selectPlan(`${plan.name} — ${plan.price}`)} className={`w-full rounded-[9px] border px-4 py-3.5 text-[15px] font-medium transition ${plan.featured ? "border-[#7c6dfa] bg-[#7c6dfa] text-white hover:bg-[#6c5de8]" : "border-white/10 text-white hover:border-[#7c6dfa] hover:text-[#7c6dfa]"}`}>
                    Оставить заявку →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="addons" className="px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade mb-12">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Дополнительно</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">Что можно добавить<br />после запуска</h2>
            </div>
            <div className="aw-fade grid gap-3 md:grid-cols-2">
              {addOns.map(([name, price]) => (
                <div key={name} className="flex items-center justify-between gap-4 rounded-[14px] border border-white/10 bg-[#0f0f1a] p-5">
                  <span className="text-sm text-white/65">{name}</span>
                  <span className="whitespace-nowrap font-display text-lg font-bold text-white">{price}</span>
                </div>
              ))}
            </div>
            <p className="aw-fade mt-6 text-sm leading-6 text-white/40">Домен, хостинг, SSL, платные плагины, платёжные системы, SMS, email-сервисы и внешние подписки оплачиваются отдельно по тарифам соответствующих сервисов.</p>
          </div>
        </section>

        <section id="contact" className="border-t border-white/10 bg-gradient-to-br from-[#7c6dfa]/5 to-[#4fd1c5]/5 px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade text-center">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Заявка</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">Расскажите<br />о вашем проекте</h2>
              <p className="mx-auto max-w-xl text-lg font-light leading-8 text-white/45">Опишите бизнес, город, услугу и что хотите получить: сайт-визитку, CRM, Telegram-бота, AI-агента или магазин.</p>
            </div>
            <form onSubmit={submitContact} className="aw-fade mx-auto mt-12 max-w-2xl">
              <div className="grid gap-3.5 md:grid-cols-2">
                <Field label="Ваше имя" value={contact.name} placeholder="Станислав" onChange={(value) => setContact({ ...contact, name: value })} />
                <Field label="Телефон, Telegram или email" value={contact.contact} placeholder="+7..., @username или email" onChange={(value) => setContact({ ...contact, contact: value })} />
                <Field label="Тип бизнеса" value={contact.business} placeholder="услуги, магазин, салон, производство..." onChange={(value) => setContact({ ...contact, business: value })} />
                <label className="block text-[13px] font-medium text-white/45">
                  Интересующий пакет
                  <select value={contact.plan} onChange={(event) => setContact({ ...contact, plan: event.target.value })} className="mt-1.5 w-full rounded-[9px] border border-white/10 bg-[#080810] px-4 py-3 text-[15px] text-white outline-none transition focus:border-[#7c6dfa]">
                    <option value="">Выберите пакет</option>
                    {planOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <label className="mt-3.5 block text-[13px] font-medium text-white/45">
                Кратко о задаче
                <textarea value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} placeholder="Что нужно сделать? Есть ли домен, логотип, тексты, фото? Какие услуги или товары нужно показать?" className="mt-1.5 min-h-28 w-full resize-y rounded-[9px] border border-white/10 bg-[#080810] px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#7c6dfa]" />
              </label>
              <button className="mt-5 w-full rounded-[10px] bg-[#7c6dfa] px-4 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#6c5de8]" type="submit">
                Отправить заявку →
              </button>
              <div className="mt-3.5 text-center text-[13px] text-white/45">Без спама. Отвечу по делу: что лучше сделать, сколько стоит и с чего начать.</div>
              {error ? <div className="mt-4 rounded-[14px] border border-red-400/30 bg-red-500/10 p-4 text-center text-sm text-red-200">{error}</div> : null}
              {sent ? <div className="mt-4 rounded-[14px] border border-[#4fd1c5]/20 bg-[#4fd1c5]/10 p-4 text-center text-sm text-[#4fd1c5]">✅ Заявка отправлена. Я свяжусь с вами и предложу следующий шаг.</div> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-12 text-center">
        <div className="mb-3 font-display text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-[#7c6dfa]">AWSEEN</div>
        <div className="mb-4 flex flex-wrap justify-center gap-6">
          {[
            ["Сайт-визитка", "#business-card"],
            ["Услуги", "#services"],
            ["Цены", "#pricing"],
            ["Заявка", "#contact"],
            ["Telegram", "https://t.me/StanMan101"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="text-[13px] text-white/45 transition hover:text-white">{label}</a>
          ))}
        </div>
        <p className="text-[13px] text-white/45">© 2026 AWSEEN. WordPress сайты, AI-агенты, CRM и автоматизации для малого бизнеса.</p>
      </footer>
    </div>
  );
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-[13px] font-medium text-white/45">
      {label}
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-[9px] border border-white/10 bg-[#080810] px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#7c6dfa]" />
    </label>
  );
}
